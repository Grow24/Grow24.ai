import React, { useState } from 'react';
import Card from './shared/Card';

const ProductPortfolioSection = ({ data }) => {
  const [igPgFilter, setIgPgFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('2016-12-31');
  const [dateTo, setDateTo] = useState('2017-01-11');
  const [valueVolumeFilter, setValueVolumeFilter] = useState('All');
  const [columnFilters, setColumnFilters] = useState({
    date: '',
    item: '',
    amount: '',
  });

  const filteredData = data.tableData.filter(row => {
    return (
      (!columnFilters.date || row.date.includes(columnFilters.date)) &&
      (!columnFilters.item || row.item.toLowerCase().includes(columnFilters.item.toLowerCase())) &&
      (!columnFilters.amount || row.amount.toString().includes(columnFilters.amount))
    );
  });

  // Generate heatmap data
  const heatmapData = data?.heatmap || [];
  const maxHeatmapValue = Math.max(...heatmapData.flatMap(row => row.values || []), 1);

  const getHeatmapColor = (value) => {
    const intensity = (value / maxHeatmapValue) * 100;
    if (intensity > 80) return 'bg-blue-900';
    if (intensity > 60) return 'bg-blue-700';
    if (intensity > 40) return 'bg-blue-500';
    if (intensity > 20) return 'bg-blue-300';
    return 'bg-blue-100';
  };

  const handleCopy = () => {
    const csv = [
      ['Date', 'Item', 'amount'],
      ...filteredData.map(row => [row.date, row.item, row.amount])
    ].map(row => row.join(',')).join('\n');
    navigator.clipboard.writeText(csv);
  };

  const handleDownload = () => {
    const csv = [
      ['Date', 'Item', 'amount'],
      ...filteredData.map(row => [row.date, row.item, row.amount])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-portfolio.csv';
    a.click();
  };

  return (
    <Card title="Product Portfolio" className="mb-6">
      {/* Filters */}
      <div className="mb-6 flex gap-4 items-center flex-wrap">
        <select
          className="px-3 py-2 border border-gray-300 rounded text-sm"
          value={igPgFilter}
          onChange={(e) => setIgPgFilter(e.target.value)}
        >
          <option>All</option>
          <option>IG</option>
          <option>PG</option>
        </select>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Date Range</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          />
          <span className="text-sm text-gray-600">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
        <select
          className="px-3 py-2 border border-gray-300 rounded text-sm"
          value={valueVolumeFilter}
          onChange={(e) => setValueVolumeFilter(e.target.value)}
        >
          <option>All</option>
          <option>Value</option>
          <option>Volume</option>
        </select>
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

      {/* Heatmap and Table Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Heatmap */}
        <div>
          <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '600px' }}>
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-2 py-1 text-xs font-bold"></th>
                  {data?.dateColumns?.map((date, idx) => (
                    <th key={idx} className="border border-gray-300 px-2 py-1 text-xs font-bold" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                      {date}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    <td className="border border-gray-300 px-2 py-1 text-xs font-bold">{row.product}</td>
                    {row.values?.map((value, colIdx) => (
                      <td
                        key={colIdx}
                        className={`border border-gray-300 px-1 py-1 text-xs text-center ${getHeatmapColor(value)} text-white`}
                        style={{ minWidth: '20px' }}
                      >
                        {value > 0 ? '●' : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table */}
        <div>
          <div className="overflow-x-auto" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Date <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Item <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    amount <span className="text-xs">↑↓</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{row.date}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.item}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.amount.toLocaleString()}</td>
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
              value={columnFilters.date}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, date: e.target.value }))}
            />
            <input
              type="text"
              placeholder="All"
              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
              value={columnFilters.item}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, item: e.target.value }))}
            />
            <input
              type="text"
              placeholder="All"
              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
              value={columnFilters.amount}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, amount: e.target.value }))}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductPortfolioSection;


