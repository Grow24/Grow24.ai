/**
 * Subflow Node - References another flow
 */
import { Position } from '@xyflow/react';
import { BaseNode } from './BaseNode';
interface SubflowNodeProps {
  data: {
    label: string;
    subflowId?: string;
  };
  selected?: boolean;
}

export function SubflowNode({ data, selected }: SubflowNodeProps) {
  return (
    <BaseNode
      data={data}
      selected={selected}
      variant="subflow"
      sourceHandles={[Position.Bottom]}
      targetHandles={[Position.Top]}
    >
      <div className="text-xs text-muted-foreground mt-1">
        Flow: {data.subflowId}
      </div>
    </BaseNode>
  );
}