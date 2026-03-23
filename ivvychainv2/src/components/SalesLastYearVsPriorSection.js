import React, { useRef, useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from './shared/Card';
import DownloadButton from './shared/DownloadButton';
import { downloadInteractiveComposedChartDashboard } from '../utils/interactiveComposedChartExport';

const SalesLastYearVsPriorSection = ({ data }) => {
  const dashboardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Prepare data structure for the export
      const allFilterData = {
        mainChart: data || [],
        comparisonData: data || [],
        tableData: data || []
      };

      const config = {
        chartTitle: 'Sales Last Year vs Prior',
        labelKey: 'period',
        barDataKeys: [
          { key: 'salesLY', label: 'Sales LY', color: '#3B82F6', yAxisID: 'y' },
          { key: 'salesPriorTarget', label: 'Sales Prior/Target', color: '#FBBF24', yAxisID: 'y' }
        ],
        lineDataKeys: [
          { key: 'grossProfit', label: 'Gross Profit', color: '#10B981', yAxisID: 'y1' }
        ],
        chartDataKey: 'mainChart',
        tableDataKey: 'comparisonData',
        yAxisLabel: 'Sales',
        y1AxisLabel: 'Gross Profit',
        filterGroups: [] // No filters for this dashboard
      };

      await downloadInteractiveComposedChartDashboard(
        allFilterData,
        'Sales Last Year vs Prior',
        {},
        config
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
      <Card title="Sales Last yr vs Prior" className="mb-6">
        <div className="mb-4 flex items-center justify-end">
          <DownloadButton
            onClick={handleDownload}
            isDownloading={isDownloading}
            title="Download Sales Last Year vs Prior dashboard with metadata for HBMP AgentBot"
          />
        </div>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="salesLY" fill="#3B82F6" name="Sales LY" />
          <Bar yAxisId="left" dataKey="salesPriorTarget" fill="#FBBF24" name="Sales Prior/Target" />
          <Line yAxisId="right" type="monotone" dataKey="grossProfit" stroke="#10B981" strokeWidth={2} name="Gross Profit" />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
    </div>
  );
};

export default SalesLastYearVsPriorSection;


