import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TableChild } from '../../hooks/useTableContainer';

interface DroppableCellProps {
  row: number;
  col: number;
  width: number;
  height: number;
  x: number;
  y: number;
  children: TableChild[];
  isContainer: boolean;
  onDrop: (row: number, col: number, item: any) => void;
  onChildUpdate: (childId: string, updates: Partial<TableChild>) => void;
  onRightClick?: (e: React.MouseEvent, row: number, col: number) => void;
}

export function DroppableCell({ 
  row, 
  col, 
  width, 
  height, 
  x, 
  y, 
  children, 
  isContainer,
  onDrop,
  onChildUpdate,
  onRightClick 
}: DroppableCellProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `cell-${row}-${col}`,
    data: { row, col }
  });
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    onRightClick?.(e, row, col);
  };

  const renderChild = (child: TableChild) => {
    const childX = x + (child.position?.x || width / 2);
    const childY = y + (child.position?.y || height / 2);

    switch (child.type) {
      case 'shape':
        return (
          <g key={child.id}>
            {child.nodeType === 'rectangle' && (
              <rect
                x={childX - 15}
                y={childY - 10}
                width={30}
                height={20}
                fill="#3b82f6"
                stroke="#1e40af"
                strokeWidth="1"
                rx="2"
              />
            )}
            {child.nodeType === 'circle' && (
              <circle
                cx={childX}
                cy={childY}
                r={12}
                fill="#10b981"
                stroke="#059669"
                strokeWidth="1"
              />
            )}
            {child.nodeType === 'diamond' && (
              <polygon
                points={`${childX},${childY-12} ${childX+12},${childY} ${childX},${childY+12} ${childX-12},${childY}`}
                fill="#f59e0b"
                stroke="#d97706"
                strokeWidth="1"
              />
            )}
          </g>
        );
      case 'text':
        return (
          <text
            key={child.id}
            x={childX}
            y={childY}
            fontSize="10"
            fill="#1e293b"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {child.data?.text || 'Text'}
          </text>
        );
      default:
        return null;
    }
  };

  return (
    <g 
      ref={setNodeRef}
      onContextMenu={handleContextMenu}
    >
      {/* Cell background with drop indication */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={isOver ? '#dbeafe' : (isContainer ? '#fafbff' : 'white')}
        stroke={isOver ? '#3b82f6' : '#e2e8f0'}
        strokeWidth={isOver ? "2" : "1"}
        strokeDasharray={isContainer && children.length === 0 ? '4 4' : 'none'}
        className="cursor-pointer"
        style={{ pointerEvents: 'all' }}
        onContextMenu={handleContextMenu}
      />
      
      {/* Render child elements */}
      {children.map(renderChild)}
      
      {/* Drop zone indicator */}
      {isContainer && children.length === 0 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          fontSize="9"
          fill="#6b7280"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          Drop shapes here
        </text>
      )}
    </g>
  );
}