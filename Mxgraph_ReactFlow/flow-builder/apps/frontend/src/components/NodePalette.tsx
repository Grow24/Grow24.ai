import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
  onNodeClick: (nodeType: string) => void;
}

const nodeTypeConfig = {
  start: { label: 'Start', color: 'bg-green-100 border-green-300', icon: '▶️' },
  screen: { label: 'Screen', color: 'bg-blue-100 border-blue-300', icon: '📱' },
  decision: { label: 'Decision', color: 'bg-yellow-100 border-yellow-300', icon: '❓' },
  action: { label: 'Action', color: 'bg-purple-100 border-purple-300', icon: '⚡' },
  subflow: { label: 'Subflow', color: 'bg-indigo-100 border-indigo-300', icon: '🔄' },
  end: { label: 'End', color: 'bg-red-100 border-red-300', icon: '🏁' },
};

export function NodePalette({ onDragStart, onNodeClick }: NodePaletteProps) {
  return (
    <Card className="w-64 h-fit">
      <CardHeader>
        <CardTitle className="text-sm">Node Palette</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {Object.entries(nodeTypeConfig).map(([type, config]) => (
          <div
            key={type}
            className={`p-3 rounded border-2 cursor-pointer ${config.color} hover:shadow-md transition-shadow`}
            onClick={() => onNodeClick(type)}
            draggable
            onDragStart={(event) => onDragStart(event, type)}
          >
            <div className="flex items-center gap-2">
              <span>{config.icon}</span>
              <span className="text-sm font-medium">{config.label}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}