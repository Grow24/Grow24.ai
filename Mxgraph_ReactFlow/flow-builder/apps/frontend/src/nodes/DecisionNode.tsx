/**
 * Decision Node - Conditional branching logic
 */
import { Position } from '@xyflow/react';
import { BaseNode } from './BaseNode';
interface DecisionNodeProps {
  data: {
    label: string;
    conditions?: Array<{ id: string; field: string; operator: string; value: string; label: string }>;
  };
  selected?: boolean;
}

export function DecisionNode({ data, selected }: DecisionNodeProps) {
  return (
    <BaseNode
      data={data}
      selected={selected}
      variant="decision"
      sourceHandles={[Position.Right, Position.Bottom]} // Multiple paths
      targetHandles={[Position.Top]}
    >
      <div className="text-xs text-muted-foreground mt-1">
        {data.conditions?.length || 0} condition(s)
      </div>
    </BaseNode>
  );
}