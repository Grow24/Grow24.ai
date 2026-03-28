import React, { useState } from 'react';
import {
  EdgeProps,
  getBezierPath,
  getStraightPath,
  getSmoothStepPath,
  EdgeLabelRenderer,
  BaseEdge,
} from '@xyflow/react';

interface StyledEdgeProps extends EdgeProps {
  data?: {
    onLabelEdit?: (edgeId: string, position: { x: number; y: number }) => void;
    onLabelChange?: (edgeId: string, label: string) => void;
    isDropTarget?: boolean;
  };
}

export function StyledEdge({
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
  data,
}: StyledEdgeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label || '');

  // Extract custom style properties
  const edgeStyle = style as any;
  const pathType = edgeStyle.style || 'bezier';
  const strokeColor = edgeStyle.strokeColor || '#64748b';
  const strokeWidth = edgeStyle.strokeWidth || 2;
  const dashed = edgeStyle.dashed || false;
  const arrowHead = edgeStyle.arrowHead || 'triangle';
  const labelBgColor = edgeStyle.labelBgColor || '#ffffff';

  // Get the appropriate path based on style
  let edgePath: string;
  let labelX: number;
  let labelY: number;

  const pathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };

  switch (pathType) {
    case 'straight':
      [edgePath, labelX, labelY] = getStraightPath(pathParams);
      break;
    case 'step':
    case 'orthogonal':
      [edgePath, labelX, labelY] = getSmoothStepPath(pathParams);
      break;
    case 'bezier':
    default:
      [edgePath, labelX, labelY] = getBezierPath(pathParams);
      break;
  }

  // Create marker end based on arrow head style
  let customMarkerEnd = markerEnd;
  if (arrowHead === 'none') {
    customMarkerEnd = undefined;
  } else if (arrowHead === 'diamond') {
    customMarkerEnd = 'url(#diamond-marker)';
  }

  const isDropTarget = data?.isDropTarget || false;
  
  const strokeStyle = {
    strokeWidth: isDropTarget ? strokeWidth + 2 : strokeWidth,
    stroke: isDropTarget ? '#3b82f6' : strokeColor,
    strokeDasharray: dashed ? '5,5' : 'none',
  };

  const handleLabelClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (data?.onLabelEdit) {
      data.onLabelEdit(id, { x: event.clientX, y: event.clientY });
    }
  };

  const handleLabelDoubleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsEditing(true);
    setEditValue(label || '');
  };

  const handleSave = () => {
    if (data?.onLabelChange) {
      data.onLabelChange(id, editValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      setEditValue(label || '');
    }
  };

  return (
    <>
      {/* Custom markers */}
      <defs>
        <marker
          id="diamond-marker"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,3 L3,0 L6,3 L3,6 Z" fill={strokeColor} />
        </marker>
      </defs>

      <BaseEdge
        path={edgePath}
        markerEnd={customMarkerEnd}
        style={strokeStyle}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="px-2 py-1 text-xs border border-blue-500 rounded bg-white focus:outline-none"
              style={{ backgroundColor: labelBgColor }}
              autoFocus
            />
          ) : label ? (
            <div
              onClick={handleLabelClick}
              onDoubleClick={handleLabelDoubleClick}
              className="border border-slate-300 rounded px-2 py-1 text-xs font-medium text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
              style={{ backgroundColor: labelBgColor }}
            >
              {label}
            </div>
          ) : (
            <div
              onClick={handleLabelClick}
              onDoubleClick={handleLabelDoubleClick}
              className="bg-slate-100 border border-slate-300 rounded px-2 py-1 text-xs text-slate-500 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            >
              Add label...
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}