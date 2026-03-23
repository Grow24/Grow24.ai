# Implementation Examples for Each Dashboard

## How to Integrate Interactive Export with Your Dashboard Components

---

## Example 1: AnalysisByProductSection

**Current state:** Uses static PNG + JSON export  
**Change to:** Interactive HTML with search

### Before:

```javascript
import { downloadDashboard } from "../utils/dashboardDownload";

const AnalysisByProductSection = ({ data }) => {
  const handleDashboardDownload = async () => {
    // Old way - static export
    await downloadDashboard(
      dashboardRef.current,
      "Analysis By Product",
      metadata
    );
  };
};
```

### After:

```javascript
import { downloadInteractiveDashboard } from "../utils/interactiveDashboardDownload";

const AnalysisByProductSection = ({ data, selectedYear, filters }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleInteractiveDownload = async () => {
    setIsDownloading(true);
    try {
      // Prepare dashboard data
      const dashboardData = {
        tableData: filteredData, // Your filtered table data
        metrics: {
          totalProducts: filteredData.length,
          totalSales: filteredData.reduce((sum, row) => sum + row.sales, 0),
          averageGrossProfit:
            filteredData.length > 0
              ? (
                  filteredData.reduce((sum, row) => sum + row.grossProfit, 0) /
                  filteredData.length
                ).toFixed(2)
              : 0,
          totalOrders: filteredData.reduce((sum, row) => sum + row.orders, 0),
        },
      };

      // Prepare metadata
      const metadata = {
        filters: columnFilters, // Your column filter state
        summary: {
          recordCount: filteredData.length,
          exportDate: new Date().toISOString(),
          selectedYear: selectedYear,
        },
      };

      // Download interactive dashboard
      await downloadInteractiveDashboard(
        dashboardData,
        "Analysis By Product",
        metadata
      );
    } catch (error) {
      console.error("Error downloading dashboard:", error);
      alert("Failed to download dashboard. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      {/* Your dashboard content */}
      <button
        onClick={handleInteractiveDownload}
        disabled={isDownloading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {isDownloading
          ? "⏳ Generating..."
          : "📥 Download Interactive Dashboard"}
      </button>
    </div>
  );
};
```

---

## Example 2: SalesOverviewSection

**Change:** Add interactive export to sales charts

```javascript
import { downloadInteractiveDashboard } from "../utils/interactiveDashboardDownload";

const SalesOverviewSection = ({ data, filters }) => {
  const handleDownload = async () => {
    const dashboardData = {
      chartData: data.chartData, // Your Recharts data
      salesMetrics: {
        totalSales: calculateTotalSales(data),
        monthlySales: data.monthlySales,
        yearOverYearGrowth: calculateGrowth(data),
        projectedQ4: calculateProjection(data),
      },
      trendData: data.trendData,
    };

    const metadata = {
      filters,
      summary: {
        dataPoints: data.chartData.length,
        timeRange: `${filters.startPeriod} to ${filters.endPeriod}`,
        analysisType: "Sales Overview",
      },
    };

    await downloadInteractiveDashboard(
      dashboardData,
      "Sales Overview",
      metadata
    );
  };

  return (
    <div>
      <div ref={dashboardRef}>{/* Your sales charts here */}</div>
      <button onClick={handleDownload} className="btn-primary">
        📊 Download Sales Overview
      </button>
    </div>
  );
};
```

---

## Example 3: ProductABCSection

**Change:** Export ABC analysis with interactive table

```javascript
import { downloadInteractiveDashboard } from "../utils/interactiveDashboardDownload";

const ProductABCSection = ({ data, filters }) => {
  const handleDownload = async () => {
    // Organize data by ABC category
    const dashboardData = {
      abcAnalysis: {
        categoryA: data.categoryA, // High value products
        categoryB: data.categoryB, // Medium value products
        categoryC: data.categoryC, // Low value products
      },
      tableData: [...data.categoryA, ...data.categoryB, ...data.categoryC],
      analytics: {
        totalProducts: data.totalProducts,
        categoryACount: data.categoryA.length,
        categoryBCount: data.categoryB.length,
        categoryCCount: data.categoryC.length,
        categoryAValue: calculateCategoryValue(data.categoryA),
        categoryBValue: calculateCategoryValue(data.categoryB),
        categoryCValue: calculateCategoryValue(data.categoryC),
      },
    };

    const metadata = {
      filters,
      summary: {
        analysisType: "Product ABC Analysis",
        totalProductsAnalyzed: data.totalProducts,
        analysisDate: new Date().toISOString(),
      },
    };

    await downloadInteractiveDashboard(
      dashboardData,
      "Product ABC Analysis",
      metadata
    );
  };

  return (
    <div>
      {/* Your ABC analysis components */}
      <button onClick={handleDownload} className="btn-primary">
        📈 Download ABC Analysis
      </button>
    </div>
  );
};
```

---

## Example 4: ReceivablesSection (Complex Dashboard)

**Change:** Export detailed receivables data with drill-downs

```javascript
import { downloadInteractiveDashboard } from "../utils/interactiveDashboardDownload";

const ReceivablesSection = ({ data, filters }) => {
  const handleDownload = async () => {
    const dashboardData = {
      receivablesByAge: {
        current: data.current,
        thirtyDays: data.thirtyDays,
        sixtyDays: data.sixtyDays,
        ninetyDays: data.ninetyDays,
        overNinety: data.overNinety,
      },
      customerBreakdown: data.customerBreakdown, // Table data
      metrics: {
        totalOutstanding: data.totalOutstanding,
        daysOverdue: data.daysOverdue,
        collectionRate: data.collectionRate,
        badDebtReserve: data.badDebtReserve,
      },
      topCustomers: data.topCustomers.slice(0, 10), // Top 10 for export
    };

    const metadata = {
      filters,
      summary: {
        reportType: "Receivables Aging Report",
        reportDate: new Date().toISOString(),
        asOfDate: filters.endPeriod,
        totalRecords: data.customerBreakdown.length,
      },
    };

    await downloadInteractiveDashboard(
      dashboardData,
      "Receivables Report",
      metadata
    );
  };

  return (
    <div>
      {/* Your receivables visualization */}
      <button onClick={handleDownload} className="btn-primary">
        📋 Download Receivables Report
      </button>
    </div>
  );
};
```

---

## Example 5: ForecastingSection (With Predictions)

**Change:** Export forecasting data with scenarios

```javascript
import { downloadInteractiveDashboard } from "../utils/interactiveDashboardDownload";

const ForecastingSection = ({ data, filters }) => {
  const handleDownload = async () => {
    const dashboardData = {
      forecast: {
        baseline: data.baselineProjection,
        optimistic: data.optimisticScenario,
        pessimistic: data.pessimisticScenario,
      },
      historical: data.historicalData,
      accuracy: {
        mape: data.mape,
        rmse: data.rmse,
        confidenceLevel: data.confidenceLevel,
      },
      metrics: {
        nextQuarterForecast: data.q1Forecast,
        nextYearForecast: data.annualForecast,
        growthRate: data.projectedGrowth,
        assumptions: data.assumptions,
      },
    };

    const metadata = {
      filters,
      summary: {
        modelType: "Time Series ARIMA",
        forecastPeriod: "12 months",
        confidenceInterval: "95%",
        lastUpdated: new Date().toISOString(),
      },
    };

    await downloadInteractiveDashboard(
      dashboardData,
      "Sales Forecast",
      metadata
    );
  };

  return (
    <div>
      {/* Your forecast charts and tables */}
      <button onClick={handleDownload} className="btn-primary">
        🔮 Download Forecast Report
      </button>
    </div>
  );
};
```

---

## Generic Template for Any Dashboard

Copy this template for new dashboards:

```javascript
import { downloadInteractiveDashboard } from "../utils/interactiveDashboardDownload";
import { useState } from "react";

const MyDashboardSection = ({ data, filters }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // 1. Prepare dashboard data
      const dashboardData = {
        // Main data to display
        tableData: data.tableData,

        // Calculated metrics
        metrics: {
          total: calculateTotal(data),
          average: calculateAverage(data),
          growth: calculateGrowth(data),
          // Add more metrics...
        },

        // Additional data sections
        details: data.details,
        summary: data.summary,
      };

      // 2. Prepare metadata
      const metadata = {
        // Applied filters
        filters: filters,

        // Summary info
        summary: {
          recordCount: data.tableData?.length || 0,
          exportDate: new Date().toISOString(),
          reportType: "My Dashboard",
          timeRange: `${filters.startPeriod} to ${filters.endPeriod}`,
        },
      };

      // 3. Download
      await downloadInteractiveDashboard(
        dashboardData,
        "My Dashboard Name", // Display name
        metadata
      );
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download dashboard");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      {/* Your dashboard content */}

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="btn-primary"
      >
        {isDownloading ? "⏳ Generating..." : "📥 Download Dashboard"}
      </button>
    </div>
  );
};

export default MyDashboardSection;
```

---

## Helper Functions

Use these to calculate metrics for your exports:

```javascript
// src/utils/dashboardMetrics.js

export const calculateTotal = (data) => {
  return data.tableData?.reduce((sum, row) => sum + (row.value || 0), 0) || 0;
};

export const calculateAverage = (data) => {
  const total = calculateTotal(data);
  const count = data.tableData?.length || 0;
  return count > 0 ? (total / count).toFixed(2) : 0;
};

export const calculateGrowth = (data) => {
  if (!data.current || !data.previous) return 0;
  return (((data.current - data.previous) / data.previous) * 100).toFixed(2);
};

export const calculatePercentage = (value, total) => {
  return total > 0 ? ((value / total) * 100).toFixed(2) : 0;
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
```

---

## Import Example

In your dashboard component:

```javascript
import { downloadInteractiveDashboard } from "../utils/interactiveDashboardDownload";
import {
  calculateTotal,
  calculateAverage,
  calculateGrowth,
} from "../utils/dashboardMetrics";

// Then use in your download handler...
```

---

## Testing Checklist

- [ ] Import works without errors
- [ ] Download button is clickable
- [ ] HTML file is generated
- [ ] File opens in browser
- [ ] Search box works
- [ ] Table displays correctly
- [ ] Filters are shown
- [ ] Print to PDF works
- [ ] File is shareable
- [ ] Mobile view is responsive

---

## Common Patterns

### Pattern 1: Table-based dashboard

```javascript
dashboardData = {
  tableData: filteredData,
  metrics: calculateMetrics(filteredData),
};
```

### Pattern 2: Chart-based dashboard

```javascript
dashboardData = {
  chartData: data.chartData,
  timeSeries: data.timeSeries,
  metrics: data.metrics,
};
```

### Pattern 3: Multi-section dashboard

```javascript
dashboardData = {
  section1: data.section1Data,
  section2: data.section2Data,
  section3: data.section3Data,
  summary: calculateSummary(),
};
```

### Pattern 4: Hierarchical data

```javascript
dashboardData = {
  byCategory: {
    categoryA: data.categoryA,
    categoryB: data.categoryB,
  },
  byRegion: {
    northAmerica: data.north,
    europe: data.europe,
  },
  totals: calculateTotals(),
};
```

---

## Integration Checklist

For each dashboard section:

- [ ] Import `downloadInteractiveDashboard`
- [ ] Create `handleDownload` function
- [ ] Prepare `dashboardData` object
- [ ] Prepare `metadata` object
- [ ] Add download button
- [ ] Test with real data
- [ ] Verify formatting
- [ ] Get user feedback
- [ ] Deploy

---

## Quick Reference

**Import:**

```javascript
import { downloadInteractiveDashboard } from "../utils/interactiveDashboardDownload";
```

**Call:**

```javascript
await downloadInteractiveDashboard(dashboardData, "Name", metadata);
```

**That's it!** The rest is automatic. ✨

---

Ready to implement? Start with your first dashboard and follow the template above!
