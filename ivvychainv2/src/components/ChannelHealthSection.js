import React, { useState } from 'react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Card from './shared/Card';

const ChannelHealthSection = ({ data }) => {
  const [columnFilters, setColumnFilters] = useState({
    channel: '',
    cp: '',
    cpType: '',
    newLeads: '',
    leadsClosed: '',
    revenueVal: '',
    revenueVol: '',
    pipelineVal: '',
    pipelineVol: '',
  });

  const filteredData = data.tableData.filter(row => {
    return (
      (!columnFilters.channel || row.channel.toLowerCase().includes(columnFilters.channel.toLowerCase())) &&
      (!columnFilters.cp || row.cp.toLowerCase().includes(columnFilters.cp.toLowerCase())) &&
      (!columnFilters.cpType || row.cpType.toLowerCase().includes(columnFilters.cpType.toLowerCase())) &&
      (!columnFilters.newLeads || row.newLeads.toString().includes(columnFilters.newLeads)) &&
      (!columnFilters.leadsClosed || row.leadsClosed.toString().includes(columnFilters.leadsClosed)) &&
      (!columnFilters.revenueVal || row.revenueVal.toString().includes(columnFilters.revenueVal)) &&
      (!columnFilters.revenueVol || row.revenueVol.toString().includes(columnFilters.revenueVol)) &&
      (!columnFilters.pipelineVal || row.pipelineVal.toString().includes(columnFilters.pipelineVal)) &&
      (!columnFilters.pipelineVol || row.pipelineVol.toString().includes(columnFilters.pipelineVol))
    );
  });

  const maxRevenueVal = Math.max(...filteredData.map(r => r.revenueVal), 1);

  const handleCopy = () => {
    const csv = [
      ['Channel', 'C.P', 'Cp Type', 'New Leads', 'Leads Closed', 'Revenue Val', 'Revenue Vol', 'Pipeline Val', 'Pipeline Vol'],
      ...filteredData.map(row => [
        row.channel,
        row.cp,
        row.cpType,
        row.newLeads,
        row.leadsClosed,
        row.revenueVal,
        row.revenueVol,
        row.pipelineVal,
        row.pipelineVol,
      ])
    ].map(row => row.join(',')).join('\n');
    navigator.clipboard.writeText(csv);
  };

  const handleDownload = () => {
    const csv = [
      ['Channel', 'C.P', 'Cp Type', 'New Leads', 'Leads Closed', 'Revenue Val', 'Revenue Vol', 'Pipeline Val', 'Pipeline Vol'],
      ...filteredData.map(row => [
        row.channel,
        row.cp,
        row.cpType,
        row.newLeads,
        row.leadsClosed,
        row.revenueVal,
        row.revenueVol,
        row.pipelineVal,
        row.pipelineVol,
      ])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'channel-health.csv';
    a.click();
  };

  return (
    <Card title="Channel Health" className="mb-6">
      {/* Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data.chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="channel" />
            <YAxis yAxisId="left" label={{ value: 'Values', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Values', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" name="Revenue" />
            <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#10B981" strokeWidth={2} name="Volume" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Toolbar */}
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
                Channel <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                C.P <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Cp Type <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                New Leads <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Leads Closed <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Revenue Val <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Revenue Vol <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Pipeline Val <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Pipeline Vol <span className="text-xs">↑↓</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2 font-semibold">{row.channel}</td>
                <td className="border border-gray-300 px-4 py-2">{row.cp}</td>
                <td className="border border-gray-300 px-4 py-2">{row.cpType}</td>
                <td className="border border-gray-300 px-4 py-2">{row.newLeads}</td>
                <td className="border border-gray-300 px-4 py-2">{row.leadsClosed}</td>
                <td className="border border-gray-300 px-4 py-2 relative">
                  <div className="flex items-center">
                    <div className="flex-1 bg-pink-200 h-4 rounded" style={{ width: `${(row.revenueVal / maxRevenueVal) * 100}%` }}></div>
                    <span className="ml-2">{row.revenueVal.toLocaleString()}</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 relative">
                  <div className="flex items-center">
                    <div className="flex-1 bg-pink-200 h-4 rounded" style={{ width: `${(row.revenueVol / 10) * 100}%` }}></div>
                    <span className="ml-2">{row.revenueVol}</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">{row.pipelineVal.toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">{row.pipelineVol}</td>
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
          value={columnFilters.channel}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, channel: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.cp}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, cp: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.cpType}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, cpType: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.newLeads}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, newLeads: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.leadsClosed}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, leadsClosed: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.revenueVal}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, revenueVal: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.revenueVol}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, revenueVol: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.pipelineVal}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, pipelineVal: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.pipelineVol}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, pipelineVol: e.target.value }))}
        />
      </div>
    </Card>
  );
};

export default ChannelHealthSection;


