import React from 'react';

const KPITiles = ({ tiles = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {tiles.map((tile, index) => (
        <div
          key={index}
          className="bg-blue-50 rounded-lg p-6 border border-blue-200"
        >
          <div className="text-2xl font-bold text-gray-900 mb-1">{tile.value}</div>
          <div className="text-sm text-gray-600">{tile.label}</div>
        </div>
      ))}
    </div>
  );
};

export default KPITiles;

