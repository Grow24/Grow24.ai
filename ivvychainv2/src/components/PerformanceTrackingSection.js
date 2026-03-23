import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import Card from './shared/Card';

const PerformanceTrackingSection = ({ data }) => {
  const [columnFilters, setColumnFilters] = useState({
    account: '',
    annualTarget: '',
    ytdTarget: '',
    ytdAccount: '',
    targetGap: '',
    pipeline: '',
    ppGap: '',
  });

  const filteredData = data.tableData.filter(row => {
    return (
      (!columnFilters.account || row.account.toLowerCase().includes(columnFilters.account.toLowerCase())) &&
      (!columnFilters.annualTarget || row.annualTarget.toString().includes(columnFilters.annualTarget)) &&
      (!columnFilters.ytdTarget || row.ytdTarget.toString().includes(columnFilters.ytdTarget)) &&
      (!columnFilters.ytdAccount || row.ytdAccount.toString().includes(columnFilters.ytdAccount)) &&
      (!columnFilters.targetGap || row.targetGap.toString().includes(columnFilters.targetGap)) &&
      (!columnFilters.pipeline || row.pipeline.toString().includes(columnFilters.pipeline)) &&
      (!columnFilters.ppGap || row.ppGap.toString().includes(columnFilters.ppGap))
    );
  });

  const handleCopy = () => {
    const csv = [
      ['Account', 'Annual Target', 'YTD Target', 'YTD Account', 'Target Gap', 'Pipeline', 'P/P Gap'],
      ...filteredData.map(row => [
        row.account,
        row.annualTarget,
        row.ytdTarget,
        row.ytdAccount,
        row.targetGap,
        row.pipeline,
        row.ppGap,
      ])
    ].map(row => row.join(',')).join('\n');
    navigator.clipboard.writeText(csv);
  };

  const handleDownload = () => {
    const csv = [
      ['Account', 'Annual Target', 'YTD Target', 'YTD Account', 'Target Gap', 'Pipeline', 'P/P Gap'],
      ...filteredData.map(row => [
        row.account,
        row.annualTarget,
        row.ytdTarget,
        row.ytdAccount,
        row.targetGap,
        row.pipeline,
        row.ppGap,
      ])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'performance-tracking.csv';
    a.click();
  };

  return (
    <Card title="Performance Tracking" className="mb-6">
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

      {/* Table */}
      <div className="overflow-x-auto" style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Account <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Sparkline (Past 3 Months) <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Annual Target <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                YTD Target <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                YTD Account <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Target Gap <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Pipeline <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                P/P Gap <span className="text-xs">↑↓</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2 font-semibold">{row.account}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <ResponsiveContainer width="100%" height={40}>
                    <LineChart data={row.sparkline}>
                      <Line type="monotone" dataKey="value" stroke="#F97316" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </td>
                <td className="border border-gray-300 px-4 py-2">{row.annualTarget.toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">{row.ytdTarget.toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">{row.ytdAccount}</td>
                <td className="border border-gray-300 px-4 py-2">{row.targetGap.toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">{row.pipeline.toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">{row.ppGap.toLocaleString()}</td>
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
          value={columnFilters.account}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, account: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.annualTarget}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, annualTarget: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.ytdTarget}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, ytdTarget: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.ytdAccount}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, ytdAccount: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.targetGap}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, targetGap: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.pipeline}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, pipeline: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.ppGap}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, ppGap: e.target.value }))}
        />
      </div>
    </Card>
  );
};

export default PerformanceTrackingSection;


