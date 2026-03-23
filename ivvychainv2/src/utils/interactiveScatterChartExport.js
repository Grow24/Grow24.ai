/**
 * Downloads dashboard with FULLY INTERACTIVE SCATTER CHARTS
 * Creates self-contained HTML with Chart.js scatter charts and working buttons
 * @param {Object} allYearQuarterData - Data for all years and quarters
 * @param {string} dashboardName - Name of the dashboard
 * @param {Object} initialFilters - Initial filter state
 */
export const downloadInteractiveScatterChartDashboard = async (allYearQuarterData, dashboardName, initialFilters) => {
  try {
    const htmlContent = generateInteractiveScatterChartHTML(dashboardName, allYearQuarterData, initialFilters);

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
    console.error('Error downloading interactive scatter chart dashboard:', error);
    alert('Failed to download dashboard. Please try again.');
  }
};

const generateInteractiveScatterChartHTML = (dashboardName, allYearQuarterData, initialFilters) => {
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'];
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${dashboardName} Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <script>
        // Fallback: Ensure Chart.js loads even if CDN is slow
        (function() {
            let attempts = 0;
            const maxAttempts = 50;
            const checkChart = setInterval(function() {
                attempts++;
                if (typeof Chart !== 'undefined') {
                    clearInterval(checkChart);
                    console.log('Chart.js loaded successfully');
                    if (document.readyState !== 'loading' && typeof initializeDashboard === 'function') {
                        setTimeout(initializeDashboard, 100);
                    }
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkChart);
                    console.error('Chart.js failed to load after ' + maxAttempts + ' attempts');
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js';
                    script.onload = function() {
                        console.log('Chart.js loaded from alternative CDN');
                        if (typeof initializeDashboard === 'function') {
                            setTimeout(initializeDashboard, 100);
                        }
                    };
                    document.head.appendChild(script);
                }
            }, 100);
        })();
    </script>
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
        }
        
        .header .subtitle {
            font-size: 16px;
            opacity: 0.95;
        }
        
        .export-date {
            margin-top: 12px;
            font-size: 14px;
            opacity: 0.9;
        }
        
        .dashboard-content {
            padding: 32px;
        }
        
        .card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            padding: 24px;
            margin-bottom: 24px;
        }
        
        .card-title {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 20px;
            color: #2d3748;
        }
        
        .controls {
            display: flex;
            gap: 16px;
            margin-bottom: 24px;
            flex-wrap: wrap;
        }
        
        .button-group {
            display: flex;
            gap: 8px;
            background: #f7fafc;
            padding: 4px;
            border-radius: 8px;
        }
        
        .button {
            padding: 8px 20px;
            border: none;
            background: transparent;
            color: #4a5568;
            font-weight: 600;
            font-size: 14px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .button:hover {
            background: #e2e8f0;
        }
        
        .button.active {
            background: #667eea;
            color: white;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }
        
        .charts-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
            margin-bottom: 24px;
        }
        
        .chart-container {
            background: #f7fafc;
            padding: 20px;
            border-radius: 12px;
            height: 450px;
            position: relative;
        }
        
        .chart-canvas-wrapper {
            position: relative;
            height: 380px;
            width: 100%;
        }
        
        .chart-container canvas {
            max-height: 100% !important;
            width: 100% !important;
        }
        
        .chart-title {
            font-size: 14px;
            font-weight: 600;
            color: #4a5568;
            margin-bottom: 12px;
        }
        
        .filters-section {
            background: #f7fafc;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 24px;
        }
        
        .filters-section h3 {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #2d3748;
        }
        
        .filters-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }
        
        .filter-item {
            padding: 12px;
            background: white;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .filter-item strong {
            color: #4a5568;
            margin-right: 8px;
        }
        
        .data-section {
            margin-top: 32px;
        }
        
        .tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 20px;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .tab {
            padding: 12px 24px;
            background: transparent;
            border: none;
            border-bottom: 3px solid transparent;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            color: #718096;
            transition: all 0.2s;
            position: relative;
            bottom: -2px;
        }
        
        .tab:hover {
            color: #667eea;
        }
        
        .tab.active {
            color: #667eea;
            border-bottom-color: #667eea;
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
            padding: 14px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
        }
        
        td {
            padding: 12px 14px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
        }
        
        tbody tr:hover {
            background-color: #f7fafc;
        }
        
        .search-box {
            margin-bottom: 16px;
        }
        
        .search-box {
            position: relative;
        }
        
        .search-box input {
            width: 100%;
            padding: 10px 16px 10px 40px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
        }
        
        .search-box input:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .search-icon-wrapper {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            color: #718096;
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
            body { background: white; padding: 0; }
            .print-button { display: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>${dashboardName} Dashboard</h1>
            <div class="subtitle">Fully Interactive Dashboard - All Charts & Data Embedded</div>
            <div class="export-date">Exported: ${new Date().toLocaleString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</div>
        </div>

        <div class="dashboard-content">
            <div id="dashboard-root"></div>
        </div>
    </div>

    <button class="print-button" onclick="window.print()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 6px;"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>Print / Save PDF</button>

    <script>
        // Embedded data for all years and quarters
        const ALL_DATA = ${JSON.stringify(allYearQuarterData, null, 2)};
        const INITIAL_FILTERS = ${JSON.stringify(initialFilters, null, 2)};
        const COLORS = ${JSON.stringify(COLORS)};

        let selectedYear = INITIAL_FILTERS.selectedYear || '2017';
        let selectedQuarter = INITIAL_FILTERS.selectedQuarter || 'Q1';
        let activeTab = 'fytdData';
        let searchTerm = '';
        let fytdChart = null;
        let percentVsPriorChart = null;

        // Initialize dashboard - wait for Chart.js to load
        function initializeDashboard() {
            if (typeof Chart === 'undefined') {
                console.log('Waiting for Chart.js to load...');
                setTimeout(initializeDashboard, 100);
                return;
            }
            
            console.log('Chart.js loaded, initializing dashboard...');
            renderDashboard();
            setTimeout(() => {
                createCharts();
            }, 200);
        }

        if (document.readyState === 'loading') {
            window.addEventListener('DOMContentLoaded', initializeDashboard);
        } else {
            initializeDashboard();
        }

        function renderDashboard() {
            try {
                const currentData = ALL_DATA[selectedYear] && ALL_DATA[selectedYear][selectedQuarter]
                    ? ALL_DATA[selectedYear][selectedQuarter]
                    : { fytd: [], prior: [], percentVsPrior: [] };

                const html = \`
                    <div class="card">
                        <h2 class="card-title">Sales Growth Analysis</h2>
                        
                        <div class="controls">
                            <div class="button-group">
                                <button class="button \${selectedYear === '2015' ? 'active' : ''}" onclick="changeYear('2015')">2015</button>
                                <button class="button \${selectedYear === '2016' ? 'active' : ''}" onclick="changeYear('2016')">2016</button>
                                <button class="button \${selectedYear === '2017' ? 'active' : ''}" onclick="changeYear('2017')">2017</button>
                            </div>
                            <div class="button-group">
                                <button class="button \${selectedQuarter === 'Q1' ? 'active' : ''}" onclick="changeQuarter('Q1')">Q1</button>
                                <button class="button \${selectedQuarter === 'Q2' ? 'active' : ''}" onclick="changeQuarter('Q2')">Q2</button>
                                <button class="button \${selectedQuarter === 'Q3' ? 'active' : ''}" onclick="changeQuarter('Q3')">Q3</button>
                                <button class="button \${selectedQuarter === 'Q4' ? 'active' : ''}" onclick="changeQuarter('Q4')">Q4</button>
                            </div>
                        </div>

                        <div class="filters-section">
                            <h3><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 6px;"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>Applied Filters</h3>
                            <div class="filters-grid">
                                <div class="filter-item">
                                    <strong>Selected Year:</strong> \${selectedYear}
                                </div>
                                <div class="filter-item">
                                    <strong>Selected Quarter:</strong> \${selectedQuarter}
                                </div>
                            </div>
                        </div>

                        <div class="charts-grid">
                            <div class="chart-container">
                                <h4 class="chart-title">By SalesPerson – value (FYTD)</h4>
                                <div class="chart-canvas-wrapper">
                                    <canvas id="fytdChart"></canvas>
                                </div>
                            </div>
                            <div class="chart-container">
                                <h4 class="chart-title">By SalesPerson – value (% vs Prior)</h4>
                                <div class="chart-canvas-wrapper">
                                    <canvas id="percentVsPriorChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="data-section">
                        <h2 class="card-title"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>Dashboard Data</h2>
                        
                        <div class="tabs">
                            <button class="tab \${activeTab === 'fytdData' ? 'active' : ''}" onclick="changeTab('fytdData')">FYTD Data</button>
                            <button class="tab \${activeTab === 'priorData' ? 'active' : ''}" onclick="changeTab('priorData')">Prior Data</button>
                            <button class="tab \${activeTab === 'metrics' ? 'active' : ''}" onclick="changeTab('metrics')">Metrics</button>
                        </div>

                    <div class="search-box">
                        <div class="search-icon-wrapper">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                        </div>
                        <input type="text" id="searchInput" placeholder="Search data..." oninput="handleSearch(event)" value="\${searchTerm}">
                    </div>

                        <div id="tableContainer"></div>
                    </div>
                \`;

                const root = document.getElementById('dashboard-root');
                if (root) {
                    root.innerHTML = html;
                    renderTable();
                } else {
                    console.error('Dashboard root element not found');
                }
            } catch (error) {
                console.error('Error rendering dashboard:', error);
                const root = document.getElementById('dashboard-root');
                if (root) {
                    root.innerHTML = '<div style="padding: 40px; text-align: center; color: #e53e3e; background: #fed7d7; border-radius: 8px;"><h2>Error Loading Dashboard</h2><p>Please check the console for details.</p></div>';
                }
            }
        }

        function createCharts() {
            if (!ALL_DATA || !ALL_DATA[selectedYear] || !ALL_DATA[selectedYear][selectedQuarter]) {
                console.error('Data not available for', selectedYear, selectedQuarter);
                return;
            }
            
            const currentData = ALL_DATA[selectedYear][selectedQuarter];
            
            if (!currentData.fytd || !currentData.percentVsPrior) {
                console.error('Data structure incomplete');
                return;
            }
            
            try {
                if (fytdChart && typeof fytdChart.destroy === 'function') {
                    fytdChart.destroy();
                    fytdChart = null;
                }
                if (percentVsPriorChart && typeof percentVsPriorChart.destroy === 'function') {
                    percentVsPriorChart.destroy();
                    percentVsPriorChart = null;
                }
            } catch (e) {
                console.warn('Error destroying charts:', e);
            }
            
            setTimeout(() => {
                if (typeof Chart === 'undefined') {
                    console.error('Chart.js not loaded');
                    return;
                }
                
                // FYTD Scatter Chart
                const ctx1 = document.getElementById('fytdChart');
                if (ctx1) {
                    try {
                        const fytdData = currentData.fytd.map((d, index) => ({
                            x: d.grossMargin || 0,
                            y: d.sales || 0,
                            name: d.name || 'SalesPerson ' + (index + 1)
                        }));
                        
                        fytdChart = new Chart(ctx1, {
                            type: 'scatter',
                            data: {
                                datasets: [{
                                    label: 'SalesPerson',
                                    data: fytdData,
                                    backgroundColor: fytdData.map((_, i) => COLORS[i % COLORS.length]),
                                    borderColor: fytdData.map((_, i) => COLORS[i % COLORS.length]),
                                    borderWidth: 2,
                                    pointRadius: 8,
                                    pointHoverRadius: 10
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: 'top'
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function(context) {
                                                const point = context.raw;
                                                return [
                                                    'Name: ' + point.name,
                                                    'Gross Margin: ' + formatValue(point.x),
                                                    'Sales: ' + formatValue(point.y)
                                                ];
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        type: 'linear',
                                        position: 'bottom',
                                        title: {
                                            display: true,
                                            text: 'Gross Margin'
                                        },
                                        min: -25000000,
                                        max: 100000000
                                    },
                                    y: {
                                        type: 'linear',
                                        title: {
                                            display: true,
                                            text: 'Sales'
                                        },
                                        min: -25000000,
                                        max: 125000000
                                    }
                                }
                            }
                        });
                        console.log('FYTD Chart created successfully');
                    } catch (e) {
                        console.error('Error creating FYTD chart:', e);
                    }
                }

                // Percent vs Prior Scatter Chart
                const ctx2 = document.getElementById('percentVsPriorChart');
                if (ctx2) {
                    try {
                        const percentData = currentData.percentVsPrior.map((d, index) => ({
                            x: d.percentGrossMargin || 0,
                            y: d.percentSales || 0,
                            name: d.name || 'SalesPerson ' + (index + 1)
                        }));
                        
                        percentVsPriorChart = new Chart(ctx2, {
                            type: 'scatter',
                            data: {
                                datasets: [{
                                    label: 'SalesPerson',
                                    data: percentData,
                                    backgroundColor: percentData.map((_, i) => COLORS[i % COLORS.length]),
                                    borderColor: percentData.map((_, i) => COLORS[i % COLORS.length]),
                                    borderWidth: 2,
                                    pointRadius: 8,
                                    pointHoverRadius: 10
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: 'top'
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function(context) {
                                                const point = context.raw;
                                                return [
                                                    'Name: ' + point.name,
                                                    '% Gross Margin: ' + formatValue(point.x),
                                                    '% Sales: ' + formatValue(point.y)
                                                ];
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        type: 'linear',
                                        position: 'bottom',
                                        title: {
                                            display: true,
                                            text: '% Gross Margin'
                                        },
                                        min: -25000000,
                                        max: 50000000
                                    },
                                    y: {
                                        type: 'linear',
                                        title: {
                                            display: true,
                                            text: '% Sales'
                                        },
                                        min: -25000000,
                                        max: 125000000
                                    }
                                }
                            }
                        });
                        console.log('Percent vs Prior Chart created successfully');
                    } catch (e) {
                        console.error('Error creating percent vs prior chart:', e);
                    }
                }
            }, 100);
        }

        function renderTable() {
            const container = document.getElementById('tableContainer');
            if (!container) return;
            
            if (!ALL_DATA || !ALL_DATA[selectedYear] || !ALL_DATA[selectedYear][selectedQuarter]) {
                container.innerHTML = '<p style="color: #718096; padding: 20px; text-align: center;">No data available for selected filters</p>';
                return;
            }
            
            const currentData = ALL_DATA[selectedYear][selectedQuarter];
            let data = [];
            
            if (activeTab === 'fytdData') {
                data = currentData.fytd || [];
            } else if (activeTab === 'priorData') {
                data = currentData.prior || [];
            } else if (activeTab === 'metrics') {
                // Create metrics table
                const metrics = {
                    totalSalespersons: currentData.fytd?.length || 0,
                    avgGrossMargin: currentData.fytd?.length > 0 
                        ? (currentData.fytd.reduce((sum, d) => sum + (d.grossMargin || 0), 0) / currentData.fytd.length).toFixed(2)
                        : 0,
                    avgSales: currentData.fytd?.length > 0
                        ? (currentData.fytd.reduce((sum, d) => sum + (d.sales || 0), 0) / currentData.fytd.length).toFixed(2)
                        : 0
                };
                container.innerHTML = \`
                    <table>
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>Total Salespersons</td><td>\${metrics.totalSalespersons}</td></tr>
                            <tr><td>Average Gross Margin</td><td>\${formatValue(metrics.avgGrossMargin)}</td></tr>
                            <tr><td>Average Sales</td><td>\${formatValue(metrics.avgSales)}</td></tr>
                        </tbody>
                    </table>
                \`;
                return;
            }
            
            if (!Array.isArray(data) || data.length === 0) {
                container.innerHTML = '<p style="color: #718096; padding: 20px; text-align: center;">No data available</p>';
                return;
            }
            
            const filteredData = data.filter(row => {
                if (!searchTerm) return true;
                return Object.values(row).some(val => 
                    String(val || '').toLowerCase().includes(searchTerm.toLowerCase())
                );
            });

            if (filteredData.length === 0) {
                container.innerHTML = '<p style="color: #718096; padding: 20px; text-align: center;">No matching data found for "' + searchTerm + '"</p>';
                return;
            }

            const headers = Object.keys(filteredData[0]);
            let tableHTML = '<table><thead><tr>';
            headers.forEach(header => {
                tableHTML += \`<th>\${formatLabel(header)}</th>\`;
            });
            tableHTML += '</tr></thead><tbody>';

            filteredData.forEach(row => {
                tableHTML += '<tr>';
                headers.forEach(header => {
                    tableHTML += \`<td>\${formatValue(row[header])}</td>\`;
                });
                tableHTML += '</tr>';
            });

            tableHTML += '</tbody></table>';
            container.innerHTML = tableHTML;
        }

        function changeYear(year) {
            selectedYear = year;
            renderDashboard();
            setTimeout(() => {
                createCharts();
            }, 100);
        }

        function changeQuarter(quarter) {
            selectedQuarter = quarter;
            renderDashboard();
            setTimeout(() => {
                createCharts();
            }, 100);
        }

        function changeTab(tab) {
            activeTab = tab;
            searchTerm = '';
            renderDashboard();
            renderTable();
        }

        function handleSearch(event) {
            searchTerm = event.target.value;
            renderTable();
        }

        function formatLabel(str) {
            return str.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();
        }

        function formatValue(val) {
            if (val === null || val === undefined) return '-';
            if (typeof val === 'number') {
                return val.toLocaleString('en-US', { maximumFractionDigits: 2 });
            }
            return String(val);
        }
        
        window.addEventListener('error', function(e) {
            console.error('Global error:', e.error);
            const root = document.getElementById('dashboard-root');
            if (root && !root.querySelector('.error-message')) {
                root.innerHTML += '<div class="error-message" style="padding: 20px; margin-top: 20px; background: #fed7d7; color: #e53e3e; border-radius: 8px; display: flex; align-items: center;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>An error occurred. Check console for details.</div>';
            }
        });
    </script>
</body>
</html>`;
};

