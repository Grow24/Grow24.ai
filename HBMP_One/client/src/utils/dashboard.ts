import { DocumentListItem } from '@/api/documents.api';
import { Docket } from '@/api/projects.api';

export interface NextAction {
  title: string;
  reason: string;
  action: 'create' | 'submit' | 'approve' | 'continue';
  documentId?: string;
  docketId?: string;
  templateCode?: string;
  tab?: string;
}

export interface Blocker {
  label: string;
  reason: string;
  documentType: string;
}

export interface PhaseCounts {
  conceptual: { approved: number; total: number };
  logical: { approved: number; total: number };
  implementation: { approved: number; total: number };
}

/**
 * Helper to determine if a document is a BRD based on template name
 */
function isBRD(doc: DocumentListItem): boolean {
  return doc.templateName.includes('BRD') || doc.templateName.includes('Business Requirements');
}

/**
 * Helper to determine if a document is an SRS based on template name
 */
function isSRS(doc: DocumentListItem): boolean {
  return doc.templateName === 'SRS' || doc.templateName === 'System Requirements Specification' || doc.templateName.includes('SRS');
}

/**
 * Helper to determine if a document is a Business Case
 */
function isBusinessCase(doc: DocumentListItem): boolean {
  return doc.templateName === 'Business Case' || doc.templateName.includes('Business Case');
}

/**
 * Compute the next action the user should take based on current project state
 */
export function computeNextAction(
  documents: DocumentListItem[],
  dockets: Docket[]
): NextAction | null {
  // Find documents by template name
  const businessCaseDoc = documents.find(isBusinessCase);
  const brdDocs = documents.filter(isBRD);
  const srsDocs = documents.filter(isSRS);
  
  const businessCaseDocket = dockets.find((d) => d.type === 'BUSINESS_CASE');
  const businessReqDocket = dockets.find((d) => d.type === 'BUSINESS_REQUIREMENTS');
  const testDocket = dockets.find((d) => d.type === 'TEST');

  // Rule 1: If Business Case exists but not APPROVED
  if (businessCaseDoc && businessCaseDoc.status !== 'APPROVED') {
    return {
      title: 'Submit/Approve Business Case',
      reason: 'Business Case must be Approved to unlock BRD creation',
      action: 'submit',
      documentId: businessCaseDoc.id,
      docketId: businessCaseDoc.docketId,
      tab: 'workflow',
    };
  }

  // Rule 2: If Business Case not created
  if (!businessCaseDoc && businessCaseDocket) {
    return {
      title: 'Create Business Case',
      reason: 'Start by creating a Business Case to define project scope',
      action: 'create',
      docketId: businessCaseDocket.id,
      templateCode: 'BUSINESS_CASE',
    };
  }

  // Rule 3: If BRD not created and Business Case is approved
  if (businessCaseDoc?.status === 'APPROVED' && brdDocs.length === 0 && businessReqDocket) {
    return {
      title: 'Create BRD (Business Requirement Document)',
      reason: 'Business Case is approved. Create BRD to define business requirements',
      action: 'create',
      docketId: businessReqDocket.id,
      templateCode: 'BRD',
    };
  }

  // Rule 4: If BRD exists but not APPROVED
  const latestBRD = brdDocs[brdDocs.length - 1];
  if (latestBRD && latestBRD.status !== 'APPROVED') {
    return {
      title: 'Submit/Approve BRD',
      reason: 'BRD must be Approved to unlock SRS creation',
      action: 'submit',
      documentId: latestBRD.id,
      docketId: latestBRD.docketId,
      tab: 'workflow',
    };
  }

  // Rule 5: If UATP not created and BRD is approved
  const uatpDocs = documents.filter((d) => 
    d.templateName === 'User Acceptance Test Plan' || d.templateName.includes('UATP') || d.templateId === 'UATP'
  );
  if (latestBRD?.status === 'APPROVED' && uatpDocs.length === 0 && businessReqDocket) {
    return {
      title: 'Create UATP',
      reason: 'BRD is approved. Create UATP (User Acceptance Test Plan)',
      action: 'create',
      docketId: businessReqDocket.id,
      templateCode: 'UATP',
    };
  }

  // SRS rules hidden for now
  // // Rule 6: If UATP exists, prompt to create SRS
  // const latestUATP = uatpDocs[uatpDocs.length - 1];
  // if (latestUATP && srsDocs.length === 0 && businessReqDocket) {
  //   return {
  //     title: 'Create SRS',
  //     reason: 'UATP is created. Create SRS (System Requirements Specification)',
  //     action: 'create',
  //     docketId: businessReqDocket.id,
  //     templateCode: 'SRS',
  //   };
  // }

  // // Rule 7: If SRS exists but not APPROVED
  // const latestSRS = srsDocs[srsDocs.length - 1];
  // if (latestSRS && latestSRS.status !== 'APPROVED') {
  //   return {
  //     title: 'Submit/Approve SRS',
  //     reason: 'SRS must be Approved to unlock Implementation test plans',
  //     action: 'submit',
  //     documentId: latestSRS.id,
  //     docketId: latestSRS.docketId,
  //     tab: 'workflow',
  //   };
  // }

  // Rule 8: Default - continue with current active document
  const activeDocs = documents.filter((d) => d.status === 'DRAFT' || d.status === 'UNDER_REVIEW');
  if (activeDocs.length > 0) {
    const latestActive = activeDocs.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )[0];
    return {
      title: `Continue ${latestActive.templateName}`,
      reason: 'Complete checklist items and submit for review',
      action: 'continue',
      documentId: latestActive.id,
      docketId: latestActive.docketId,
    };
  }

  return null;
}

/**
 * Compute blockers based on workflow gating rules
 */
export function computeBlockers(
  documents: DocumentListItem[],
  dockets: Docket[]
): Blocker[] {
  const blockers: Blocker[] = [];

  const businessCaseDoc = documents.find(isBusinessCase);
  const brdDocs = documents.filter(isBRD);
  const srsDocs = documents.filter(isSRS);

  // Check if BRD is locked (Business Case not approved)
  if (!businessCaseDoc || businessCaseDoc.status !== 'APPROVED') {
    blockers.push({
      label: 'BRD creation',
      reason: 'Requires Business Case to be Approved',
      documentType: 'BRD',
    });
  }

  // Check if UATP is locked (BRD not approved)
  const latestBRD = brdDocs[brdDocs.length - 1];
  const uatpDocs = documents.filter((d) => 
    d.templateName === 'User Acceptance Test Plan' || d.templateName.includes('UATP') || d.templateId === 'UATP'
  );
  if (!latestBRD || latestBRD.status !== 'APPROVED') {
    blockers.push({
      label: 'UATP creation',
      reason: 'Requires BRD to be Approved',
      documentType: 'UATP',
    });
  }

  // SRS blockers hidden for now
  // // Check if SRS is locked (UATP not created)
  // if (uatpDocs.length === 0) {
  //   blockers.push({
  //     label: 'SRS creation',
  //     reason: 'Requires UATP to be created first',
  //     documentType: 'SRS',
  //   });
  // }

  // Check if Test Plans are locked (UATP not approved - changed from SRS)
  const latestUATP = uatpDocs[uatpDocs.length - 1];
  if (!latestUATP || latestUATP.status !== 'APPROVED') {
    blockers.push({
      label: 'SIT/UTP Plans',
      reason: 'Requires UATP to be Approved',
      documentType: 'TEST',
    });
  }

  return blockers;
}

/**
 * Compute phase counts (approved/total) for CLIPON stepper
 */
export function computePhaseCounts(documents: DocumentListItem[]): PhaseCounts {
  const conceptual = documents.filter((d) => d.level === 'C');
  const logical = documents.filter((d) => d.level === 'L');
  const implementation = documents.filter((d) => d.level === 'I');

  return {
    conceptual: {
      approved: conceptual.filter((d) => d.status === 'APPROVED').length,
      total: conceptual.length,
    },
    logical: {
      approved: logical.filter((d) => d.status === 'APPROVED').length,
      total: logical.length,
    },
    implementation: {
      approved: implementation.filter((d) => d.status === 'APPROVED').length,
      total: implementation.length,
    },
  };
}

