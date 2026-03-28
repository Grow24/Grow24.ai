/**
 * Start Node - Entry point of the flow
 */
import React from 'react';
import { Position } from '@xyflow/react';
import { BaseNode } from './BaseNode';
interface StartNodeProps {
  data: {
    label: string;
  };
  selected?: boolean;
}

export function StartNode({ data, selected }: StartNodeProps) {
  return (
    <BaseNode
      data={data}
      selected={selected}
      variant="start"
      sourceHandles={[Position.Bottom]}
      targetHandles={[]} // Start node has no inputs
    >
      <div className="text-xs text-muted-foreground mt-1">
        Flow entry point
      </div>
    </BaseNode>
  );
}