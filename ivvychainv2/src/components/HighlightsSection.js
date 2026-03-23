import React, { useState } from 'react';
import Badge from './shared/Badge';
import Select from './shared/Select';
import ButtonGroup from './shared/ButtonGroup';
import Card from './shared/Card';

const HighlightsSection = ({ highlights = [], filters = {}, onFilterChange = () => {} }) => {
  const [viewMode, setViewMode] = useState('text');

  const filterOptions = ['All', 'Option 1', 'Option 2'];

  // Default filters object
  const defaultFilters = {
    object1Type: filters.object1Type || '',
    object1Name: filters.object1Name || '',
    object2Type: filters.object2Type || '',
    object2Name: filters.object2Name || ''
  };

  return (
    <Card title="Highlights" className="mb-6">
      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <ButtonGroup
          options={['Text View', 'Table View']}
          selected={viewMode === 'text' ? 'Text View' : 'Table View'}
          onSelect={(value) => setViewMode(value === 'Text View' ? 'text' : 'table')}
          className="mb-4"
        />
      </div>

      {/* Additional Filters */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Select
          label="Object1 Type"
          value={defaultFilters.object1Type}
          onChange={(value) => onFilterChange('object1Type', value)}
          options={filterOptions}
        />
        <Select
          label="Object1 Name"
          value={defaultFilters.object1Name}
          onChange={(value) => onFilterChange('object1Name', value)}
          options={filterOptions}
        />
        <Select
          label="Object2 Type"
          value={defaultFilters.object2Type}
          onChange={(value) => onFilterChange('object2Type', value)}
          options={filterOptions}
        />
        <Select
          label="Object2 Name"
          value={defaultFilters.object2Name}
          onChange={(value) => onFilterChange('object2Name', value)}
          options={filterOptions}
        />
      </div>

      {/* Highlights List */}
      {viewMode === 'text' && (
        <div className="space-y-4">
          {highlights && highlights.length > 0 ? highlights.map((highlight, index) => (
            <div key={index} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-gray-500 text-center">Product Image</span>
              </div>
              <div className="flex-1">
                <h4 className="text-blue-600 font-semibold mb-2 cursor-pointer hover:underline">
                  {highlight.title}
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">{highlight.description}</p>
              </div>
              <div className="flex items-start">
                <Badge variant={highlight.badgeType || 'inquiry'}>
                  {highlight.badge}
                </Badge>
              </div>
            </div>
          )) : (
            <div className="text-center text-gray-500 py-8">No highlights available</div>
          )}
        </div>
      )}

      {viewMode === 'table' && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Image</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
              </tr>
            </thead>
            <tbody>
              {highlights && highlights.length > 0 ? highlights.map((highlight, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="w-16 h-16 bg-gray-200 rounded"></div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-blue-600 font-semibold">
                    {highlight.title}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{highlight.description}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Badge variant={highlight.badgeType || 'inquiry'}>{highlight.badge}</Badge>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                    No highlights available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default HighlightsSection;

