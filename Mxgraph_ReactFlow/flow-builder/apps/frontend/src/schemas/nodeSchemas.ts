import { z } from 'zod';

// Base node schema
export const baseNodeSchema = z.object({
  label: z.string().min(1, 'Label is required'),
});

// Start node schema
export const startNodeSchema = baseNodeSchema.extend({
  type: z.literal('start'),
});

// Decision node schema
export const decisionConditionSchema = z.object({
  id: z.string().min(1, 'Condition ID is required'),
  label: z.string().min(1, 'Condition label is required'),
  expression: z.string().min(1, 'Expression is required'),
});

export const decisionNodeSchema = baseNodeSchema.extend({
  type: z.literal('decision'),
  conditions: z.array(decisionConditionSchema).min(1, 'At least one condition required'),
  defaultPath: z.string().min(1, 'Default path is required'),
});

// Action node schema
export const actionNodeSchema = baseNodeSchema.extend({
  type: z.literal('action'),
  actionType: z.enum(['email', 'api', 'db'], { required_error: 'Action type is required' }),
  config: z.record(z.any()).optional(),
  outputVar: z.string().optional(),
});

// Process node schema
export const processNodeSchema = baseNodeSchema.extend({
  type: z.literal('process'),
  description: z.string().optional(),
});

// End node schema
export const endNodeSchema = baseNodeSchema.extend({
  type: z.literal('end'),
  status: z.enum(['success', 'error']).optional(),
});

// Table node schema
export const tableNodeSchema = baseNodeSchema.extend({
  type: z.literal('table'),
  rows: z.number().min(1, 'At least 1 row required'),
  cols: z.number().min(1, 'At least 1 column required'),
  cells: z.array(z.array(z.string())),
  columnWidths: z.array(z.number().min(20)),
  rowHeights: z.array(z.number().min(20)),
});

// Union type for all node schemas
export const nodeConfigSchema = z.discriminatedUnion('type', [
  startNodeSchema,
  decisionNodeSchema,
  actionNodeSchema,
  processNodeSchema,
  endNodeSchema,
  tableNodeSchema,
]);

// TypeScript types
export type StartNodeConfig = z.infer<typeof startNodeSchema>;
export type DecisionNodeConfig = z.infer<typeof decisionNodeSchema>;
export type ActionNodeConfig = z.infer<typeof actionNodeSchema>;
export type ProcessNodeConfig = z.infer<typeof processNodeSchema>;
export type EndNodeConfig = z.infer<typeof endNodeSchema>;
export type TableNodeConfig = z.infer<typeof tableNodeSchema>;
export type NodeConfig = z.infer<typeof nodeConfigSchema>;