import React, { useState } from 'react';
import ButtonGroup from './shared/ButtonGroup';
import Card from './shared/Card';

const PerformanceKPISection = ({ data = { tableData: [] } }) => {
  const [accountFilter, setAccountFilter] = useState('All');
  const [periodMode, setPeriodMode] = useState('monthly'); // 'monthly' | 'quarterly' | 'yearly' | 'mtd' | 'qtd' | 'ytd'
  const [columnFilters, setColumnFilters] = useState({
    name: '',
    engagementScore: '',
    targetAchievement: '',
    productivityScore: '',
    cycleTime: '',
    leadGeneration: '',
    marginsImprovement: '',
    inquirySize: '',
    expense: '',
    attendance: '',
    closureRate: '',
  });

  const tableData = data?.tableData || [];
  const filteredData = tableData.filter(row => {
    return (
      (!columnFilters.name || row.name.toLowerCase().includes(columnFilters.name.toLowerCase())) &&
      (!columnFilters.engagementScore || row.engagementScore.toString().includes(columnFilters.engagementScore)) &&
      (!columnFilters.targetAchievement || row.targetAchievement.toString().includes(columnFilters.targetAchievement)) &&
      (!columnFilters.productivityScore || row.productivityScore.toString().includes(columnFilters.productivityScore)) &&
      (!columnFilters.cycleTime || row.cycleTime.toString().includes(columnFilters.cycleTime)) &&
      (!columnFilters.leadGeneration || row.leadGeneration.toString().includes(columnFilters.leadGeneration)) &&
      (!columnFilters.marginsImprovement || row.marginsImprovement.toString().includes(columnFilters.marginsImprovement)) &&
      (!columnFilters.inquirySize || row.inquirySize.toString().includes(columnFilters.inquirySize)) &&
      (!columnFilters.expense || row.expense.toString().includes(columnFilters.expense)) &&
      (!columnFilters.attendance || row.attendance.toString().includes(columnFilters.attendance)) &&
      (!columnFilters.closureRate || row.closureRate.toString().includes(columnFilters.closureRate))
    );
  });

  // Calculate max values for data bars
  const maxValues = {
    engagementScore: Math.max(...filteredData.map(r => r.engagementScore), 1),
    targetAchievement: Math.max(...filteredData.map(r => r.targetAchievement), 1),
    productivityScore: Math.max(...filteredData.map(r => r.productivityScore), 1),
    cycleTime: Math.max(...filteredData.map(r => r.cycleTime), 1),
    leadGeneration: Math.max(...filteredData.map(r => r.leadGeneration), 1),
    marginsImprovement: Math.max(...filteredData.map(r => r.marginsImprovement), 1),
    inquirySize: Math.max(...filteredData.map(r => r.inquirySize), 1),
    expense: Math.max(...filteredData.map(r => r.expense), 1),
    attendance: Math.max(...filteredData.map(r => r.attendance), 1),
    closureRate: Math.max(...filteredData.map(r => r.closureRate), 1),
  };

  const handleCopy = () => {
    const csv = [
      ['Name', 'EngagementScore', 'TargetAchievement', 'ProductivityScore', 'CycleTime', 'LeadGeneration', 'MarginsImprovement', 'InquirySize', 'Expense', 'Attendance', 'ClosureRate'],
      ...filteredData.map(row => [
        row.name,
        row.engagementScore,
        row.targetAchievement,
        row.productivityScore,
        row.cycleTime,
        row.leadGeneration,
        row.marginsImprovement,
        row.inquirySize,
        row.expense,
        row.attendance,
        row.closureRate,
      ])
    ].map(row => row.join(',')).join('\n');
    navigator.clipboard.writeText(csv);
  };

  const handleDownload = () => {
    const csv = [
      ['Name', 'EngagementScore', 'TargetAchievement', 'ProductivityScore', 'CycleTime', 'LeadGeneration', 'MarginsImprovement', 'InquirySize', 'Expense', 'Attendance', 'ClosureRate'],
      ...filteredData.map(row => [
        row.name,
        row.engagementScore,
        row.targetAchievement,
        row.productivityScore,
        row.cycleTime,
        row.leadGeneration,
        row.marginsImprovement,
        row.inquirySize,
        row.expense,
        row.attendance,
        row.closureRate,
      ])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'performance-kpi.csv';
    a.click();
  };

  return (
    <Card title="Performance KPI" className="mb-6">
      {/* Filters */}
      <div className="mb-6 flex gap-4 items-center flex-wrap">
        <select
          className="px-3 py-2 border border-gray-300 rounded text-sm"
          value={accountFilter}
          onChange={(e) => setAccountFilter(e.target.value)}
        >
          <option>All</option>
          <option>A1</option>
          <option>A2</option>
        </select>
        <ButtonGroup
          options={['Monthly', 'Quarterly', 'Yearly', 'MTD', 'QTD', 'YTD']}
          selected={periodMode === 'monthly' ? 'Monthly' : periodMode === 'quarterly' ? 'Quarterly' : periodMode === 'yearly' ? 'Yearly' : periodMode === 'mtd' ? 'MTD' : periodMode === 'qtd' ? 'QTD' : 'YTD'}
          onSelect={(val) => {
            const mapping = { 'Monthly': 'monthly', 'Quarterly': 'quarterly', 'Yearly': 'yearly', 'MTD': 'mtd', 'QTD': 'qtd', 'YTD': 'ytd' };
            setPeriodMode(mapping[val]);
          }}
        />
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
                Name <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                EngagementScore <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                TargetAchievement <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                ProductivityScore <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                CycleTime <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                LeadGeneration <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                MarginsImprovement <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                InquirySize <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Expense <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                Attendance <span className="text-xs">↑↓</span>
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                ClosureRate <span className="text-xs">↑↓</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2 font-semibold">{row.name}</td>
                <td className="border border-gray-300 px-4 py-2 relative">
                  <div className="flex items-center">
                    <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.engagementScore / maxValues.engagementScore) * 100}%` }}></div>
                    <span className="ml-2">{row.engagementScore}</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 relative">
                  <div className="flex items-center">
                    <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.targetAchievement / maxValues.targetAchievement) * 100}%` }}></div>
                    <span className="ml-2">{row.targetAchievement}</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 relative">
                  <div className="flex items-center">
                    <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.productivityScore / maxValues.productivityScore) * 100}%` }}></div>
                    <span className="ml-2">{row.productivityScore}</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 relative">
                  <div className="flex items-center">
                    <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.cycleTime / maxValues.cycleTime) * 100}%` }}></div>
                    <span className="ml-2">{row.cycleTime}</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 relative">
                  <div className="flex items-center">
                    <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.leadGeneration / maxValues.leadGeneration) * 100}%` }}></div>
                    <span className="ml-2">{row.leadGeneration}</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 relative">
                  <div className="flex items-center">
                    <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.marginsImprovement / maxValues.marginsImprovement) * 100}%` }}></div>
                    <span className="ml-2">{row.marginsImprovement}</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 relative">
                  <div className="flex items-center">
                    <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.inquirySize / maxValues.inquirySize) * 100}%` }}></div>
                    <span className="ml-2">{row.inquirySize}</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 relative">
                  <div className="flex items-center">
                    <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.expense / maxValues.expense) * 100}%` }}></div>
                    <span className="ml-2">{row.expense}</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 relative">
                  <div className="flex items-center">
                    <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.attendance / maxValues.attendance) * 100}%` }}></div>
                    <span className="ml-2">{row.attendance}</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 relative">
                  <div className="flex items-center">
                    <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.closureRate / maxValues.closureRate) * 100}%` }}></div>
                    <span className="ml-2">{row.closureRate}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 text-sm text-gray-600">Showing 1 to {filteredData.length} of {filteredData.length} entries</div>

      {/* Column Filters */}
      <div className="mt-4 flex gap-2 flex-wrap">
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
          value={columnFilters.name}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, name: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
          value={columnFilters.engagementScore}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, engagementScore: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
          value={columnFilters.targetAchievement}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, targetAchievement: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
          value={columnFilters.productivityScore}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, productivityScore: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
          value={columnFilters.cycleTime}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, cycleTime: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
          value={columnFilters.leadGeneration}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, leadGeneration: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
          value={columnFilters.marginsImprovement}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, marginsImprovement: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
          value={columnFilters.inquirySize}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, inquirySize: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
          value={columnFilters.expense}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, expense: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
          value={columnFilters.attendance}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, attendance: e.target.value }))}
        />
        <input
          type="text"
          placeholder="All"
          className="px-2 py-1 border border-gray-300 rounded text-sm flex-1 min-w-[100px]"
          value={columnFilters.closureRate}
          onChange={(e) => setColumnFilters(prev => ({ ...prev, closureRate: e.target.value }))}
        />
      </div>
    </Card>
  );
};

export default PerformanceKPISection;


