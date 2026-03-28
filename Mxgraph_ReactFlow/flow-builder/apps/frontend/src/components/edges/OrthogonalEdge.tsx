import React from 'react';
import { EdgeProps, getStraightPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';

export const OrthogonalEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  label,
  labelStyle,
  labelShowBg,
  labelBgStyle,
  labelBgPadding,
  labelBgBorderRadius,
  selected,
}) => {
  // Calculate orthogonal path
  const getOrthogonalPath = () => {
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;
    
    // Simple L-shaped path for orthogonal routing
    if (Math.abs(targetX - sourceX) > Math.abs(targetY - sourceY)) {
      // Horizontal first, then vertical
      return `M ${sourceX},${sourceY} L ${midX},${sourceY} L ${midX},${targetY} L ${targetX},${targetY}`;
    } else {
      // Vertical first, then horizontal
      return `M ${sourceX},${sourceY} L ${sourceX},${midY} L ${targetX},${midY} L ${targetX},${targetY}`;
    }
  };

  const [edgePath, labelX, labelY] = style?.style === 'orthogonal' 
    ? [getOrthogonalPath(), (sourceX + targetX) / 2, (sourceY + targetY) / 2]
    : getStraightPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });

  const edgeStyle = {
    stroke: style?.strokeColor || '#64748b',
    strokeWidth: style?.strokeWidth || 2,
    strokeDasharray: style?.dashed ? '5,5' : 'none',
    ...style,
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={edgeStyle}
        className={selected ? 'selected' : ''}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: 'all',
              backgroundColor: style?.labelBgColor || '#ffffff',
              padding: '2px 6px',
              borderRadius: '3px',
              border: '1px solid #e2e8f0',
              color: '#374151',
              fontFamily: 'Inter, Roboto, sans-serif',
              ...labelStyle,
            }}
            className="nodrag nopan"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};