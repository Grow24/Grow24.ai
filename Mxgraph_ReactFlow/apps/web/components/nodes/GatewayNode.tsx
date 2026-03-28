import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';

interface GatewayNodeData {
  label: string;
  description?: string;
}

export const GatewayNode = memo(({ data }: NodeProps<GatewayNodeData>) => {
  return (
    <div className="relative">
      {/* Diamond shape using CSS transform */}
      <div 
        className="w-12 h-12 bg-yellow-100 border-2 border-yellow-400 transform rotate-45 shadow-sm"
        style={{ 
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          transform: 'none'
        }}
      >
      </div>
      
      {/* Label positioned over the diamond */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-yellow-900 text-center max-w-[40px] leading-tight">
          {data.label}
        </span>
      </div>
      
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="target"
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
        style={{ left: '-6px', top: '50%', transform: 'translateY(-50%)' }}
      />
      
      {/* Output handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
        style={{ right: '-6px', top: '50%', transform: 'translateY(-50%)' }}
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
        style={{ bottom: '-6px', left: '50%', transform: 'translateX(-50%)' }}
      />
    </div>
  );
});

GatewayNode.displayName = 'GatewayNode';