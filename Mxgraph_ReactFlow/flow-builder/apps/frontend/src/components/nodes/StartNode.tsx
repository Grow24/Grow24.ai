import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { StyledNodeWrapper } from './StyledNodeWrapper';
import { drawioNodeStyles } from '../../config/nodeStyles';
import { Play } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface StartNodeProps {
  data: {
    label: string;
    style?: {
      fillColor?: string;
      borderColor?: string;
      borderWidth?: number;
      borderStyle?: string;
      textColor?: string;
      fontSize?: number;
      icon?: string;
      shadow?: boolean;
    };
  };
  selected?: boolean;
}

export function StartNode({ data, selected }: StartNodeProps) {
  const nodeStyle = drawioNodeStyles.start;
  const style = data.style || {};
  const IconComponent = style.icon && (LucideIcons as any)[style.icon] ? (LucideIcons as any)[style.icon] : Play;
  
  return (
    <div className="relative">
      <StyledNodeWrapper
        color={style.fillColor || nodeStyle.background}
        border={style.borderColor || nodeStyle.border}
        textColor={style.textColor || nodeStyle.textColor}
        icon={<IconComponent className="w-4 h-4" />}
        label={data.label || 'Start'}
        shape={nodeStyle.shape}
        selected={selected}
      />
      
      {/* Output handles in all four directions */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-green-600 bg-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 border-2 border-green-600 bg-white"
      />
      <Handle
        type="source"
        position={Position.Left}
        className="w-3 h-3 border-2 border-green-600 bg-white"
      />
      <Handle
        type="source"
        position={Position.Top}
        className="w-3 h-3 border-2 border-green-600 bg-white"
      />
    </div>
  );
}