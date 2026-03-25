import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi, Document } from '@/api/documents.api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, Send, Check, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import DocumentHeader from '@/components/document/DocumentHeader';
import SectionNav from '@/components/document/SectionNav';
import SectionContent from '@/components/document/SectionContent';
import MetaPanel, { TabType } from '@/components/document/MetaPanel';
import ImportDialog from '@/components/document/ImportDialog';
import { EditorProvider } from '@/components/document/EditorContext';
import { ChecklistItem } from '@/types/checklist';
import { calculateChecklistSummary } from '@/utils/workflow';
import { cn } from '@/lib/utils';

export default function DocumentEditorPage() {
  const { projectId, docketId, documentId } = useParams<{
    projectId: string;
    docketId: string;
    documentId: string;
  }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  
  // Initialize activeRightTab from query param if present, otherwise default to 'info'
  const tabParam = searchParams.get('tab') as TabType | null;
  const [activeRightTab, setActiveRightTab] = useState<TabType>(
    (tabParam && ['info', 'checklist', 'flow', 'workflow'].includes(tabParam)) ? tabParam : 'info'
  );

  // Update tab if query param changes
  useEffect(() => {
    if (tabParam && ['info', 'checklist', 'flow', 'workflow'].includes(tabParam)) {
      setActiveRightTab(tabParam);
    }
  }, [tabParam]);

  const { data: document, isLoading } = useQuery({
    queryKey: ['document', documentId],
    queryFn: () => documentsApi.getById(documentId!),
    enabled: !!documentId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { fieldValues: Array<{ fieldValueId: string; value: string }> }) =>
      documentsApi.update(documentId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document', documentId] });
      toast({
        title: 'Saved',
        description: 'Document changes have been saved',
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => documentsApi.updateStatus(documentId!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document', documentId] });
      toast({
        title: 'Status updated',
        description: 'Document status has been updated',
      });
    },
  });

  const workflowTransitionMutation = useMutation({
    mutationFn: ({ action, comment }: { action: 'SUBMIT' | 'APPROVE' | 'REQUEST_CHANGES'; comment?: string }) =>
      documentsApi.executeWorkflowTransition(documentId!, action, comment),
    onSuccess: (data) => {
      // Invalidate all related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['document', documentId] });
      queryClient.invalidateQueries({ queryKey: ['workflow-history', documentId] });
      queryClient.invalidateQueries({ queryKey: ['workflow-transitions', documentId] });
      queryClient.invalidateQueries({ queryKey: ['project-documents', document?.projectId] });
      
      // Show success toast with level completion info if applicable
      const statusMessage = data.status === 'APPROVED' 
        ? `Document approved. ${document?.level === 'L' ? 'Logical level may be complete.' : ''}`
        : `Document status changed to ${data.status}`;
      
      toast({
        title: 'Workflow transition successful',
        description: statusMessage,
      });
    },
    onError: (error: any) => {
      // Safely extract error message with defensive checks
      let errorMessage = 'Failed to execute workflow transition';
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: 'Workflow transition failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const handleSave = (fieldValues: Array<{ fieldValueId: string; value: string }>) => {
    updateMutation.mutate({ fieldValues });
  };

  const handleStatusChange = (status: string) => {
    statusMutation.mutate(status);
  };

  // Get mock checklist items (same as MetaPanel uses)
  const getMockChecklistItems = (templateCode: string): ChecklistItem[] => {
    const baseItems: ChecklistItem[] = [
      { id: '1', category: 'Content', label: 'Problem statement documented', status: 'DONE', tag: 'MANDATORY', sectionId: 'section-1' },
      { id: '2', category: 'Content', label: 'Goals & success metrics defined', status: 'DONE', tag: 'MANDATORY', sectionId: 'section-2' },
      { id: '3', category: 'Content', label: 'Scope & out-of-scope filled', status: 'OPEN', tag: 'MANDATORY', sectionId: 'section-3' },
      { id: '4', category: 'Risk & Dependencies', label: 'Key risks described', status: 'OPEN', tag: 'MANDATORY', sectionId: 'section-4' },
      { id: '5', category: 'Risk & Dependencies', label: 'Mitigation plan captured', status: 'OPEN', tag: 'MANDATORY', sectionId: 'section-5' },
      { id: '6', category: 'Traceability', label: 'Each BR linked to Business Goal', status: 'AUTO_FAILED', tag: 'AUTO' },
      { id: '7', category: 'Traceability', label: 'Stakeholders listed', status: 'DONE', tag: 'MANDATORY', sectionId: 'section-6' },
      { id: '8', category: 'Traceability', label: 'Business objectives mapped', status: 'OPEN', tag: 'MANDATORY', sectionId: 'section-7' },
      { id: '9', category: 'Content', label: 'Executive summary completed', status: 'OPEN', tag: 'MANDATORY', sectionId: 'section-8' },
      { id: '10', category: 'Content', label: 'Financial analysis included', status: 'AUTO_PASSED', tag: 'AUTO' },
    ];
    return baseItems;
  };

  // Calculate checklist summary for header
  const checklistSummary = useMemo(() => {
    if (!document) return undefined;
    const checklistItems = getMockChecklistItems(document.template.code);
    return calculateChecklistSummary(checklistItems);
  }, [document]);

  const handleWorkflowTransition = (action: 'SUBMIT' | 'APPROVE' | 'REQUEST_CHANGES', comment?: string) => {
    // TEMPORARY FOR TESTING: Allow approval regardless of checklist
    // TODO: Re-enable checklist validation for production
    // if (action === 'APPROVE' && checklistSummary && checklistSummary.completionPercent < 100) {
    //   toast({
    //     title: 'Cannot approve',
    //     description: `Cannot approve: ${checklistSummary.totalCount - checklistSummary.completedCount} checklist items pending (${checklistSummary.completionPercent}% complete)`,
    //     variant: 'destructive',
    //   });
    //   setActiveRightTab('checklist');
    //   return;
    // }
    workflowTransitionMutation.mutate({ action, comment });
  };

  const handleSectionRename = (sectionId: string, newTitle: string) => {
    // TODO: Implement backend API call to rename section
    // For now, just refresh the document
    queryClient.invalidateQueries({ queryKey: ['document', documentId] });
  };

  const handleSectionDelete = (sectionId: string) => {
    // TODO: Implement backend API call to delete section
    // For now, just refresh the document
    queryClient.invalidateQueries({ queryKey: ['document', documentId] });
  };

  const handleSectionDuplicate = (sectionId: string) => {
    // TODO: Implement backend API call to duplicate section
    // For now, just refresh the document
    queryClient.invalidateQueries({ queryKey: ['document', documentId] });
  };

  const handleSectionMove = (sectionId: string, direction: 'up' | 'down') => {
    if (!document) return;
    
    const currentIndex = document.template.sections.findIndex((s) => s.id === sectionId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= document.template.sections.length) return;

    // TODO: Implement backend API call to reorder sections
    // For now, just refresh the document
    queryClient.invalidateQueries({ queryKey: ['document', documentId] });
  };

  const handleExport = async (format: 'docx' | 'pdf' | 'xlsx' | 'google-doc' | 'google-sheets') => {
    try {
      if (format === 'google-doc' || format === 'google-sheets') {
        // For Google exports, use the API endpoint
        const result = await documentsApi.exportToGoogle(format, documentId!);
        
        // Show success message with instructions
        toast({
          title: 'Export ready',
          description: result.message || `Document ready for ${format === 'google-doc' ? 'Google Docs' : 'Google Sheets'}`,
        });
        
        // Open Google Docs/Sheets creation page
        if (result.url) {
          window.open(result.url, '_blank');
        }
        
        // For Google Sheets, also provide download link if available
        if (format === 'google-sheets' && (result as any).downloadUrl) {
          setTimeout(() => {
            const downloadLink = window.document.createElement('a');
            downloadLink.href = (result as any).downloadUrl;
            downloadLink.download = `${document?.title.replace(/[^a-z0-9]/gi, '-')}.xlsx`;
            downloadLink.click();
          }, 1000);
        }
        return;
      }

      const blob = await documentsApi.export(documentId!, format);
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      const fileExtension = format === 'xlsx' ? 'xlsx' : format;
      a.download = `${document?.title.replace(/[^a-z0-9]/gi, '-')}.${fileExtension}`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast({
        title: 'Export started',
        description: `Downloading ${format.toUpperCase()} file...`,
      });
    } catch (error: any) {
      toast({
        title: 'Export failed',
        description: error.message || 'Failed to export document',
        variant: 'destructive',
      });
    }
  };

  // Set first section as active when document loads
  // This must be before any early returns to follow Rules of Hooks
  useEffect(() => {
    if (document && document.template.sections.length > 0) {
      // If no section is selected, or the selected section doesn't exist in current document
      const sectionExists = activeSectionId
        ? document.template.sections.some((s) => s.id === activeSectionId)
        : false;
      
      if (!sectionExists) {
        setActiveSectionId(document.template.sections[0].id);
      }
    }
  }, [document, activeSectionId]);

  if (isLoading) {
    return <div className="p-6">Loading document...</div>;
  }

  if (!document) {
    return <div className="p-6">Document not found</div>;
  }

  return (
    <EditorProvider>
      <DocumentHeader
        document={document}
        onStatusChange={handleStatusChange}
        onWorkflowTransition={handleWorkflowTransition}
        onExport={handleExport}
        checklistSummary={checklistSummary}
        requiredCompletionPercent={100}
        onSwitchToTab={setActiveRightTab}
        onImport={() => setImportDialogOpen(true)}
      />

      <div className="w-full h-[calc(100vh-80px)] flex flex-col">
        <div className="flex-1 flex gap-6 overflow-hidden px-6 py-6">
          {/* Left: Section Navigation */}
          <div className={cn('shrink-0 flex flex-col', isSidebarCollapsed ? 'w-12' : 'w-64')}>
            <div className="flex-1 overflow-y-auto">
              <SectionNav
                sections={document.template.sections}
                activeSectionId={activeSectionId}
                onSectionSelect={setActiveSectionId}
                isCollapsed={isSidebarCollapsed}
                onCollapseChange={setIsSidebarCollapsed}
                onSectionRename={handleSectionRename}
                onSectionDelete={handleSectionDelete}
                onSectionDuplicate={handleSectionDuplicate}
                onSectionMove={handleSectionMove}
              />
            </div>
          </div>

          {/* Center: Section Content - expands to fill available space */}
          <div className="flex-1 min-w-0 overflow-y-auto">
            <SectionContent
              document={document}
              activeSectionId={activeSectionId}
              onSectionChange={setActiveSectionId}
              onSave={handleSave}
            />
          </div>

          {/* Right: Meta Panel - fixed width, scrollable */}
          <div className="w-80 shrink-0 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <MetaPanel 
                document={document} 
                activeTab={activeRightTab}
                onTabChange={setActiveRightTab}
                onGoToSection={(sectionId) => {
                  setActiveSectionId(sectionId);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Import Dialog */}
      {document && (
        <ImportDialog
          open={importDialogOpen}
          onOpenChange={setImportDialogOpen}
          documentId={document.id}
          document={document}
          defaultSectionId={activeSectionId || undefined}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['document', documentId] });
          }}
        />
      )}
    </EditorProvider>
  );
}

