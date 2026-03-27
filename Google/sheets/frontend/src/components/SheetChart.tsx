import { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SheetChartProps {
  spreadsheetId: string;
  data: any[][];
  chartType: 'bar' | 'line' | 'pie';
  onChartTypeChange: (type: 'bar' | 'line' | 'pie') => void;
}

const COLORS = ['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function SheetChart({ spreadsheetId, data, chartType, onChartTypeChange }: SheetChartProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse sheet data to extract headers and numeric columns
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    try {
      // Assume first row is headers
      const headers = data[0];
      const rows = data.slice(1);

      // Find numeric columns
      const numericColumns: number[] = [];
      const labelColumn = 0; // Use first column as labels

      headers.forEach((header: any, index: number) => {
        if (index === 0) return; // Skip label column

        // Check if majority of values in this column are numeric
        const numericCount = rows.reduce((count, row) => {
          const value = row[index];
          return count + (value && !isNaN(parseFloat(value)) ? 1 : 0);
        }, 0);

        if (numericCount > rows.length / 2) {
          numericColumns.push(index);
        }
      });

      if (numericColumns.length === 0) {
        return { error: 'No numeric columns found in the sheet' };
      }

      // Transform data for Recharts
      const transformedData = rows.map((row) => {
        const dataPoint: any = {
          name: row[labelColumn] || 'N/A',
        };

        numericColumns.forEach((colIndex) => {
          const columnName = headers[colIndex];
          const value = row[colIndex];
          dataPoint[columnName] = value && !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
        });

        return dataPoint;
      }).filter(item => item.name !== 'N/A'); // Filter out empty rows

      return {
        data: transformedData,
        headers,
        numericColumns: numericColumns.map(idx => headers[idx]),
      };
    } catch (err) {
      console.error('Error parsing chart data:', err);
      return { error: 'Failed to parse sheet data' };
    }
  }, [data]);

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="mt-2">No data available</p>
        </div>
      </div>
    );
  }

  if ('error' in chartData) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2">{chartData.error}</p>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    const { data: chartValues, numericColumns } = chartData;

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartValues} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {numericColumns.map((col, idx) => (
                <Bar key={col} dataKey={col} fill={COLORS[idx % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartValues} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {numericColumns.map((col, idx) => (
                <Line key={col} type="monotone" dataKey={col} stroke={COLORS[idx % COLORS.length]} strokeWidth={2} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        // For pie chart, use first numeric column
        const firstColumn = numericColumns[0];
        const pieData = chartValues.map((item) => ({
          name: item.name,
          value: item[firstColumn],
        }));

        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Chart Type Selector */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Data Visualization</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onChartTypeChange('bar')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              chartType === 'bar'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Bar
          </button>
          <button
            onClick={() => onChartTypeChange('line')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              chartType === 'line'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Line
          </button>
          <button
            onClick={() => onChartTypeChange('pie')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              chartType === 'pie'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pie
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2">{error}</p>
            </div>
          </div>
        ) : (
          renderChart()
        )}
      </div>

      {/* Data Info */}
      {chartData && 'numericColumns' in chartData && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
          <span className="font-medium">Columns:</span> {chartData.numericColumns.join(', ')}
          {' '}&bull;{' '}
          <span className="font-medium">Rows:</span> {chartData.data.length}
        </div>
      )}
    </div>
  );
}
