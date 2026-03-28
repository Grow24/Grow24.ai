import React from 'react';
import { StyledNodeWrapper } from './StyledNodeWrapper';
import { drawioNodeStyles } from '../../config/nodeStyles';
import { Settings } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface ProcessNodeProps {
  data: {
    label: string;
    description?: string;
    style?: {
      fillColor?: string;
      borderColor?: string;
      borderWidth?: number;
      borderStyle?: string;
      textColor?: string;
      fontSize?: number;
      icon?: string;
      shadow?: boolean;
      borderRadius?: number;
    };
  };
  selected?: boolean;
}

export function ProcessNode({ data, selected }: ProcessNodeProps) {
  const nodeStyle = drawioNodeStyles.process;
  const style = data.style || {};
  const IconComponent = style.icon && (LucideIcons as any)[style.icon] ? (LucideIcons as any)[style.icon] : Settings;
  
  return (
    <StyledNodeWrapper
      color={style.fillColor || nodeStyle.background}
      border={style.borderColor || nodeStyle.border}
      textColor={style.textColor || nodeStyle.textColor}
      icon={<IconComponent className="w-4 h-4" />}
      label={data.label || 'Process'}
      shape={nodeStyle.shape}
      selected={selected}
      style={{
        borderRadius: style.borderRadius || nodeStyle.borderRadius || 16,
        minWidth: '160px'
      }}
    >
      {data.description && (
        <div className="text-xs opacity-75 mt-1">
          {data.description}
        </div>
      )}
    </StyledNodeWrapper>
  );
}