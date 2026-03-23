import { toPng } from 'html-to-image';

/**
 * Downloads dashboard with VISUAL CHARTS + Interactive Data
 * Captures the actual UI as seen in the app, then adds interactive data below
 * @param {HTMLElement} dashboardRef - Reference to the dashboard DOM element
 * @param {Object} dashboardData - Data for interactive tables
 * @param {string} dashboardName - Name of the dashboard
 * @param {Object} metadata - Filter and config information
 */
export const downloadVisualDashboard = async (dashboardRef, dashboardData, dashboardName, metadata) => {
  try {
    // Step 1: Capture the visual dashboard as PNG
    const visualImage = await toPng(dashboardRef, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    });

    // Step 2: Create HTML with the visual image + interactive data
    const htmlContent = generateVisualHTML(dashboardName, visualImage, dashboardData, metadata);

    // Step 3: Download as HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${dashboardName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error downloading visual dashboard:', error);
    alert('Failed to download dashboard. Please try again.');
  }
};

/**
 * Generates HTML with embedded visual dashboard image + interactive data section
 */
const generateVisualHTML = (dashboardName, visualImage, dashboardData, metadata) => {
  const filtersHTML = metadata?.filters ? Object.entries(metadata.filters)
    .map(([key, value]) => `<div class="filter-item"><strong>${formatLabel(key)}:</strong> ${value}</div>`)
    .join('') : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📊 ${dashboardName} Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            color: #1a202c;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 32px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }
        
        .header .subtitle {
            font-size: 16px;
            opacity: 0.95;
            font-weight: 500;
        }
        
        .export-date {
            margin-top: 12px;
            font-size: 14px;
            opacity: 0.9;
        }
        
        .visual-dashboard {
            padding: 32px;
            background: #f7fafc;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .visual-dashboard img {
            width: 100%;
            height: auto;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            display: block;
        }
        
        .filters-section {
            background: white;
            padding: 24px 32px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .filters-section h2 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #2d3748;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .filters-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
        }
        
        .filter-item {
            padding: 12px 16px;
            background: #f7fafc;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .filter-item strong {
            color: #4a5568;
            margin-right: 8px;
        }
        
        .data-section {
            padding: 32px;
        }
        
        .tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 24px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 0;
        }
        
        .tab {
            padding: 12px 24px;
            background: transparent;
            border: none;
            border-bottom: 3px solid transparent;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            color: #718096;
            transition: all 0.2s;
            position: relative;
            bottom: -2px;
        }
        
        .tab:hover {
            color: #667eea;
            background: #f7fafc;
        }
        
        .tab.active {
            color: #667eea;
            border-bottom-color: #667eea;
            background: white;
        }
        
        .tab-content {
            display: none;
            animation: fadeIn 0.3s;
        }
        
        .tab-content.active {
            display: block;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .search-box {
            margin-bottom: 20px;
            position: relative;
        }
        
        .search-box input {
            width: 100%;
            padding: 12px 40px 12px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.2s;
        }
        
        .search-box input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .search-icon {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #a0aec0;
        }
        
        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        
        thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        th {
            padding: 16px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        td {
            padding: 14px 16px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
        }
        
        tbody tr {
            transition: background-color 0.2s;
        }
        
        tbody tr:hover {
            background-color: #f7fafc;
        }
        
        tbody tr:last-child td {
            border-bottom: none;
        }
        
        .metadata-section {
            background: #f7fafc;
            padding: 24px 32px;
            border-top: 1px solid #e2e8f0;
        }
        
        .metadata-section h2 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #2d3748;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .metadata-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        pre {
            background: #1a202c;
            color: #68d391;
            padding: 16px;
            border-radius: 8px;
            overflow-x: auto;
            font-size: 13px;
            line-height: 1.6;
        }
        
        .footer {
            text-align: center;
            padding: 24px;
            color: #718096;
            font-size: 13px;
            background: white;
            border-top: 1px solid #e2e8f0;
        }
        
        .print-button {
            position: fixed;
            bottom: 30px;
            right: 30px;
            padding: 14px 28px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
            transition: all 0.3s;
            z-index: 1000;
        }
        
        .print-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 28px rgba(102, 126, 234, 0.5);
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .container {
                box-shadow: none;
            }
            .print-button {
                display: none;
            }
            .tab {
                display: none;
            }
            .tab-content {
                display: block !important;
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 ${dashboardName} Dashboard</h1>
            <div class="subtitle">Interactive Dashboard Export - Fully Functional & Self-Contained</div>
            <div class="export-date">Exported: ${new Date().toLocaleString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</div>
        </div>

        <!-- Visual Dashboard Image -->
        <div class="visual-dashboard">
            <img src="${visualImage}" alt="${dashboardName} Visual Dashboard" />
        </div>

        ${filtersHTML ? `
        <!-- Applied Filters -->
        <div class="filters-section">
            <h2>🔍 Applied Filters</h2>
            <div class="filters-grid">
                ${filtersHTML}
            </div>
        </div>
        ` : ''}

        <!-- Interactive Data Section -->
        <div class="data-section">
            <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 24px; color: #2d3748;">📈 Dashboard Data</h2>
            ${generateDataSection(dashboardData)}
        </div>

        <!-- Export Metadata -->
        <div class="metadata-section">
            <h2>📋 Export Metadata</h2>
            <div class="metadata-content">
                <pre>${JSON.stringify(metadata, null, 2)}</pre>
            </div>
        </div>

        <div class="footer">
            💡 This is a self-contained HTML dashboard. All data and styling are embedded. You can print, share, or archive this file.
            <br>
            Generated by IVYCHAIN v2 Dashboard Export System
        </div>
    </div>

    <button class="print-button" onclick="window.print()">🖨️ Print / Save PDF</button>

    <script>
        // Tab switching functionality
        function showTab(tabName) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all tabs
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab content
            const selectedContent = document.getElementById(tabName);
            if (selectedContent) {
                selectedContent.classList.add('active');
            }
            
            // Add active class to clicked tab
            event.target.classList.add('active');
        }

        // Search functionality for each table
        function searchTable(inputId, tableId) {
            const input = document.getElementById(inputId);
            const filter = input.value.toUpperCase();
            const table = document.getElementById(tableId);
            const tr = table.getElementsByTagName('tr');

            for (let i = 1; i < tr.length; i++) {
                const row = tr[i];
                const cells = row.getElementsByTagName('td');
                let found = false;

                for (let j = 0; j < cells.length; j++) {
                    const cell = cells[j];
                    if (cell) {
                        const textValue = cell.textContent || cell.innerText;
                        if (textValue.toUpperCase().indexOf(filter) > -1) {
                            found = true;
                            break;
                        }
                    }
                }

                row.style.display = found ? '' : 'none';
            }
        }

        // Initialize: Show first tab
        window.addEventListener('DOMContentLoaded', () => {
            const firstTab = document.querySelector('.tab');
            if (firstTab) {
                firstTab.click();
            }
        });
    </script>
</body>
</html>`;
};

/**
 * Generate tabbed data section with search
 */
const generateDataSection = (dashboardData) => {
  if (!dashboardData || typeof dashboardData !== 'object') {
    return '<p style="color: #718096;">No data available</p>';
  }

  const tabs = [];
  const contents = [];
  let tabIndex = 0;

  // Generate tabs for each data array
  Object.entries(dashboardData).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      const tabId = `tab-${tabIndex}`;
      const tableId = `table-${tabIndex}`;
      const searchId = `search-${tabIndex}`;
      
      tabs.push(`
        <button class="tab" onclick="showTab('${tabId}')">${formatLabel(key)}</button>
      `);
      
      contents.push(`
        <div id="${tabId}" class="tab-content">
            <div class="search-box">
                <input 
                    type="text" 
                    id="${searchId}" 
                    placeholder="🔍 Search ${formatLabel(key)}..." 
                    onkeyup="searchTable('${searchId}', '${tableId}')"
                >
                <span class="search-icon">🔍</span>
            </div>
            ${generateTable(value, tableId)}
        </div>
      `);
      
      tabIndex++;
    } else if (key === 'metrics' && typeof value === 'object') {
      const tabId = `tab-${tabIndex}`;
      
      tabs.push(`
        <button class="tab" onclick="showTab('${tabId}')">📊 Metrics</button>
      `);
      
      const metricsHTML = Object.entries(value)
        .map(([metricKey, metricValue]) => `
          <div class="filter-item">
            <strong>${formatLabel(metricKey)}:</strong> ${metricValue}
          </div>
        `).join('');
      
      contents.push(`
        <div id="${tabId}" class="tab-content">
            <div class="filters-grid">
                ${metricsHTML}
            </div>
        </div>
      `);
      
      tabIndex++;
    }
  });

  if (tabs.length === 0) {
    return '<p style="color: #718096;">No tabular data available</p>';
  }

  return `
    <div class="tabs">
        ${tabs.join('')}
    </div>
    ${contents.join('')}
  `;
};

/**
 * Generate HTML table from data array
 */
const generateTable = (dataArray, tableId) => {
  if (!dataArray || dataArray.length === 0) {
    return '<p style="color: #718096;">No data available</p>';
  }

  const headers = Object.keys(dataArray[0]);
  
  return `
    <table id="${tableId}">
        <thead>
            <tr>
                ${headers.map(header => `<th>${formatLabel(header)}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
            ${dataArray.map(row => `
                <tr>
                    ${headers.map(header => `<td>${formatCellValue(row[header])}</td>`).join('')}
                </tr>
            `).join('')}
        </tbody>
    </table>
  `;
};

/**
 * Format label from camelCase to Title Case
 */
const formatLabel = (str) => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
};

/**
 * Format cell value for display
 */
const formatCellValue = (value) => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'number') {
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  return value;
};
