import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area } from 'recharts';

const ReceivablesDrilldownView = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState('balanceByOverdue');

  // Mini chart thumbnails for left strip
  const leftThumbnails = [
    { id: 'balanceByOverdue', title: 'Balance by Overdue', type: 'bar' },
    { id: 'balance', title: 'Balance', type: 'bar' },
    { id: 'avgReceivables', title: 'Avg Receivables', type: 'line' },
    { id: 'beforeDueOverdue', title: 'Before Due and Overdue', type: 'bar' },
    { id: 'overduePercent', title: 'Overdue %', type: 'line' },
    { id: 'avgPaymentTerms', title: 'Avg Payment Terms', type: 'area' },
    { id: 'averageDueDays', title: 'Average Due (Days)', type: 'area' },
    { id: 'receivableTurnover', title: 'Receivable Turnover (Days)', type: 'bar' },
    { id: 'receivableCoefficient', title: 'Receivable Coefficient', type: 'bar' },
    { id: 'salesInReceivables', title: 'Sales (in Receivables)', type: 'bar' },
    { id: 'salesOnCredit', title: 'Sales on Credit %', type: 'line' },
    { id: 'customerNetChange', title: 'Customer Net Change', type: 'bar' },
  ];

  // Mini chart thumbnails for right strip
  const rightThumbnails = [
    { id: 'balanceBySalesPerson', title: 'Balance by SalesPerson', type: 'bar' },
  ];

  const renderMiniChart = (thumbnail) => {
    const chartData = data?.[thumbnail.id] || [];
    const isSelected = selectedMetric === thumbnail.id;

    return (
      <div
        key={thumbnail.id}
        onClick={() => setSelectedMetric(thumbnail.id)}
        className={`p-2 mb-2 border rounded cursor-pointer transition-all ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="text-xs font-semibold mb-1">{thumbnail.title}</div>
        <ResponsiveContainer width="100%" height={60}>
          {thumbnail.type === 'bar' && (
            <BarChart data={chartData.slice(0, 5)}>
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          )}
          {thumbnail.type === 'line' && (
            <LineChart data={chartData.slice(0, 5)}>
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
            </LineChart>
          )}
          {thumbnail.type === 'area' && (
            <AreaChart data={chartData.slice(0, 5)}>
              <Area type="monotone" dataKey="value" fill="#3B82F6" fillOpacity={0.6} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  const kpis = data?.summary || {
    balance: 4250000,
    overdue: 3000000,
    overduePercent: 61,
  };

  return (
    <div className="flex gap-4">
      {/* Left Thumbnail Strip */}
      <div className="w-48" style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {leftThumbnails.map(renderMiniChart)}
      </div>

      {/* Center KPIs */}
      <div className="flex-1 flex items-center justify-center gap-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{(kpis.balance / 1000000).toFixed(2)} M</div>
          <div className="text-sm text-gray-600 mt-1">Balance</div>
        </div>
        <div className="w-px h-16 bg-gray-300"></div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{(kpis.overdue / 1000000).toFixed(0)} M</div>
          <div className="text-sm text-gray-600 mt-1">Overdue</div>
        </div>
        <div className="w-px h-16 bg-gray-300"></div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{kpis.overduePercent} %</div>
          <div className="text-sm text-gray-600 mt-1">Overdue %</div>
        </div>
      </div>

      {/* Right Thumbnail Strip */}
      <div className="w-48" style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {rightThumbnails.map(renderMiniChart)}
      </div>
    </div>
  );
};

export default ReceivablesDrilldownView;


