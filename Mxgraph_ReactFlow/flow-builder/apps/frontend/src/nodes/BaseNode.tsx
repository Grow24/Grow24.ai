/**
 * Base Node Component - Common styling and structure for all node types
 */
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

interface BaseNodeProps {
  data: {
    label: string;
  };
  selected?: boolean;
  children?: React.ReactNode;
  variant?: 'start' | 'screen' | 'decision' | 'action' | 'subflow' | 'end';
  sourceHandles?: Position[];
  targetHandles?: Position[];
}

const variantStyles = {
  start: 'ring-2 ring-green-500 bg-green-50 border-green-200',
  screen: 'ring-2 ring-blue-500 bg-blue-50 border-blue-200',
  decision: 'ring-2 ring-yellow-500 bg-yellow-50 border-yellow-200',
  action: 'ring-2 ring-purple-500 bg-purple-50 border-purple-200',
  subflow: 'ring-2 ring-indigo-500 bg-indigo-50 border-indigo-200',
  end: 'ring-2 ring-red-500 bg-red-50 border-red-200',
};

export function BaseNode({ 
  data, 
  selected, 
  children, 
  variant = 'start',
  sourceHandles = [Position.Bottom],
  targetHandles = [Position.Top]
}: BaseNodeProps) {
  const variantClass = variantStyles[variant];
  const selectedClass = selected ? 'ring-4 ring-blue-400' : '';

  return (
    <Card className={`min-w-[150px] max-w-[200px] ${variantClass} ${selectedClass} transition-all`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs uppercase tracking-wider opacity-70">
          {variant}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="font-medium">{data.label}</div>
        {children}
      </CardContent>
      
      {/* Target Handles */}
      {targetHandles.map((position, index) => (
        <Handle
          key={`target-${position}-${index}`}
          type="target"
          position={position}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
      ))}
      
      {/* Source Handles */}
      {sourceHandles.map((position, index) => (
        <Handle
          key={`source-${position}-${index}`}
          type="source"
          position={position}
          className="w-3 h-3 bg-gray-600 border-2 border-white"
        />
      ))}
    </Card>
  );
}