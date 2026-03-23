import { toPng } from 'html-to-image';

/**
 * Downloads a dashboard with its metadata
 * @param {HTMLElement} element - The DOM element to capture
 * @param {string} dashboardName - Name of the dashboard
 * @param {Object} metadata - Metadata object containing filters, data, configs, etc.
 */
export const downloadDashboard = async (element, dashboardName, metadata) => {
  try {
    // Capture the dashboard as an image
    const dataUrl = await toPng(element, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    // Create metadata JSON
    const metadataJson = JSON.stringify(metadata, null, 2);

    // Create a zip-like structure using a single HTML file that contains both image and metadata
    // This makes it easy for the AgentBot to parse
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${dashboardName} Dashboard Export</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .dashboard-image {
            width: 100%;
            max-width: 100%;
            height: auto;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .metadata-section {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .metadata-section h2 {
            color: #333;
            border-bottom: 2px solid #3B82F6;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .metadata-content {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
        }
        pre {
            margin: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .info-box {
            background: #e3f2fd;
            border-left: 4px solid #2196F3;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .info-box h3 {
            margin-top: 0;
            color: #1976D2;
        }
    </style>
</head>
<body>
    <div class="info-box">
        <h3>Dashboard Export Information</h3>
        <p><strong>Dashboard Name:</strong> ${dashboardName}</p>
        <p><strong>Export Date:</strong> ${new Date().toISOString()}</p>
        <p><strong>Purpose:</strong> This export contains the dashboard visualization and all associated metadata for analysis by HBMP AgentBot.</p>
    </div>
    
    <h1>${dashboardName} Dashboard</h1>
    
    <div class="dashboard-image-container">
        <img src="${dataUrl}" alt="${dashboardName} Dashboard" class="dashboard-image" />
    </div>
    
    <div class="metadata-section">
        <h2>Dashboard Metadata</h2>
        <div class="metadata-content">
            <pre>${escapeHtml(metadataJson)}</pre>
        </div>
    </div>
</body>
</html>`;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${dashboardName.replace(/\s+/g, '_')}_Dashboard_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Also download the image separately
    const imageLink = document.createElement('a');
    imageLink.href = dataUrl;
    imageLink.download = `${dashboardName.replace(/\s+/g, '_')}_Dashboard_${new Date().toISOString().split('T')[0]}.png`;
    document.body.appendChild(imageLink);
    imageLink.click();
    document.body.removeChild(imageLink);

    // Also download JSON metadata separately
    const jsonBlob = new Blob([metadataJson], { type: 'application/json' });
    const jsonUrl = window.URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = `${dashboardName.replace(/\s+/g, '_')}_Metadata_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(jsonLink);
    jsonLink.click();
    document.body.removeChild(jsonLink);
    window.URL.revokeObjectURL(jsonUrl);

  } catch (error) {
    console.error('Error downloading dashboard:', error);
    alert('Failed to download dashboard. Please try again.');
  }
};

/**
 * Helper function to escape HTML special characters
 */
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
};

/**
 * Prepares metadata object for a dashboard
 * @param {Object} config - Configuration object with filters, data, etc.
 */
export const prepareDashboardMetadata = (config) => {
  return {
    dashboard: {
      name: config.name || 'Dashboard',
      type: config.type || 'general',
      description: config.description || '',
      exportDate: new Date().toISOString(),
    },
    filters: config.filters || {},
    data: {
      summary: config.dataSummary || {},
      dataPoints: config.dataPoints || 0,
      lastUpdated: config.lastUpdated || new Date().toISOString(),
    },
    visualization: {
      chartTypes: config.chartTypes || [],
      metrics: config.metrics || [],
      dimensions: config.dimensions || [],
    },
    context: {
      selectedYear: config.selectedYear || null,
      selectedQuarter: config.selectedQuarter || null,
      comparisonMode: config.comparisonMode || null,
      otherFilters: config.otherFilters || {},
    },
    rawData: config.rawData || null, // Include raw data if needed
  };
};

