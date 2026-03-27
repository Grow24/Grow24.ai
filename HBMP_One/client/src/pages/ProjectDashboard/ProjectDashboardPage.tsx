import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '@/api/projects.api';
import { documentsApi } from '@/api/documents.api';
import { templatesApi } from '@/api/templates.api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import DocketCard from '@/components/dashboard/DocketCard';
import NextActionCard from '@/components/dashboard/NextActionCard';
import BlockersCard from '@/components/dashboard/BlockersCard';
import CliphaseCard from '@/components/dashboard/CliphaseCard';
import { computeNextAction, computeBlockers, computePhaseCounts, NextAction } from '@/utils/dashboard';

export default function ProjectDashboardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getById(projectId!),
    enabled: !!projectId,
  });

  const { data: documentsData, isLoading: documentsLoading } = useQuery({
    queryKey: ['project-documents', projectId],
    queryFn: () => documentsApi.getByProject(projectId!),
    enabled: !!projectId,
  });

  const { data: templatesData, error: templatesError } = useQuery({
    queryKey: ['templates'],
    queryFn: () => templatesApi.getAll(),
  });

  if (templatesError) {
    console.error('Templates error:', templatesError);
  }

  if (projectLoading || documentsLoading) {
    return <div className="p-6">Loading project dashboard...</div>;
  }

  if (!project) {
    return (
      <div className="p-6">
        <div className="text-red-500">Project not found</div>
        <div className="mt-2 text-sm text-muted-foreground">
          Project ID: {projectId}
        </div>
      </div>
    );
  }

  const businessCaseDocket = project.dockets?.find((d) => d.type === 'BUSINESS_CASE');
  const businessReqDocket = project.dockets?.find((d) => d.type === 'BUSINESS_REQUIREMENTS');
  const testDocket = project.dockets?.find((d) => d.type === 'TEST');

  const businessCaseTemplate = templatesData?.templates.find((t) => t.code === 'BUSINESS_CASE');
  const brdTemplate = templatesData?.templates.find((t) => t.code === 'BRD');
  // const srsTemplate = templatesData?.templates.find((t) => t.code === 'SRS'); // Hidden for now
  const uatpTemplate = templatesData?.templates.find((t) => t.code === 'UATP');

  // Check if Business Case is approved (for BRD gating)
  const businessCaseDoc = documentsData?.documents.find(
    (d) => d.templateName === 'Business Case' || d.templateName.includes('BUSINESS_CASE')
  );
  const isBusinessCaseApproved = businessCaseDoc?.status === 'APPROVED';

  // Compute dashboard state
  const documents = documentsData?.documents || [];
  const dockets = project.dockets || [];
  const nextAction = computeNextAction(documents, dockets);
  const blockers = computeBlockers(documents, dockets);
  const phaseCounts = computePhaseCounts(documents);
  
  // Compute phase unlock status
  const hasApprovedBRD = documents.some(
    (d) => (d.templateName.includes('BRD') || d.templateName.includes('Business Requirements')) && d.status === 'APPROVED'
  );
  // UATP is completed when it exists (regardless of status, just needs to be created/filled)
  const hasUATP = documents.some(
    (d) => d.templateName === 'User Acceptance Test Plan' || d.templateName.includes('UATP') || d.templateId === 'UATP'
  );
  // const hasApprovedSRS = documents.some(
  //   (d) => (d.templateName === 'SRS' || d.templateName === 'System Requirements Specification') && d.status === 'APPROVED'
  // ); // Hidden for now

  // Debug info
  if (process.env.NODE_ENV === 'development') {
    console.log('Dashboard Debug:', {
      project,
      businessCaseDocket,
      businessCaseTemplate,
      brdTemplate,
      templatesData,
      documentsData,
      isBusinessCaseApproved,
    });
  }

  const handleCreateBusinessCase = async () => {
    if (!businessCaseDocket || !businessCaseTemplate) {
      toast({
        title: 'Error',
        description: 'Business Case template or docket not found. Please ensure the backend is running and database is seeded.',
        variant: 'destructive',
      });
      console.error('Missing:', { businessCaseDocket, businessCaseTemplate, templatesData });
      return;
    }

    try {
      const doc = await documentsApi.create(projectId!, businessCaseDocket.id, {
        templateId: businessCaseTemplate.id,
        title: `Business Case - ${project.name}`,
      });
      navigate(`/projects/${projectId}/dockets/${businessCaseDocket.id}/documents/${doc.id}`);
    } catch (error: any) {
      console.error('Create Business Case error:', error);
      toast({
        title: 'Error Creating Business Case',
        description: error.message || error.error?.message || 'Failed to create Business Case. Check console for details.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateBRD = async () => {
    if (!businessReqDocket || !brdTemplate) {
      toast({
        title: 'Error',
        description: 'BRD template or docket not found. Please ensure the backend is running and database is seeded.',
        variant: 'destructive',
      });
      console.error('Missing:', { businessReqDocket, brdTemplate, templatesData });
      return;
    }

    if (!isBusinessCaseApproved) {
      toast({
        title: 'Cannot Create BRD',
        description: 'Business Case must be Approved before creating a BRD.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const doc = await documentsApi.create(projectId!, businessReqDocket.id, {
        templateId: brdTemplate.id,
        title: `BRD - ${project.name}`,
      });
      navigate(`/projects/${projectId}/dockets/${businessReqDocket.id}/documents/${doc.id}`);
    } catch (error: any) {
      console.error('Create BRD error:', error);
      toast({
        title: 'Error Creating BRD',
        description: error.message || error.error?.message || 'Failed to create BRD. Check console for details.',
        variant: 'destructive',
      });
    }
  };

  // SRS creation handler - hidden for now
  // const handleCreateSRS = async () => {
  //   if (!businessReqDocket || !srsTemplate) {
  //     toast({
  //       title: 'Error',
  //       description: 'SRS template or docket not found. Please ensure the backend is running and database is seeded.',
  //       variant: 'destructive',
  //     });
  //     return;
  //   }

  //   if (!hasUATP) {
  //     toast({
  //       title: 'Cannot Create SRS',
  //       description: 'UATP must be created and filled before creating an SRS.',
  //       variant: 'destructive',
  //     });
  //     return;
  //   }

  //   try {
  //     const doc = await documentsApi.create(projectId!, businessReqDocket.id, {
  //       templateId: srsTemplate.id,
  //       title: `SRS - ${project.name}`,
  //     });
  //     navigate(`/projects/${projectId}/dockets/${businessReqDocket.id}/documents/${doc.id}`);
  //   } catch (error: any) {
  //     console.error('Create SRS error:', error);
  //     toast({
  //       title: 'Error Creating SRS',
  //       description: error.message || error.error?.message || 'Failed to create SRS. Check console for details.',
  //       variant: 'destructive',
  //     });
  //   }
  // };

  const handleCreateUATP = async () => {
    if (!businessReqDocket || !uatpTemplate) {
      toast({
        title: 'Error',
        description: 'UATP template or docket not found. Please ensure the backend is running and database is seeded.',
        variant: 'destructive',
      });
      return;
    }

    if (!hasApprovedBRD) {
      toast({
        title: 'Cannot Create UATP',
        description: 'BRD must be Approved before creating a UATP.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const doc = await documentsApi.create(projectId!, businessReqDocket.id, {
        templateId: uatpTemplate.id,
        title: `UATP - ${project.name}`,
      });
      navigate(`/projects/${projectId}/dockets/${businessReqDocket.id}/documents/${doc.id}`);
    } catch (error: any) {
      console.error('Create UATP error:', error);
      toast({
        title: 'Error Creating UATP',
        description: error.message || error.error?.message || 'Failed to create UATP. Check console for details.',
        variant: 'destructive',
      });
    }
  };

  // TEMPORARY FOR TESTING: Auto-approve BRD function
  const handleAutoApproveBRD = async () => {
    const brdDocs = documents.filter((d) => 
      (d.templateName.includes('BRD') || d.templateName.includes('Business Requirements')) && d.status === 'UNDER_REVIEW'
    );
    if (brdDocs.length > 0) {
      const latestBRD = brdDocs[brdDocs.length - 1];
      try {
        await documentsApi.executeWorkflowTransition(latestBRD.id, 'APPROVE');
        toast({
          title: 'BRD Approved',
          description: 'BRD has been automatically approved for testing',
        });
        // Refresh documents
        queryClient.invalidateQueries({ queryKey: ['project-documents', projectId] });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to approve BRD',
          variant: 'destructive',
        });
      }
    }
  };

  const handleNextAction = async (action: NextAction) => {
    if (action.action === 'create') {
      if (action.templateCode === 'BUSINESS_CASE' && action.docketId) {
        await handleCreateBusinessCase();
      } else if (action.templateCode === 'BRD' && action.docketId) {
        await handleCreateBRD();
      // } else if (action.templateCode === 'SRS' && action.docketId) {
      //   await handleCreateSRS(); // Hidden for now
      } else if (action.templateCode === 'UATP' && action.docketId) {
        await handleCreateUATP();
      }
    } else if (action.action === 'submit' && action.documentId && action.docketId) {
      // TEMPORARY FOR TESTING: Auto-approve BRD if it's UNDER_REVIEW
      const doc = documents.find((d) => d.id === action.documentId);
      if (doc && (doc.templateName.includes('BRD') || doc.templateName.includes('Business Requirements')) && doc.status === 'UNDER_REVIEW') {
        await handleAutoApproveBRD();
        return;
      }
      // Navigate to document with workflow tab open
      const url = `/projects/${projectId}/dockets/${action.docketId}/documents/${action.documentId}${action.tab ? `?tab=${action.tab}` : ''}`;
      navigate(url);
    } else if (action.action === 'continue' && action.documentId && action.docketId) {
      // Navigate to document
      navigate(`/projects/${projectId}/dockets/${action.docketId}/documents/${action.documentId}`);
    }
  };

  return (
    <div className="space-y-8 p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">{project.name}</h1>
        {project.clientName && <p className="text-sm text-slate-500 font-medium">{project.clientName}</p>}
      </div>

      {/* 3-Panel Command Center */}
      <div className="grid gap-6 md:grid-cols-3">
        <NextActionCard nextAction={nextAction} onActionClick={handleNextAction} />
        <CliphaseCard
          phaseCounts={phaseCounts}
          hasApprovedBRD={hasApprovedBRD}
          hasApprovedSRS={false}
        />
        <BlockersCard blockers={blockers} />
      </div>

      {/* KPI Cards - Professional Design */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Business Cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">
              {documentsData?.documents.filter((d) => d.templateName === 'Business Case').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">BRDs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">
              {documentsData?.documents.filter((d) => d.templateName.includes('BRD')).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">User Acceptance Test Plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">
              {documentsData?.documents.filter((d) => d.templateName === 'User Acceptance Test Plan' || d.templateName.includes('UATP') || d.templateId === 'UATP').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Docket Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {businessCaseDocket && (
          <div id="business-case">
            <DocketCard
              docket={businessCaseDocket}
              documents={documentsData?.documents.filter((d) => d.docketId === businessCaseDocket.id) || []}
              onCreateDocument={handleCreateBusinessCase}
              projectId={projectId!}
            />
          </div>
        )}
        {businessReqDocket && (
          <div id="business-requirements">
            <DocketCard
              docket={businessReqDocket}
              documents={documentsData?.documents.filter((d) => d.docketId === businessReqDocket.id) || []}
              onCreateDocument={handleCreateBRD}
              // onCreateSRS={handleCreateSRS} // Hidden for now
              onCreateUATP={handleCreateUATP}
              projectId={projectId!}
              isCreateDisabled={!isBusinessCaseApproved}
              disabledTooltip="Business Case must be Approved before creating a BRD"
              showSRSButton={false}
              showUATPButton={hasApprovedBRD}
              isUATPCreateDisabled={!hasApprovedBRD}
            />
          </div>
        )}
        {testDocket && (
          <div id="test">
            <DocketCard
              docket={testDocket}
              documents={documentsData?.documents.filter((d) => d.docketId === testDocket.id) || []}
              projectId={projectId!}
            />
          </div>
        )}
      </div>
    </div>
  );
}

