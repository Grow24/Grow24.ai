import React, { useState } from 'react';
import SalesOverviewSection from '../components/SalesOverviewSection';
import QuickOverviewSection from '../components/QuickOverviewSection';
import PerformanceKPISection from '../components/PerformanceKPISection';
import HighlightsSection from '../components/HighlightsSection';
import MonthlyTrendsSection from '../components/MonthlyTrendsSection';

const BusinessInsights = () => {
  const [selectedYear, setSelectedYear] = useState('2017');
  const [selectedQuarter, setSelectedQuarter] = useState('Q1');
  const [comparisonMode, setComparisonMode] = useState('Vs Prior');

  // Mock data
  const salesData = {
    grossProfitYTD: [
      { name: 'Jan', value: 4000 },
      { name: 'Feb', value: 3000 },
      { name: 'Mar', value: 5000 },
    ],
    salesYTD: [
      { name: 'Jan', current: 4000, priorTarget: 3500 },
      { name: 'Feb', current: 3000, priorTarget: 3200 },
      { name: 'Mar', current: 5000, priorTarget: 4500 },
    ],
    costYTD: [
      { name: 'Jan', current: 2000, priorTarget: 1800 },
      { name: 'Feb', current: 1500, priorTarget: 1600 },
      { name: 'Mar', current: 2500, priorTarget: 2200 },
    ],
  };

  const quickOverviewData = {
    salesProfit: [
      { period: 'Jan', priorYTD: 4000, currentYTD: 4500 },
      { period: 'Feb', priorYTD: 8000, currentYTD: 9000 },
      { period: 'Mar', priorYTD: 12000, currentYTD: 13500 },
    ],
  };

  const kpiData = {
    tableData: [
      {
        name: 'John Doe',
        engagementScore: 85,
        targetAchievement: 92,
        productivityScore: 78,
        cycleTime: 15,
        leadGeneration: 45,
        marginsImprovement: 12,
        inquirySize: 25000,
        expense: 5000,
        attendance: 95,
        closureRate: 65,
      },
      // Add more mock data as needed
    ],
  };

  // Mock highlights data
  const highlightsData = [
    {
      title: 'Sales Performance Improvement',
      description: 'Sales have increased by 15% compared to the previous quarter, showing strong growth in key markets.',
      badge: 'Sales',
      badgeType: 'sales'
    },
    {
      title: 'New Customer Acquisition',
      description: 'Successfully acquired 25 new customers this month, exceeding the target of 20.',
      badge: 'Customer',
      badgeType: 'customer'
    },
    {
      title: 'Product Launch Success',
      description: 'New product line launched successfully with positive initial feedback from customers.',
      badge: 'Product',
      badgeType: 'product'
    }
  ];

  // Mock filters state
  const [filters, setFilters] = useState({
    object1Type: '',
    object1Name: '',
    object2Type: '',
    object2Name: ''
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Mock monthly trends data
  const monthlyTrendsData = {
    monthlySales: [
      { month: 'Jan', sales: 4000, salesPriorTarget: 3500, grossProfitPercent: 25 },
      { month: 'Feb', sales: 3000, salesPriorTarget: 3200, grossProfitPercent: 28 },
      { month: 'Mar', sales: 5000, salesPriorTarget: 4500, grossProfitPercent: 30 },
      { month: 'Apr', sales: 4500, salesPriorTarget: 4000, grossProfitPercent: 27 },
      { month: 'May', sales: 5500, salesPriorTarget: 5000, grossProfitPercent: 32 },
      { month: 'Jun', sales: 6000, salesPriorTarget: 5500, grossProfitPercent: 35 }
    ],
    grossProfit: [
      { quarter: 'Q1', grossProfit: 12000, gpPriorTarget: 11000, sales: 12000 },
      { quarter: 'Q2', grossProfit: 16000, gpPriorTarget: 15000, sales: 16000 },
      { quarter: 'Q3', grossProfit: 18000, gpPriorTarget: 17000, sales: 18000 },
      { quarter: 'Q4', grossProfit: 20000, gpPriorTarget: 19000, sales: 20000 }
    ]
  };

  return (
    <div className="content-header">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Business Insights</h1>

      {/* Highlights Section */}
      <HighlightsSection 
        highlights={highlightsData}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Quick Overview */}
      <QuickOverviewSection
        data={quickOverviewData}
        selectedYear={selectedYear}
        selectedQuarter={selectedQuarter}
        comparisonMode={comparisonMode}
        onYearChange={setSelectedYear}
        onQuarterChange={setSelectedQuarter}
        onComparisonChange={setComparisonMode}
      />

      {/* Sales Overview */}
      <SalesOverviewSection
        data={salesData}
        selectedYear={selectedYear}
        comparisonMode={comparisonMode}
        onYearChange={setSelectedYear}
        onComparisonChange={setComparisonMode}
      />

      {/* Monthly Trends */}
      <MonthlyTrendsSection 
        data={monthlyTrendsData}
        selectedYear={selectedYear}
        comparisonMode={comparisonMode}
        onYearChange={setSelectedYear}
        onComparisonChange={setComparisonMode}
      />

      {/* Performance KPIs */}
      <PerformanceKPISection data={kpiData} />
    </div>
  );
};

export default BusinessInsights;
