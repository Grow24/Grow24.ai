import React from 'react';
import { CollabCursor } from '../../hooks/useCollaboration';

interface LiveCursorsProps {
  cursors: CollabCursor[];
}

export const LiveCursors: React.FC<LiveCursorsProps> = ({ cursors }) => {
  return (
    <>
      {cursors.map((cursor) => (
        <div
          key={cursor.user.id}
          className="fixed pointer-events-none z-50 transition-all duration-100"
          style={{
            left: cursor.x,
            top: cursor.y,
            transform: 'translate(-2px, -2px)',
          }}
        >
          {/* Cursor pointer */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            className="drop-shadow-sm"
          >
            <path
              d="M2 2L18 8L8 12L2 18L2 2Z"
              fill={cursor.user.color}
              stroke="white"
              strokeWidth="1"
            />
          </svg>
          
          {/* User name badge */}
          <div
            className="absolute top-5 left-2 px-2 py-1 rounded text-xs font-medium text-white shadow-sm whitespace-nowrap"
            style={{ backgroundColor: cursor.user.color }}
          >
            {cursor.user.name}
          </div>
        </div>
      ))}
    </>
  );
};