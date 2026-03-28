/**
 * End Node - Terminates the flow
 */
import { Position } from '@xyflow/react';
import { BaseNode } from './BaseNode';
interface EndNodeProps {
  data: {
    label: string;
    status?: 'success' | 'error';
  };
  selected?: boolean;
}

export function EndNode({ data, selected }: EndNodeProps) {
  const statusColor = data.status === 'success' ? 'text-green-600' : 'text-red-600';
  
  return (
    <BaseNode
      data={data}
      selected={selected}
      variant="end"
      sourceHandles={[]} // End node has no outputs
      targetHandles={[Position.Top]}
    >
      <div className={`text-xs mt-1 font-medium ${statusColor}`}>
        {data.status}
      </div>
    </BaseNode>
  );
}