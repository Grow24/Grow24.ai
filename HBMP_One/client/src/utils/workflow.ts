import { ChecklistItem, ChecklistSummary } from '@/types/checklist';
import { Document, DocumentListItem } from '@/api/documents.api';

/**
 * Calculate checklist summary from items
 */
export function calculateChecklistSummary(items: ChecklistItem[]): ChecklistSummary {
  const completedCount = items.filter(
    (item) => item.status === 'DONE' || item.status === 'AUTO_PASSED'
  ).length;
  const totalCount = items.length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  return {
    completedCount,
    totalCount,
    completionPercent,
  };
}

/**
 * Get pending item IDs
 */
export function getPendingItemIds(items: ChecklistItem[]): string[] {
  return items
    .filter((item) => item.status !== 'DONE' && item.status !== 'AUTO_PASSED')
    .map((item) => item.id);
}

/**
 * Flow node status based on document status
 */
export type FlowNodeStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'APPROVED';

export interface FlowNodeViewModel {
  nodeId: string;
  label: string;
  status: FlowNodeStatus;
  checklistCompletionPercent?: number;
  isCurrent?: boolean;
  documentId?: string;
  documentTemplateCode?: string;
  level?: 'C' | 'L' | 'I';
}

/**
 * Map document status to flow node status
 */
export function mapDocumentStatusToFlowStatus(status: string): FlowNodeStatus {
  switch (status) {
    case 'APPROVED':
      return 'APPROVED';
    case 'UNDER_REVIEW':
    case 'DRAFT':
      return 'IN_PROGRESS';
    default:
      return 'NOT_STARTED';
  }
}

/**
 * Build flow nodes from documents
 */
export function buildFlowNodes(
  documents: DocumentListItem[],
  currentDocumentId?: string,
  checklistData?: Map<string, ChecklistSummary>
): FlowNodeViewModel[] {
  // Flow configuration mapping with prerequisites
  const flowConfig: Record<string, { 
    label: string; 
    templateCodes: string[];
    requires?: string[]; // Array of nodeIds that must be APPROVED
    level?: 'C' | 'L' | 'I';
  }> = {
    'business-case': {
      label: 'Business Case',
      templateCodes: ['BUSINESS_CASE'],
      level: 'C',
    },
    'brd': {
      label: 'BRD',
      templateCodes: ['BRD', 'BRS'],
      requires: ['business-case'], // BRD requires Business Case to be approved
      level: 'C',
    },
    'srs': {
      label: 'SRS',
      templateCodes: ['SRS'],
      requires: ['brd'], // SRS requires BRD to be approved
      level: 'L',
    },
    'uat-plan': {
      label: 'UATP',
      templateCodes: ['UAT_PLAN', 'UATP'],
      requires: ['brd'], // UATP requires BRD to be approved (not SRS)
      level: 'L',
    },
    'sit-plan': {
      label: 'SIT Plan',
      templateCodes: ['SIT_PLAN', 'SITP'],
      requires: ['uat-plan'], // SIT Plan requires UAT Plan to be approved
      level: 'I',
    },
    'utp': {
      label: 'UTP',
      templateCodes: ['UTP'],
      requires: ['sit-plan'], // UTP requires SIT Plan to be approved
      level: 'I',
    },
  };

  // Build a map of node statuses for prerequisite checking
  const nodeStatusMap = new Map<string, FlowNodeStatus>();
  
  // First pass: determine status for each node
  Object.entries(flowConfig).forEach(([nodeId, config]) => {
    const doc = documents.find((d) => {
      const templateCode = d.templateName.toUpperCase().replace(/\s+/g, '_');
      return config.templateCodes.some((code) => templateCode.includes(code));
    });
    
    const status = doc ? mapDocumentStatusToFlowStatus(doc.status) : 'NOT_STARTED';
    nodeStatusMap.set(nodeId, status);
  });

  // Second pass: build nodes with prerequisite checking
  return Object.entries(flowConfig).map(([nodeId, config]) => {
    // Find matching document
    const doc = documents.find((d) => {
      const templateCode = d.templateName.toUpperCase().replace(/\s+/g, '_');
      return config.templateCodes.some((code) => templateCode.includes(code));
    });

    let status: FlowNodeStatus = doc ? mapDocumentStatusToFlowStatus(doc.status) : 'NOT_STARTED';
    
    // Check prerequisites - if any required node is not APPROVED, lock this node
    if (config.requires && status === 'NOT_STARTED') {
      const prerequisitesMet = config.requires.every((reqNodeId) => {
        const reqStatus = nodeStatusMap.get(reqNodeId);
        return reqStatus === 'APPROVED';
      });
      
      if (!prerequisitesMet) {
        status = 'NOT_STARTED'; // Keep as NOT_STARTED, ProcessFlow will handle locked state
      }
    }

    const checklistPercent = doc && checklistData?.get(doc.id)?.completionPercent;
    const isCurrent = doc?.id === currentDocumentId;

    return {
      nodeId,
      label: config.label,
      status,
      checklistCompletionPercent: checklistPercent,
      isCurrent,
      documentId: doc?.id,
      documentTemplateCode: doc?.templateName,
      level: config.level,
    };
  });
}

/**
 * CLIPON Level Status
 */
export type LevelKey = 'C' | 'L' | 'I' | 'P' | 'O' | 'N';

export interface LevelStatus {
  level: LevelKey;
  label: string;
  isComplete: boolean;
  isCurrent: boolean;
  isLocked: boolean;
}

/**
 * Compute CLIPON level statuses
 */
export function computeLevelStatuses(
  documents: DocumentListItem[],
  currentDocumentLevel?: string
): LevelStatus[] {
  // Check document approvals by level
  const hasApprovedBusinessCase = documents.some(
    (doc) =>
      (doc.templateName.includes('Business Case') || doc.templateName.includes('BUSINESS_CASE')) &&
      doc.status === 'APPROVED'
  );

  const hasApprovedBRD = documents.some(
    (doc) =>
      (doc.templateName.includes('BRD') || doc.templateName.includes('BRS')) &&
      doc.status === 'APPROVED' &&
      doc.level === 'C'
  );

  const hasApprovedSRS = documents.some(
    (doc) =>
      doc.templateName === 'SRS' &&
      doc.status === 'APPROVED' &&
      doc.level === 'L'
  );

  const hasApprovedUAT = documents.some(
    (doc) =>
      (doc.templateName.includes('UAT') || doc.templateName.includes('UATP')) &&
      doc.status === 'APPROVED' &&
      doc.level === 'L'
  );

  const hasApprovedSIT = documents.some(
    (doc) =>
      (doc.templateName.includes('SIT') || doc.templateName.includes('SITP')) &&
      doc.status === 'APPROVED' &&
      doc.level === 'I'
  );

  const hasApprovedUTP = documents.some(
    (doc) =>
      (doc.templateName.includes('UTP')) &&
      doc.status === 'APPROVED' &&
      doc.level === 'I'
  );

  // Level completion rules
  const conceptualComplete = hasApprovedBusinessCase && hasApprovedBRD;
  const logicalComplete = hasApprovedSRS && hasApprovedUAT;
  const implementationComplete = hasApprovedSIT && hasApprovedUTP;

  // Determine current level
  const currentLevel = currentDocumentLevel?.toUpperCase() as LevelKey | undefined;

  const levels: LevelStatus[] = [
    {
      level: 'C',
      label: 'Conceptual',
      isComplete: conceptualComplete,
      isCurrent: currentLevel === 'C',
      isLocked: false, // Conceptual is never locked
    },
    {
      level: 'L',
      label: 'Logical',
      isComplete: logicalComplete,
      isCurrent: currentLevel === 'L',
      isLocked: !conceptualComplete,
    },
    {
      level: 'I',
      label: 'Implementation',
      isComplete: implementationComplete,
      isCurrent: currentLevel === 'I',
      isLocked: !logicalComplete,
    },
    {
      level: 'P',
      label: 'Production',
      isComplete: false,
      isCurrent: currentLevel === 'P',
      isLocked: !implementationComplete,
    },
    {
      level: 'O',
      label: 'Operate',
      isComplete: false,
      isCurrent: currentLevel === 'O',
      isLocked: true, // Always locked for now
    },
    {
      level: 'N',
      label: 'Navigate',
      isComplete: false,
      isCurrent: currentLevel === 'N',
      isLocked: true, // Always locked for now
    },
  ];

  return levels;
}

