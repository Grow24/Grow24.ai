import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Card from './shared/Card';

const ChannelProductSection = ({ data, productName = 'Product A' }) => {
  const [columnFilters, setColumnFilters] = useState({
    channel: '',
    product: '',
    y2015_16: '',
    y2016_17: '',
    y2017_18: '',
  });

  const filteredData = data.tableData.filter(row => {
    return (
      (!columnFilters.channel || row.channel.toLowerCase().includes(columnFilters.channel.toLowerCase())) &&
      (!columnFilters.product || row.product.toLowerCase().includes(columnFilters.product.toLowerCase())) &&
      (!columnFilters.y2015_16 || row.y2015_16.toString().includes(columnFilters.y2015_16)) &&
      (!columnFilters.y2016_17 || row.y2016_17.toString().includes(columnFilters.y2016_17)) &&
      (!columnFilters.y2017_18 || row.y2017_18.toString().includes(columnFilters.y2017_18))
    );
  });

  const handleCopy = () => {
    const csv = [
      ['Channel', 'Product', '2015-16', '2016-17', '2017-18'],
      ...filteredData.map(row => [row.channel, row.product, row.y2015_16, row.y2016_17, row.y2017_18])
    ].map(row => row.join(',')).join('\n');
    navigator.clipboard.writeText(csv);
  };

  const handleDownload = () => {
    const csv = [
      ['Channel', 'Product', '2015-16', '2016-17', '2017-18'],
      ...filteredData.map(row => [row.channel, row.product, row.y2015_16, row.y2016_17, row.y2017_18])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'channel-product.csv';
    a.click();
  };

  return (
    <Card className="mb-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Chart */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{productName}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hfs" fill="#86EFAC" name="Channel : HFS" />
              <Bar dataKey="mr" fill="#4ADE80" name="Channel : MR" />
            </BarChart>
          </ResponsiveContainer>
        </div>

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

          <div className="overflow-x-auto" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Channel <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Product <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    2015-16 <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    2016-17 <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    2017-18 <span className="text-xs">↑↓</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">{row.channel}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.product}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.y2015_16}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.y2016_17}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.y2017_18}</td>
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
              value={columnFilters.product}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, product: e.target.value }))}
            />
            <input
              type="text"
              placeholder="All"
              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
              value={columnFilters.y2015_16}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, y2015_16: e.target.value }))}
            />
            <input
              type="text"
              placeholder="All"
              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
              value={columnFilters.y2016_17}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, y2016_17: e.target.value }))}
            />
            <input
              type="text"
              placeholder="All"
              className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
              value={columnFilters.y2017_18}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, y2017_18: e.target.value }))}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChannelProductSection;


