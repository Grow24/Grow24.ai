// Runtime type guards for node configurations

export interface DecisionCondition {
  id: string;
  label: string;
  expression: string;
}

export interface StartNodeData {
  label: string;
}

export interface DecisionNodeData {
  label: string;
  conditions: DecisionCondition[];
  defaultPath: string;
}

export interface ActionNodeData {
  label: string;
  actionType: 'email' | 'api' | 'db';
  config?: Record<string, any>;
  outputVar?: string;
}

export interface ProcessNodeData {
  label: string;
  description?: string;
}

export interface EndNodeData {
  label: string;
  status?: 'success' | 'error';
}

// Runtime type guards
export const isStartNodeData = (data: any): data is StartNodeData => {
  return typeof data === 'object' && 
         typeof data.label === 'string';
};

export const isDecisionNodeData = (data: any): data is DecisionNodeData => {
  return typeof data === 'object' &&
         typeof data.label === 'string' &&
         Array.isArray(data.conditions) &&
         typeof data.defaultPath === 'string' &&
         data.conditions.every((c: any) => 
           typeof c.id === 'string' &&
           typeof c.label === 'string' &&
           typeof c.expression === 'string'
         );
};

export const isActionNodeData = (data: any): data is ActionNodeData => {
  return typeof data === 'object' &&
         typeof data.label === 'string' &&
         ['email', 'api', 'db'].includes(data.actionType);
};

export const isProcessNodeData = (data: any): data is ProcessNodeData => {
  return typeof data === 'object' &&
         typeof data.label === 'string';
};

export const isEndNodeData = (data: any): data is EndNodeData => {
  return typeof data === 'object' &&
         typeof data.label === 'string';
};