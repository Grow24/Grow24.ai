import React, { useState, useRef, useEffect } from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';
import { StickyNote } from 'lucide-react';

const COLORS = [
  { name: 'Yellow', value: '#FFF7D6', border: '#F2D98B' },
  { name: 'Blue', value: '#E6F3FF', border: '#B3D9FF' },
  { name: 'Green', value: '#E8F5E8', border: '#B8E6B8' },
  { name: 'Pink', value: '#FFE6F0', border: '#FFB3D9' },
  { name: 'Purple', value: '#F0E6FF', border: '#D9B3FF' }
];

export const StickyNoteNode: React.FC<NodeProps> = ({ 
  data, 
  selected, 
  id 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.content || 'Double-click to edit...');
  const [color, setColor] = useState(data.color || COLORS[0].value);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const currentColor = COLORS.find(c => c.value === color) || COLORS[0];

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
      textRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (data.onChange) {
      data.onChange({ content, color });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (data.onChange) {
      data.onChange({ content, color: newColor });
    }
  };

  return (
    <div className="relative">
      <NodeResizer
        isVisible={selected}
        minWidth={120}
        minHeight={80}
        maxWidth={400}
        maxHeight={300}
      />
      
      <div
        className={`w-full h-full p-3 rounded-lg border-2 shadow-lg transform rotate-1 ${
          selected ? 'ring-2 ring-blue-500' : ''
        }`}
        style={{
          backgroundColor: color,
          borderColor: currentColor.border,
          minWidth: '120px',
          minHeight: '80px'
        }}
        onDoubleClick={handleDoubleClick}
      >
        {/* Header with icon and color picker */}
        <div className="flex items-center justify-between mb-2">
          <StickyNote className="w-4 h-4 opacity-50" />
          <div className="flex gap-1">
            {COLORS.map((c) => (
              <button
                key={c.value}
                className={`w-3 h-3 rounded-full border ${
                  color === c.value ? 'ring-1 ring-gray-400' : ''
                }`}
                style={{ backgroundColor: c.value, borderColor: c.border }}
                onClick={() => handleColorChange(c.value)}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        {!isEditing ? (
          <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {content}
          </div>
        ) : (
          <textarea
            ref={textRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full h-full resize-none outline-none bg-transparent text-sm leading-relaxed"
            style={{ minHeight: '40px' }}
            placeholder="Enter your note..."
          />
        )}
      </div>
    </div>
  );
};