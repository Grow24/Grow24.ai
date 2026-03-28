import React, { useState, useEffect, useRef } from 'react';
import { Edge } from '@xyflow/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Check, Edit3 } from 'lucide-react';

interface EdgeLabelEditorProps {
  edge: Edge | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (edgeId: string, label: string) => void;
  position?: { x: number; y: number };
}

export function EdgeLabelEditor({ edge, isOpen, onClose, onSave, position }: EdgeLabelEditorProps) {
  const [label, setLabel] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (edge && isOpen) {
      setLabel(edge.label || '');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [edge, isOpen]);

  if (!edge || !isOpen || !position) {
    return null;
  }

  const handleSave = () => {
    onSave(edge.id, label);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Editor Popup */}
      <div 
        className="fixed z-50 bg-white border border-slate-300 rounded-lg shadow-xl p-4 min-w-[280px]"
        style={{
          left: Math.min(position.x, window.innerWidth - 300),
          top: Math.min(position.y, window.innerHeight - 120),
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Edit3 className="w-4 h-4 text-slate-500" />
          <h3 className="font-medium text-slate-900">Edit Edge Label</h3>
        </div>
        
        <div className="space-y-3">
          <Input
            ref={inputRef}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter label (e.g., Yes, No, Approved)"
            className="h-9 text-sm"
          />
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Press Enter to save, Esc to cancel
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 px-3"
              >
                <X className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="h-8 px-3 bg-blue-600 hover:bg-blue-700"
              >
                <Check className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Custom Edge Label Component for ReactFlow
export function CustomEdgeLabel({ 
  label, 
  labelX, 
  labelY, 
  onEdit 
}: { 
  label?: string; 
  labelX: number; 
  labelY: number; 
  onEdit: () => void;
}) {
  if (!label) {
    return (
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
        style={{ left: labelX, top: labelY }}
        onClick={onEdit}
      >
        <div className="bg-slate-100 border border-slate-300 rounded px-2 py-1 text-xs text-slate-500 opacity-60 group-hover:opacity-100 transition-opacity">
          Add label...
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
      style={{ left: labelX, top: labelY }}
      onClick={onEdit}
    >
      <div className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-medium text-slate-700 shadow-sm group-hover:bg-slate-50 transition-colors">
        {label}
      </div>
    </div>
  );
}