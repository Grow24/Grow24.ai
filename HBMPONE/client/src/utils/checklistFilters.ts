import { ChecklistItem, ChecklistItemStatus, ChecklistItemTag } from '@/types/checklist';

export interface ChecklistFilters {
  status: 'all' | 'open' | 'done' | 'auto_failed';
  tag: 'all' | 'mandatory' | 'auto';
}

/**
 * Filter checklist items based on filters
 */
export function filterChecklistItems(
  items: ChecklistItem[],
  filters: ChecklistFilters
): ChecklistItem[] {
  let filtered = [...items];

  // Apply status filter
  if (filters.status === 'open') {
    filtered = filtered.filter(
      (item) => item.status === 'OPEN' || item.status === 'AUTO_FAILED'
    );
  } else if (filters.status === 'done') {
    filtered = filtered.filter(
      (item) => item.status === 'DONE' || item.status === 'AUTO_PASSED'
    );
  } else if (filters.status === 'auto_failed') {
    filtered = filtered.filter((item) => item.status === 'AUTO_FAILED');
  }

  // Apply tag filter
  if (filters.tag === 'mandatory') {
    filtered = filtered.filter((item) => item.tag === 'MANDATORY');
  } else if (filters.tag === 'auto') {
    filtered = filtered.filter((item) => item.tag === 'AUTO');
  }

  return filtered;
}

/**
 * Compute enhanced checklist summary with mandatory breakdown
 */
export interface EnhancedChecklistSummary {
  completedCount: number;
  totalCount: number;
  completionPercent: number;
  mandatoryCompleted: number;
  mandatoryTotal: number;
  mandatoryCompletionPercent: number;
}

export function computeChecklistSummary(items: ChecklistItem[]): EnhancedChecklistSummary {
  const completedCount = items.filter(
    (item) => item.status === 'DONE' || item.status === 'AUTO_PASSED'
  ).length;
  const totalCount = items.length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const mandatoryItems = items.filter((item) => item.tag === 'MANDATORY');
  const mandatoryCompleted = mandatoryItems.filter(
    (item) => item.status === 'DONE' || item.status === 'AUTO_PASSED'
  ).length;
  const mandatoryTotal = mandatoryItems.length;
  const mandatoryCompletionPercent =
    mandatoryTotal > 0 ? Math.round((mandatoryCompleted / mandatoryTotal) * 100) : 0;

  return {
    completedCount,
    totalCount,
    completionPercent,
    mandatoryCompleted,
    mandatoryTotal,
    mandatoryCompletionPercent,
  };
}

/**
 * Get blocking mandatory items (first 5 highest priority)
 */
export function getBlockingMandatoryItems(items: ChecklistItem[]): ChecklistItem[] {
  return items
    .filter(
      (item) =>
        item.tag === 'MANDATORY' &&
        item.status !== 'DONE' &&
        item.status !== 'AUTO_PASSED'
    )
    .slice(0, 5);
}

