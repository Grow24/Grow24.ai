import React from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';
import { Settings, Mail, Database, Globe, Zap, Plus } from 'lucide-react';

interface Action {
  type: 'email' | 'api' | 'db' | 'webhook' | 'custom';
  config: Record<string, any>;
}

const ActionIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'email': return <Mail className="w-3 h-3" />;
    case 'api': return <Globe className="w-3 h-3" />;
    case 'db': return <Database className="w-3 h-3" />;
    case 'webhook': return <Zap className="w-3 h-3" />;
    default: return <Settings className="w-3 h-3" />;
  }
};

export const ActivityNode: React.FC<NodeProps> = ({ data, selected }) => {
  const actions = data.actions || [];
  const style = data.style || {
    fillColor: '#ffffff',
    borderColor: '#a855f7',
    borderWidth: 2,
    textColor: '#1e293b',
    fontSize: 14,
    borderRadius: 16
  };

  return (
    <div className="relative">
      {/* Handles */}
      <Handle type="target" position={Position.Top} id="top" className="w-3 h-3 bg-blue-500 border-2 border-white hover:bg-blue-600" />
      <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-blue-500 border-2 border-white hover:bg-blue-600" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3 bg-blue-500 border-2 border-white hover:bg-blue-600" />
      <Handle type="target" position={Position.Left} id="left" className="w-3 h-3 bg-blue-500 border-2 border-white hover:bg-blue-600" />
      
      <div
        className={`min-w-32 px-4 py-3 shadow-lg ${selected ? 'ring-2 ring-blue-500' : ''}`}
        style={{
          backgroundColor: style.fillColor,
          borderColor: style.borderColor,
          borderWidth: style.borderWidth,
          borderStyle: 'solid',
          borderRadius: style.borderRadius,
          color: style.textColor,
          fontSize: style.fontSize,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-4 h-4 text-purple-600" />
          <span className="font-medium text-sm">{data.label}</span>
          {actions.length > 1 && (
            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">
              {actions.length} Actions
            </span>
          )}
        </div>
        
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {actions.map((action: Action, index: number) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                title={`${action.type} action`}
              >
                <ActionIcon type={action.type} />
                <span className="capitalize">{action.type}</span>
              </div>
            ))}
          </div>
        )}
        
        {data.description && (
          <div className="text-xs text-gray-600 mt-1">{data.description}</div>
        )}
      </div>
    </div>
  );
};