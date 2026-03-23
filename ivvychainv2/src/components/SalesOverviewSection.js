import React, { useRef, useState } from 'react';
import { AreaChart, Area, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ButtonGroup from './shared/ButtonGroup';
import Card from './shared/Card';
import DownloadButton from './shared/DownloadButton';
import { downloadVisualDashboard } from '../utils/visualDashboardDownload';

const SalesOverviewSection = ({ data, selectedYear, comparisonMode, onYearChange, onComparisonChange }) => {
  const dashboardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const dashboardData = {
        grossProfitYTD: data.grossProfitYTD || [],
        salesYTD: data.salesYTD || [],
        costYTD: data.costYTD || [],
        quantityYTD: data.quantityYTD || [],
        salesOverview: data.salesOverview || [],
        metrics: {
          totalSalesYTD: data.salesYTD?.reduce((sum, d) => sum + (d.current || 0), 0) || 0,
          totalGrossProfitYTD: data.grossProfitYTD?.[data.grossProfitYTD.length - 1]?.value || 0,
          avgGrossProfitPercent: data.salesOverview?.length > 0 ? (data.salesOverview.reduce((sum, d) => sum + (d.grossProfitPercent || 0), 0) / data.salesOverview.length).toFixed(2) : 0,
        },
      };
      const metadata = {
        filters: { selectedYear, comparisonMode },
        summary: {
          exportDate: new Date().toISOString(),
          reportType: 'Sales Overview Dashboard',
        },
      };
      await downloadVisualDashboard(dashboardRef.current, dashboardData, 'Sales Overview', metadata);
    } catch (error) {
      console.error('Error downloading dashboard:', error);
      alert('Failed to download dashboard. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div ref={dashboardRef}>
      <Card title="Sales Overview" className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-4">
            <ButtonGroup
              options={['2015', '2016', '2017']}
              selected={selectedYear}
              onSelect={onYearChange}
            />
            <ButtonGroup
              options={['Vs Prior', 'Vs Target']}
              selected={comparisonMode}
              onSelect={onComparisonChange}
            />
          </div>
          <DownloadButton
            onClick={handleDownload}
            isDownloading={isDownloading}
            title="Download dashboard with metadata for HBMP AgentBot"
          />
        </div>

      {/* Small Area Charts */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Gross Profit YTD vs Prior/Target</h4>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={data.grossProfitYTD}>
              <Area type="monotone" dataKey="value" stroke="#FBBF24" fill="#FBBF24" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Sales YTD vs Prior/Target</h4>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={data.salesYTD}>
              <Area type="monotone" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="priorTarget" stroke="#FBBF24" fill="#FBBF24" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Cost YTD vs Prior/Target</h4>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={data.costYTD}>
              <Area type="monotone" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="priorTarget" stroke="#FBBF24" fill="#FBBF24" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Quantity YTD vs Prior/Target</h4>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={data.quantityYTD}>
              <Area type="monotone" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="priorTarget" stroke="#FBBF24" fill="#FBBF24" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Large Mixed Chart */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Sales Overview</h4>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data.salesOverview}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="sales" fill="#3B82F6" />
            <Bar yAxisId="left" dataKey="lySales" fill="#FBBF24" />
            <Line yAxisId="right" type="monotone" dataKey="grossProfitPercent" stroke="#10B981" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
    </div>
  );
};

export default SalesOverviewSection;

