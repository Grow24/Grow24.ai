import React, { useState, useRef } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ButtonGroup from './shared/ButtonGroup';
import Card from './shared/Card';
import DownloadButton from './shared/DownloadButton';
import { downloadDashboard, prepareDashboardMetadata } from '../utils/dashboardDownload';
import { downloadInteractiveDashboard } from '../utils/interactiveDashboardDownload';

const ForecastingSection = ({ data }) => {
  const dashboardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [flu, setFlu] = useState('FLU1');
  const [account, setAccount] = useState('All');
  const [metric, setMetric] = useState('Cum. Forecasting vs Cum. Actual');
  const [timeGrouping, setTimeGrouping] = useState('month'); // 'year' | 'quarter' | 'month'

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const dashboardData = {
        forecastData: data || [],
        metrics: {
          totalForecasting: data?.reduce((sum, d) => sum + (d.cumForecasting || 0), 0) || 0,
          totalActual: data?.reduce((sum, d) => sum + (d.cumActual || 0), 0) || 0,
          variance: data?.length > 0 ? (data[data.length - 1]?.cumForecasting - data[data.length - 1]?.cumActual).toFixed(2) : 0,
        },
      };
      const metadata = {
        filters: { flu, account, metric, timeGrouping },
        summary: {
          exportDate: new Date().toISOString(),
          reportType: 'Forecasting Analysis',
        },
      };
      await downloadInteractiveDashboard(dashboardData, 'Forecasting', metadata);
    } catch (error) {
      console.error('Error downloading dashboard:', error);
      alert('Failed to download dashboard. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div ref={dashboardRef}>
      <Card title="Forecasting" className="mb-6">
        <div className="mb-4 flex items-center justify-end">
          <DownloadButton
            onClick={handleDownload}
            isDownloading={isDownloading}
            title="Download Forecasting dashboard with metadata for HBMP AgentBot"
          />
        </div>
      {/* Filters */}
      <div className="mb-6 flex gap-4 items-center flex-wrap">
        <select
          className="px-3 py-2 border border-gray-300 rounded text-sm"
          value={flu}
          onChange={(e) => setFlu(e.target.value)}
        >
          <option>FLU1</option>
          <option>FLU2</option>
          <option>FLU3</option>
        </select>
        <select
          className="px-3 py-2 border border-gray-300 rounded text-sm"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
        >
          <option>All</option>
          <option>A1</option>
          <option>A2</option>
        </select>
        <select
          className="px-3 py-2 border border-gray-300 rounded text-sm"
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
        >
          <option>Cum. Forecasting vs Cum. Actual</option>
          <option>Pipeline vs Target</option>
        </select>
        <div className="ml-auto">
          <ButtonGroup
            options={['Year', 'Qtr', 'Month']}
            selected={timeGrouping === 'year' ? 'Year' : timeGrouping === 'quarter' ? 'Qtr' : 'Month'}
            onSelect={(val) => {
              const mapping = { 'Year': 'year', 'Qtr': 'quarter', 'Month': 'month' };
              setTimeGrouping(mapping[val]);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Main Chart */}
        <div className="col-span-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Cumulative Forecasting vs Cumulative Actual</h4>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data.mainChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis label={{ value: 'Values (M)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cumulativeActual" stroke="#EF4444" strokeWidth={2} name="Cumulative Actual" />
              <Line type="monotone" dataKey="cumulativeForecasting" stroke="#3B82F6" strokeWidth={2} name="Cumulative Forecasting" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Side Charts */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Industry Group</h4>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={data.industryGroup}>
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Territory</h4>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={data.territory}>
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="mt-6 space-y-4">
        {/* Forecast Table */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Forecast</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold">Parameter</th>
                  {data.forecastTable?.months?.map((month, idx) => (
                    <th key={idx} className="border border-gray-300 px-4 py-2 text-left font-bold">{month}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Forecast</td>
                  {data.forecastTable?.values?.map((value, idx) => (
                    <td key={idx} className="border border-gray-300 px-4 py-2">{value}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Target/Actual/Pipeline Table */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Target / Actual / Pipeline</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left font-bold">Parameter</th>
                  {data.targetTable?.months?.map((month, idx) => (
                    <th key={idx} className="border border-gray-300 px-4 py-2 text-left font-bold">{month}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Target</td>
                  {data.targetTable?.target?.map((value, idx) => (
                    <td key={idx} className="border border-gray-300 px-4 py-2">{value}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Actual</td>
                  {data.targetTable?.actual?.map((value, idx) => (
                    <td key={idx} className="border border-gray-300 px-4 py-2">{value}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Pipeline</td>
                  {data.targetTable?.pipeline?.map((value, idx) => (
                    <td key={idx} className="border border-gray-300 px-4 py-2">{value}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
    </div>
  );
};

export default ForecastingSection;


