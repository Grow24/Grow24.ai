/**
 * Flow edge types for connecting nodes
 */

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: 'default' | 'conditional';
  data?: EdgeData;
}

export interface EdgeData {
  label?: string;
  condition?: string;
  isDefault?: boolean;
}