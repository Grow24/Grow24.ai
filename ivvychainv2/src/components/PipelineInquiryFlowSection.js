import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Card from './shared/Card';

const PipelineInquiryFlowSection = ({ data }) => {
  const [inquiryStatus, setInquiryStatus] = useState('All');
  const [dateFrom, setDateFrom] = useState('2017-01-01');
  const [dateTo, setDateTo] = useState('2017-04-01');
  const [columnFilters, setColumnFilters] = useState({
    date: '',
    stage: '',
    id: '',
    status: '',
    name: '',
    soAmt: '',
    n: '',
  });

  const filteredData = data.tableData.filter(row => {
    return (
      (!columnFilters.date || row.date.includes(columnFilters.date)) &&
      (!columnFilters.stage || row.stage.toLowerCase().includes(columnFilters.stage.toLowerCase())) &&
      (!columnFilters.id || row.id.toString().includes(columnFilters.id)) &&
      (!columnFilters.status || row.status.toLowerCase().includes(columnFilters.status.toLowerCase())) &&
      (!columnFilters.name || row.name.toString().includes(columnFilters.name)) &&
      (!columnFilters.soAmt || row.soAmt.toString().includes(columnFilters.soAmt)) &&
      (!columnFilters.n || row.n.toString().includes(columnFilters.n))
    );
  });

  const handleCopy = () => {
    const csv = [
      ['Date', 'Stage', 'ID', 'Status', 'NAME', 'SO_Amt', 'n'],
      ...filteredData.map(row => [row.date, row.stage, row.id, row.status, row.name, row.soAmt, row.n])
    ].map(row => row.join(',')).join('\n');
    navigator.clipboard.writeText(csv);
  };

  const handleDownload = () => {
    const csv = [
      ['Date', 'Stage', 'ID', 'Status', 'NAME', 'SO_Amt', 'n'],
      ...filteredData.map(row => [row.date, row.stage, row.id, row.status, row.name, row.soAmt, row.n])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipeline-inquiry-flow.csv';
    a.click();
  };

  return (
    <Card title="Pipeline / Inquiry Flow" className="mb-6">
      {/* Filters */}
      <div className="mb-6 flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Filter inq by date</label>
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
          value={inquiryStatus}
          onChange={(e) => setInquiryStatus(e.target.value)}
        >
          <option>All</option>
          <option>Pipeline</option>
          <option>CL</option>
        </select>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#14B8A6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
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

      {/* Table */}
      <div className="overflow-x-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Date <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Stage <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                ID <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Status <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                NAME <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                SO_Amt <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                n <span className="text-xs">↑↓</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{row.date}</td>
                <td className="border border-gray-300 px-4 py-2">{row.stage}</td>
                <td className="border border-gray-300 px-4 py-2">{row.id}</td>
                <td className="border border-gray-300 px-4 py-2">{row.status}</td>
                <td className="border border-gray-300 px-4 py-2">{row.name}</td>
                <td className="border border-gray-300 px-4 py-2">{row.soAmt.toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">{row.n}</td>
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
          value={columnFilters.stage}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, stage: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.id}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, id: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.status}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, status: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.name}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, name: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.soAmt}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, soAmt: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.n}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, n: e.target.value }))}
        />
      </div>
    </Card>
  );
};

export default PipelineInquiryFlowSection;


