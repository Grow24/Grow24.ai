import React, { useState, useEffect } from 'react';
import {
  EdgeProps,
  getBezierPath,
  getStraightPath,
  getSmoothStepPath,
  EdgeLabelRenderer,
  BaseEdge,
} from '@xyflow/react';
import { Paperclip } from 'lucide-react';
import { attachmentApi } from '../api/media';

interface CustomEdgeProps extends EdgeProps {
  data?: {
    onLabelEdit?: (edgeId: string, position: { x: number; y: number }) => void;
  };
  style?: {
    strokeColor?: string;
    strokeWidth?: number;
    style?: string;
    arrowHead?: string;
    dashed?: boolean;
    labelBgColor?: string;
  };
}

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style: reactFlowStyle = {},
  markerEnd,
  label,
  data,
  style: customStyle,
}: CustomEdgeProps) {
  const edgeStyle = customStyle || {};
  const [attachmentCount, setAttachmentCount] = useState(0);

  useEffect(() => {
    const loadAttachments = async () => {
      try {
        const attachments = await attachmentApi.getByScope('edge', id);
        setAttachmentCount(attachments.length);
      } catch (error) {
        console.error('Failed to load edge attachments:', error);
      }
    };
    loadAttachments();
  }, [id]);
  
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
  
  switch (edgeStyle.style) {
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

  const handleLabelClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (data?.onLabelEdit) {
      data.onLabelEdit(id, { x: event.clientX, y: event.clientY });
    }
  };
  
  // Create marker end based on arrow head style
  let customMarkerEnd = markerEnd;
  if (edgeStyle.arrowHead === 'none') {
    customMarkerEnd = undefined;
  } else if (edgeStyle.arrowHead === 'diamond') {
    customMarkerEnd = 'url(#diamond-marker)';
  }

  const strokeStyle = {
    ...reactFlowStyle,
    strokeWidth: edgeStyle.strokeWidth || 2,
    stroke: edgeStyle.strokeColor || '#64748b',
    strokeDasharray: edgeStyle.dashed ? '5,5' : 'none',
  };

  return (
    <>
      {/* Custom diamond marker definition */}
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
          <path d="M0,3 L3,0 L6,3 L3,6 Z" fill={edgeStyle.strokeColor || '#64748b'} />
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
          className="nodrag nopan flex items-center gap-2"
        >
          {label ? (
            <div
              onClick={handleLabelClick}
              className="border border-slate-300 rounded px-2 py-1 text-xs font-medium text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
              style={{ backgroundColor: edgeStyle.labelBgColor || '#ffffff' }}
            >
              {label}
            </div>
          ) : (
            <div
              onClick={handleLabelClick}
              className="bg-slate-100 border border-slate-300 rounded px-2 py-1 text-xs text-slate-500 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            >
              Add label...
            </div>
          )}
          
          {attachmentCount > 0 && (
            <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm">
              <Paperclip className="w-3 h-3" />
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}