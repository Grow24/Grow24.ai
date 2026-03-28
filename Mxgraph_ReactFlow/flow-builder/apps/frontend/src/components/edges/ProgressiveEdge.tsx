import React from 'react';
import { EdgeProps, getStraightPath } from '@xyflow/react';

interface ProgressiveEdgeProps extends EdgeProps {
  isProgressive?: boolean;
  isActive?: boolean;
}

export const ProgressiveEdge: React.FC<ProgressiveEdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  isProgressive = false,
  isActive = false,
  ...props
}) => {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const strokeColor = isActive 
    ? '#00E0FF' 
    : isProgressive 
    ? '#007BFF' 
    : '#B0B7C3';
    
  const strokeWidth = isActive ? 4 : isProgressive ? 3 : 2;

  return (
    <>
      <path
        id={id}
        style={{
          stroke: strokeColor,
          strokeWidth,
          fill: 'none',
          transition: 'all 0.3s ease'
        }}
        className="react-flow__edge-path"
        d={edgePath}
      />
      {isActive && (
        <path
          style={{
            stroke: strokeColor,
            strokeWidth: strokeWidth + 2,
            fill: 'none',
            opacity: 0.3,
            filter: `drop-shadow(0 0 8px ${strokeColor})`
          }}
          d={edgePath}
        />
      )}
    </>
  );
};