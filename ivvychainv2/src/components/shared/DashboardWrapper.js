import React, { useRef, useState } from 'react';
import DownloadButton from './DownloadButton';
import { downloadDashboard, prepareDashboardMetadata } from '../../utils/dashboardDownload';

/**
 * Wrapper component that adds download functionality to any dashboard
 * @param {Object} props
 * @param {React.ReactNode} props.children - Dashboard content
 * @param {string} props.dashboardName - Name of the dashboard
 * @param {Object} props.metadataConfig - Configuration for metadata preparation
 * @param {Object} props.data - Dashboard data
 * @param {Object} props.filters - Current filters/state
 */
const DashboardWrapper = ({ 
  children, 
  dashboardName, 
  metadataConfig = {}, 
  data = {},
  filters = {},
  showDownloadButton = true,
  downloadButtonPosition = 'right' // 'right' | 'left' | 'top' | 'bottom'
}) => {
  const dashboardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!dashboardRef.current) return;
    
    setIsDownloading(true);
    try {
      const metadata = prepareDashboardMetadata({
        name: dashboardName,
        ...metadataConfig,
        filters,
        rawData: data,
      });

      await downloadDashboard(dashboardRef.current, dashboardName, metadata);
    } catch (error) {
      console.error('Error downloading dashboard:', error);
      alert('Failed to download dashboard. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!showDownloadButton) {
    return <div ref={dashboardRef}>{children}</div>;
  }

  // Render download button based on position
  const renderDownloadButton = () => (
    <DownloadButton
      onClick={handleDownload}
      isDownloading={isDownloading}
      title={`Download ${dashboardName} dashboard with metadata for HBMP AgentBot`}
    />
  );

  return (
    <div ref={dashboardRef}>
      {downloadButtonPosition === 'top' && (
        <div className="mb-4 flex justify-end">
          {renderDownloadButton()}
        </div>
      )}
      {children}
      {downloadButtonPosition === 'bottom' && (
        <div className="mt-4 flex justify-end">
          {renderDownloadButton()}
        </div>
      )}
    </div>
  );
};

export default DashboardWrapper;





