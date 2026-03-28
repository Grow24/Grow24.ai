import React from 'react';
import { Copy, Trash2, Settings, Edit } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function ContextMenu({ x, y, onEdit, onDuplicate, onDelete, onClose }: ContextMenuProps) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Menu */}
      <div 
        className="fixed z-50 bg-white border border-slate-200 rounded-lg shadow-lg py-2 min-w-[160px]"
        style={{ left: x, top: y }}
      >
        <button
          onClick={onEdit}
          className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3"
        >
          <Settings className="w-4 h-4 text-slate-500" />
          Configure
        </button>
        
        <button
          onClick={onDuplicate}
          className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3"
        >
          <Copy className="w-4 h-4 text-slate-500" />
          Duplicate
        </button>
        
        <div className="border-t border-slate-200 my-1" />
        
        <button
          onClick={onDelete}
          className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-3"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </>
  );
}