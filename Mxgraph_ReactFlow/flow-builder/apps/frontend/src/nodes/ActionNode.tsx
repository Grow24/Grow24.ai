/**
 * Action Node - Performs operations/API calls
 */
import { Position } from '@xyflow/react';
import { BaseNode } from './BaseNode';
interface ActionNodeProps {
  data: {
    label: string;
    actionType?: string;
    parameters?: Record<string, any>;
  };
  selected?: boolean;
}

export function ActionNode({ data, selected }: ActionNodeProps) {
  return (
    <BaseNode
      data={data}
      selected={selected}
      variant="action"
      sourceHandles={[Position.Bottom]}
      targetHandles={[Position.Top]}
    >
      <div className="text-xs text-muted-foreground mt-1">
        {data.actionType}
      </div>
    </BaseNode>
  );
}