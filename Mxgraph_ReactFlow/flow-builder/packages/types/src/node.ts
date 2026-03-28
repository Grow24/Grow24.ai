/**
 * Flow node types - matches Salesforce Flow node types
 */

export type NodeType = 
  | 'start'
  | 'screen'
  | 'decision'
  | 'action'
  | 'subflow'
  | 'end';

export interface BaseFlowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
}

export type FlowNode = 
  | StartNode
  | ScreenNode
  | DecisionNode
  | ActionNode
  | SubflowNode
  | EndNode;

// Specific node types
export interface StartNode extends BaseFlowNode {
  type: 'start';
  data: StartNodeData;
}

export interface ScreenNode extends BaseFlowNode {
  type: 'screen';
  data: ScreenNodeData;
}

export interface DecisionNode extends BaseFlowNode {
  type: 'decision';
  data: DecisionNodeData;
}

export interface ActionNode extends BaseFlowNode {
  type: 'action';
  data: ActionNodeData;
}

export interface SubflowNode extends BaseFlowNode {
  type: 'subflow';
  data: SubflowNodeData;
}

export interface EndNode extends BaseFlowNode {
  type: 'end';
  data: EndNodeData;
}

// Node data types
export type NodeData = 
  | StartNodeData
  | ScreenNodeData
  | DecisionNodeData
  | ActionNodeData
  | SubflowNodeData
  | EndNodeData;

export interface StartNodeData {
  label: string;
}

export interface ScreenNodeData {
  label: string;
  fields: ScreenField[];
}

export interface DecisionNodeData {
  label: string;
  conditions: DecisionCondition[];
}

export interface ActionNodeData {
  label: string;
  actionType: string;
  parameters: Record<string, unknown>;
}

export interface SubflowNodeData {
  label: string;
  subflowId: string;
  parameters?: Record<string, unknown>;
}

export interface EndNodeData {
  label: string;
  status: 'success' | 'error';
}

// Supporting types
export interface ScreenField {
  id: string;
  type: 'text' | 'number' | 'email' | 'select' | 'checkbox';
  label: string;
  required: boolean;
  options?: string[];
}

export interface DecisionCondition {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: string | number | boolean;
  label: string;
}