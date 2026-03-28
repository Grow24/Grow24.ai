import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Minus, Edit2 } from 'lucide-react';

interface Swimlane {
  id: string;
  title: string;
  height: number;
}

interface SwimlaneCanvasProps {
  swimlanes: Swimlane[];
  onUpdateSwimlanes: (swimlanes: Swimlane[]) => void;
  enabled: boolean;
  onToggle: () => void;
}

export const SwimlaneCanvas: React.FC<SwimlaneCanvasProps> = ({
  swimlanes,
  onUpdateSwimlanes,
  enabled,
  onToggle
}) => {
  const [editingLane, setEditingLane] = useState<string | null>(null);

  const addLane = () => {
    const newLane: Swimlane = {
      id: `lane-${Date.now()}`,
      title: `Lane ${swimlanes.length + 1}`,
      height: 200
    };
    onUpdateSwimlanes([...swimlanes, newLane]);
  };

  const removeLane = (laneId: string) => {
    onUpdateSwimlanes(swimlanes.filter(lane => lane.id !== laneId));
  };

  const updateLaneTitle = (laneId: string, title: string) => {
    onUpdateSwimlanes(
      swimlanes.map(lane => 
        lane.id === laneId ? { ...lane, title } : lane
      )
    );
    setEditingLane(null);
  };

  if (!enabled) return null;

  let yOffset = 0;

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {swimlanes.map((lane, index) => {
        const currentY = yOffset;
        yOffset += lane.height;
        
        return (
          <div
            key={lane.id}
            className="absolute left-0 right-0 border-b border-gray-300"
            style={{
              top: currentY,
              height: lane.height,
              backgroundColor: index % 2 === 0 ? '#f8fafc' : '#ffffff'
            }}
          >
            {/* Lane header */}
            <div className="absolute left-0 top-0 w-32 h-full bg-gray-100 border-r border-gray-300 flex items-center justify-center pointer-events-auto">
              {editingLane === lane.id ? (
                <Input
                  value={lane.title}
                  onChange={(e) => updateLaneTitle(lane.id, e.target.value)}
                  onBlur={() => setEditingLane(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setEditingLane(null);
                    }
                  }}
                  className="w-28 h-8 text-xs"
                  autoFocus
                />
              ) : (
                <div 
                  className="text-xs font-medium text-gray-700 cursor-pointer hover:text-gray-900 flex items-center gap-1"
                  onClick={() => setEditingLane(lane.id)}
                >
                  <span className="truncate">{lane.title}</span>
                  <Edit2 className="w-3 h-3 opacity-50" />
                </div>
              )}
            </div>
          </div>
        );
      })}
      
      {/* Controls */}
      <div className="absolute top-4 left-36 flex gap-2 pointer-events-auto">
        <Button
          size="sm"
          variant="outline"
          onClick={addLane}
          className="h-8 px-2"
        >
          <Plus className="w-4 h-4" />
        </Button>
        {swimlanes.length > 1 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => removeLane(swimlanes[swimlanes.length - 1].id)}
            className="h-8 px-2"
          >
            <Minus className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};