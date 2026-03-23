import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Card from './shared/Card';

const CampaignPerformanceSection = ({ data }) => {
  const [columnFilters, setColumnFilters] = useState({
    campaignName: '',
    type: '',
    startDate: '',
    endDate: '',
    status: '',
    budgeted: '',
    actualCost: '',
    expectedRevenue: '',
    revenue: '',
  });

  const filteredData = data.tableData.filter(row => {
    return (
      (!columnFilters.campaignName || row.campaignName.toLowerCase().includes(columnFilters.campaignName.toLowerCase())) &&
      (!columnFilters.type || row.type.toLowerCase().includes(columnFilters.type.toLowerCase())) &&
      (!columnFilters.startDate || row.startDate.includes(columnFilters.startDate)) &&
      (!columnFilters.endDate || row.endDate.includes(columnFilters.endDate)) &&
      (!columnFilters.status || row.status.toLowerCase().includes(columnFilters.status.toLowerCase())) &&
      (!columnFilters.budgeted || row.budgeted.toString().includes(columnFilters.budgeted)) &&
      (!columnFilters.actualCost || row.actualCost.toString().includes(columnFilters.actualCost)) &&
      (!columnFilters.expectedRevenue || row.expectedRevenue.toString().includes(columnFilters.expectedRevenue)) &&
      (!columnFilters.revenue || row.revenue.toString().includes(columnFilters.revenue))
    );
  });

  const maxRevenue = Math.max(...filteredData.map(r => r.revenue), 1);

  const handleCopy = () => {
    const csv = [
      ['Campaign Name', 'Type', 'Start Date', 'End Date', 'Status', 'Budgeted', 'Actual Cost', 'Expected Revenue', 'Revenue'],
      ...filteredData.map(row => [
        row.campaignName,
        row.type,
        row.startDate,
        row.endDate,
        row.status,
        row.budgeted,
        row.actualCost,
        row.expectedRevenue,
        row.revenue,
      ])
    ].map(row => row.join(',')).join('\n');
    navigator.clipboard.writeText(csv);
  };

  const handleDownload = () => {
    const csv = [
      ['Campaign Name', 'Type', 'Start Date', 'End Date', 'Status', 'Budgeted', 'Actual Cost', 'Expected Revenue', 'Revenue'],
      ...filteredData.map(row => [
        row.campaignName,
        row.type,
        row.startDate,
        row.endDate,
        row.status,
        row.budgeted,
        row.actualCost,
        row.expectedRevenue,
        row.revenue,
      ])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaign-performance.csv';
    a.click();
  };

  // Sort chart data by revenue descending
  const chartData = [...filteredData]
    .sort((a, b) => b.revenue - a.revenue)
    .map(row => ({ campaign: row.campaignName, revenue: row.revenue }));

  return (
    <Card title="Campaign Performance" className="mb-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Table */}
        <div>
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

          <div className="overflow-x-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Campaign Name <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Type <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Start Date <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    End Date <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Status <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Budgeted <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Actual Cost <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Expected Revenue <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Revenue <span className="text-xs">↑↓</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">{row.campaignName}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.type}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.startDate}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.endDate}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.status}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.budgeted.toLocaleString()}</td>
                    <td className={`border border-gray-300 px-4 py-2 ${row.actualCost < row.budgeted ? 'bg-red-100' : ''}`}>
                      {row.actualCost.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{row.expectedRevenue.toLocaleString()}</td>
                    <td className={`border border-gray-300 px-4 py-2 relative ${row.revenue < row.expectedRevenue ? 'bg-red-100' : ''}`}>
                      <div className="flex items-center">
                        <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.revenue / maxRevenue) * 100}%` }}></div>
                        <span className="ml-2">{row.revenue.toLocaleString()}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Column Filters */}
          <div className="mt-4 flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="All"
              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
              value={columnFilters.campaignName}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, campaignName: e.target.value }))}
            />
            <input
              type="text"
              placeholder="All"
              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
              value={columnFilters.type}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, type: e.target.value }))}
            />
            <input
              type="text"
              placeholder="All"
              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
              value={columnFilters.startDate}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, startDate: e.target.value }))}
            />
            <input
              type="text"
              placeholder="All"
              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
              value={columnFilters.endDate}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, endDate: e.target.value }))}
            />
            <input
              type="text"
              placeholder="All"
              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
              value={columnFilters.status}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, status: e.target.value }))}
            />
            <input
              type="text"
              placeholder="All"
              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
              value={columnFilters.budgeted}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, budgeted: e.target.value }))}
            />
            <input
              type="text"
              placeholder="All"
              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
              value={columnFilters.actualCost}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, actualCost: e.target.value }))}
            />
            <input
              type="text"
              placeholder="All"
              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
              value={columnFilters.expectedRevenue}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, expectedRevenue: e.target.value }))}
            />
            <input
              type="text"
              placeholder="All"
              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
              value={columnFilters.revenue}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, revenue: e.target.value }))}
            />
          </div>
        </div>

        {/* Chart */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Revenue by Campaign</h4>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="campaign" type="category" width={80} />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default CampaignPerformanceSection;


