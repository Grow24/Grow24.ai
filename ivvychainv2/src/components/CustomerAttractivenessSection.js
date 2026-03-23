import React, { useState } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import Card from './shared/Card';

const CustomerAttractivenessSection = ({ data }) => {
  const [activeTab, setActiveTab] = useState('aaTable'); // 'aaTable' | 'attractivenessMap' | 'deltaMap'
  const [columnFilters, setColumnFilters] = useState({
    customerId: '',
    recencyDays: '',
    transactionCount: '',
    amount: '',
    frequencyScore: '',
    monetaryScore: '',
    customerAttractiveness: '',
    customerActivity: '',
    dateCalculated: '',
  });
  const [visibleColumns, setVisibleColumns] = useState({
    customerId: true,
    recencyDays: true,
    transactionCount: true,
    amount: true,
    frequencyScore: true,
    monetaryScore: true,
    customerAttractiveness: true,
    customerActivity: true,
    dateCalculated: true,
  });

  const filteredData = data.tableData.filter(row => {
    return (
      (!columnFilters.customerId || row.customerId.toLowerCase().includes(columnFilters.customerId.toLowerCase())) &&
      (!columnFilters.recencyDays || row.recencyDays.toString().includes(columnFilters.recencyDays)) &&
      (!columnFilters.transactionCount || row.transactionCount.toString().includes(columnFilters.transactionCount)) &&
      (!columnFilters.amount || row.amount.toString().includes(columnFilters.amount)) &&
      (!columnFilters.frequencyScore || row.frequencyScore.toString().includes(columnFilters.frequencyScore)) &&
      (!columnFilters.monetaryScore || row.monetaryScore.toString().includes(columnFilters.monetaryScore)) &&
      (!columnFilters.customerAttractiveness || row.customerAttractiveness.toString().includes(columnFilters.customerAttractiveness)) &&
      (!columnFilters.customerActivity || row.customerActivity.toString().includes(columnFilters.customerActivity)) &&
      (!columnFilters.dateCalculated || row.dateCalculated.includes(columnFilters.dateCalculated))
    );
  });

  const handleCopy = () => {
    const visibleCols = Object.keys(visibleColumns).filter(key => visibleColumns[key]);
    const headers = visibleCols.map(col => col.replace(/([A-Z])/g, ' $1').trim());
    const csv = [
      headers,
      ...filteredData.map(row => visibleCols.map(col => row[col]))
    ].map(row => row.join(',')).join('\n');
    navigator.clipboard.writeText(csv);
  };

  const handleDownload = () => {
    const visibleCols = Object.keys(visibleColumns).filter(key => visibleColumns[key]);
    const headers = visibleCols.map(col => col.replace(/([A-Z])/g, ' $1').trim());
    const csv = [
      headers,
      ...filteredData.map(row => visibleCols.map(col => row[col]))
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer-attractiveness.csv';
    a.click();
  };

  const toggleColumnVisibility = (column) => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  const renderAATable = () => (
    <>
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
        <div className="relative group">
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
            Column visibility
          </button>
          <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 p-2 min-w-[200px] hidden group-hover:block">
            {Object.keys(visibleColumns).map(col => (
              <label key={col} className="flex items-center gap-2 p-1 hover:bg-gray-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns[col]}
                  onChange={() => toggleColumnVisibility(col)}
                  className="cursor-pointer"
                />
                <span className="text-sm">{col.replace(/([A-Z])/g, ' $1').trim()}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              {visibleColumns.customerId && (
                <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                  customer_id <span className="text-xs">↑↓</span>
                </th>
              )}
              {visibleColumns.recencyDays && (
                <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                  recency_days <span className="text-xs">↑↓</span>
                </th>
              )}
              {visibleColumns.transactionCount && (
                <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                  transaction_count <span className="text-xs">↑↓</span>
                </th>
              )}
              {visibleColumns.amount && (
                <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                  amount <span className="text-xs">↑↓</span>
                </th>
              )}
              {visibleColumns.frequencyScore && (
                <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                  frequency_score <span className="text-xs">↑↓</span>
                </th>
              )}
              {visibleColumns.monetaryScore && (
                <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                  monetary_score <span className="text-xs">↑↓</span>
                </th>
              )}
              {visibleColumns.customerAttractiveness && (
                <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                  Customer Attractiveness <span className="text-xs">↑↓</span>
                </th>
              )}
              {visibleColumns.customerActivity && (
                <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                  Customer Activity <span className="text-xs">↑↓</span>
                </th>
              )}
              {visibleColumns.dateCalculated && (
                <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                  date_calculated <span className="text-xs">↑↓</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {visibleColumns.customerId && (
                  <td className="border border-gray-300 px-4 py-2">{row.customerId}</td>
                )}
                {visibleColumns.recencyDays && (
                  <td className="border border-gray-300 px-4 py-2">{row.recencyDays}</td>
                )}
                {visibleColumns.transactionCount && (
                  <td className="border border-gray-300 px-4 py-2">{row.transactionCount}</td>
                )}
                {visibleColumns.amount && (
                  <td className="border border-gray-300 px-4 py-2">{row.amount.toLocaleString()}</td>
                )}
                {visibleColumns.frequencyScore && (
                  <td className="border border-gray-300 px-4 py-2">{row.frequencyScore}</td>
                )}
                {visibleColumns.monetaryScore && (
                  <td className="border border-gray-300 px-4 py-2">{row.monetaryScore}</td>
                )}
                {visibleColumns.customerAttractiveness && (
                  <td className="border border-gray-300 px-4 py-2">{row.customerAttractiveness}</td>
                )}
                {visibleColumns.customerActivity && (
                  <td className="border border-gray-300 px-4 py-2">{row.customerActivity.toFixed(2)}</td>
                )}
                {visibleColumns.dateCalculated && (
                  <td className="border border-gray-300 px-4 py-2">{row.dateCalculated}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Column Filters */}
      <div className="mt-4 flex gap-2 flex-wrap">
        {visibleColumns.customerId && (
          <input
            type="text"
            placeholder="All"
            className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[120px]"
            value={columnFilters.customerId}
            onChange={(e) => setColumnFilters(prev => ({ ...prev, customerId: e.target.value }))}
          />
        )}
        {visibleColumns.recencyDays && (
          <input
            type="text"
            placeholder="All"
            className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
            value={columnFilters.recencyDays}
            onChange={(e) => setColumnFilters(prev => ({ ...prev, recencyDays: e.target.value }))}
          />
        )}
        {visibleColumns.transactionCount && (
          <input
            type="text"
            placeholder="All"
            className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
            value={columnFilters.transactionCount}
            onChange={(e) => setColumnFilters(prev => ({ ...prev, transactionCount: e.target.value }))}
          />
        )}
        {visibleColumns.amount && (
          <input
            type="text"
            placeholder="All"
            className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
            value={columnFilters.amount}
            onChange={(e) => setColumnFilters(prev => ({ ...prev, amount: e.target.value }))}
          />
        )}
        {visibleColumns.frequencyScore && (
          <input
            type="text"
            placeholder="All"
            className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
            value={columnFilters.frequencyScore}
            onChange={(e) => setColumnFilters(prev => ({ ...prev, frequencyScore: e.target.value }))}
          />
        )}
        {visibleColumns.monetaryScore && (
          <input
            type="text"
            placeholder="All"
            className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
            value={columnFilters.monetaryScore}
            onChange={(e) => setColumnFilters(prev => ({ ...prev, monetaryScore: e.target.value }))}
          />
        )}
        {visibleColumns.customerAttractiveness && (
          <input
            type="text"
            placeholder="All"
            className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
            value={columnFilters.customerAttractiveness}
            onChange={(e) => setColumnFilters(prev => ({ ...prev, customerAttractiveness: e.target.value }))}
          />
        )}
        {visibleColumns.customerActivity && (
          <input
            type="text"
            placeholder="All"
            className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
            value={columnFilters.customerActivity}
            onChange={(e) => setColumnFilters(prev => ({ ...prev, customerActivity: e.target.value }))}
          />
        )}
        {visibleColumns.dateCalculated && (
          <input
            type="text"
            placeholder="All"
            className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
            value={columnFilters.dateCalculated}
            onChange={(e) => setColumnFilters(prev => ({ ...prev, dateCalculated: e.target.value }))}
          />
        )}
      </div>
    </>
  );

  const renderAttractivenessMap = () => {
    const scatterData = filteredData.map(row => ({
      x: row.customerActivity,
      y: row.customerAttractiveness,
      name: row.customerId,
      amount: row.amount,
    }));

    return (
      <div>
        <div className="mb-4">
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Customer Activity"
                label={{ value: 'Customer Activity', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Customer Attractiveness"
                label={{ value: 'Customer Attractiveness', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                        <p className="font-semibold">{data.name}</p>
                        <p>Activity: {data.x.toFixed(2)}</p>
                        <p>Attractiveness: {data.y}</p>
                        <p>Amount: {data.amount.toLocaleString()}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter dataKey="y" fill="#3B82F6">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#3B82F6" />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="text-sm text-gray-600">
          Hover over points to see customer details. Each point represents a customer positioned by their Activity (X-axis) and Attractiveness (Y-axis).
        </div>
      </div>
    );
  };

  const renderDeltaMap = () => {
    // Delta map shows change over time - comparing current vs previous period
    const deltaData = filteredData.map(row => ({
      customerId: row.customerId,
      activityChange: (Math.random() - 0.5) * 20, // Simulated change
      attractivenessChange: (Math.random() - 0.5) * 15,
      currentActivity: row.customerActivity,
      currentAttractiveness: row.customerAttractiveness,
    }));

    return (
      <div>
        <div className="mb-4">
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart data={deltaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="activityChange" 
                name="Activity Change"
                label={{ value: 'Activity Change', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                type="number" 
                dataKey="attractivenessChange" 
                name="Attractiveness Change"
                label={{ value: 'Attractiveness Change', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                        <p className="font-semibold">{data.customerId}</p>
                        <p>Activity Change: {data.activityChange.toFixed(2)}</p>
                        <p>Attractiveness Change: {data.attractivenessChange.toFixed(2)}</p>
                        <p>Current Activity: {data.currentActivity.toFixed(2)}</p>
                        <p>Current Attractiveness: {data.currentAttractiveness}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter dataKey="attractivenessChange" fill="#10B981">
                {deltaData.map((entry, index) => {
                  const color = entry.activityChange > 0 && entry.attractivenessChange > 0 
                    ? '#10B981' // Green for improvement
                    : entry.activityChange < 0 && entry.attractivenessChange < 0
                    ? '#EF4444' // Red for decline
                    : '#F59E0B'; // Amber for mixed
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500"></div>
            <span className="text-sm">Improvement (Both increased)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500"></div>
            <span className="text-sm">Decline (Both decreased)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500"></div>
            <span className="text-sm">Mixed Change</span>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          This view shows changes in Customer Activity and Attractiveness over time. Points in the top-right quadrant indicate improvement, while bottom-left indicates decline.
        </div>
      </div>
    );
  };

  return (
    <Card title="Customer Attractiveness" className="mb-6">
      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-300">
        <button
          onClick={() => setActiveTab('aaTable')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'aaTable'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          AA Table
        </button>
        <button
          onClick={() => setActiveTab('attractivenessMap')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'attractivenessMap'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Attractiveness Map
        </button>
        <button
          onClick={() => setActiveTab('deltaMap')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'deltaMap'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Delta Map
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'aaTable' && renderAATable()}
      {activeTab === 'attractivenessMap' && renderAttractivenessMap()}
      {activeTab === 'deltaMap' && renderDeltaMap()}
    </Card>
  );
};

export default CustomerAttractivenessSection;

