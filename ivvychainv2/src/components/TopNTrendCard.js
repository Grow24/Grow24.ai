import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
} from 'recharts';

const TopNTrendCard = ({ title, trendData = [], seasonalityData = [], metric, isSeasonality = false }) => {
  const [zoom, setZoom] = useState('All');
  const [dateFrom, setDateFrom] = useState('2015-04-01');
  const [dateTo, setDateTo] = useState('2018-06-30');

  // Use seasonality data if this is a seasonality chart, otherwise use trend data
  const chartData = isSeasonality ? seasonalityData : trendData;

  // Filter data based on zoom and date range
  const filteredData = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
    
    let filtered = [...chartData];
    
    // Apply date range filter
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= fromDate && itemDate <= toDate;
    });

    // Apply zoom filter
    if (zoom !== 'All') {
      const now = new Date();
      let startDate = new Date();
      
      switch (zoom) {
        case '1m':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case '3m':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case '6m':
          startDate.setMonth(now.getMonth() - 6);
          break;
        case 'YTD':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case '1y':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          return filtered;
      }
      
      filtered = filtered.filter(item => new Date(item.date) >= startDate);
    }

    return filtered;
  }, [chartData, zoom, dateFrom, dateTo]);

  const formatValue = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toFixed(0);
  };

  const hasSeasonality = seasonalityData && seasonalityData.length > 0;

  return (
    <div className="border border-gray-200 rounded p-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-4">{title}</h4>
      
      {/* Controls */}
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        <div className="flex gap-2">
          {['1m', '3m', '6m', 'YTD', '1y', 'All'].map((level) => (
            <button
              key={level}
              onClick={() => setZoom(level)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                zoom === level
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-xs"
          />
          <label className="text-xs text-gray-600">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-xs"
          />
        </div>
      </div>

      {/* Chart or No Seasonality Message */}
      {isSeasonality && !hasSeasonality ? (
        <div className="h-64 flex items-center justify-center border border-gray-200 rounded bg-gray-50">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-500 mb-2">NO SEASONALITY</div>
            <div className="text-sm text-gray-400">No data to display</div>
          </div>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                }}
              />
              <YAxis tickFormatter={formatValue} />
              <Tooltip
                formatter={(value) => formatValue(value)}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                fill={isSeasonality ? '#10B981' : '#3B82F6'}
                fillOpacity={0.6}
                stroke={isSeasonality ? '#10B981' : '#3B82F6'}
                strokeWidth={2}
              />
              <Brush
                dataKey="date"
                height={30}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default TopNTrendCard;


