import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
} from 'recharts';
import ButtonGroup from './shared/ButtonGroup';

const ReceivablesFiltersView = ({ data, timeGrouping, year, onTimeGroupingChange, onYearChange }) => {
  // KPIs
  const kpis = data?.summary || {
    balance: 4250000,
    overdue: 3000000,
    overduePercent: 61,
  };

  // Chart data
  const balanceData = data?.balance || [];
  const beforeDueOverdueData = data?.beforeDueOverdue || [];
  const overduePercentData = data?.overduePercent || [];
  const avgPaymentTermsData = data?.avgPaymentTerms || [];
  const averageDueDaysData = data?.averageDueDays || [];
  const receivableTurnoverData = data?.receivableTurnover || [];
  const customerNetChangeData = data?.customerNetChange || [];
  const salesInReceivablesData = data?.salesInReceivables || [];
  const salesOnCreditData = data?.salesOnCredit || [];

  return (
    <div>
      {/* Controls */}
      <div className="mb-6">
        <div className="mb-4">
          <ButtonGroup
            options={['Year', 'Qtr', 'Month']}
            selected={timeGrouping === 'year' ? 'Year' : timeGrouping === 'quarter' ? 'Qtr' : 'Month'}
            onSelect={(val) => {
              const mapping = { 'Year': 'year', 'Qtr': 'quarter', 'Month': 'month' };
              onTimeGroupingChange(mapping[val]);
            }}
          />
        </div>
        <div>
          <ButtonGroup
            options={['2014', '2015', '2016', '2017']}
            selected={year.toString()}
            onSelect={(val) => onYearChange(parseInt(val))}
          />
        </div>
      </div>

      {/* KPIs */}
      <div className="flex items-center justify-center gap-8 mb-8 py-4 border-t border-b">
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

      {/* Charts Grid */}
      <div className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Balance</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={balanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FBBF24" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Before Due and Overdue</h4>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={beforeDueOverdueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="beforeDue" fill="#3B82F6" name="Before Due" />
                <Bar dataKey="overdue" fill="#FBBF24" name="Overdue" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2 - Overdue % */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Overdue %</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={overduePercentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="y2014" stroke="#EF4444" name="2014" />
              <Line type="monotone" dataKey="y2015" stroke="#10B981" name="2015" />
              <Line type="monotone" dataKey="y2016" stroke="#FBBF24" name="2016" />
              <Line type="monotone" dataKey="y2017" stroke="#3B82F6" name="2017" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Avg Payment Terms</h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={avgPaymentTermsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" fill="#FBBF24" stroke="#FBBF24" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Average Due (Days)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={averageDueDaysData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" fill="#3B82F6" stroke="#3B82F6" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Receivable TurnOver (Days)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={receivableTurnoverData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="year" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Customer Net Change</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={customerNetChangeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 5 */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Sales (in Receivables)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesInReceivablesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FBBF24" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Sales on Credit %</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesOnCreditData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivablesFiltersView;

