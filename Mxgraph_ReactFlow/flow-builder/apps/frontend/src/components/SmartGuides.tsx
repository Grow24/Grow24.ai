import React from 'react';

interface SmartGuidesProps {
  guides: { x: number[]; y: number[] };
  viewport: { x: number; y: number; zoom: number };
}

export const SmartGuides: React.FC<SmartGuidesProps> = ({ guides, viewport }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      {/* Vertical guides */}
      {guides.x.map((x, index) => (
        <div
          key={`v-${index}`}
          className="absolute bg-blue-500 opacity-60"
          style={{
            left: x * viewport.zoom + viewport.x,
            top: 0,
            width: 1,
            height: '100%',
          }}
        />
      ))}
      
      {/* Horizontal guides */}
      {guides.y.map((y, index) => (
        <div
          key={`h-${index}`}
          className="absolute bg-blue-500 opacity-60"
          style={{
            left: 0,
            top: y * viewport.zoom + viewport.y,
            width: '100%',
            height: 1,
          }}
        />
      ))}
    </div>
  );
};