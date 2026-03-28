import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface StyledNodeWrapperProps {
  children?: React.ReactNode;
  color: string;
  border: string;
  textColor?: string;
  icon?: React.ReactNode;
  label: string;
  shape?: 'rectangle' | 'oval' | 'diamond' | 'circle' | 'document' | 'process';
  selected?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const StyledNodeWrapper: React.FC<StyledNodeWrapperProps> = ({
  children,
  color,
  border,
  textColor = '#374151',
  icon,
  label,
  shape = 'rectangle',
  selected = false,
  className = '',
  style = {}
}) => {
  const getShapeStyle = () => {
    const baseStyle = {
      background: color,
      borderColor: border,
      color: textColor,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 600,
      fontSize: '12px',
      border: '2px solid',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      ...style
    };

    switch (shape) {
      case 'oval':
        return {
          ...baseStyle,
          borderRadius: '50px',
          width: '120px',
          height: '50px'
        };
      case 'diamond':
        return {
          ...baseStyle,
          transform: 'rotate(45deg)',
          width: '60px',
          height: '60px',
          borderRadius: '8px'
        };
      case 'circle':
        return {
          ...baseStyle,
          borderRadius: '50%',
          width: '50px',
          height: '50px'
        };
      case 'process':
        return {
          ...baseStyle,
          borderRadius: '15px',
          width: '120px',
          height: '50px'
        };
      case 'document':
        return {
          ...baseStyle,
          borderRadius: '8px 8px 0 0',
          width: '120px',
          height: '50px'
        };
      default:
        return {
          ...baseStyle,
          borderRadius: '8px',
          width: '120px',
          height: '50px'
        };
    }
  };

  const getLabelStyle = () => {
    if (shape === 'diamond') {
      return {
        transform: 'rotate(-45deg)',
        fontSize: '10px',
        textAlign: 'center' as const,
        maxWidth: '40px',
        lineHeight: '1.2'
      };
    }
    return {
      textAlign: 'center' as const,
      fontSize: '12px',
      fontWeight: 600,
      lineHeight: '1.2',
      padding: '0 4px'
    };
  };

  return (
    <div className="relative group">
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 border border-gray-400 bg-white group-hover:opacity-100 opacity-0 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 border border-gray-400 bg-white group-hover:opacity-100 opacity-0 transition-opacity"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 border border-gray-400 bg-white group-hover:opacity-100 opacity-0 transition-opacity"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 border border-gray-400 bg-white group-hover:opacity-100 opacity-0 transition-opacity"
      />

      <div
        style={getShapeStyle()}
        className={`${selected ? 'ring-2 ring-blue-400' : ''} ${className}`}
      >
        <div style={getLabelStyle()}>
          {icon && <span style={{ marginRight: '4px', fontSize: '10px' }}>{icon}</span>}
          {label}
        </div>
        {children}
      </div>
    </div>
  );
};