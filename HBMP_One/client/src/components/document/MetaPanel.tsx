import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Document, documentsApi, DocumentListItem } from '@/api/documents.api';
import { sectionDocketsApi, SectionDocket } from '@/api/sectionDockets.api';
import { sectionSupportsMiniDocket, evaluateSectionCompletion } from '@/utils/sectionCompletion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ProcessFlow from './ProcessFlow';
import WorkflowTab from './WorkflowTab';
import ChecklistTab from './ChecklistTab';
import { ChecklistItem, ChecklistSummary } from '@/types/checklist';
import {
  calculateChecklistSummary,
  getPendingItemIds,
  buildFlowNodes,
  computeLevelStatuses,
  FlowNodeViewModel,
  LevelStatus,
} from '@/utils/workflow';

interface MetaPanelProps {
  document: Document;
  onTabChange?: (tab: TabType) => void;
  activeTab?: TabType;
  onGoToSection?: (sectionId: string) => void;
}

export type TabType = 'info' | 'checklist' | 'flow' | 'workflow';

// Mock checklist data - will be replaced with API call later
function getMockChecklistItems(templateCode: string): ChecklistItem[] {
  // BRD-specific checklist items
  if (templateCode === 'BRD') {
    return [
      // Content category
      {
        id: 'brd-1',
        category: 'Content',
        label: 'Needs Statement documented',
        status: 'OPEN',
        tag: 'MANDATORY',
        sectionId: 'needs-statement',
      },
      {
        id: 'brd-2',
        category: 'Content',
        label: 'Business Goals defined',
        status: 'OPEN',
        tag: 'MANDATORY',
        sectionId: 'business-goals',
      },
      {
        id: 'brd-3',
        category: 'Content',
        label: 'Business Objectives defined',
        status: 'OPEN',
        tag: 'MANDATORY',
        sectionId: 'business-objectives',
      },
      {
        id: 'brd-4',
        category: 'Content',
        label: 'Success Metrics defined',
        status: 'OPEN',
        tag: 'MANDATORY',
        sectionId: 'success-metrics',
      },
      // Stakeholders category
      {
        id: 'brd-5',
        category: 'Stakeholders',
        label: 'Stakeholder list populated with interest & influence',
        status: 'OPEN',
        tag: 'MANDATORY',
        sectionId: 'stakeholder-list',
      },
      {
        id: 'brd-6',
        category: 'Stakeholders',
        label: 'Stakeholder requirements documented for key groups',
        status: 'OPEN',
        tag: 'MANDATORY',
        sectionId: 'stakeholder-requirements-list',
      },
      // Process category
      {
        id: 'brd-7',
        category: 'Process',
        label: 'AS-IS and TO-BE process locations filled',
        status: 'OPEN',
        tag: 'MANDATORY',
        sectionId: 'as-is-process',
      },
      // Scope category
      {
        id: 'brd-8',
        category: 'Scope',
        label: 'In-scope and Out-of-scope items captured',
        status: 'OPEN',
        tag: 'MANDATORY',
        sectionId: 'in-scope-items',
      },
      // Constraints category
      {
        id: 'brd-9',
        category: 'Constraints',
        label: 'Constraints captured (Scope, Schedule, Cost, Quality, Resource, Risk) or explicitly marked None',
        status: 'OPEN',
        tag: 'MANDATORY',
        sectionId: 'constraints-scope',
      },
      // Governance category
      {
        id: 'brd-10',
        category: 'Governance',
        label: 'Assumptions and Dependencies sections completed',
        status: 'OPEN',
        tag: 'MANDATORY',
        sectionId: 'assumptions',
      },
    ];
  }

  // Business Case checklist items (default)
  const baseItems: ChecklistItem[] = [
    // Content category
    {
      id: '1',
      category: 'Content',
      label: 'Problem statement documented',
      status: 'DONE',
      tag: 'MANDATORY',
      sectionId: 'section-1',
    },
    {
      id: '2',
      category: 'Content',
      label: 'Goals & success metrics defined',
      status: 'DONE',
      tag: 'MANDATORY',
      sectionId: 'section-2',
    },
    {
      id: '3',
      category: 'Content',
      label: 'Scope & out-of-scope filled',
      status: 'OPEN',
      tag: 'MANDATORY',
      sectionId: 'section-3',
    },
    // Risk & Dependencies category
    {
      id: '4',
      category: 'Risk & Dependencies',
      label: 'Key risks described',
      status: 'OPEN',
      tag: 'MANDATORY',
      sectionId: 'section-4',
    },
    {
      id: '5',
      category: 'Risk & Dependencies',
      label: 'Mitigation plan captured',
      status: 'OPEN',
      tag: 'MANDATORY',
      sectionId: 'section-5',
    },
    // Traceability category
    {
      id: '6',
      category: 'Traceability',
      label: 'Each BR linked to Business Goal',
      status: 'AUTO_FAILED',
      tag: 'AUTO',
    },
    {
      id: '7',
      category: 'Traceability',
      label: 'Stakeholders listed',
      status: 'DONE',
      tag: 'MANDATORY',
      sectionId: 'section-6',
    },
    {
      id: '8',
      category: 'Traceability',
      label: 'Business objectives mapped',
      status: 'OPEN',
      tag: 'MANDATORY',
      sectionId: 'section-7',
    },
    {
      id: '9',
      category: 'Content',
      label: 'Executive summary completed',
      status: 'OPEN',
      tag: 'MANDATORY',
      sectionId: 'section-8',
    },
    {
      id: '10',
      category: 'Content',
      label: 'Financial analysis included',
      status: 'AUTO_PASSED',
      tag: 'AUTO',
    },
  ];

  return baseItems;
}

export default function MetaPanel({ document, onTabChange: externalOnTabChange, activeTab: externalActiveTab, onGoToSection }: MetaPanelProps) {
  const [internalActiveTab, setInternalActiveTab] = useState<TabType>('info');
  const activeTab = externalActiveTab ?? internalActiveTab;
  
  const setActiveTab = (tab: TabType) => {
    if (externalOnTabChange) {
      externalOnTabChange(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };

  const { data: projectDocuments } = useQuery({
    queryKey: ['project-documents', document.projectId],
    queryFn: () => documentsApi.getByProject(document.projectId),
    enabled: activeTab === 'flow' || activeTab === 'workflow' || activeTab === 'checklist',
    select: (data) => data.documents,
  });

  // Fetch section dockets for all sections that support mini-dockets
  const sectionsWithDockets = useMemo(() => {
    return document.template.sections.filter((s) => sectionSupportsMiniDocket(s.title));
  }, [document.template.sections]);

  // Fetch all section dockets (using parallel queries)
  const sectionDocketsQueries = useQuery({
    queryKey: ['section-dockets', document.id, 'all'],
    queryFn: async () => {
      const dockets: Record<string, SectionDocket | null> = {};
      await Promise.all(
        sectionsWithDockets.map(async (section) => {
          try {
            const docket = await sectionDocketsApi.getBySection(document.id, section.id);
            if (docket) {
              dockets[section.id] = docket;
            }
          } catch {
            // Docket doesn't exist yet, that's fine
            dockets[section.id] = null;
          }
        })
      );
      return dockets;
    },
    enabled: sectionsWithDockets.length > 0,
  });

  const sectionDocketsMap = sectionDocketsQueries.data || {};

  // Get base checklist items (mock for now)
  const baseChecklistItems = useMemo(() => getMockChecklistItems(document.template.code), [document.template.code]);

  // Enhance checklist items with AUTO items for sections with dockets
  const checklistItems = useMemo(() => {
    const enhanced: ChecklistItem[] = [...baseChecklistItems];

    // Add AUTO checklist items for sections with dockets
    sectionsWithDockets.forEach((section) => {
      const docket = sectionDocketsMap[section.id];
      
      // Build field values map for evaluation
      const fieldValues: Record<string, string> = {};
      section.fields.forEach((field) => {
        if (field.fieldValueId) {
          fieldValues[field.fieldValueId] = field.value || '';
        }
      });

      // Evaluate completion
      const completionStatus = evaluateSectionCompletion(section, fieldValues, docket || undefined);
      const isComplete = completionStatus === 'complete';

      // Add AUTO checklist item
      enhanced.push({
        id: `auto-docket-${section.id}`,
        category: 'Artifacts',
        label: `Supporting artifacts attached for "${section.title}"`,
        status: isComplete ? 'AUTO_PASSED' : 'AUTO_FAILED',
        tag: 'AUTO',
        sectionId: section.id,
      });
    });

    return enhanced;
  }, [baseChecklistItems, sectionsWithDockets, sectionDocketsMap, document]);
  
  // Calculate checklist summary
  const checklistSummary = useMemo(() => calculateChecklistSummary(checklistItems), [checklistItems]);
  const pendingItemIds = useMemo(() => getPendingItemIds(checklistItems), [checklistItems]);

  // Build flow nodes
  const flowNodes = useMemo(() => {
    if (!projectDocuments) return [];
    // Create checklist data map (for now, use mock data for all documents)
    const checklistDataMap = new Map<string, ChecklistSummary>();
    projectDocuments.forEach((doc) => {
      checklistDataMap.set(doc.id, checklistSummary); // Using same summary for all for now
    });
    return buildFlowNodes(projectDocuments, document.id, checklistDataMap);
  }, [projectDocuments, document.id, checklistSummary]);

  // Compute CLIPON level statuses
  const levelStatuses = useMemo(() => {
    if (!projectDocuments) return [];
    return computeLevelStatuses(projectDocuments, document.level);
  }, [projectDocuments, document.level]);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'info', label: 'Info' },
    { id: 'checklist', label: 'Checklist' },
    { id: 'flow', label: 'Flow' },
    { id: 'workflow', label: 'Workflow' },
  ];

  // Format last updated time
  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Document Health Summary */}
      <div className="border-b bg-gray-50/50 p-4 shrink-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Document Health
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Status</span>
              <Badge 
                variant={
                  document.status === 'APPROVED' ? 'success' :
                  document.status === 'UNDER_REVIEW' ? 'warning' :
                  'secondary'
                }
                className="text-xs"
              >
                {document.status}
              </Badge>
            </div>
            {checklistSummary && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Checklist</span>
                <span className={cn(
                  "text-xs font-semibold",
                  checklistSummary.completionPercent >= 100 ? "text-green-600" : "text-amber-600"
                )}>
                  {checklistSummary.completionPercent}%
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Last updated</span>
              <span className="text-xs font-medium text-foreground">
                {formatLastUpdated(document.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Premium styling */}
      <div className="flex border-b bg-white z-10 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-3 text-sm font-medium border-b-2 transition-all relative',
              activeTab === tab.id
                ? 'border-primary text-primary font-semibold bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-gray-50/50'
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
      {activeTab === 'info' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Document Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Template:</span> {document.template.name}
              </div>
              <div>
                <span className="font-medium">Level:</span> {document.level}
              </div>
              <div>
                <span className="font-medium">Version:</span> {document.version}
              </div>
              <div>
                <span className="font-medium">Created:</span>{' '}
                {new Date(document.createdAt).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Updated:</span>{' '}
                {new Date(document.updatedAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {document.status === 'DRAFT' &&
                  'You can freely edit. When ready, submit for review.'}
                {document.status === 'UNDER_REVIEW' &&
                  'Editing may be locked; reviewers will approve.'}
                {document.status === 'APPROVED' &&
                  'Document is approved. Create new version to edit.'}
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No attachments yet</p>
              <button className="mt-2 text-sm text-primary hover:underline">
                + Add attachment
              </button>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'checklist' && (
        <ChecklistTab
          documentTitle={document.template.name}
          items={checklistItems}
          onItemsChange={(updatedItems) => {
            // Update checklist items (in real implementation, this would sync with backend)
            // For now, we'll handle this via state in ChecklistTab itself
          }}
          onGoToSection={onGoToSection}
          requiredCompletionPercent={100}
          onTabChange={setActiveTab}
        />
      )}

      {activeTab === 'flow' && (
        <div className="w-full">
          <ProcessFlow
            document={document}
            projectDocuments={projectDocuments || []}
            flowNodes={flowNodes}
            levelStatuses={levelStatuses}
            onTabChange={setActiveTab}
          />
        </div>
      )}

      {activeTab === 'workflow' && (
        <WorkflowTab
          document={document}
          checklistSummary={checklistSummary}
          pendingItemIds={pendingItemIds}
          flowNodes={flowNodes}
          levelStatuses={levelStatuses}
          onTabChange={setActiveTab}
        />
      )}
      </div>
    </div>
  );
}

