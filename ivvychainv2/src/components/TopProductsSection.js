import React, { useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ButtonGroup from './shared/ButtonGroup';
import Card from './shared/Card';
import DownloadButton from './shared/DownloadButton';
import { downloadInteractiveBarChartDashboard } from '../utils/interactiveBarChartExport';

const TopProductsSection = ({ data, selectedYear, selectedQuarter, comparisonMode, onYearChange, onQuarterChange, onComparisonChange }) => {
  const dashboardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const getGrowthRateColor = (rate) => {
    if (rate === 'A') return 'text-green-600 font-bold';
    if (rate === 'B') return 'text-orange-600 font-bold';
    return 'text-red-600 font-bold';
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Prepare data for all filter combinations
      const allFilterData = {
        'vs Prior': {
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
          }
        },
        'vs Target': {
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
          }
        }
      };

      const config = {
        chartType: 'horizontalBar',
        chartTitle: 'Sales by Product',
        labelKey: 'product',
        dataKey: 'sales',
        chartDataKey: 'chartData',
        tableDataKey: 'tableData',
        showLegend: true,
        colors: ['#10B981'],
        filterGroups: [
          { name: 'comparisonMode', options: ['vs Prior', 'vs Target'], label: 'Comparison Mode' },
          { name: 'selectedYear', options: ['2015', '2016', '2017'], label: 'Year' },
          { name: 'selectedQuarter', options: ['Q1', 'Q2', 'Q3', 'Q4'], label: 'Quarter' }
        ]
      };

      await downloadInteractiveBarChartDashboard(
        allFilterData,
        'Top 10 Products',
        { comparisonMode, selectedYear, selectedQuarter },
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
      <Card title="Top 10 Products" className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">Copy</button>
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">Print</button>
            <DownloadButton
              onClick={handleDownload}
              isDownloading={isDownloading}
              className="px-3 py-1 text-sm"
              title="Download Top 10 Products dashboard with metadata for HBMP AgentBot"
            />
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">Column visibility</button>
          </div>
        <div className="flex gap-4">
          <ButtonGroup
            options={['vs Prior', 'vs Target']}
            selected={comparisonMode}
            onSelect={onComparisonChange}
          />
          <ButtonGroup
            options={['2015', '2016', '2017']}
            selected={selectedYear}
            onSelect={onYearChange}
          />
          <ButtonGroup
            options={['Q1', 'Q2', 'Q3', 'Q4']}
            selected={selectedQuarter}
            onSelect={onQuarterChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left - Data Table */}
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Product <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Sales <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    vsTarget <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    GrowthRate <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Avg_Sales <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Orders <span className="text-xs">↑↓</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.tableData.map((row, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">{row.product}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.sales.toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.vsTarget}</td>
                    <td className={`border border-gray-300 px-4 py-2 ${getGrowthRateColor(row.growthRate)}`}>
                      {row.growthRate}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{row.avgSales}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Footer Filters */}
          <div className="mt-4 flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <select key={i} className="px-2 py-1 border border-gray-300 rounded text-sm">
                <option>All</option>
              </select>
            ))}
          </div>
        </div>

        {/* Right - Horizontal Bar Chart */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Sales by Product</h4>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart 
              data={data.chartData} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="product" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#10B981" name="Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
    </div>
  );
};

export default TopProductsSection;


