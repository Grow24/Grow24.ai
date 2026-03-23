import React, { useState } from 'react';
import Card from './shared/Card';

const Top10InquiriesSection = ({ data }) => {
  const [columnFilters, setColumnFilters] = useState({
    accountName: '',
    bestGuessAmount: '',
    probability: '',
    amount: '',
    stage: '',
    days: '',
  });

  const filteredData = data.tableData.filter(row => {
    return (
      (!columnFilters.accountName || row.accountName.toLowerCase().includes(columnFilters.accountName.toLowerCase())) &&
      (!columnFilters.bestGuessAmount || row.bestGuessAmount.toString().includes(columnFilters.bestGuessAmount)) &&
      (!columnFilters.probability || row.probability.toString().includes(columnFilters.probability)) &&
      (!columnFilters.amount || row.amount.toString().includes(columnFilters.amount)) &&
      (!columnFilters.stage || row.stage.toString().includes(columnFilters.stage)) &&
      (!columnFilters.days || row.days.toString().includes(columnFilters.days))
    );
  });

  const maxProbability = Math.max(...filteredData.map(r => r.probability), 1);
  const maxAmount = Math.max(...filteredData.map(r => r.amount), 1);

  const handleCopy = () => {
    const csv = [
      ['Account_Name', 'Best_Guess_Amount', 'Probability', 'Amount', 'Stage', 'Days'],
      ...filteredData.map(row => [
        row.accountName,
        row.bestGuessAmount,
        row.probability,
        row.amount,
        row.stage,
        row.days,
      ])
    ].map(row => row.join(',')).join('\n');
    navigator.clipboard.writeText(csv);
  };

  const handleDownload = () => {
    const csv = [
      ['Account_Name', 'Best_Guess_Amount', 'Probability', 'Amount', 'Stage', 'Days'],
      ...filteredData.map(row => [
        row.accountName,
        row.bestGuessAmount,
        row.probability,
        row.amount,
        row.stage,
        row.days,
      ])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'top-10-inquiries.csv';
    a.click();
  };

  return (
    <Card title="Top 10 Inquiries" className="mb-6">
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
                Account_Name <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Best_Guess_Amount <span className="text-xs">↑↓</span>
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
            {filteredData.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2 font-semibold">{row.accountName}</td>
                <td className="border border-gray-300 px-4 py-2">{row.bestGuessAmount.toFixed(1)}</td>
                <td className="border border-gray-300 px-4 py-2 relative">
                  <div className="flex items-center">
                    <div className="flex-1 bg-pink-200 h-4 rounded" style={{ width: `${(row.probability / maxProbability) * 100}%` }}></div>
                    <span className="ml-2">{row.probability.toFixed(2)}</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 relative">
                  <div className="flex items-center">
                    <div className="flex-1 bg-orange-200 h-4 rounded" style={{ width: `${(row.amount / maxAmount) * 100}%` }}></div>
                    <span className="ml-2">{row.amount.toLocaleString()}</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">{row.stage}</td>
                <td className="border border-gray-300 px-4 py-2">{row.days}</td>
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
          value={columnFilters.accountName}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, accountName: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.bestGuessAmount}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, bestGuessAmount: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.probability}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, probability: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
          value={columnFilters.amount}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, amount: e.target.value }))}
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
          value={columnFilters.days}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, days: e.target.value }))}
        />
      </div>
    </Card>
  );
};

export default Top10InquiriesSection;


