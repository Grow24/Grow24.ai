/**
 * Document dependency mapping for CLIPON workflow
 * Defines what each document type depends on and what it enables
 */

export interface DocumentDependency {
  documentType: string;
  dependsOn: string[];
  enables: string[];
}

/**
 * Get document dependencies based on template code
 */
export function getDocumentDependencies(templateCode: string): DocumentDependency {
  const code = templateCode.toUpperCase();

  switch (code) {
    case 'BUSINESS_CASE':
      return {
        documentType: 'Business Case',
        dependsOn: [],
        enables: ['BRD', 'Business Requirements'],
      };

    case 'BRD':
      return {
        documentType: 'BRD',
        dependsOn: ['Approved Business Case'],
        enables: ['UATP'],
      };

    // case 'SRS':
    //   return {
    //     documentType: 'SRS',
    //     dependsOn: ['Completed UATP'],
    //     enables: ['SIT Plan', 'UTP'],
    //   }; // Hidden for now

    case 'UAT':
    case 'UAT_STRATEGY':
    case 'UAT_PLAN':
    case 'UATP':
      return {
        documentType: 'UATP',
        dependsOn: ['Approved BRD'],
        enables: [], // SRS hidden for now
      };

    case 'SIT':
    case 'SIT_PLAN':
      return {
        documentType: 'SIT Plan',
        dependsOn: ['Approved UATP'], // Changed from SRS
        enables: [],
      };

    case 'UTP':
    case 'UNIT_TEST_PLAN':
      return {
        documentType: 'UTP',
        dependsOn: ['Approved UATP'], // Changed from SRS
        enables: [],
      };

    default:
      // Fallback for unknown document types
      return {
        documentType: templateCode,
        dependsOn: [],
        enables: [],
      };
  }
}

/**
 * Get document type label from template code
 */
export function getDocumentTypeLabel(templateCode: string): string {
  const deps = getDocumentDependencies(templateCode);
  return deps.documentType;
}

