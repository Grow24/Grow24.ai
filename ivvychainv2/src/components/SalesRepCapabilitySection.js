import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import Card from './shared/Card';

const SalesRepCapabilitySection = ({ data }) => {
  const [columnFilters, setColumnFilters] = useState({
    name: '',
    engagementScore: '',
    targetAchievement: '',
    productivityScore: '',
    cycleTime: '',
    leadGeneration: '',
  });

  const filteredData = data.tableData.filter(row => {
    return (
      (!columnFilters.name || row.name.toLowerCase().includes(columnFilters.name.toLowerCase())) &&
      (!columnFilters.engagementScore || row.engagementScore.toString().includes(columnFilters.engagementScore)) &&
      (!columnFilters.targetAchievement || row.targetAchievement.toString().includes(columnFilters.targetAchievement)) &&
      (!columnFilters.productivityScore || row.productivityScore.toString().includes(columnFilters.productivityScore)) &&
      (!columnFilters.cycleTime || row.cycleTime.toString().includes(columnFilters.cycleTime)) &&
      (!columnFilters.leadGeneration || row.leadGeneration.toString().includes(columnFilters.leadGeneration))
    );
  });

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
    a.download = 'sales-rep-capability.csv';
    a.click();
  };

  return (
    <Card title="Sales Rep Capability" className="mb-6">
      {/* Radar Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Sales Rep Capability</h4>
        <ResponsiveContainer width="100%" height={500}>
          <RadarChart data={data.radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="competency" />
            <PolarRadiusAxis angle={90} domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Radar name="Shiv" dataKey="shiv" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
            <Radar name="Aditya" dataKey="aditya" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
          </RadarChart>
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
            {filteredData.map((row, index) => {
              const maxEngagement = Math.max(...filteredData.map(r => r.engagementScore), 1);
              const maxTarget = Math.max(...filteredData.map(r => r.targetAchievement), 1);
              const maxProductivity = Math.max(...filteredData.map(r => r.productivityScore), 1);
              const maxCycle = Math.max(...filteredData.map(r => r.cycleTime), 1);
              const maxLead = Math.max(...filteredData.map(r => r.leadGeneration), 1);
              const maxMargins = Math.max(...filteredData.map(r => r.marginsImprovement), 1);
              const maxInquiry = Math.max(...filteredData.map(r => r.inquirySize), 1);
              const maxExpense = Math.max(...filteredData.map(r => r.expense), 1);
              const maxAttendance = Math.max(...filteredData.map(r => r.attendance), 1);
              const maxClosure = Math.max(...filteredData.map(r => r.closureRate), 1);

              return (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">{row.name}</td>
                  <td className="border border-gray-300 px-4 py-2 relative">
                    <div className="flex items-center">
                      <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.engagementScore / maxEngagement) * 100}%` }}></div>
                      <span className="ml-2">{row.engagementScore}</span>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 relative">
                    <div className="flex items-center">
                      <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.targetAchievement / maxTarget) * 100}%` }}></div>
                      <span className="ml-2">{row.targetAchievement}</span>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 relative">
                    <div className="flex items-center">
                      <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.productivityScore / maxProductivity) * 100}%` }}></div>
                      <span className="ml-2">{row.productivityScore}</span>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 relative">
                    <div className="flex items-center">
                      <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.cycleTime / maxCycle) * 100}%` }}></div>
                      <span className="ml-2">{row.cycleTime}</span>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 relative">
                    <div className="flex items-center">
                      <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.leadGeneration / maxLead) * 100}%` }}></div>
                      <span className="ml-2">{row.leadGeneration}</span>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 relative">
                    <div className="flex items-center">
                      <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.marginsImprovement / maxMargins) * 100}%` }}></div>
                      <span className="ml-2">{row.marginsImprovement}</span>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 relative">
                    <div className="flex items-center">
                      <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.inquirySize / maxInquiry) * 100}%` }}></div>
                      <span className="ml-2">{row.inquirySize}</span>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 relative">
                    <div className="flex items-center">
                      <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.expense / maxExpense) * 100}%` }}></div>
                      <span className="ml-2">{row.expense}</span>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 relative">
                    <div className="flex items-center">
                      <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.attendance / maxAttendance) * 100}%` }}></div>
                      <span className="ml-2">{row.attendance}</span>
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 relative">
                    <div className="flex items-center">
                      <div className="flex-1 bg-blue-200 h-4 rounded" style={{ width: `${(row.closureRate / maxClosure) * 100}%` }}></div>
                      <span className="ml-2">{row.closureRate}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
      </div>
    </Card>
  );
};

export default SalesRepCapabilitySection;


