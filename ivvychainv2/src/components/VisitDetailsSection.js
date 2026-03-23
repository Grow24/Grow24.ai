import React, { useState } from 'react';
import Card from './shared/Card';
import ButtonGroup from './shared/ButtonGroup';

const VisitDetailsSection = ({ data }) => {
  const [viewMode, setViewMode] = useState('visitsOnly'); // 'visitsOnly' | 'allInq' | 'allAccounts'
  const [periodMode, setPeriodMode] = useState('weekly'); // 'weekly' | 'monthly' | 'quarterly'
  const [colorMode, setColorMode] = useState('inqStages'); // 'inqStages' | 'byValue' | 'visitStatus'
  const [accountFilter, setAccountFilter] = useState('All');
  const [nameFilter, setNameFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('2016-12-31');
  const [dateTo, setDateTo] = useState('2017-01-11');

  const getCellColor = (value) => {
    if (colorMode === 'inqStages') {
      // Green for high values, red for low
      if (value > 800) return 'bg-green-500';
      if (value > 600) return 'bg-green-400';
      if (value > 400) return 'bg-yellow-400';
      if (value > 200) return 'bg-orange-400';
      return 'bg-red-400';
    } else if (colorMode === 'byValue') {
      // Similar logic but different thresholds
      if (value > 700) return 'bg-green-500';
      if (value > 500) return 'bg-green-400';
      if (value > 300) return 'bg-yellow-400';
      if (value > 100) return 'bg-orange-400';
      return 'bg-red-400';
    } else {
      // Visit Status mode
      if (value > 750) return 'bg-green-500';
      if (value > 550) return 'bg-green-400';
      if (value > 350) return 'bg-yellow-400';
      if (value > 150) return 'bg-orange-400';
      return 'bg-red-400';
    }
  };

  const heatmapData = data?.heatmap || [];
  const tableData = data?.table || [];

  return (
    <Card title="VISIT DETAILS" className="mb-6">
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4 items-center flex-wrap">
          <select
            className="px-3 py-2 border border-gray-300 rounded text-sm"
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
          >
            <option>All</option>
            <option>Account</option>
            <option>Lead</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded text-sm"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          >
            <option>All</option>
          </select>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Select Date Range</label>
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
        </div>

        {/* View Mode Buttons */}
        <div>
          <ButtonGroup
            options={['Visits Only', 'All Inq', 'All Accounts']}
            selected={viewMode === 'visitsOnly' ? 'Visits Only' : viewMode === 'allInq' ? 'All Inq' : 'All Accounts'}
            onSelect={(val) => {
              const mapping = { 'Visits Only': 'visitsOnly', 'All Inq': 'allInq', 'All Accounts': 'allAccounts' };
              setViewMode(mapping[val]);
            }}
          />
        </div>

        {/* Period Mode Buttons */}
        <div>
          <ButtonGroup
            options={['Weekly', 'Monthly', 'Quaterly']}
            selected={periodMode === 'weekly' ? 'Weekly' : periodMode === 'monthly' ? 'Monthly' : 'Quaterly'}
            onSelect={(val) => {
              const mapping = { 'Weekly': 'weekly', 'Monthly': 'monthly', 'Quaterly': 'quarterly' };
              setPeriodMode(mapping[val]);
            }}
          />
        </div>

        {/* Color Mode Buttons */}
        <div>
          <label className="text-sm text-gray-600 mb-2 block">Choose color</label>
          <ButtonGroup
            options={['Inq Stages', 'By Value', 'Visit Status']}
            selected={colorMode === 'inqStages' ? 'Inq Stages' : colorMode === 'byValue' ? 'By Value' : 'Visit Status'}
            onSelect={(val) => {
              const mapping = { 'Inq Stages': 'inqStages', 'By Value': 'byValue', 'Visit Status': 'visitStatus' };
              setColorMode(mapping[val]);
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-4 flex gap-2">
        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
          Copy
        </button>
        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
          Print
        </button>
        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
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
          <div className="overflow-x-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-2 py-1 text-xs font-bold"></th>
                  {data?.dateColumns?.map((date, idx) => (
                    <th key={idx} className="border border-gray-300 px-2 py-1 text-xs font-bold">
                      {date}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    <td className="border border-gray-300 px-2 py-1 text-xs font-bold">{row.label}</td>
                    {row.values.map((value, colIdx) => (
                      <td
                        key={colIdx}
                        className={`border border-gray-300 px-2 py-1 text-xs text-center ${getCellColor(value)} text-white`}
                      >
                        {value}
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
          <div className="overflow-x-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Account Name <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Best Guess Amount <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Probability <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Amount <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Stage <span className="text-xs">↑↓</span>
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                    Days <span className="text-xs">↑↓</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">{row.accountName}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.bestGuessAmount.toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.probability.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.amount.toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.stage}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VisitDetailsSection;


