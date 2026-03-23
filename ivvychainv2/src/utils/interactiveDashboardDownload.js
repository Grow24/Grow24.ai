import { toPng } from 'html-to-image';

/**
 * Creates a fully interactive, self-contained HTML dashboard file
 * Includes data, styling, and React-like interactivity
 * @param {Object} dashboardData - Complete dashboard data object
 * @param {string} dashboardName - Name of the dashboard
 * @param {Object} metadata - Filter and config information
 */
export const downloadInteractiveDashboard = async (dashboardData, dashboardName, metadata) => {
  try {
    // Create a self-contained HTML file with embedded data and interactivity
    const htmlContent = generateInteractiveHTML(dashboardName, dashboardData, metadata);

    // Download as HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${dashboardName.replace(/\s+/g, '_')}_Interactive_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error downloading interactive dashboard:', error);
    alert('Failed to download dashboard. Please try again.');
  }
};

/**
 * Generates a complete, interactive HTML file with embedded CSS and JS
 */
const generateInteractiveHTML = (dashboardName, dashboardData, metadata) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${dashboardName} Dashboard</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/recharts@2.15.0/dist/Recharts.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #3B82F6 0%, #1F2937 100%);
            color: white;
            padding: 30px;
            border-bottom: 1px solid #E5E7EB;
        }
        
        .header h1 {
            font-size: 2em;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .header p {
            font-size: 0.95em;
            opacity: 0.9;
            margin-bottom: 15px;
        }
        
        .export-info {
            background: rgba(255,255,255,0.1);
            padding: 12px 16px;
            border-radius: 6px;
            font-size: 0.9em;
            display: inline-block;
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        .content {
            padding: 30px;
        }
        
        .section {
            margin-bottom: 40px;
            background: #F9FAFB;
            padding: 25px;
            border-radius: 8px;
            border-left: 4px solid #3B82F6;
        }
        
        .section h2 {
            color: #1F2937;
            font-size: 1.5em;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #E5E7EB;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .filters-section {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #E5E7EB;
        }
        
        .filter-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .filter-item {
            display: flex;
            flex-direction: column;
        }
        
        .filter-label {
            font-weight: 600;
            color: #374151;
            font-size: 0.9em;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .filter-value {
            background: #EFF6FF;
            padding: 10px 12px;
            border-radius: 6px;
            border: 1px solid #BFDBFE;
            color: #1E40AF;
            font-weight: 500;
            word-break: break-word;
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border: 1px solid #E5E7EB;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .data-table thead {
            background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
            color: white;
        }
        
        .data-table th {
            padding: 14px;
            text-align: left;
            font-weight: 600;
            font-size: 0.9em;
            letter-spacing: 0.5px;
            border-right: 1px solid rgba(255,255,255,0.1);
        }
        
        .data-table th:last-child {
            border-right: none;
        }
        
        .data-table td {
            padding: 12px 14px;
            border-bottom: 1px solid #E5E7EB;
            color: #374151;
        }
        
        .data-table tbody tr:hover {
            background: #F3F4F6;
            transition: background 0.2s ease;
        }
        
        .data-table tbody tr:last-child td {
            border-bottom: none;
        }
        
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
            text-align: center;
        }
        
        .status-a {
            background: #DCFCE7;
            color: #15803D;
        }
        
        .status-b {
            background: #FEF3C7;
            color: #92400E;
        }
        
        .status-c {
            background: #FEE2E2;
            color: #991B1B;
        }
        
        .metric-card {
            background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 10px 0;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .metric-label {
            font-size: 0.9em;
            opacity: 0.9;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .metric-value {
            font-size: 1.8em;
            font-weight: 700;
        }
        
        .controls {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            flex-wrap: wrap;
        }
        
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9em;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        
        .btn-primary {
            background: #3B82F6;
            color: white;
        }
        
        .btn-primary:hover {
            background: #2563EB;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        
        .btn-secondary {
            background: #E5E7EB;
            color: #374151;
        }
        
        .btn-secondary:hover {
            background: #D1D5DB;
        }
        
        .search-box {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #E5E7EB;
            border-radius: 6px;
            font-size: 0.95em;
            margin-bottom: 15px;
            transition: border-color 0.3s ease;
        }
        
        .search-box:focus {
            outline: none;
            border-color: #3B82F6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .footer {
            background: #F3F4F6;
            padding: 20px;
            border-top: 1px solid #E5E7EB;
            text-align: center;
            color: #6B7280;
            font-size: 0.85em;
        }
        
        .metadata-section {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            border: 1px solid #E5E7EB;
        }
        
        .metadata-content {
            background: #F9FAFB;
            padding: 15px;
            border-radius: 6px;
            overflow-x: auto;
            max-height: 300px;
            overflow-y: auto;
        }
        
        .metadata-content pre {
            margin: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 0.85em;
            color: #374151;
            font-family: 'Monaco', 'Courier New', monospace;
        }
        
        .tabs {
            display: flex;
            gap: 5px;
            margin-bottom: 15px;
            border-bottom: 2px solid #E5E7EB;
        }
        
        .tab {
            padding: 12px 20px;
            background: none;
            border: none;
            cursor: pointer;
            font-weight: 600;
            color: #6B7280;
            border-bottom: 3px solid transparent;
            margin-bottom: -2px;
            transition: all 0.3s ease;
        }
        
        .tab.active {
            color: #3B82F6;
            border-bottom-color: #3B82F6;
        }
        
        .tab:hover {
            color: #1F2937;
        }
        
        @media (max-width: 768px) {
            .header {
                padding: 20px;
            }
            
            .header h1 {
                font-size: 1.5em;
            }
            
            .content {
                padding: 15px;
            }
            
            .filter-grid {
                grid-template-columns: 1fr;
            }
            
            .data-table {
                font-size: 0.9em;
            }
            
            .data-table th,
            .data-table td {
                padding: 10px 8px;
            }
            
            .metric-card {
                padding: 15px;
            }
            
            .metric-value {
                font-size: 1.4em;
            }
        }
        
        .print-hide {
            display: none;
        }
        
        @media print {
            body {
                background: white;
            }
            
            .controls {
                display: none;
            }
            
            .section {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 ${dashboardName} Dashboard</h1>
            <p>Interactive Dashboard Export - Fully Functional & Self-Contained</p>
            <div class="export-info">
                <strong>Exported:</strong> ${new Date().toLocaleString()}
            </div>
        </div>
        
        <div class="content">
            <!-- Filters Section -->
            <div class="section">
                <h2>🔍 Applied Filters</h2>
                <div class="filters-section">
                    <div class="filter-grid">
                        ${Object.entries(metadata.filters || {})
                          .map(([key, value]) => `
                            <div class="filter-item">
                                <div class="filter-label">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                <div class="filter-value">${value || 'N/A'}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Data Section -->
            <div class="section">
                <h2>📈 Dashboard Data</h2>
                ${generateDataSection(dashboardData)}
            </div>
            
            <!-- Metadata Section -->
            <div class="section">
                <h2>ℹ️ Export Metadata</h2>
                <div class="metadata-section">
                    <div class="metadata-content">
                        <pre>${escapeHtml(JSON.stringify(metadata, null, 2))}</pre>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>📄 This is a self-contained HTML dashboard. All data and styling are embedded. You can print, share, or archive this file.</p>
            <p style="margin-top: 10px; opacity: 0.7;">Generated by IVYCHAIN v2 Dashboard Export System</p>
        </div>
    </div>
    
    <script>
        // Interactive functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Search functionality
            const searchBoxes = document.querySelectorAll('.search-box');
            searchBoxes.forEach(box => {
                box.addEventListener('input', function(e) {
                    const filter = e.target.value.toLowerCase();
                    const table = e.target.closest('div').querySelector('table');
                    if (table) {
                        const rows = table.querySelectorAll('tbody tr');
                        rows.forEach(row => {
                            const text = row.textContent.toLowerCase();
                            row.style.display = text.includes(filter) ? '' : 'none';
                        });
                    }
                });
            });
            
            // Tab switching
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabGroup = this.parentElement;
                    tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Hide/show content associated with tabs
                    const tabContents = document.querySelectorAll('[data-tab-content]');
                    tabContents.forEach(content => {
                        content.style.display = content.getAttribute('data-tab-content') === this.dataset.tab ? 'block' : 'none';
                    });
                });
            });
            
            // Copy to clipboard functionality
            const copyButtons = document.querySelectorAll('.btn-copy');
            copyButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const content = this.dataset.copy;
                    navigator.clipboard.writeText(content);
                    const originalText = this.textContent;
                    this.textContent = '✓ Copied!';
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 2000);
                });
            });
            
            // Print functionality
            const printButtons = document.querySelectorAll('.btn-print');
            printButtons.forEach(btn => {
                btn.addEventListener('click', () => window.print());
            });
        });
    </script>
</body>
</html>`;
};

/**
 * Generates data visualization section based on dashboard data structure
 */
const generateDataSection = (data) => {
  if (!data || Object.keys(data).length === 0) {
    return '<p>No data available</p>';
  }

  let html = '<div class="tabs">';
  const keys = Object.keys(data);
  keys.forEach((key, index) => {
    html += `<button class="tab ${index === 0 ? 'active' : ''}" data-tab="${key}">${formatTabName(key)}</button>`;
  });
  html += '</div>';

  keys.forEach((key, index) => {
    html += `<div data-tab-content="${key}" style="display: ${index === 0 ? 'block' : 'none'}">
      ${renderDataContent(data[key], key)}
    </div>`;
  });

  return html;
};

/**
 * Renders different data types appropriately
 */
const renderDataContent = (data, key) => {
  if (Array.isArray(data) && data.length > 0) {
    if (typeof data[0] === 'object') {
      return generateTable(data);
    } else {
      return `<p><strong>${data.join(', ')}</strong></p>`;
    }
  } else if (typeof data === 'object' && data !== null) {
    return `<pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre>`;
  } else {
    return `<p>${data}</p>`;
  }
};

/**
 * Generates an HTML table from array of objects
 */
const generateTable = (data) => {
  if (!data || data.length === 0) return '<p>No data</p>';

  const headers = Object.keys(data[0]);
  let html = '<input type="text" class="search-box" placeholder="Search table...">';
  html += '<table class="data-table"><thead><tr>';
  headers.forEach(header => {
    html += `<th>${escapeHtml(header)}</th>`;
  });
  html += '</tr></thead><tbody>';

  data.forEach(row => {
    html += '<tr>';
    headers.forEach(header => {
      const value = row[header];
      const displayValue = escapeHtml(String(value || ''));
      html += `<td>${displayValue}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  return html;
};

/**
 * Formats tab names for display
 */
const formatTabName = (name) => {
  return name
    .replace(/([A-Z])/g, ' \$1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

/**
 * Escapes HTML special characters
 */
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
};
