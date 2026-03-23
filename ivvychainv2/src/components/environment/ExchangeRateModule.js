import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Card from '../shared/Card';
import DataTable from './shared/DataTable';

const ExchangeRateModule = () => {
  const [activeTab, setActiveTab] = useState('graphs'); // 'graphs' | 'table'
  const [locationFilter, setLocationFilter] = useState('All');
  const [measureFilter, setMeasureFilter] = useState('NATUSD');
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [visibleSeries, setVisibleSeries] = useState(new Set());
  const [legendPage, setLegendPage] = useState(1);
  const [allLocations, setAllLocations] = useState([]);

  useEffect(() => {
    // Mock data - generate multi-series line chart data
    const locations = ['ARG', 'AUS', 'AUT', 'BEL', 'BGR', 'BRA', 'CAN', 'CHN', 'DEU', 'FRA', 'GBR', 'IDN'];
    setAllLocations(locations);

    // Generate chart data for each location
    const years = Array.from({ length: 67 }, (_, i) => 1950 + i);
    const seriesData = locations.map((loc, idx) => {
      let baseValue = 0.5 + idx * 0.1;
      if (loc === 'IDN') {
        // IDN shows significant fluctuations
        baseValue = 9000;
      }
      return {
        location: loc,
        color: ['#3B82F6', '#F97316', '#EF4444', '#10B981', '#8B5CF6', '#EC4899', '#14B8A6', '#F59E0B', '#6366F1', '#84CC16', '#06B6D4', '#9333EA'][idx],
        data: years.map((year) => {
          let value = baseValue;
          if (loc === 'IDN') {
            // Simulate IDN fluctuations
            if (year >= 1998) value = 8000 + Math.random() * 2000;
            if (year >= 2000) value = 9000 + Math.random() * 1000;
            if (year >= 2008) value = 9500 + Math.random() * 500;
          } else {
            value = baseValue + Math.random() * 1000;
          }
          return { year, value };
        }),
      };
    });

    // Transform for Recharts format
    const transformedChartData = years.map((year) => {
      const point = { year };
      seriesData.forEach((series) => {
        const yearData = series.data.find((d) => d.year === year);
        point[series.location] = yearData ? yearData.value : null;
      });
      return point;
    });

    setChartData(transformedChartData);
    setVisibleSeries(new Set(locations.slice(0, 5))); // Show first 5 by default

    // Generate table data
    const mockTableData = [];
    locations.forEach((loc) => {
      years.forEach((year) => {
        let value = 0.5 + locations.indexOf(loc) * 0.1;
        if (loc === 'IDN') {
          value = 9000 + Math.random() * 1000;
        } else {
          value = value + Math.random() * 1000;
        }
        mockTableData.push({
          location: loc,
          measure: measureFilter,
          time: year,
          value: value,
        });
      });
    });

    setTableData(mockTableData);
  }, [locationFilter, measureFilter]);

  const filteredChartData = useMemo(() => {
    if (locationFilter === 'All') {
      return chartData;
    }
    return chartData.map((point) => {
      const filtered = { year: point.year };
      filtered[locationFilter] = point[locationFilter];
      return filtered;
    });
  }, [chartData, locationFilter]);

  const filteredTableData = useMemo(() => {
    let filtered = tableData;
    if (locationFilter !== 'All') {
      filtered = filtered.filter((row) => row.location === locationFilter);
    }
    return filtered;
  }, [tableData, locationFilter]);

  const tableColumns = [
    { key: 'location', label: 'LOCATION' },
    { key: 'measure', label: 'MEASURE' },
    { key: 'time', label: 'TIME' },
    {
      key: 'value',
      label: 'Value',
      render: (val) => val.toFixed(6),
    },
  ];

  const seriesToShow = Array.from(visibleSeries);
  const legendItemsPerPage = 5;
  const totalLegendPages = Math.ceil(allLocations.length / legendItemsPerPage);
  const visibleLegendItems = allLocations.slice(
    (legendPage - 1) * legendItemsPerPage,
    legendPage * legendItemsPerPage
  );

  const toggleSeries = (location) => {
    setVisibleSeries((prev) => {
      const next = new Set(prev);
      if (next.has(location)) {
        next.delete(location);
      } else {
        next.add(location);
      }
      return next;
    });
  };

  const getSeriesColor = (location) => {
    const idx = allLocations.indexOf(location);
    return ['#3B82F6', '#F97316', '#EF4444', '#10B981', '#8B5CF6', '#EC4899', '#14B8A6', '#F59E0B', '#6366F1', '#84CC16', '#06B6D4', '#9333EA'][idx] || '#6B7280';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Exchange Rate Analysis</h1>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-300">
        <button
          onClick={() => setActiveTab('graphs')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'graphs'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Graphs
        </button>
        <button
          onClick={() => setActiveTab('table')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'table'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Table
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Location</label>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="All">All</option>
            {allLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Measure</label>
          <select
            value={measureFilter}
            onChange={(e) => setMeasureFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="NATUSD">NATUSD</option>
            <option value="NATEUR">NATEUR</option>
            <option value="NATGBP">NATGBP</option>
          </select>
        </div>
      </div>

      {/* Graphs Tab */}
      {activeTab === 'graphs' && (
        <Card>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={filteredChartData} margin={{ top: 20, right: 150, bottom: 20, left: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                type="number"
                scale="linear"
                domain={[1950, 2016]}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                label={{ value: 'Rate', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 11 }}
                domain={[0, 15000]}
              />
              <Tooltip
                formatter={(value, name) => [
                  value ? value.toFixed(6) : 'N/A',
                  name,
                ]}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Legend
                wrapperStyle={{ paddingLeft: '20px' }}
                content={({ payload }) => (
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-semibold mb-2">Legend</div>
                    {visibleLegendItems.map((location) => {
                      const isVisible = visibleSeries.has(location);
                      const color = getSeriesColor(location);
                      return (
                        <div
                          key={location}
                          onClick={() => toggleSeries(location)}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                          style={{ opacity: isVisible ? 1 : 0.5 }}
                        >
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: color }}
                          ></div>
                          <span className="text-sm">{location}</span>
                        </div>
                      );
                    })}
                    {totalLegendPages > 1 && (
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => setLegendPage((p) => Math.max(1, p - 1))}
                          disabled={legendPage === 1}
                          className="px-2 py-1 text-xs bg-gray-200 rounded disabled:opacity-50"
                        >
                          ▲
                        </button>
                        <span className="text-xs">
                          {legendPage}/{totalLegendPages}
                        </span>
                        <button
                          onClick={() => setLegendPage((p) => Math.min(totalLegendPages, p + 1))}
                          disabled={legendPage === totalLegendPages}
                          className="px-2 py-1 text-xs bg-gray-200 rounded disabled:opacity-50"
                        >
                          ▼
                        </button>
                      </div>
                    )}
                  </div>
                )}
              />
              {seriesToShow.map((location) => (
                <Line
                  key={location}
                  type="monotone"
                  dataKey={location}
                  stroke={getSeriesColor(location)}
                  strokeWidth={2}
                  dot={false}
                  name={location}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Table Tab */}
      {activeTab === 'table' && (
        <DataTable data={filteredTableData} columns={tableColumns} pageSize={15} />
      )}
    </div>
  );
};

export default ExchangeRateModule;

