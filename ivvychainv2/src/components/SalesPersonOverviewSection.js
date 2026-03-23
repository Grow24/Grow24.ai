import React, { useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ButtonGroup from './shared/ButtonGroup';
import Card from './shared/Card';
import DownloadButton from './shared/DownloadButton';
import { downloadInteractiveBarChartDashboard } from '../utils/interactiveBarChartExport';

const SalesPersonOverviewSection = ({ data, selectedYear, selectedQuarter, onYearChange, onQuarterChange }) => {
  const dashboardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Prepare data for all year/quarter combinations
      const allYearQuarterData = {
        '2015': {
          'Q1': { chartData: data.chartData || [], tableData: data.tableData || [] },
          'Q2': { chartData: data.chartData || [], tableData: data.tableData || [] },
          'Q3': { chartData: data.chartData || [], tableData: data.tableData || [] },
          'Q4': { chartData: data.chartData || [], tableData: data.tableData || [] }
        },
        '2016': {
          'Q1': { chartData: data.chartData || [], tableData: data.tableData || [] },
          'Q2': { chartData: data.chartData || [], tableData: data.tableData || [] },
          'Q3': { chartData: data.chartData || [], tableData: data.tableData || [] },
          'Q4': { chartData: data.chartData || [], tableData: data.tableData || [] }
        },
        '2017': {
          'Q1': { chartData: data.chartData || [], tableData: data.tableData || [] },
          'Q2': { chartData: data.chartData || [], tableData: data.tableData || [] },
          'Q3': { chartData: data.chartData || [], tableData: data.tableData || [] },
          'Q4': { chartData: data.chartData || [], tableData: data.tableData || [] }
        },
        '2018': {
          'Q1': { chartData: data.chartData || [], tableData: data.tableData || [] },
          'Q2': { chartData: data.chartData || [], tableData: data.tableData || [] },
          'Q3': { chartData: data.chartData || [], tableData: data.tableData || [] },
          'Q4': { chartData: data.chartData || [], tableData: data.tableData || [] }
        }
      };

      const config = {
        chartType: 'horizontalBar',
        chartTitle: 'Sales Timeline',
        labelKey: 'period',
        dataKey: 'currentYTD',
        chartDataKey: 'chartData',
        tableDataKey: 'tableData',
        showLegend: true,
        colors: ['#3B82F6', '#FBBF24'],
        filterGroups: [
          { name: 'selectedYear', options: ['2015', '2016', '2017', '2018'], label: 'Year' },
          { name: 'selectedQuarter', options: ['Q1', 'Q2', 'Q3', 'Q4'], label: 'Quarter' }
        ]
      };

      await downloadInteractiveBarChartDashboard(
        allYearQuarterData,
        'Sales Person Overview',
        { selectedYear, selectedQuarter },
        config
      );
    } catch (error) {
      console.error('Error downloading dashboard:', error);
      alert('Failed to download dashboard. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div ref={dashboardRef}>
      <Card title="Sales Person Overview" className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-4">
            <ButtonGroup
              options={['2015', '2016', '2017', '2018']}
              selected={selectedYear}
              onSelect={onYearChange}
            />
            <ButtonGroup
              options={['Q1', 'Q2', 'Q3', 'Q4']}
              selected={selectedQuarter}
              onSelect={onQuarterChange}
            />
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">Copy</button>
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">Print</button>
            <DownloadButton
              onClick={handleDownload}
              isDownloading={isDownloading}
              className="px-3 py-1 text-sm"
              title="Download Sales Person Overview dashboard with metadata for HBMP AgentBot"
            />
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">Column visibility</button>
          </div>
        </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left - Horizontal Bar Chart */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Sales Timeline</h4>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={data.chartData} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="period" type="category" width={80} />
              <Tooltip />
              <Legend />
              <Bar dataKey="currentYTD" fill="#3B82F6" name="Current YTD" />
              <Bar dataKey="priorYTD" fill="#FBBF24" name="Prior YTD" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right - Data Table */}
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Name <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Sales <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    SalesLY <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Target <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Gross_Profit <span className="text-xs">↑↓</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.tableData.map((row, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">{row.name}</td>
                    <td className="border border-gray-300 px-4 py-2 bg-pink-100 rounded-full text-center">{row.sales}</td>
                    <td className="border border-gray-300 px-4 py-2 bg-pink-100 rounded-full text-center">{row.salesLY}</td>
                    <td className="border border-gray-300 px-4 py-2 bg-pink-100 rounded-full text-center">{row.target}</td>
                    <td className="border border-gray-300 px-4 py-2 bg-pink-100 rounded-full text-center">{row.grossProfit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Footer Filters */}
          <div className="mt-4 flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <select key={i} className="px-2 py-1 border border-gray-300 rounded text-sm">
                <option>All</option>
              </select>
            ))}
          </div>
        </div>
      </div>
    </Card>
    </div>
  );
};

export default SalesPersonOverviewSection;


