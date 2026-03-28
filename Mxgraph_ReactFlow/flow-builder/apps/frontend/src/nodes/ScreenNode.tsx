/**
 * Screen Node - User interaction/data collection
 */
import { Position } from '@xyflow/react';
import { BaseNode } from './BaseNode';
interface ScreenNodeProps {
  data: {
    label: string;
    fields?: Array<{ id: string; type: string; label: string; required: boolean }>;
  };
  selected?: boolean;
}

export function ScreenNode({ data, selected }: ScreenNodeProps) {
  return (
    <BaseNode
      data={data}
      selected={selected}
      variant="screen"
      sourceHandles={[Position.Bottom]}
      targetHandles={[Position.Top]}
    >
      <div className="text-xs text-muted-foreground mt-1">
        {data.fields?.length || 0} field(s)
      </div>
    </BaseNode>
  );
}