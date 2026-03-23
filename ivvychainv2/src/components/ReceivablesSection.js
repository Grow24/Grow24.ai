import React, { useRef, useState } from 'react';
import Card from './shared/Card';
import DownloadButton from './shared/DownloadButton';
import { downloadDashboard, prepareDashboardMetadata } from '../utils/dashboardDownload';
import { downloadInteractiveDashboard } from '../utils/interactiveDashboardDownload';
import ReceivablesDrilldownView from './ReceivablesDrilldownView';
import ReceivablesFiltersView from './ReceivablesFiltersView';

const ReceivablesSection = ({ data, receivablesState, onReceivablesStateChange }) => {
  const dashboardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { viewMode, timeGrouping, year } = receivablesState;

  const handleModeChange = (mode) => {
    onReceivablesStateChange(prev => ({ ...prev, viewMode: mode }));
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const dashboardData = {
        receivablesData: data || [],
        metrics: {
          totalBalance: data?.reduce((sum, d) => sum + (d.balance || 0), 0) || 0,
          totalOverdue: data?.reduce((sum, d) => sum + (d.overdue || 0), 0) || 0,
          overduePercentage: data?.length > 0 ? ((data.reduce((sum, d) => sum + (d.overdue || 0), 0) / data.reduce((sum, d) => sum + (d.balance || 0), 0)) * 100).toFixed(2) : 0,
        },
      };
      const metadata = {
        filters: { viewMode, timeGrouping, year },
        summary: {
          exportDate: new Date().toISOString(),
          reportType: 'Receivables Analysis',
        },
      };
      await downloadInteractiveDashboard(dashboardData, 'Receivables', metadata);
    } catch (error) {
      console.error('Error downloading dashboard:', error);
      alert('Failed to download dashboard. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div ref={dashboardRef}>
      <Card title="Receivables" className="mb-6">
        <div className="mb-4 flex items-center justify-end">
          <DownloadButton
            onClick={handleDownload}
            isDownloading={isDownloading}
            title="Download Receivables dashboard with metadata for HBMP AgentBot"
          />
        </div>
      <div className="mb-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleModeChange('drilldown')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              viewMode === 'drilldown'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            by drilldown
          </button>
          <button
            onClick={() => handleModeChange('filters')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              viewMode === 'filters'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            by Filters
          </button>
        </div>
      </div>

      {viewMode === 'drilldown' ? (
        <ReceivablesDrilldownView data={data.drilldown} />
      ) : (
        <ReceivablesFiltersView
          data={data.filters}
          timeGrouping={timeGrouping}
          year={year}
          onTimeGroupingChange={(grp) => onReceivablesStateChange(prev => ({ ...prev, timeGrouping: grp }))}
          onYearChange={(yr) => onReceivablesStateChange(prev => ({ ...prev, year: yr }))}
        />
      )}
    </Card>
    </div>
  );
};

export default ReceivablesSection;


