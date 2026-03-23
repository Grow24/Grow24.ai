import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Card from './shared/Card';

const VoucherTypeSection = ({ data }) => {
  const [accountFilter, setAccountFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('2016-12-31');
  const [dateTo, setDateTo] = useState('2017-01-11');
  const [voucherTypeFilter, setVoucherTypeFilter] = useState('All');
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
    a.download = 'voucher-type.csv';
    a.click();
  };

  return (
    <Card title="Voucher Type" className="mb-6">
      {/* Filters */}
      <div className="mb-6 flex gap-4 items-center flex-wrap">
        <select
          className="px-3 py-2 border border-gray-300 rounded text-sm"
          value={accountFilter}
          onChange={(e) => setAccountFilter(e.target.value)}
        >
          <option>All</option>
          <option>Account</option>
          <option>Lead</option>
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
          value={voucherTypeFilter}
          onChange={(e) => setVoucherTypeFilter(e.target.value)}
        >
          <option>All</option>
          <option>Type1</option>
          <option>Type2</option>
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

      {/* Chart and Table Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Chart */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Inquiry Count</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Inquiry Count', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="base1" fill="#F87171" name="Base1" />
              <Bar dataKey="base2" stroke="#14B8A6" fill="#14B8A6" name="Base2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div>
          <div className="overflow-x-auto" style={{ maxHeight: '400px', overflowY: 'auto' }}>
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

export default VoucherTypeSection;


