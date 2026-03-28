import { nodeConfigSchema, NodeConfig } from '../schemas/nodeSchemas';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Validate node configuration with friendly error messages
export const validateNodeConfig = (config: any): ValidationResult => {
  try {
    nodeConfigSchema.parse(config);
    return { isValid: true, errors: [] };
  } catch (error: any) {
    const errors = error.errors?.map((err: any) => {
      const path = err.path.join('.');
      return `${path}: ${err.message}`;
    }) || ['Invalid configuration'];
    
    return { isValid: false, errors };
  }
};

// Validate MECE conditions for decision nodes
export const validateMECEConditions = (conditions: any[]): ValidationResult => {
  const errors: string[] = [];

  // Check for duplicate IDs
  const ids = conditions.map(c => c.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    errors.push(`Duplicate condition IDs: ${duplicateIds.join(', ')}`);
  }

  // Check for duplicate labels
  const labels = conditions.map(c => c.label);
  const duplicateLabels = labels.filter((label, index) => labels.indexOf(label) !== index);
  if (duplicateLabels.length > 0) {
    errors.push(`Duplicate condition labels: ${duplicateLabels.join(', ')}`);
  }

  // Check for empty expressions
  const emptyExpressions = conditions.filter(c => !c.expression?.trim());
  if (emptyExpressions.length > 0) {
    errors.push('All conditions must have expressions');
  }

  return { isValid: errors.length === 0, errors };
};