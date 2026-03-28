import { z } from 'zod';

export const startNodeSchema = z.object({
  label: z.string().min(1, 'Label is required'),
});

export const screenNodeSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  fields: z.array(z.any()).optional(),
});

export const decisionNodeSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  conditions: z.array(z.any()).optional(),
});

export const actionNodeSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  actionType: z.string().optional(),
  parameters: z.record(z.any()).optional(),
});

export const subflowNodeSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  subflowId: z.string().optional(),
  parameters: z.record(z.any()).optional(),
});

export const endNodeSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  status: z.enum(['success', 'error']).optional(),
});

export type StartNodeFormData = z.infer<typeof startNodeSchema>;
export type ScreenNodeFormData = z.infer<typeof screenNodeSchema>;
export type DecisionNodeFormData = z.infer<typeof decisionNodeSchema>;
export type ActionNodeFormData = z.infer<typeof actionNodeSchema>;
export type SubflowNodeFormData = z.infer<typeof subflowNodeSchema>;
export type EndNodeFormData = z.infer<typeof endNodeSchema>;