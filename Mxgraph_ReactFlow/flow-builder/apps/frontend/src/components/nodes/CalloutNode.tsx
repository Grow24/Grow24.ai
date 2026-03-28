import React, { useState, useRef, useEffect } from 'react';
import { NodeProps } from '@xyflow/react';
import { MessageSquare } from 'lucide-react';

export const CalloutNode: React.FC<NodeProps> = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.text || 'Add note...');
  const textRef = useRef<HTMLDivElement>(null);

  const style = data.style || {
    fillColor: '#fef3c7',
    borderColor: '#f59e0b',
    borderWidth: 2,
    textColor: '#92400e',
    fontSize: 12,
    borderRadius: 8
  };

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (data.onChange) {
      data.onChange({ text });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div className="relative">
      {/* Leader arrow */}
      <div 
        className="absolute -bottom-3 left-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent"
        style={{ borderTopColor: style.fillColor }}
      />
      <div 
        className="absolute -bottom-4 left-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent"
        style={{ borderTopColor: style.borderColor }}
      />
      
      {/* Callout body */}
      <div
        className={`min-w-32 max-w-48 p-3 rounded-lg border-2 shadow-lg transform -rotate-1 ${
          selected ? 'ring-2 ring-blue-500' : ''
        }`}
        style={{
          backgroundColor: style.fillColor,
          borderColor: style.borderColor,
          borderWidth: style.borderWidth,
          borderRadius: style.borderRadius,
          color: style.textColor,
          fontSize: style.fontSize,
        }}
        onDoubleClick={handleDoubleClick}
      >
        {!isEditing ? (
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 opacity-50 mt-0.5 flex-shrink-0" />
            <div className="whitespace-pre-wrap break-words text-sm">
              {text}
            </div>
          </div>
        ) : (
          <div
            ref={textRef}
            contentEditable
            suppressContentEditableWarning
            className="outline-none whitespace-pre-wrap break-words text-sm"
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onInput={(e) => setText(e.currentTarget.textContent || '')}
          >
            {text}
          </div>
        )}
      </div>
    </div>
  );
};