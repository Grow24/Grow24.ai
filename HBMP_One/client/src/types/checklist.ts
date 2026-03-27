export type ChecklistItemStatus =
  | "OPEN"
  | "DONE"
  | "AUTO_PASSED"
  | "AUTO_FAILED";

export type ChecklistItemTag = "MANDATORY" | "AUTO";

export interface ChecklistItem {
  id: string;
  category: string;       // e.g. "Content", "Risk & Dependencies"
  label: string;          // e.g. "Problem statement documented"
  status: ChecklistItemStatus;
  tag: ChecklistItemTag;
  sectionId?: string;     // id of the document section to scroll to
}

export interface ChecklistSummary {
  completedCount: number; // DONE or AUTO_PASSED
  totalCount: number;
  completionPercent: number; // 0–100
}

