import React, { useState, useRef } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import ButtonGroup from './shared/ButtonGroup';
import Card from './shared/Card';
import DownloadButton from './shared/DownloadButton';
import { downloadDashboard, prepareDashboardMetadata } from '../utils/dashboardDownload';
import { downloadInteractiveDashboard } from '../utils/interactiveDashboardDownload';

const AnalysisByCustomerSection = ({ data, selectedYear, onYearChange }) => {
  const dashboardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [columnFilters, setColumnFilters] = useState({
    customer: '',
    sales: '',
    salesLY: '',
    lyVar: '',
    growthStatus: '',
    targetVar: '',
    cogs: '',
    grossProfit: '',
    quantity: '',
    orders: '',
  });

  const getGrowthStatusColor = (status) => {
    if (status === 'A') return 'text-green-600 font-bold';
    if (status === 'B') return 'text-orange-600 font-bold';
    return 'text-red-600 font-bold';
  };

  // Filter table data
  const filteredData = data.tableData.filter(row => {
    return (
      (!columnFilters.customer || row.customer.toLowerCase().includes(columnFilters.customer.toLowerCase())) &&
      (!columnFilters.sales || row.sales.toString().includes(columnFilters.sales)) &&
      (!columnFilters.salesLY || row.salesLY.toString().includes(columnFilters.salesLY)) &&
      (!columnFilters.lyVar || row.lyVar.toString().includes(columnFilters.lyVar)) &&
      (!columnFilters.growthStatus || row.growthStatus.toLowerCase().includes(columnFilters.growthStatus.toLowerCase())) &&
      (!columnFilters.targetVar || row.targetVar.toString().includes(columnFilters.targetVar)) &&
      (!columnFilters.cogs || row.cogs.toString().includes(columnFilters.cogs)) &&
      (!columnFilters.grossProfit || row.grossProfit.toString().includes(columnFilters.grossProfit)) &&
      (!columnFilters.quantity || row.quantity.toString().includes(columnFilters.quantity)) &&
      (!columnFilters.orders || row.orders.toString().includes(columnFilters.orders))
    );
  });

  // Calculate max values for data bars
  const maxSales = Math.max(...filteredData.map(r => r.sales), 1);
  const maxTargetVar = Math.max(...filteredData.map(r => r.targetVar), 1);
  const maxGrossProfit = Math.max(...filteredData.map(r => r.grossProfit), 1);
  const maxQuantity = Math.max(...filteredData.map(r => r.quantity), 1);

  const handleCopy = () => {
    const csv = [
      ['Customer', 'Sales', 'SalesLY', 'LY_Var', 'Growth_Status', 'Target_Var', 'COGS', 'GrossProfit', 'Quantity', 'Orders'],
      ...filteredData.map(row => [
        row.customer,
        row.sales,
        row.salesLY,
        row.lyVar,
        row.growthStatus,
        row.targetVar,
        row.cogs,
        row.grossProfit,
        row.quantity,
        row.orders,
      ])
    ].map(row => row.join(',')).join('\n');
    
    navigator.clipboard.writeText(csv);
  };

  const handleCSVDownload = () => {
    const csv = [
      ['Customer', 'Sales', 'SalesLY', 'LY_Var', 'Growth_Status', 'Target_Var', 'COGS', 'GrossProfit', 'Quantity', 'Orders'],
      ...filteredData.map(row => [
        row.customer,
        row.sales,
        row.salesLY,
        row.lyVar,
        row.growthStatus,
        row.targetVar,
        row.cogs,
        row.grossProfit,
        row.quantity,
        row.orders,
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analysis-by-customer.csv';
    a.click();
  };

  const handleDashboardDownload = async () => {
    setIsDownloading(true);
    try {
      const dashboardData = {
        tableData: filteredData,
        metrics: {
          totalCustomers: filteredData.length,
          totalSales: filteredData.reduce((sum, row) => sum + row.sales, 0),
          totalSalesLY: filteredData.reduce((sum, row) => sum + row.salesLY, 0),
          averageGrossProfit: filteredData.length > 0 ? (filteredData.reduce((sum, row) => sum + row.grossProfit, 0) / filteredData.length).toFixed(2) : 0,
          totalOrders: filteredData.reduce((sum, row) => sum + row.orders, 0),
        },
        summary: {
          growthCategoryA: filteredData.filter(r => r.growthStatus === 'A').length,
          growthCategoryB: filteredData.filter(r => r.growthStatus === 'B').length,
          growthCategoryC: filteredData.filter(r => r.growthStatus === 'C').length,
        },
      };
      const metadata = {
        filters: { selectedYear, ...columnFilters },
        summary: {
          recordCount: filteredData.length,
          exportDate: new Date().toISOString(),
          reportType: 'Customer Analysis Report',
        },
      };
      await downloadInteractiveDashboard(dashboardData, 'Analysis By Customer', metadata);
    } catch (error) {
      console.error('Error downloading dashboard:', error);
      alert('Failed to download dashboard. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Generate sparkline data (simple mock)
  const generateSparklineData = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      value: Math.random() * 1000000 + 500000,
    }));
  };

  const sparklineData = generateSparklineData();

  return (
    <div ref={dashboardRef}>
      <Card title="Analysis by Customer" className="mb-6">
      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="border border-gray-200 rounded p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">{data.summary?.sales || '4M'}</div>
          <div className="text-sm text-gray-600 mb-2">Sales</div>
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={sparklineData}>
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="border border-gray-200 rounded p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">{data.summary?.salesLY || '3M'}</div>
          <div className="text-sm text-gray-600 mb-2">Sales LY</div>
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={sparklineData}>
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="border border-gray-200 rounded p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">{data.summary?.growthStatus || 'G'}</div>
          <div className="text-sm text-gray-600 mb-2">Growth Status</div>
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={sparklineData}>
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="border border-gray-200 rounded p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{data.summary?.growthProfit || '54%'}</div>
              <div className="text-sm text-gray-600 mb-2">Growth Profit %</div>
              <ResponsiveContainer width="100%" height={60}>
                <LineChart data={sparklineData}>
                  <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="ml-4">
              <ButtonGroup
                options={['2015', '2016', '2017']}
                selected={selectedYear}
                onSelect={onYearChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex gap-2">
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
          Download
        </button>
        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
          Column visibility
        </button>
      </div>

      {/* Scrollable Table */}
      <div className="overflow-x-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Customer <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Sales <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                SalesLY <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                LY_Var <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Growth_Status <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Target_Var <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                COGS <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                GrossProfit <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Quantity <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Orders <span className="text-xs">↑↓</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2 font-semibold">{row.customer}</td>
                <td className="border border-gray-300 px-4 py-2 relative">
                  <div className="flex items-center">
                    <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.sales / maxSales) * 100}%` }}></div>
                    <span className="ml-2">{row.sales.toLocaleString()}</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">{row.salesLY.toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">{row.lyVar}</td>
                <td className={`border border-gray-300 px-4 py-2 ${getGrowthStatusColor(row.growthStatus)}`}>
                  {row.growthStatus}
                </td>
                <td className="border border-gray-300 px-4 py-2 relative">
                  <div className="flex items-center">
                    <div className="flex-1 bg-orange-200 h-4 rounded" style={{ width: `${(row.targetVar / maxTargetVar) * 100}%` }}></div>
                    <span className="ml-2">{row.targetVar}</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">{row.cogs}</td>
                <td className="border border-gray-300 px-4 py-2 relative">
                  <div className="flex items-center">
                    <div className="flex-1 bg-orange-200 h-4 rounded" style={{ width: `${(row.grossProfit / maxGrossProfit) * 100}%` }}></div>
                    <span className="ml-2">{row.grossProfit}</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 relative">
                  <div className="flex items-center">
                    <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.quantity / maxQuantity) * 100}%` }}></div>
                    <span className="ml-2">{row.quantity}</span>
                  </div>
                </td>
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
          value={columnFilters.customer}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, customer: e.target.value }))}
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
          value={columnFilters.salesLY}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, salesLY: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.lyVar}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, lyVar: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.growthStatus}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, growthStatus: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.targetVar}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, targetVar: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.cogs}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, cogs: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.grossProfit}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, grossProfit: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.quantity}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, quantity: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.orders}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, orders: e.target.value }))}
        />
      </div>
    </Card>
    </div>
  );
};

export default AnalysisByCustomerSection;


