import React from 'react';
import { MessageCircle } from 'lucide-react';

interface CommentPinProps {
  count: number;
  resolved?: boolean;
  onClick: () => void;
  position: { x: number; y: number };
}

export const CommentPin: React.FC<CommentPinProps> = ({
  count,
  resolved = false,
  onClick,
  position
}) => {
  return (
    <div
      className={`absolute z-50 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
        resolved ? 'opacity-40' : ''
      }`}
      style={{ left: position.x, top: position.y }}
      onClick={onClick}
    >
      <div className={`
        relative flex items-center justify-center w-6 h-6 rounded-full border-2 text-xs font-medium
        ${resolved 
          ? 'bg-gray-100 border-gray-300 text-gray-500' 
          : 'bg-blue-500 border-blue-600 text-white hover:bg-blue-600'
        }
        transition-colors duration-200
      `}>
        {count > 0 ? count : <MessageCircle className="w-3 h-3" />}
        
        {/* Pulse animation for unresolved comments */}
        {!resolved && (
          <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
        )}
      </div>
    </div>
  );
};