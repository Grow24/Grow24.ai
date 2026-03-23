import React from 'react';
import ButtonGroup from './shared/ButtonGroup';
import Card from './shared/Card';

const TreemapSection = ({ title, data, viewMode, onViewModeChange }) => {
  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <ButtonGroup
          options={data.viewOptions || ['IG', 'PG']}
          selected={viewMode}
          onSelect={onViewModeChange}
        />
      </div>
      <div className="bg-green-800 rounded-lg p-8 min-h-[200px] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-2xl font-bold mb-2">{data.mainLabel || 'GEM PHOS'}</div>
          {data.subLabels && (
            <div className="space-y-1">
              {data.subLabels.map((label, index) => (
                <div key={index} className="text-sm">{label}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TreemapSection;

