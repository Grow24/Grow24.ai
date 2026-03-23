import { useRef, useState } from 'react';
import { downloadDashboard, prepareDashboardMetadata } from '../utils/dashboardDownload';

/**
 * Custom hook for dashboard download functionality
 * @param {Object} config - Configuration object for the dashboard
 * @returns {Object} - { dashboardRef, isDownloading, handleDownload }
 */
export const useDashboardDownload = (config) => {
  const dashboardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!dashboardRef.current) {
      console.warn('Dashboard ref not available');
      return;
    }

    setIsDownloading(true);
    try {
      const metadata = prepareDashboardMetadata(config);
      await downloadDashboard(dashboardRef.current, config.name || 'Dashboard', metadata);
    } catch (error) {
      console.error('Error downloading dashboard:', error);
      alert('Failed to download dashboard. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    dashboardRef,
    isDownloading,
    handleDownload,
  };
};






