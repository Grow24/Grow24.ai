import React, { useRef, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ButtonGroup from './shared/ButtonGroup';
import Card from './shared/Card';
import DownloadButton from './shared/DownloadButton';
import { downloadVisualDashboard } from '../utils/visualDashboardDownload';

const QuickOverviewSection = ({ 
  data = {
    salesProfit: [],
    grossProfit: []
  }, 
  selectedYear = '2017', 
  selectedQuarter = 'Q1', 
  comparisonMode = 'Vs Prior', 
  onYearChange = () => {}, 
  onQuarterChange = () => {}, 
  onComparisonChange = () => {} 
}) => {
  const dashboardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const salesProfitData = data?.salesProfit || [];
  const grossProfitData = data?.grossProfit || [];

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Prepare dashboard data
      const dashboardData = {
        salesProfitData: salesProfitData,
        grossProfitData: grossProfitData,
        charts: {
          salesVsProfit: {
            type: 'Area Chart',
            dataPoints: salesProfitData.length,
            metrics: ['Sales', 'Profit', 'Target'],
          },
          grossProfit: {
            type: 'Area Chart',
            dataPoints: grossProfitData.length,
            metrics: ['Gross Profit', 'Prior YTD', 'Current YTD'],
          },
        },
        metrics: {
          totalSalesDataPoints: salesProfitData.length,
          totalGrossProfitDataPoints: grossProfitData.length,
          selectedPeriod: `${selectedYear} - ${selectedQuarter}`,
          comparisonType: comparisonMode,
        },
      };

      // Prepare metadata
      const metadata = {
        filters: {
          selectedYear: selectedYear,
          selectedQuarter: selectedQuarter,
          comparisonMode: comparisonMode,
        },
        summary: {
          chartCount: 2,
          exportDate: new Date().toISOString(),
          reportType: 'Quick Overview Dashboard',
        },
      };

      // Download visual dashboard
      await downloadVisualDashboard(
        dashboardRef.current,
        dashboardData,
        'Quick Overview',
        metadata
      );
    } catch (error) {
      console.error('Error downloading dashboard:', error);
      alert('Failed to download dashboard. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div ref={dashboardRef}>
      <Card className="mb-6">
        <div className="mb-4 flex items-center justify-end">
          <DownloadButton
            onClick={handleDownload}
            isDownloading={isDownloading}
            title="Download Quick Overview dashboard with metadata for HBMP AgentBot"
          />
        </div>
      <div className="grid grid-cols-3 gap-6">
        {/* Left Side - Controls */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Year</label>
            <ButtonGroup
              options={['2015-16', '2016-17', '2017-18']}
              selected={selectedYear}
              onSelect={onYearChange}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Quarter</label>
            <ButtonGroup
              options={['Q1', 'Q2', 'Q3', 'Q4']}
              selected={selectedQuarter}
              onSelect={onQuarterChange}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Comparison</label>
            <ButtonGroup
              options={['vs Prior', 'vs Target']}
              selected={comparisonMode}
              onSelect={onComparisonChange}
            />
          </div>
        </div>

        {/* Right Side - Charts */}
        <div className="col-span-2 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Sales vs Profit / Target</h4>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={salesProfitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="priorYTD" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="currentYTD" stackId="1" stroke="#FBBF24" fill="#FBBF24" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Gross Profit vs Prior / Target</h4>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={grossProfitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="priorYTD" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="currentYTD" stackId="1" stroke="#FBBF24" fill="#FBBF24" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
    </div>
  );
};

export default QuickOverviewSection;

