import { DecisionNodeData, DecisionCondition } from './NodeConfigSchema';

// Legacy condition format for FlowRunner compatibility
export interface LegacyCondition {
  id: string;
  label: string;
  expression: string;
}

// Compile structured decision config to legacy format
export const compileDecisionForLegacyEval = (nodeData: DecisionNodeData): DecisionNodeData & { legacyConditions: LegacyCondition[] } => {
  const legacyConditions: LegacyCondition[] = nodeData.conditions.map(condition => ({
    id: condition.id,
    label: condition.label,
    expression: condition.expression // Keep expression as-is for current FlowRunner
  }));

  return {
    ...nodeData,
    legacyConditions
  };
};

// Transform structured config to field-operator-value format (future enhancement)
export const transformToFieldOperatorValue = (expression: string): { field: string; operator: string; value: any } | null => {
  // Simple regex patterns for common expressions
  const patterns = [
    { regex: /(\w+)\s*>=\s*(.+)/, operator: 'greater_than_or_equal' },
    { regex: /(\w+)\s*>\s*(.+)/, operator: 'greater_than' },
    { regex: /(\w+)\s*<=\s*(.+)/, operator: 'less_than_or_equal' },
    { regex: /(\w+)\s*<\s*(.+)/, operator: 'less_than' },
    { regex: /(\w+)\s*===?\s*(.+)/, operator: 'equals' },
    { regex: /(\w+)\s*!==?\s*(.+)/, operator: 'not_equals' },
  ];

  for (const pattern of patterns) {
    const match = expression.match(pattern.regex);
    if (match) {
      const field = match[1];
      let value: any = match[2];
      
      // Parse value type
      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      else if (!isNaN(Number(value))) value = Number(value);
      else value = value.replace(/['"]/g, ''); // Remove quotes
      
      return { field, operator: pattern.operator, value };
    }
  }
  
  return null;
};

// Detect if node data uses structured format
export const hasStructuredConfig = (nodeData: any): boolean => {
  return nodeData.conditions && 
         Array.isArray(nodeData.conditions) &&
         nodeData.conditions.length > 0 &&
         nodeData.conditions.every((c: any) => c.id && c.label && c.expression);
};