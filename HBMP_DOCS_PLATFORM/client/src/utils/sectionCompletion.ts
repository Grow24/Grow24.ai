import { DocumentSection } from '@/api/documents.api';
import { SectionDocket } from '@/api/sectionDockets.api';

export type SectionCompletionStatus = 'complete' | 'in-progress' | 'untouched';

/**
 * Check if a section title suggests it should support mini-dockets
 */
export function sectionSupportsMiniDocket(sectionTitle: string): boolean {
  const titleLower = sectionTitle.toLowerCase();
  return (
    titleLower.includes('cost') ||
    titleLower.includes('benefit') ||
    titleLower.includes('financial') ||
    titleLower.includes('attachment') ||
    titleLower.includes('alternative') ||
    titleLower.includes('risk') ||
    titleLower.includes('supporting') ||
    titleLower.includes('artifact')
  );
}

/**
 * Evaluate section completion considering mini-docket rules
 * 
 * Rule v1: Section is COMPLETE if:
 * (A) summary field has content (existing field value not empty)
 * AND
 * (B) SectionDocket has at least 1 item (if docket exists)
 * 
 * If no docket exists, fall back to standard completion rules:
 * - All mandatory fields filled = complete
 * - Some data = in-progress
 * - No data = untouched
 */
export function evaluateSectionCompletion(
  section: DocumentSection,
  fieldValues: Record<string, string>,
  sectionDocket?: SectionDocket | null
): SectionCompletionStatus {
  // If section has a docket, use mini-docket rules
  if (sectionDocket) {
    // Check if summary field has content
    // We consider the first field (usually "content" or similar) as the summary
    const hasSummaryContent = section.fields.some((field) => {
      const fieldValueId = field.fieldValueId || '';
      const value = fieldValues[fieldValueId] || field.value || '';
      return value.trim() !== '';
    });

    // Check if docket has at least 1 item
    const hasItems = sectionDocket.items.length > 0;

    // Section is complete only if both conditions are met
    if (hasSummaryContent && hasItems) {
      return 'complete';
    }

    // Section is in-progress if at least one condition is met
    if (hasSummaryContent || hasItems) {
      return 'in-progress';
    }

    // Otherwise untouched
    return 'untouched';
  }

  // Standard completion rules (no docket)
  const hasData = section.fields.some((field) => {
    const fieldValueId = field.fieldValueId || '';
    const value = fieldValues[fieldValueId] || field.value || '';
    return value.trim() !== '';
  });

  const allMandatoryFilled = section.fields
    .filter((f) => f.mandatory)
    .every((f) => {
      const fieldValueId = f.fieldValueId || '';
      const value = fieldValues[fieldValueId] || f.value || '';
      return value.trim() !== '';
    });

  if (allMandatoryFilled) return 'complete';
  if (hasData) return 'in-progress';
  return 'untouched';
}


