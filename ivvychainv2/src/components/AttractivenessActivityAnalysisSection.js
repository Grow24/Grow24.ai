import React, { useState } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend } from 'recharts';
import Card from './shared/Card';

const AttractivenessActivityAnalysisSection = ({ data }) => {
  const [industryGrouping, setIndustryGrouping] = useState('Item'); // 'Item' | 'Product' | 'Territory'
  const [timeSlice, setTimeSlice] = useState('Yearly'); // 'Monthly' | 'Quarterly' | 'Yearly'
  const [columnFilters, setColumnFilters] = useState({
    groupingKey: '',
    attractiveness: '',
    activity: '',
    revenue: '',
    volume: '',
    segment: '',
  });

  // Filter data based on grouping and time slice
  const filteredData = data.tableData.filter(row => {
    return (
      row.grouping === industryGrouping &&
      row.timeSlice === timeSlice &&
      (!columnFilters.groupingKey || row.groupingKey.toLowerCase().includes(columnFilters.groupingKey.toLowerCase())) &&
      (!columnFilters.attractiveness || row.attractiveness.toString().includes(columnFilters.attractiveness)) &&
      (!columnFilters.activity || row.activity.toString().includes(columnFilters.activity)) &&
      (!columnFilters.revenue || row.revenue.toString().includes(columnFilters.revenue)) &&
      (!columnFilters.volume || row.volume.toString().includes(columnFilters.volume)) &&
      (!columnFilters.segment || row.segment.toLowerCase().includes(columnFilters.segment.toLowerCase()))
    );
  });

  // Prepare scatter chart data
  const scatterData = filteredData.map(row => ({
    x: row.activity,
    y: row.attractiveness,
    name: row.groupingKey,
    revenue: row.revenue,
    volume: row.volume,
    segment: row.segment,
  }));

  const getSegmentColor = (segment) => {
    const colors = {
      'Stars': '#10B981',      // Green - High Attractiveness, High Activity
      'Sleepers': '#3B82F6',    // Blue - High Attractiveness, Low Activity
      'Workhorses': '#F59E0B',  // Amber - Low Attractiveness, High Activity
      'Dogs': '#EF4444',        // Red - Low Attractiveness, Low Activity
    };
    return colors[segment] || '#6B7280';
  };

  const handleCopy = () => {
    const csv = [
      ['Grouping Key', 'Attractiveness', 'Activity', 'Revenue', 'Volume', 'Segment'],
      ...filteredData.map(row => [
        row.groupingKey,
        row.attractiveness,
        row.activity,
        row.revenue,
        row.volume,
        row.segment,
      ])
    ].map(row => row.join(',')).join('\n');
    navigator.clipboard.writeText(csv);
  };

  const handleDownload = () => {
    const csv = [
      ['Grouping Key', 'Attractiveness', 'Activity', 'Revenue', 'Volume', 'Segment'],
      ...filteredData.map(row => [
        row.groupingKey,
        row.attractiveness,
        row.activity,
        row.revenue,
        row.volume,
        row.segment,
      ])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attractiveness-activity-analysis.csv';
    a.click();
  };

  return (
    <Card title="Attractiveness / Activity Analysis" className="mb-6">
      {/* Controls */}
      <div className="mb-6 flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-700">Industry Grouping</label>
          <select
            className="px-3 py-2 border border-gray-300 rounded text-sm"
            value={industryGrouping}
            onChange={(e) => setIndustryGrouping(e.target.value)}
          >
            <option>Item</option>
            <option>Product</option>
            <option>Territory</option>
          </select>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm font-semibold text-gray-700">Time Slice</label>
          <select
            className="px-3 py-2 border border-gray-300 rounded text-sm"
            value={timeSlice}
            onChange={(e) => setTimeSlice(e.target.value)}
          >
            <option>Monthly</option>
            <option>Quarterly</option>
            <option>Yearly</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-4 flex gap-2">
        <button onClick={handleCopy} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
          Copy
        </button>
        <button onClick={() => window.print()} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
          Print
        </button>
        <button onClick={handleDownload} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
          Download
        </button>
        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
          Column visibility
        </button>
      </div>

      {/* Scatter Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          {industryGrouping} Attractiveness vs Activity ({timeSlice})
        </h4>
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart data={scatterData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Activity"
              label={{ value: 'Customer Activity', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Attractiveness"
              label={{ value: 'Customer Attractiveness', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                      <p className="font-semibold">{data.name}</p>
                      <p>Activity: {data.x.toFixed(2)}</p>
                      <p>Attractiveness: {data.y}</p>
                      <p>Revenue: {data.revenue.toLocaleString()}</p>
                      <p>Volume: {data.volume.toLocaleString()}</p>
                      <p>Segment: {data.segment}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Scatter dataKey="y" fill="#8884d8">
              {scatterData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getSegmentColor(entry.segment)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="mt-4 flex gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500"></div>
            <span className="text-sm">Stars (High Attractiveness, High Activity)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500"></div>
            <span className="text-sm">Sleepers (High Attractiveness, Low Activity)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500"></div>
            <span className="text-sm">Workhorses (Low Attractiveness, High Activity)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500"></div>
            <span className="text-sm">Dogs (Low Attractiveness, Low Activity)</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                {industryGrouping} <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Attractiveness <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Activity <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Revenue <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Volume <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Segment <span className="text-xs">↑↓</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold">{row.groupingKey}</td>
                <td className="border border-gray-300 px-4 py-2">{row.attractiveness}</td>
                <td className="border border-gray-300 px-4 py-2">{row.activity.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">{row.revenue.toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">{row.volume.toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <span 
                    className="px-2 py-1 rounded text-xs font-semibold text-white"
                    style={{ backgroundColor: getSegmentColor(row.segment) }}
                  >
                    {row.segment}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Column Filters */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.groupingKey}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, groupingKey: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.attractiveness}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, attractiveness: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.activity}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, activity: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.revenue}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, revenue: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.volume}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, volume: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.segment}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, segment: e.target.value }))}
        />
      </div>
    </Card>
  );
};

export default AttractivenessActivityAnalysisSection;

