import React, { useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ButtonGroup from './shared/ButtonGroup';
import Card from './shared/Card';
import DownloadButton from './shared/DownloadButton';
import { downloadInteractiveBarChartDashboard } from '../utils/interactiveBarChartExport';

const TopCustomersSection = ({ data, selectedYear, selectedQuarter, comparisonMode, onYearChange, onQuarterChange, onComparisonChange }) => {
  const dashboardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [columnFilters, setColumnFilters] = useState({
    product: '',
    sales: '',
    vsTarget: '',
    growthRate: '',
    avgSales: '',
    orders: '',
  });

  const getGrowthRateColor = (rate) => {
    if (rate === 'A') return 'text-green-600 font-bold';
    if (rate === 'B') return 'text-orange-600 font-bold';
    return 'text-red-600 font-bold';
  };

  // Filter table data based on column filters
  const filteredData = data.tableData.filter(row => {
    return (
      (!columnFilters.product || row.product.toLowerCase().includes(columnFilters.product.toLowerCase())) &&
      (!columnFilters.sales || row.sales.toString().includes(columnFilters.sales)) &&
      (!columnFilters.vsTarget || row.vsTarget.toString().includes(columnFilters.vsTarget)) &&
      (!columnFilters.growthRate || row.growthRate.toLowerCase().includes(columnFilters.growthRate.toLowerCase())) &&
      (!columnFilters.avgSales || row.avgSales.toString().includes(columnFilters.avgSales)) &&
      (!columnFilters.orders || row.orders.toString().includes(columnFilters.orders))
    );
  });

  // Chart data should match filtered table data
  const chartData = filteredData.map(p => ({ product: p.product, sales: p.sales }));

  const handleCopy = () => {
    const csv = [
      ['Product', 'Sales', 'vsTarget', 'GrowthRate', 'Avg_Sales', 'Orders'],
      ...filteredData.map(row => [
        row.product,
        row.sales,
        row.vsTarget,
        row.growthRate,
        row.avgSales,
        row.orders,
      ])
    ].map(row => row.join(',')).join('\n');
    
    navigator.clipboard.writeText(csv);
  };

  const handleCSVDownload = () => {
    const csv = [
      ['Product', 'Sales', 'vsTarget', 'GrowthRate', 'Avg_Sales', 'Orders'],
      ...filteredData.map(row => [
        row.product,
        row.sales,
        row.vsTarget,
        row.growthRate,
        row.avgSales,
        row.orders,
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'top-customers.csv';
    a.click();
  };

  const handleDashboardDownload = async () => {
    setIsDownloading(true);
    try {
      // Prepare data for all filter combinations
      const allFilterData = {
        'vs Prior': {
          '2015': {
            'Q1': { chartData: chartData, tableData: filteredData },
            'Q2': { chartData: chartData, tableData: filteredData },
            'Q3': { chartData: chartData, tableData: filteredData },
            'Q4': { chartData: chartData, tableData: filteredData }
          },
          '2016': {
            'Q1': { chartData: chartData, tableData: filteredData },
            'Q2': { chartData: chartData, tableData: filteredData },
            'Q3': { chartData: chartData, tableData: filteredData },
            'Q4': { chartData: chartData, tableData: filteredData }
          },
          '2017': {
            'Q1': { chartData: chartData, tableData: filteredData },
            'Q2': { chartData: chartData, tableData: filteredData },
            'Q3': { chartData: chartData, tableData: filteredData },
            'Q4': { chartData: chartData, tableData: filteredData }
          }
        },
        'vs Target': {
          '2015': {
            'Q1': { chartData: chartData, tableData: filteredData },
            'Q2': { chartData: chartData, tableData: filteredData },
            'Q3': { chartData: chartData, tableData: filteredData },
            'Q4': { chartData: chartData, tableData: filteredData }
          },
          '2016': {
            'Q1': { chartData: chartData, tableData: filteredData },
            'Q2': { chartData: chartData, tableData: filteredData },
            'Q3': { chartData: chartData, tableData: filteredData },
            'Q4': { chartData: chartData, tableData: filteredData }
          },
          '2017': {
            'Q1': { chartData: chartData, tableData: filteredData },
            'Q2': { chartData: chartData, tableData: filteredData },
            'Q3': { chartData: chartData, tableData: filteredData },
            'Q4': { chartData: chartData, tableData: filteredData }
          }
        }
      };

      const config = {
        chartType: 'horizontalBar',
        chartTitle: 'Sales by Customer',
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
        'Top 10 Customers',
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
      <Card title="Top 10 Customers" className="mb-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
          >
            Copy
          </button>
          <button 
            onClick={() => window.print()}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
          >
            Print
          </button>
          <button 
            onClick={handleCSVDownload}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
          >
            Download CSV
          </button>
          <DownloadButton
            onClick={handleDashboardDownload}
            isDownloading={isDownloading}
            className="px-3 py-1 text-sm"
            title="Download Top 10 Customers dashboard with metadata for HBMP AgentBot"
          />
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
            Column visibility
          </button>
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
          <div className="overflow-x-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
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
                {filteredData.map((row, index) => (
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
            <input
              type="text"
              placeholder="All"
              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
              value={columnFilters.product}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, product: e.target.value }))}
            />
            <input
              type="text"
              placeholder="All"
              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
              value={columnFilters.sales}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, sales: e.target.value }))}
            />
            <input
              type="text"
              placeholder="All"
              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
              value={columnFilters.vsTarget}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, vsTarget: e.target.value }))}
            />
            <input
              type="text"
              placeholder="All"
              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
              value={columnFilters.growthRate}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, growthRate: e.target.value }))}
            />
            <input
              type="text"
              placeholder="All"
              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
              value={columnFilters.avgSales}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, avgSales: e.target.value }))}
            />
            <input
              type="text"
              placeholder="All"
              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
              value={columnFilters.orders}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, orders: e.target.value }))}
            />
          </div>
        </div>

        {/* Right - Horizontal Bar Chart */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Sales by Customer</h4>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart 
              data={chartData} 
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

export default TopCustomersSection;


