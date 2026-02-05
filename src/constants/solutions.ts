// Valid solution IDs that have detail pages
// This list must match the keys in solutionDetails in SolutionDetailPage.tsx
export const VALID_SOLUTION_IDS = [
  'corp-strat-1',
  'corp-goal-1',
  'corp-plan-1',
  'corp-ops-1',
  'sales-goal-1',
  'sales-strat-1',
  'mkt-goal-1',
  'mkt-strat-1'
] as const

export type ValidSolutionId = typeof VALID_SOLUTION_IDS[number]

// Helper to check if a solution ID is valid
export function isValidSolutionId(id: string): boolean {
  return VALID_SOLUTION_IDS.includes(id as ValidSolutionId)
}
