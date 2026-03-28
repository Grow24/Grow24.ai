import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface EventNodeData {
  label: string;
  description?: string;
}

export const EventNode = memo(({ data }: NodeProps<EventNodeData>) => {
  return (
    <div className="relative">
      {/* Circular event shape */}
      <div className="w-16 h-16 bg-orange-100 border-2 border-orange-400 rounded-full shadow-sm flex items-center justify-center">
        <span className="text-xs font-medium text-orange-900 text-center max-w-[50px] leading-tight">
          {data.label}
        </span>
      </div>
      
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-orange-500 border-2 border-white"
      />
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-orange-500 border-2 border-white"
      />
    </div>
  );
});

EventNode.displayName = 'EventNode';