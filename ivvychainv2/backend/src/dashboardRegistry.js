const fs = require('fs');
const path = require('path');

const EXPORTS_FOLDER = path.join(__dirname, '../../exports');
const REGISTRY_FILE = path.join(__dirname, '../../exports/dashboard-registry.json');

/**
 * Scans the exports folder and creates/updates the dashboard registry
 */
function scanDashboards() {
  const registry = {
    dashboards: [],
    lastUpdated: new Date().toISOString(),
    totalCount: 0
  };

  // Create exports folder if it doesn't exist
  if (!fs.existsSync(EXPORTS_FOLDER)) {
    fs.mkdirSync(EXPORTS_FOLDER, { recursive: true });
    return registry;
  }

  const files = fs.readdirSync(EXPORTS_FOLDER);
  
  files.forEach(file => {
    // Look for JSON metadata files (ending with _Metadata_*.json)
    if (file.includes('_Metadata_') && file.endsWith('.json')) {
      try {
        const filePath = path.join(EXPORTS_FOLDER, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const metadata = JSON.parse(content);
        
        // Extract dashboard name from filename
        // Format: DashboardName_Metadata_YYYY-MM-DD.json
        const nameMatch = file.match(/^(.+?)_Metadata_/);
        const dashboardName = nameMatch ? nameMatch[1].replace(/_/g, ' ') : file.replace('_Metadata_', '').replace(/_\d{4}-\d{2}-\d{2}\.json$/, '');
        
        // Check if HTML and PNG files exist
        const htmlFile = file.replace('_Metadata_', '_Dashboard_').replace('.json', '.html');
        const pngFile = file.replace('_Metadata_', '_Dashboard_').replace('.json', '.png');
        const htmlExists = fs.existsSync(path.join(EXPORTS_FOLDER, htmlFile));
        const pngExists = fs.existsSync(path.join(EXPORTS_FOLDER, pngFile));
        
        registry.dashboards.push({
          id: dashboardName.toLowerCase().replace(/\s+/g, '-'),
          name: metadata.dashboard?.name || dashboardName,
          type: metadata.dashboard?.type || 'general',
          description: metadata.dashboard?.description || '',
          exportDate: metadata.dashboard?.exportDate || new Date().toISOString(),
          metadataFile: file,
          htmlFile: htmlExists ? htmlFile : null,
          pngFile: pngExists ? pngFile : null,
          filters: metadata.context || {},
          metrics: metadata.visualization?.metrics || [],
          chartTypes: metadata.visualization?.chartTypes || [],
          dimensions: metadata.visualization?.dimensions || [],
          dataSummary: metadata.data?.summary || {},
          hasInteractiveVersion: htmlExists
        });
      } catch (error) {
        console.error(`Error parsing dashboard file ${file}:`, error);
      }
    }
  });

  // Sort by export date (newest first)
  registry.dashboards.sort((a, b) => 
    new Date(b.exportDate) - new Date(a.exportDate)
  );

  registry.totalCount = registry.dashboards.length;
  
  // Save registry
  fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2));
  
  return registry;
}

/**
 * Get dashboard registry
 */
function getRegistry() {
  if (fs.existsSync(REGISTRY_FILE)) {
    try {
      const registry = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
      // Check if registry is older than 5 minutes, refresh if needed
      const lastUpdated = new Date(registry.lastUpdated);
      const now = new Date();
      if ((now - lastUpdated) > 5 * 60 * 1000) {
        return scanDashboards();
      }
      return registry;
    } catch (error) {
      console.error('Error reading registry:', error);
      return scanDashboards();
    }
  }
  return scanDashboards();
}

/**
 * Get dashboard by ID
 */
function getDashboardById(id) {
  const registry = getRegistry();
  return registry.dashboards.find(d => d.id === id);
}

/**
 * Search dashboards by query
 */
function searchDashboards(query) {
  const registry = getRegistry();
  const lowerQuery = query.toLowerCase();
  
  return registry.dashboards.filter(dashboard => 
    dashboard.name.toLowerCase().includes(lowerQuery) ||
    dashboard.description.toLowerCase().includes(lowerQuery) ||
    dashboard.type.toLowerCase().includes(lowerQuery) ||
    (dashboard.metrics && dashboard.metrics.some(m => m.toLowerCase().includes(lowerQuery))) ||
    (dashboard.chartTypes && dashboard.chartTypes.some(ct => ct.toLowerCase().includes(lowerQuery)))
  );
}

/**
 * Get dashboards by type
 */
function getDashboardsByType(type) {
  const registry = getRegistry();
  return registry.dashboards.filter(d => d.type === type);
}

module.exports = {
  scanDashboards,
  getRegistry,
  getDashboardById,
  searchDashboards,
  getDashboardsByType
};

