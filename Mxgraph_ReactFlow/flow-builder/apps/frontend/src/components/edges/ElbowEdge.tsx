import React from 'react';
import { EdgeProps, BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';

export const ElbowEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
}) => {
  // Calculate elbow path (L-shaped)
  const midX = sourceX + (targetX - sourceX) / 2;
  const midY = sourceY + (targetY - sourceY) / 2;
  
  let path: string;
  if (Math.abs(targetX - sourceX) > Math.abs(targetY - sourceY)) {
    // Horizontal priority
    path = `M ${sourceX},${sourceY} L ${midX},${sourceY} L ${midX},${targetY} L ${targetX},${targetY}`;
  } else {
    // Vertical priority
    path = `M ${sourceX},${sourceY} L ${sourceX},${midY} L ${targetX},${midY} L ${targetX},${targetY}`;
  }

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={style}
        markerEnd={markerEnd}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${midX}px,${midY}px)`,
              fontSize: 12,
              pointerEvents: 'all',
            }}
            className="nodrag nopan bg-white px-2 py-1 shadow rounded border text-xs"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};