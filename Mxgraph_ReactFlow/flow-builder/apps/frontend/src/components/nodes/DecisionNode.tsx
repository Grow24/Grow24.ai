import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { StyledNodeWrapper } from './StyledNodeWrapper';
import { drawioNodeStyles } from '../../config/nodeStyles';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';

interface DecisionNodeProps {
  data: {
    label: string;
    conditions?: Array<{
      id: string;
      label: string;
      expression: string;
    }>;
    defaultPath?: string;
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

export function DecisionNode({ data, selected }: DecisionNodeProps) {
  const conditions = data.conditions || [];
  const nodeStyle = drawioNodeStyles.decision;
  const style = data.style || {};
  const IconComponent = style.icon && (LucideIcons as any)[style.icon] ? (LucideIcons as any)[style.icon] : HelpCircle;
  
  return (
    <div className="relative">
      <StyledNodeWrapper
        color={style.fillColor || nodeStyle.background}
        border={style.borderColor || nodeStyle.border}
        textColor={style.textColor || nodeStyle.textColor}
        icon={<IconComponent className="w-4 h-4" />}
        label={data.label || 'Decision'}
        shape={nodeStyle.shape}
        selected={selected}
      >
        {conditions.length > 0 && (
          <div className="text-xs opacity-75 mt-1">
            {conditions.length} condition{conditions.length > 1 ? 's' : ''}
          </div>
        )}
      </StyledNodeWrapper>
      
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-amber-600 bg-white"
      />
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-amber-600 bg-white"
      />
      
      {/* Additional handles for multiple conditions */}
      {conditions.map((condition, index) => (
        <Handle
          key={`condition-${condition.id || index}`}
          type="source"
          position={Position.Right}
          id={condition.id || `condition-${index}`}
          style={{ 
            right: '-6px',
            top: `${50 + (index - conditions.length/2 + 0.5) * 15}%`
          }}
          className="w-3 h-3 border-2 border-amber-600 bg-white opacity-0 hover:opacity-100 transition-opacity duration-200"
        />
      ))}
    </div>
  );
}