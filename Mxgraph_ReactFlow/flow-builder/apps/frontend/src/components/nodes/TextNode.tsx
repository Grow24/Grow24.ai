import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Type } from 'lucide-react';

export const TextNode: React.FC<NodeProps> = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.text || 'Double-click to edit text');
  const textRef = useRef<HTMLDivElement>(null);

  const style = data.style || {
    fillColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    textColor: '#1e293b',
    fontSize: 14,
    borderRadius: 4
  };

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
      const range = document.createRange();
      range.selectNodeContents(textRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
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
    <div
      className={`min-w-32 min-h-8 p-3 rounded border-2 bg-white shadow-sm ${
        selected ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{
        backgroundColor: style.fillColor,
        borderColor: style.borderColor,
        borderWidth: style.borderWidth,
        borderRadius: style.borderRadius,
        color: style.textColor,
        fontSize: style.fontSize,
        minWidth: data.width || 120,
        minHeight: data.height || 40,
      }}
      onDoubleClick={handleDoubleClick}
    >
      {!isEditing ? (
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 opacity-50" />
          <div 
            dangerouslySetInnerHTML={{ __html: text }}
            className="whitespace-pre-wrap break-words"
          />
        </div>
      ) : (
        <div
          ref={textRef}
          contentEditable
          suppressContentEditableWarning
          className="outline-none whitespace-pre-wrap break-words"
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onInput={(e) => setText(e.currentTarget.innerHTML)}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}
    </div>
  );
};