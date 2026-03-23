import React, { useState, useEffect } from 'react';
import FilterPanel from '../components/FilterPanel';
import HighlightsSection from '../components/HighlightsSection';
import QuickOverviewSection from '../components/QuickOverviewSection';
import TreemapSection from '../components/TreemapSection';
import MonthlyTrendsSection from '../components/MonthlyTrendsSection';
import SalesOverviewSection from '../components/SalesOverviewSection';
import SalesGrowthAnalysisSection from '../components/SalesGrowthAnalysisSection';
import SalesPersonOverviewSection from '../components/SalesPersonOverviewSection';
import ProductABCSection from '../components/ProductABCSection';
import SalesLastYearVsPriorSection from '../components/SalesLastYearVsPriorSection';
import TopProductsSection from '../components/TopProductsSection';
import CustomerABCSection from '../components/CustomerABCSection';
import TopCustomersSection from '../components/TopCustomersSection';
import AnalysisByProductSection from '../components/AnalysisByProductSection';
import AnalysisByCustomerSection from '../components/AnalysisByCustomerSection';
import ReceivablesSection from '../components/ReceivablesSection';
import TopNProductsByValueSection from '../components/TopNProductsByValueSection';
import TopNProductsByVolumeSection from '../components/TopNProductsByVolumeSection';
import ChannelHealthSection from '../components/ChannelHealthSection';
import ChannelProductSection from '../components/ChannelProductSection';
import CampaignPerformanceSection from '../components/CampaignPerformanceSection';
import VisitDetailsSection from '../components/VisitDetailsSection';
import VisitDataTableSection from '../components/VisitDataTableSection';
import PipelineInquiryFlowSection from '../components/PipelineInquiryFlowSection';
import Top10InquiriesSection from '../components/Top10InquiriesSection';
import ForecastingSection from '../components/ForecastingSection';
import SalesRepCapabilitySection from '../components/SalesRepCapabilitySection';
import PerformanceKPISection from '../components/PerformanceKPISection';
import PerformanceTrackingSection from '../components/PerformanceTrackingSection';
import ProductPortfolioSection from '../components/ProductPortfolioSection';
import VoucherTypeSection from '../components/VoucherTypeSection';
import CustomerAttractivenessSection from '../components/CustomerAttractivenessSection';
import BoosterAnalysisSection from '../components/BoosterAnalysisSection';
import AttractivenessActivityAnalysisSection from '../components/AttractivenessActivityAnalysisSection';

const BusinessPerformance = () => {
  // Filter state
  const [filters, setFilters] = useState({
    accounts: 'All',
    items: 'All',
    itemGroup: 'All',
    productGroup: 'All',
    unitOfMeasure: 'All',
    startPeriod: '2015-04-01',
    endPeriod: '2018-06-30',
    industryGroup: 'All',
    territory: 'All',
  });

  // Highlights filters
  const [highlightFilters, setHighlightFilters] = useState({
    object1Type: 'All',
    object1Name: 'All',
    object2Type: 'All',
    object2Name: 'All',
  });

  // Quick Overview state
  const [selectedYear, setSelectedYear] = useState('2017-18');
  const [selectedQuarter, setSelectedQuarter] = useState('Q1');
  const [comparisonMode, setComparisonMode] = useState('vs Prior');

  // Treemap view modes
  const [itemGroupView, setItemGroupView] = useState('IG');
  const [industryTypeView, setIndustryTypeView] = useState('IT');
  const [productGroupView, setProductGroupView] = useState('IG');

  // Product ABC state
  const [abcBand, setAbcBand] = useState('A');
  
  // Customer ABC state
  const [customerABCBand, setCustomerABCBand] = useState('A');
  
  // Analysis sections year state (independent from main year)
  const [productAnalysisYear, setProductAnalysisYear] = useState('2017');
  const [customerAnalysisYear, setCustomerAnalysisYear] = useState('2017');
  
  // Receivables state
  const [receivablesState, setReceivablesState] = useState({
    viewMode: 'filters', // 'drilldown' | 'filters'
    timeGrouping: 'year', // 'year' | 'quarter' | 'month'
    year: 2017,
  });

  // Default mock data
  const defaultHighlights = [
    {
      title: 'Automative Part Indus',
      description: 'A successful trial in the Automative Parts industry boosts likelihood of securing a customer P.O by 38% and sales cycles by 17 days.',
      badge: 'Inquiry',
      badgeType: 'inquiry',
    },
    {
      title: 'Shiv Dahiya Charan',
      description: 'Shiv Dahiya Charan has the best sales cycle, in terms of days to closure on customer PO basis. His closure rate is 27 days.',
      badge: 'Account',
      badgeType: 'account',
    },
    {
      title: 'Shashank Shekhar',
      description: 'Shashank Shekhar has the worst sales cycle, in terms of days to closure on customer PO basis. His closure rate is 44 days.',
      badge: 'Account',
      badgeType: 'account',
    },
  ];

  const generateDefaultChartData = () => {
    const periods = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return periods.map(period => ({
      period,
      priorYTD: Math.random() * 10000000 + 50000000,
      currentYTD: Math.random() * 10000000 + 45000000,
    }));
  };

  const generateMonthlyData = () => {
    const months = ['APR 2016', 'MAY 2016', 'JUN 2016', 'JUL 2016', 'AUG 2016', 'SEP 2016', 'OCT 2016', 'NOV 2016', 'DEC 2016', 'JAN 2017', 'FEB 2017', 'MAR 2017'];
    return months.map(month => ({
      month,
      sales: Math.random() * 10000000 + 30000000,
      salesPriorTarget: Math.random() * 8000000 + 25000000,
      grossProfitPercent: Math.random() * 30 + 10,
    }));
  };

  const generateQuarterlyData = () => {
    const quarters = ['2015 Q1', '2015 Q2', '2015 Q3', '2015 Q4', '2016 Q1', '2016 Q2', '2016 Q3', '2016 Q4', '2017 Q1', '2017 Q2', '2017 Q3', '2017 Q4', '2018 Q1'];
    return quarters.map(quarter => ({
      quarter,
      grossProfit: Math.random() * 20000000 + 40000000,
      gpPriorTarget: Math.random() * 25000000 + 50000000,
      sales: Math.random() * 50000000 + 60000000,
    }));
  };

  // Data state
  const [summary, setSummary] = useState({ records: 4457, invoices: 2253 });
  const [highlights, setHighlights] = useState(defaultHighlights);
  const [quickOverviewData, setQuickOverviewData] = useState({
    salesProfit: generateDefaultChartData(),
    grossProfit: generateDefaultChartData(),
  });
  const [treemapData, setTreemapData] = useState({
    itemGroup: { mainLabel: 'GEM PHOS', viewOptions: ['IG', 'PG'] },
    industryType: { mainLabel: 'Wire & Tube mfrs', subLabels: ['Steel Wires & Tubes'], viewOptions: ['PG', 'IT'] },
    productGroup: { mainLabel: 'COLD FORMING/COLD EXTRUSION PRODUCTS', viewOptions: ['IG', 'IT'] },
  });
  const [monthlyTrendsData, setMonthlyTrendsData] = useState({
    monthlySales: generateMonthlyData(),
    grossProfit: generateQuarterlyData(),
  });
  const [salesOverviewData, setSalesOverviewData] = useState({
    grossProfitYTD: generateDefaultChartData(),
    salesYTD: generateDefaultChartData().map(d => ({ ...d, current: d.priorYTD, priorTarget: d.currentYTD })),
    costYTD: generateDefaultChartData().map(d => ({ ...d, current: d.priorYTD, priorTarget: d.currentYTD })),
    quantityYTD: generateDefaultChartData().map(d => ({ ...d, current: d.priorYTD, priorTarget: d.currentYTD })),
    salesOverview: [
      { period: '2016 02', sales: 68716265, lySales: 30000000, grossProfitPercent: 30 },
      { period: '2016 03', sales: 80000000, lySales: 42000000, grossProfitPercent: 40 },
      { period: '2016 04', sales: 40000000, lySales: 5000000, grossProfitPercent: 5 },
      { period: '2017 01', sales: 42000000, lySales: 5000000, grossProfitPercent: 5 },
    ],
  });
  const [salesGrowthData, setSalesGrowthData] = useState({
    fytd: [],
    percentVsPrior: [],
  });
  const [salesPersonData, setSalesPersonData] = useState({
    chartData: [],
    tableData: [],
  });
  const [productABCData, setProductABCData] = useState({
    salesYTD: [],
    grossProfitYTD: [],
    mainChart: [],
  });
  const [salesLastYearData, setSalesLastYearData] = useState([]);
  const [topProductsData, setTopProductsData] = useState({
    tableData: [],
    chartData: [],
  });
  const [customerABCData, setCustomerABCData] = useState({
    salesYTD: [],
    grossProfitYTD: [],
    mainChart: [],
  });
  const [topCustomersData, setTopCustomersData] = useState({
    tableData: [],
    chartData: [],
  });
  const [analysisByProductData, setAnalysisByProductData] = useState({
    summary: {},
    tableData: [],
  });
  const [analysisByCustomerData, setAnalysisByCustomerData] = useState({
    summary: {},
    tableData: [],
  });
  const [receivablesData, setReceivablesData] = useState({
    drilldown: {},
    filters: {},
  });
  const [topNByValueData, setTopNByValueData] = useState({
    products: [],
    customers: [],
  });
  const [topNByVolumeData, setTopNByVolumeData] = useState({
    products: [],
    customers: [],
  });
  const [channelHealthData, setChannelHealthData] = useState({
    chartData: [],
    tableData: [],
  });
  const [channelProductData, setChannelProductData] = useState({
    chartData: [],
    tableData: [],
  });
  const [campaignPerformanceData, setCampaignPerformanceData] = useState({
    tableData: [],
  });
  const [visitDetailsData, setVisitDetailsData] = useState({
    heatmap: [],
    table: [],
    dateColumns: [],
  });
  const [visitDataTableData, setVisitDataTableData] = useState({
    tableData: [],
  });
  const [pipelineInquiryFlowData, setPipelineInquiryFlowData] = useState({
    chartData: [],
    tableData: [],
  });
  const [top10InquiriesData, setTop10InquiriesData] = useState({
    tableData: [],
  });
  const [forecastingData, setForecastingData] = useState({
    mainChart: [],
    industryGroup: [],
    territory: [],
    forecastTable: {},
    targetTable: {},
  });
  const [salesRepCapabilityData, setSalesRepCapabilityData] = useState({
    radarData: [],
    tableData: [],
  });
  const [performanceKPIData, setPerformanceKPIData] = useState({
    tableData: [],
  });
  const [performanceTrackingData, setPerformanceTrackingData] = useState({
    tableData: [],
  });
  const [productPortfolioData, setProductPortfolioData] = useState({
    heatmap: [],
    tableData: [],
    dateColumns: [],
  });
  const [voucherTypeData, setVoucherTypeData] = useState({
    chartData: [],
    tableData: [],
  });
  const [customerAttractivenessData, setCustomerAttractivenessData] = useState({
    tableData: [],
  });
  const [boosterAnalysisData, setBoosterAnalysisData] = useState({
    tableData: [],
    minBooster: 0,
    maxBooster: 0,
  });
  const [attractivenessActivityData, setAttractivenessActivityData] = useState({
    tableData: [],
  });
  const [loading, setLoading] = useState(false);

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Generate default mock data for new sections
  const generateSalesGrowthData = () => {
    const fytd = Array.from({ length: 20 }, (_, i) => ({
      grossMargin: (Math.random() - 0.3) * 100000000,
      sales: (Math.random() - 0.2) * 125000000,
      name: `SalesPerson ${i + 1}`,
    }));
    const percentVsPrior = Array.from({ length: 20 }, (_, i) => ({
      percentGrossMargin: (Math.random() - 0.3) * 50000000,
      percentSales: (Math.random() - 0.2) * 125000000,
      name: `SalesPerson ${i + 1}`,
    }));
    return { fytd, percentVsPrior };
  };

  const generateSalesPersonData = () => {
    const periods = ['2018 01', '2017 04', '2017 03', '2017 02', '2017 01', '2016 04'];
    const chartData = periods.map(period => ({
      period,
      currentYTD: Math.random() * 20000000 + 40000000,
      priorYTD: Math.random() * 15000000 + 20000000,
    }));
    const tableData = [
      { name: 'Shiv', sales: 97.90, salesLY: 127.40, target: 117.00, grossProfit: 46.80 },
      { name: 'Aditya', sales: 104.50, salesLY: 127.40, target: 120.90, grossProfit: 48.36 },
      { name: 'Vikas', sales: 105.60, salesLY: 128.80, target: 122.20, grossProfit: 48.88 },
      { name: 'Govind', sales: 26.40, salesLY: 127.40, target: 117.00, grossProfit: 46.80 },
      { name: 'Chetan', sales: 100.10, salesLY: 15.40, target: 117.00, grossProfit: 46.80 },
      { name: 'Sachin', sales: 102.30, salesLY: 119.00, target: 115.70, grossProfit: 46.28 },
      { name: 'Kishor', sales: 108.90, salesLY: 36.40, target: 124.80, grossProfit: 49.92 },
      { name: 'Sanket', sales: 93.50, salesLY: 127.40, target: 114.40, grossProfit: 45.76 },
      { name: 'Akhilesh', sales: 94.60, salesLY: 123.20, target: 113.10, grossProfit: 45.24 },
    ];
    return { chartData, tableData };
  };

  const generateProductABCData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      salesYTD: months.map(month => ({
        month,
        current: Math.random() * 10000000 + 40000000,
        priorTarget: Math.random() * 8000000 + 35000000,
      })),
      grossProfitYTD: months.map(month => ({
        month,
        current: Math.random() * 5000000 + 20000000,
        priorTarget: Math.random() * 4000000 + 18000000,
      })),
      mainChart: [
        { period: '2016.02', salesYTD: 42000000, salesPriorTarget: 5000000, grossProfit: 20000000 },
        { period: '2016.03', salesYTD: 78000000, salesPriorTarget: 38000000, grossProfit: 40000000 },
        { period: '2016.04', salesYTD: 60000000, salesPriorTarget: 22000000, grossProfit: 25000000 },
        { period: '2017.01', salesYTD: 50000000, salesPriorTarget: 12000000, grossProfit: 15000000 },
      ],
    };
  };

  const generateSalesLastYearData = () => {
    return [
      { period: '2016 02', salesLY: 55000000, salesPriorTarget: 15000000, grossProfit: 15000000 },
      { period: '2016 03', salesLY: 55000000, salesPriorTarget: 15000000, grossProfit: 15000000 },
      { period: '2016 04', salesLY: 75000000, salesPriorTarget: 35000000, grossProfit: 35000000 },
      { period: '2017 01', salesLY: 45000000, salesPriorTarget: 10000000, grossProfit: 15000000 },
    ];
  };

  const generateTopProductsData = () => {
    const products = [
      { product: 'GEM PHOS', sales: 512260633.2, vsTarget: 1520, growthRate: 'A', avgSales: 1216, orders: 110 },
      { product: 'ADDITIVE', sales: 70564891.2, vsTarget: 1750, growthRate: 'A', avgSales: 1400, orders: 150 },
      { product: 'DUBOIS', sales: 8209108.0, vsTarget: 1200, growthRate: 'B', avgSales: 960, orders: 120 },
      { product: 'SVM', sales: 7255778.8, vsTarget: 650, growthRate: 'C', avgSales: 520, orders: 65 },
      { product: 'LUBE', sales: 4645009.5, vsTarget: 880, growthRate: 'B', avgSales: 704, orders: 40 },
      { product: 'GEM KOTE', sales: 4147641.1, vsTarget: 600, growthRate: 'A', avgSales: 480, orders: 20 },
      { product: 'RUSTOGEM', sales: 3849227.5, vsTarget: 680, growthRate: 'B', avgSales: 544, orders: 65 },
      { product: 'GEM KLEEN', sales: 2829557.4, vsTarget: 640, growthRate: 'A', avgSales: 512, orders: 55 },
      { product: 'GEM PASS', sales: 1844432.6, vsTarget: 550, growthRate: 'C', avgSales: 440, orders: 50 },
      { product: 'PAINT STRIPPER', sales: 672586.4, vsTarget: 500, growthRate: 'C', avgSales: 400, orders: 33 },
    ];
    return {
      tableData: products,
      chartData: products.map(p => ({ product: p.product, sales: p.sales })),
    };
  };

  const generateCustomerABCData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      salesYTD: months.map(month => ({
        month,
        current: Math.random() * 10000000 + 40000000,
        priorTarget: Math.random() * 8000000 + 35000000,
      })),
      grossProfitYTD: months.map(month => ({
        month,
        current: Math.random() * 5000000 + 20000000,
        priorTarget: Math.random() * 4000000 + 18000000,
      })),
      mainChart: [
        { period: '2016 02', salesYTD: 48000000, salesPriorTarget: 10000000, grossProfit: 20000000 },
        { period: '2016 03', salesYTD: 75000000, salesPriorTarget: 40000000, grossProfit: 45000000 },
        { period: '2016 04', salesYTD: 48000000, salesPriorTarget: 12000000, grossProfit: 15000000 },
        { period: '2017 01', salesYTD: 55000000, salesPriorTarget: 18000000, grossProfit: 25000000 },
      ],
    };
  };

  const generateTopCustomersData = () => {
    const customers = [
      { product: 'BANSAL WIRE INDUSTRIES LTD.', sales: 113903638, vsTarget: 1520, growthRate: 'A', avgSales: 1216, orders: 110 },
      { product: 'Usha Martin Ltd', sales: 58613656, vsTarget: 1750, growthRate: 'A', avgSales: 1400, orders: 150 },
      { product: 'Usha Martin Limited', sales: 41811466, vsTarget: 1200, growthRate: 'B', avgSales: 960, orders: 120 },
      { product: 'AARTI STEELS LIMITED', sales: 34052518, vsTarget: 650, growthRate: 'C', avgSales: 520, orders: 65 },
      { product: 'MAHAJAN ENGG. WORKS', sales: 24929386, vsTarget: 880, growthRate: 'B', avgSales: 704, orders: 40 },
      { product: 'Hanumat Wires Udyog Pvt Ltd.', sales: 24856231, vsTarget: 600, growthRate: 'A', avgSales: 480, orders: 20 },
      { product: 'PUNCH RATNA STEEL PVT LTD', sales: 23969642, vsTarget: 680, growthRate: 'B', avgSales: 544, orders: 65 },
      { product: 'AV WIRES PVT LTD', sales: 16110403, vsTarget: 640, growthRate: 'A', avgSales: 512, orders: 55 },
      { product: 'Bansal High Carbons Pvt Ltd', sales: 14262129, vsTarget: 550, growthRate: 'C', avgSales: 440, orders: 50 },
      { product: 'BAJAJSONS LIMITED ROORKEE', sales: 14095566, vsTarget: 500, growthRate: 'C', avgSales: 400, orders: 33 },
    ];
    return {
      tableData: customers,
      chartData: customers.map(c => ({ product: c.product, sales: c.sales })),
    };
  };

  const generateAnalysisByProductData = () => {
    const products = [
      { product: 'P1', sales: 69050, salesLY: 890506, lyVar: 68, growthStatus: 'B', targetVar: 130, cogs: 110, grossProfit: 110, quantity: 110, orders: 110 },
      { product: 'P1_Jan', sales: 750, salesLY: 1750, lyVar: 34, growthStatus: 'A', targetVar: 150, cogs: 150, grossProfit: 150, quantity: 150, orders: 150 },
      { product: 'P1_Feb', sales: 602, salesLY: 1200, lyVar: 78, growthStatus: 'B', targetVar: 120, cogs: 120, grossProfit: 120, quantity: 120, orders: 120 },
      { product: 'P1_March', sales: 600, salesLY: 650, lyVar: 65, growthStatus: 'C', targetVar: 65, cogs: 65, grossProfit: 65, quantity: 65, orders: 65 },
      { product: 'P1_April', sales: 550, salesLY: 880, lyVar: 55, growthStatus: 'B', targetVar: 40, cogs: 40, grossProfit: 40, quantity: 40, orders: 40 },
      { product: 'P1_May', sales: 450, salesLY: 600, lyVar: 92, growthStatus: 'A', targetVar: 20, cogs: 20, grossProfit: 20, quantity: 20, orders: 20 },
      { product: 'P1_June', sales: 400, salesLY: 680, lyVar: 65, growthStatus: 'B', targetVar: 65, cogs: 65, grossProfit: 65, quantity: 65, orders: 65 },
      { product: 'P1_July', sales: 390, salesLY: 640, lyVar: 55, growthStatus: 'A', targetVar: 55, cogs: 55, grossProfit: 55, quantity: 55, orders: 55 },
      { product: 'P1_Aug', sales: 300, salesLY: 550, lyVar: 95, growthStatus: 'C', targetVar: 50, cogs: 50, grossProfit: 50, quantity: 50, orders: 50 },
      { product: 'P1_Sept', sales: 220, salesLY: 500, lyVar: 99, growthStatus: 'C', targetVar: 33, cogs: 33, grossProfit: 33, quantity: 33, orders: 33 },
      { product: 'P1_Oct', sales: 150, salesLY: 550, lyVar: 55, growthStatus: 'A', targetVar: 55, cogs: 55, grossProfit: 55, quantity: 55, orders: 55 },
      { product: 'P1_Nov', sales: 200, salesLY: 600, lyVar: 60, growthStatus: 'B', targetVar: 60, cogs: 60, grossProfit: 60, quantity: 60, orders: 60 },
      { product: 'P1_Dec', sales: 180, salesLY: 580, lyVar: 58, growthStatus: 'A', targetVar: 58, cogs: 58, grossProfit: 58, quantity: 58, orders: 58 },
    ];
    return {
      summary: {
        sales: '4M',
        salesLY: '3M',
        growthStatus: 'G',
        growthProfit: '54%',
      },
      tableData: products,
    };
  };

  const generateAnalysisByCustomerData = () => {
    const customers = [
      { customer: 'BANSAL WIRE INDUSTRIES LTD.', sales: 113903638, salesLY: 100000000, lyVar: 68, growthStatus: 'A', targetVar: 130, cogs: 110, grossProfit: 110, quantity: 110, orders: 110 },
      { customer: 'Usha Martin Ltd', sales: 58613656, salesLY: 50000000, lyVar: 78, growthStatus: 'A', targetVar: 120, cogs: 120, grossProfit: 120, quantity: 120, orders: 150 },
      { customer: 'Usha Martin Limited', sales: 41811466, salesLY: 40000000, lyVar: 65, growthStatus: 'B', targetVar: 65, cogs: 65, grossProfit: 65, quantity: 65, orders: 120 },
      { customer: 'AARTI STEELS LIMITED', sales: 34052518, salesLY: 35000000, lyVar: 55, growthStatus: 'C', targetVar: 40, cogs: 40, grossProfit: 40, quantity: 40, orders: 65 },
      { customer: 'MAHAJAN ENGG. WORKS', sales: 24929386, salesLY: 25000000, lyVar: 92, growthStatus: 'B', targetVar: 20, cogs: 20, grossProfit: 20, quantity: 20, orders: 40 },
      { customer: 'Hanumat Wires Udyog Pvt Ltd.', sales: 24856231, salesLY: 24000000, lyVar: 65, growthStatus: 'A', targetVar: 65, cogs: 65, grossProfit: 65, quantity: 65, orders: 20 },
      { customer: 'PUNCH RATNA STEEL PVT LTD', sales: 23969642, salesLY: 23000000, lyVar: 55, growthStatus: 'B', targetVar: 55, cogs: 55, grossProfit: 55, quantity: 55, orders: 65 },
      { customer: 'AV WIRES PVT LTD', sales: 16110403, salesLY: 15000000, lyVar: 95, growthStatus: 'A', targetVar: 50, cogs: 50, grossProfit: 50, quantity: 50, orders: 55 },
      { customer: 'Bansal High Carbons Pvt Ltd', sales: 14262129, salesLY: 14000000, lyVar: 99, growthStatus: 'C', targetVar: 33, cogs: 33, grossProfit: 33, quantity: 33, orders: 50 },
      { customer: 'BAJAJSONS LIMITED ROORKEE', sales: 14095566, salesLY: 13000000, lyVar: 55, growthStatus: 'C', targetVar: 55, cogs: 55, grossProfit: 55, quantity: 55, orders: 33 },
    ];
    return {
      summary: {
        sales: '4M',
        salesLY: '3M',
        growthStatus: 'G',
        growthProfit: '54%',
      },
      tableData: customers,
    };
  };

  const generateReceivablesData = () => {
    // Drilldown data
    const drilldown = {
      summary: {
        balance: 4250000,
        overdue: 3000000,
        overduePercent: 61,
      },
      balanceByOverdue: [
        { period: '0-30 Days', value: 500000 },
        { period: '31-60 Days', value: 800000 },
        { period: '61-90 Days', value: 600000 },
        { period: '91-180 Days', value: 400000 },
        { period: '181-365 Days', value: 300000 },
      ],
      balance: [
        { year: 2014, value: 2000000 },
        { year: 2015, value: 2500000 },
        { year: 2016, value: 3500000 },
        { year: 2017, value: 4250000 },
      ],
      avgReceivables: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: Math.random() * 1000000 + 2000000 })),
      beforeDueOverdue: [
        { period: '2014', beforeDue: 1500000, overdue: 500000 },
        { period: '2015', beforeDue: 1800000, overdue: 700000 },
        { period: '2016', beforeDue: 2200000, overdue: 1300000 },
        { period: '2017', beforeDue: 2500000, overdue: 1750000 },
      ],
      overduePercent: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, value: Math.random() * 20 + 50 })),
      avgPaymentTerms: [
        { year: 2014, value: 60 },
        { year: 2015, value: 55 },
        { year: 2016, value: 45 },
        { year: 2017, value: 50 },
      ],
      averageDueDays: [
        { year: 2014, value: 100 },
        { year: 2015, value: 150 },
        { year: 2016, value: 250 },
        { year: 2017, value: 350 },
      ],
      receivableTurnover: [
        { year: 2014, value: 42 },
        { year: 2015, value: 75 },
        { year: 2016, value: 69 },
        { year: 2017, value: 76 },
      ],
      receivableCoefficient: [
        { year: 2014, value: 2.5 },
        { year: 2015, value: 3.2 },
        { year: 2016, value: 4.1 },
        { year: 2017, value: 4.8 },
      ],
      salesInReceivables: [
        { year: 2014, value: 0.9 },
        { year: 2015, value: 1.2 },
        { year: 2016, value: 2.0 },
        { year: 2017, value: 4.2 },
      ],
      salesOnCredit: [
        { year: 2014, value: 6 },
        { year: 2015, value: 7 },
        { year: 2016, value: 8 },
        { year: 2017, value: 12 },
      ],
      customerNetChange: [
        { year: 2014, value: 0.9 },
        { year: 2015, value: 0.2 },
        { year: 2016, value: 0.75 },
        { year: 2017, value: 2.3 },
      ],
      balanceBySalesPerson: [
        { person: 'SALES1', value: 1200000 },
        { person: 'SALES2', value: 1000000 },
        { person: 'SALES3', value: 800000 },
        { person: 'SALES4', value: 600000 },
        { person: 'SALES5', value: 650000 },
      ],
    };

    // Filters data
    const filters = {
      summary: {
        balance: 4250000,
        overdue: 3000000,
        overduePercent: 61,
      },
      balance: [
        { period: '2014', value: 2000000 },
        { period: '2015', value: 2500000 },
        { period: '2016', value: 3500000 },
        { period: '2017', value: 4250000 },
      ],
      beforeDueOverdue: [
        { period: '2014', beforeDue: 1500000, overdue: 500000 },
        { period: '2015', beforeDue: 1800000, overdue: 700000 },
        { period: '2016', beforeDue: 2200000, overdue: 1300000 },
        { period: '2017', beforeDue: 2500000, overdue: 1750000 },
      ],
      overduePercent: [
        { month: 'Jan', y2014: 45, y2015: 50, y2016: 55, y2017: 60 },
        { month: 'Feb', y2014: 48, y2015: 52, y2016: 58, y2017: 62 },
        { month: 'Mar', y2014: 50, y2015: 54, y2016: 60, y2017: 64 },
        { month: 'Apr', y2014: 52, y2015: 56, y2016: 62, y2017: 66 },
        { month: 'May', y2014: 54, y2015: 58, y2016: 64, y2017: 68 },
        { month: 'Jun', y2014: 56, y2015: 60, y2016: 66, y2017: 70 },
        { month: 'Jul', y2014: 58, y2015: 62, y2016: 68, y2017: 72 },
        { month: 'Aug', y2014: 59, y2015: 63, y2016: 69, y2017: 73 },
        { month: 'Sep', y2014: 60, y2015: 64, y2016: 70, y2017: 74 },
      ],
      avgPaymentTerms: [
        { year: 2014, value: 60 },
        { year: 2015, value: 55 },
        { year: 2016, value: 45 },
        { year: 2017, value: 50 },
      ],
      averageDueDays: [
        { year: 2014, value: 100 },
        { year: 2015, value: 150 },
        { year: 2016, value: 250 },
        { year: 2017, value: 350 },
      ],
      receivableTurnover: [
        { year: 2014, value: 42 },
        { year: 2015, value: 75 },
        { year: 2016, value: 69 },
        { year: 2017, value: 76 },
      ],
      customerNetChange: [
        { year: 2014, value: 0.9 },
        { year: 2015, value: 0.2 },
        { year: 2016, value: 0.75 },
        { year: 2017, value: 2.3 },
      ],
      salesInReceivables: [
        { year: 2014, value: 0.9 },
        { year: 2015, value: 1.2 },
        { year: 2016, value: 2.0 },
        { year: 2017, value: 4.2 },
      ],
      salesOnCredit: [
        { year: 2014, value: 6 },
        { year: 2015, value: 7 },
        { year: 2016, value: 8 },
        { year: 2017, value: 12 },
      ],
    };

    return { drilldown, filters };
  };

  const generateTopNByValueData = () => {
    const generateTrendSeries = (startDate, endDate, baseValue) => {
      const series = [];
      const start = new Date(startDate);
      const end = new Date(endDate);
      let current = new Date(start);
      
      while (current <= end) {
        series.push({
          date: current.toISOString().split('T')[0],
          value: baseValue + Math.random() * baseValue * 0.3 - baseValue * 0.15,
        });
        current.setMonth(current.getMonth() + 1);
      }
      return series;
    };

    const generateSeasonalitySeries = (startDate, endDate, baseValue) => {
      const series = [];
      const start = new Date(startDate);
      const end = new Date(endDate);
      let current = new Date(start);
      
      while (current <= end) {
        const month = current.getMonth();
        const seasonalFactor = Math.sin((month / 12) * 2 * Math.PI) * 0.3;
        series.push({
          date: current.toISOString().split('T')[0],
          value: baseValue * seasonalFactor,
        });
        current.setMonth(current.getMonth() + 1);
      }
      return series;
    };

    const products = [
      {
        name: 'COLD FORMING/COLD EXTRUSION PRODUCTS',
        trendSeries: generateTrendSeries('2015-04-01', '2018-06-30', 15000000),
        seasonalitySeries: generateSeasonalitySeries('2015-04-01', '2018-06-30', 15000000),
      },
      {
        name: 'PAINT PRETREATMENT CHEMICALS',
        trendSeries: generateTrendSeries('2015-04-06', '2018-06-06', 5000000),
        seasonalitySeries: generateSeasonalitySeries('2015-04-06', '2018-06-06', 5000000),
      },
      {
        name: 'ACID INHIBITORS',
        trendSeries: generateTrendSeries('2016-04-05', '2018-05-05', 3000000),
        seasonalitySeries: generateSeasonalitySeries('2016-04-05', '2018-05-05', 3000000),
      },
    ];

    const customers = products.map(p => ({
      name: `Customer ${p.name}`,
      trendSeries: p.trendSeries,
      seasonalitySeries: p.seasonalitySeries,
    }));

    return { products, customers };
  };

  const generateTopNByVolumeData = () => {
    const generateTrendSeries = (startDate, endDate, baseValue) => {
      const series = [];
      const start = new Date(startDate);
      const end = new Date(endDate);
      let current = new Date(start);
      
      while (current <= end) {
        series.push({
          date: current.toISOString().split('T')[0],
          value: baseValue + Math.random() * baseValue * 0.3 - baseValue * 0.15,
        });
        current.setMonth(current.getMonth() + 1);
      }
      return series;
    };

    const generateSeasonalitySeries = (startDate, endDate, baseValue) => {
      const series = [];
      const start = new Date(startDate);
      const end = new Date(endDate);
      let current = new Date(start);
      
      while (current <= end) {
        const month = current.getMonth();
        const seasonalFactor = Math.sin((month / 12) * 2 * Math.PI) * 0.3;
        series.push({
          date: current.toISOString().split('T')[0],
          value: baseValue * seasonalFactor,
        });
        current.setMonth(current.getMonth() + 1);
      }
      return series;
    };

    const products = [
      {
        name: 'COLD FORMING/COLD EXTRUSION PRODUCTS',
        trendSeries: generateTrendSeries('2015-04-06', '2018-06-06', 10000),
        seasonalitySeries: generateSeasonalitySeries('2015-04-06', '2018-06-06', 10000),
      },
      {
        name: 'PAINT PRETREATMENT CHEMICALS',
        trendSeries: generateTrendSeries('2015-04-06', '2018-06-06', 5000),
        seasonalitySeries: generateSeasonalitySeries('2015-04-06', '2018-06-06', 5000),
      },
    ];

    const customers = products.map(p => ({
      name: `Customer ${p.name}`,
      trendSeries: p.trendSeries,
      seasonalitySeries: p.seasonalitySeries,
    }));

    return { products, customers };
  };

  const generateChannelHealthData = () => {
    const chartData = [
      { channel: 'DIRECT', revenue: 1100000, volume: 75 },
      { channel: 'CONFERENCE', revenue: 800000, volume: 50 },
      { channel: 'HFS', revenue: 450000, volume: 100 },
      { channel: 'MR', revenue: 200000, volume: 25 },
      { channel: 'WEBSITE', revenue: 150000, volume: 50 },
      { channel: 'BLOG', revenue: 50000, volume: 25 },
      { channel: 'E-COMMERCE', revenue: 10000, volume: 125 },
    ];

    const tableData = [
      { channel: 'Blog', cp: 'Customer', cpType: 'Distributor', newLeads: 51, leadsClosed: 45, revenueVal: 655121, revenueVol: 2, pipelineVal: 648600, pipelineVol: 5 },
      { channel: 'Website', cp: 'Owned', cpType: 'Factory', newLeads: 61, leadsClosed: 55, revenueVal: 465161, revenueVol: 3, pipelineVal: 458640, pipelineVol: 2 },
      { channel: 'Conference', cp: 'Owned', cpType: 'Factory', newLeads: 43, leadsClosed: 37, revenueVal: 56465, revenueVol: 4, pipelineVal: 49944, pipelineVol: 7 },
      { channel: 'HFS', cp: 'Suppliers', cpType: 'Warehouse', newLeads: 35, leadsClosed: 30, revenueVal: 450000, revenueVol: 100, pipelineVal: 420000, pipelineVol: 120 },
      { channel: 'MR', cp: 'Customer', cpType: 'Workshop', newLeads: 28, leadsClosed: 25, revenueVal: 200000, revenueVol: 25, pipelineVal: 180000, pipelineVol: 30 },
      { channel: 'DIRECT', cp: 'Owned', cpType: 'Factory', newLeads: 120, leadsClosed: 110, revenueVal: 1100000, revenueVol: 75, pipelineVal: 1050000, pipelineVol: 90 },
      { channel: 'E-COMMERCE', cp: 'Owned', cpType: 'Retailer', newLeads: 15, leadsClosed: 12, revenueVal: 10000, revenueVol: 125, pipelineVal: 8000, pipelineVol: 150 },
    ];

    return { chartData, tableData };
  };

  const generateChannelProductData = () => {
    const chartData = [
      { year: '2015-16', hfs: 15, mr: 20 },
      { year: '2016-17', hfs: 12, mr: 21 },
      { year: '2017-18', hfs: 20, mr: 32 },
    ];

    const tableData = [
      { channel: 'HFS', product: 'A', y2015_16: 15, y2016_17: 12, y2017_18: 21 },
      { channel: 'HFS', product: 'B', y2015_16: 10, y2016_17: 55, y2017_18: 12 },
      { channel: 'HFS', product: 'C', y2015_16: 21, y2016_17: 22, y2017_18: 32 },
      { channel: 'HFS', product: 'D', y2015_16: 18, y2016_17: 15, y2017_18: 25 },
      { channel: 'HFS', product: 'E', y2015_16: 14, y2016_17: 18, y2017_18: 28 },
      { channel: 'MR', product: 'A', y2015_16: 20, y2016_17: 21, y2017_18: 32 },
      { channel: 'MR', product: 'B', y2015_16: 15, y2016_17: 18, y2017_18: 22 },
      { channel: 'MR', product: 'C', y2015_16: 22, y2016_17: 25, y2017_18: 35 },
      { channel: 'MR', product: 'D', y2015_16: 19, y2016_17: 20, y2017_18: 28 },
      { channel: 'MR', product: 'E', y2015_16: 16, y2016_17: 19, y2017_18: 30 },
    ];

    return { chartData, tableData };
  };

  const generateCampaignPerformanceData = () => {
    const tableData = [
      { campaignName: 'C1', type: 'Direct Email', startDate: '01-11-2017', endDate: '31-12-2017', status: 'Budgeted', budgeted: 15000, actualCost: 14440, expectedRevenue: 6500000, revenue: 320653 },
      { campaignName: 'C2', type: 'Direct Email', startDate: '01-11-2017', endDate: '31-12-2017', status: 'Budgeted', budgeted: 12000, actualCost: 11440, expectedRevenue: 112000, revenue: 12500 },
      { campaignName: 'C3', type: 'Direct Email', startDate: '01-11-2017', endDate: '31-12-2017', status: 'Budgeted', budgeted: 20000, actualCost: 19500, expectedRevenue: 8000000, revenue: 7500000 },
      { campaignName: 'C4', type: 'Direct Email', startDate: '01-11-2017', endDate: '31-12-2017', status: 'Budgeted', budgeted: 10000, actualCost: 9800, expectedRevenue: 500000, revenue: 480000 },
      { campaignName: 'C5', type: 'Direct Email', startDate: '01-11-2017', endDate: '31-12-2017', status: 'Budgeted', budgeted: 18000, actualCost: 17200, expectedRevenue: 7200000, revenue: 6800000 },
      { campaignName: 'C6', type: 'Direct Email', startDate: '01-11-2017', endDate: '31-12-2017', status: 'Budgeted', budgeted: 14000, actualCost: 13500, expectedRevenue: 5600000, revenue: 5200000 },
      { campaignName: 'C7', type: 'Direct Email', startDate: '01-11-2017', endDate: '31-12-2017', status: 'Budgeted', budgeted: 16000, actualCost: 15400, expectedRevenue: 6400000, revenue: 6000000 },
      { campaignName: 'C8', type: 'Direct Email', startDate: '01-11-2017', endDate: '31-12-2017', status: 'Budgeted', budgeted: 13000, actualCost: 12500, expectedRevenue: 5200000, revenue: 4800000 },
      { campaignName: 'C9', type: 'Direct Email', startDate: '01-11-2017', endDate: '31-12-2017', status: 'Budgeted', budgeted: 17000, actualCost: 16300, expectedRevenue: 6800000, revenue: 6400000 },
      { campaignName: 'C10', type: 'Direct Email', startDate: '01-11-2017', endDate: '31-12-2017', status: 'Budgeted', budgeted: 11000, actualCost: 10600, expectedRevenue: 4400000, revenue: 4000000 },
      { campaignName: 'C11', type: 'Direct Email', startDate: '01-11-2017', endDate: '31-12-2017', status: 'Budgeted', budgeted: 19000, actualCost: 18200, expectedRevenue: 7600000, revenue: 7200000 },
    ];

    return { tableData };
  };

  const generateVisitDetailsData = () => {
    const dateColumns = ['01/08', '02/08', '03/08', '04/08', '05/08', '06/08', '07/08', '08/08', '09/08', '10/08'];
    const heatmap = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(label => ({
      label,
      values: Array.from({ length: 10 }, () => Math.floor(Math.random() * 1000)),
    }));

    const table = [
      { accountName: 'A1', bestGuessAmount: 53122, probability: 80.26, amount: 32000, stage: 'Quotation', days: 23 },
      { accountName: 'A2', bestGuessAmount: 34422, probability: 72.55, amount: 32265, stage: 'Closed Won', days: 66 },
      { accountName: 'A3', bestGuessAmount: 21000, probability: 70.66, amount: 17650, stage: 'Closed Won', days: 56 },
      { accountName: 'A4', bestGuessAmount: 112471.4, probability: 68.29, amount: 82650, stage: 'Closed Lost', days: 50 },
      { accountName: 'A5', bestGuessAmount: 98882.6, probability: 37.03, amount: 95453, stage: 'Quotation', days: 37 },
      { accountName: 'A6', bestGuessAmount: 11271.4, probability: 33.25, amount: 11035, stage: 'New', days: 30 },
      { accountName: 'A7', bestGuessAmount: 12060.2, probability: 29.47, amount: 8500, stage: 'Trial', days: 54 },
      { accountName: 'A8', bestGuessAmount: 85293.8, probability: 40.81, amount: 80156, stage: 'Trial', days: 55 },
      { accountName: 'A9', bestGuessAmount: 65432.1, probability: 65.43, amount: 54321, stage: 'Quotation', days: 42 },
    ];

    return { heatmap, table, dateColumns };
  };

  const generateVisitDataTableData = () => {
    const tableData = Array.from({ length: 9 }, (_, i) => ({
      date: `0${i + 1}-May`,
      visitName: (i + 1).toString(),
      accLeadName: `A${i + 1}`,
      status: 'Success',
    }));

    return { tableData };
  };

  const generatePipelineInquiryFlowData = () => {
    const chartData = [
      { month: 'Jan 2017', value: 2 },
      { month: 'Feb 2017', value: 4 },
      { month: 'Mar 2017', value: 3 },
    ];

    const tableData = [
      { date: '2017-01-20', stage: 'New', id: 1, status: 'Pipeline', name: 1, soAmt: 325000, n: 1 },
      { date: '2017-01-23', stage: 'Req', id: 1, status: 'Pipeline', name: 1, soAmt: 650000, n: 1 },
      { date: '2017-01-24', stage: 'Trial', id: 1, status: 'Pipeline', name: 1, soAmt: 975000, n: 1 },
      { date: '2017-02-11', stage: 'Quotation', id: 1, status: 'Pipeline', name: 1, soAmt: 1300000, n: 1 },
      { date: '2017-02-14', stage: 'Negotiation', id: 1, status: 'Pipeline', name: 1, soAmt: 1625000, n: 1 },
      { date: '2017-03-21', stage: 'CL', id: 1, status: 'CL', name: 1, soAmt: 1950000, n: 1 },
      { date: '2017-01-14', stage: 'New', id: 2, status: 'Pipeline', name: 2, soAmt: 325000, n: 1 },
      { date: '2017-01-28', stage: 'Req', id: 2, status: 'Pipeline', name: 2, soAmt: 650000, n: 1 },
      { date: '2017-01-31', stage: 'Trial', id: 2, status: 'Pipeline', name: 2, soAmt: 975000, n: 1 },
      { date: '2017-02-16', stage: 'Quotation', id: 2, status: 'Pipeline', name: 2, soAmt: 1300000, n: 1 },
      { date: '2017-03-12', stage: 'Negotiation', id: 2, status: 'Pipeline', name: 2, soAmt: 1625000, n: 1 },
      { date: '2017-03-27', stage: 'CL', id: 2, status: 'CL', name: 2, soAmt: 1950000, n: 1 },
      { date: '2017-01-06', stage: 'New', id: 3, status: 'Pipeline', name: 3, soAmt: 325000, n: 1 },
      { date: '2017-01-13', stage: 'Req', id: 3, status: 'Pipeline', name: 3, soAmt: 650000, n: 1 },
    ];

    return { chartData, tableData };
  };

  const generateTop10InquiriesData = () => {
    const tableData = [
      { accountName: 'A1', bestGuessAmount: 53122.0, probability: 80.26, amount: 32000, stage: 3, days: 23 },
      { accountName: 'A2', bestGuessAmount: 34422.0, probability: 72.55, amount: 32265, stage: 5, days: 66 },
      { accountName: 'A3', bestGuessAmount: 21000.0, probability: 70.66, amount: 17650, stage: 5, days: 56 },
      { accountName: 'A4', bestGuessAmount: 112471.4, probability: 68.29, amount: 82650, stage: 4, days: 50 },
      { accountName: 'A5', bestGuessAmount: 98882.6, probability: 37.03, amount: 95453, stage: 3, days: 37 },
      { accountName: 'A6', bestGuessAmount: 11271.4, probability: 33.25, amount: 11035, stage: 1, days: 30 },
      { accountName: 'A7', bestGuessAmount: 12060.2, probability: 29.47, amount: 8500, stage: 2, days: 54 },
      { accountName: 'A8', bestGuessAmount: 85293.8, probability: 40.81, amount: 80156, stage: 2, days: 55 },
      { accountName: 'A9', bestGuessAmount: 65432.1, probability: 65.43, amount: 54321, stage: 3, days: 42 },
      { accountName: 'A10', bestGuessAmount: 54321.0, probability: 60.00, amount: 45000, stage: 4, days: 38 },
    ];

    return { tableData };
  };

  const generateForecastingData = () => {
    const mainChart = [
      { month: 'Jan 2017', cumulativeActual: 50, cumulativeForecasting: 60 },
      { month: 'Feb 2017', cumulativeActual: 120, cumulativeForecasting: 130 },
      { month: 'Mar 2017', cumulativeActual: 200, cumulativeForecasting: 210 },
      { month: 'Apr 2017', cumulativeActual: 280, cumulativeForecasting: 290 },
      { month: 'May 2017', cumulativeActual: 360, cumulativeForecasting: 370 },
      { month: 'Jun 2017', cumulativeActual: 440, cumulativeForecasting: 450 },
      { month: 'Jul 2017', cumulativeActual: 520, cumulativeForecasting: 530 },
      { month: 'Aug 2017', cumulativeActual: 600, cumulativeForecasting: 610 },
      { month: 'Sep 2017', cumulativeActual: 680, cumulativeForecasting: 690 },
      { month: 'Oct 2017', cumulativeActual: 760, cumulativeForecasting: 770 },
      { month: 'Nov 2017', cumulativeActual: 840, cumulativeForecasting: 850 },
      { month: 'Dec 2017', cumulativeActual: 920, cumulativeForecasting: 930 },
    ];

    const industryGroup = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      value: Math.random() * 200 + 100,
    }));

    const territory = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      value: Math.random() * 300 + 150,
    }));

    const months = ['Jan-17', 'Feb-17', 'Mar-17', 'Apr-17', 'May-17', 'Jun-17', 'Jul-17', 'Aug-17', 'Sep-17', 'Oct-17', 'Nov-17', 'Dec-17'];
    const forecastValues = [1720, 2314, 1555, 2182, 2655, 1984, 1764, 1698, 1742, 1885, 2413, 1962];
    const targetValues = [2677, 2457, 2259, 1731, 2248, 2369, 1929, 2336, 2402, 1918, 2446, 2281];
    const actualValues = [1940, 2666, 2105, 1753, 2028, 2127, 1588, 2072, 2644, 1665, 2380, 1533];
    const pipelineValues = [2435, 1643, 2094, 1863, 1676, 2523, 2303, 2171, 2006, 1654, 1973, 2215];

    return {
      mainChart,
      industryGroup,
      territory,
      forecastTable: { months, values: forecastValues },
      targetTable: { months, target: targetValues, actual: actualValues, pipeline: pipelineValues },
    };
  };

  const generateSalesRepCapabilityData = () => {
    const competencies = [
      'Product Knowledge',
      'Market Development Process',
      'Sales Process',
      'Consultative Selling',
      'Account Management and Forecasting',
      'Customer Service',
      'Sales Technology',
      'Prospecting',
      'Professionalism',
      'Sales Financials',
      'Sales Compensation',
      'Leadership',
    ];

    const radarData = competencies.map(comp => ({
      competency: comp,
      shiv: Math.random() * 5 + 5,
      aditya: Math.random() * 5 + 5,
    }));

    const tableData = [
      { name: 'Rajesh', engagementScore: 3.7, targetAchievement: 1.1, productivityScore: 7.9, cycleTime: 3.1, leadGeneration: 5.3, marginsImprovement: 3.5, inquirySize: 8.5, expense: 4.9, attendance: 2.7, closureRate: 2.9 },
      { name: 'Shiv', engagementScore: 8.3, targetAchievement: 4.7, productivityScore: 3.9, cycleTime: 9.5, leadGeneration: 6.1, marginsImprovement: 1.5, inquirySize: 6.7, expense: 3.3, attendance: 1.7, closureRate: 8.1 },
      { name: 'Divakar', engagementScore: 3.9, targetAchievement: 4.7, productivityScore: 0.5, cycleTime: 7.9, leadGeneration: 0.9, marginsImprovement: 5.1, inquirySize: 8.1, expense: 2.9, attendance: 3.1, closureRate: 7.7 },
      { name: 'Aditya', engagementScore: 1.7, targetAchievement: 7.3, productivityScore: 6.9, cycleTime: 9.1, leadGeneration: 4.9, marginsImprovement: 5.9, inquirySize: 2.1, expense: 6.3, attendance: 7.7, closureRate: 0.9 },
      { name: 'Sachin', engagementScore: 5.7, targetAchievement: 7.1, productivityScore: 8.9, cycleTime: 9.1, leadGeneration: 6.5, marginsImprovement: 8.3, inquirySize: 2.1, expense: 0.7, attendance: 4.9, closureRate: 7.3 },
      { name: 'Vikas', engagementScore: 4.5, targetAchievement: 1.3, productivityScore: 3.5, cycleTime: 6.5, leadGeneration: 4.9, marginsImprovement: 1.7, inquirySize: 2.3, expense: 8.1, attendance: 7.7, closureRate: 2.5 },
      { name: 'Kishor', engagementScore: 9.1, targetAchievement: 2.7, productivityScore: 6.5, cycleTime: 2.1, leadGeneration: 5.9, marginsImprovement: 4.5, inquirySize: 1.9, expense: 5.5, attendance: 1.5, closureRate: 3.9 },
      { name: 'Govind', engagementScore: 7.9, targetAchievement: 1.1, productivityScore: 5.9, cycleTime: 5.3, leadGeneration: 6.9, marginsImprovement: 3.1, inquirySize: 4.1, expense: 3.9, attendance: 8.9, closureRate: 3.3 },
    ];

    return { radarData, tableData };
  };

  const generatePerformanceKPIData = () => {
    // Same structure as SalesRepCapability table data
    return {
      tableData: [
        { name: 'Rajesh', engagementScore: 3.7, targetAchievement: 1.1, productivityScore: 7.9, cycleTime: 3.1, leadGeneration: 5.3, marginsImprovement: 3.5, inquirySize: 8.5, expense: 4.9, attendance: 2.7, closureRate: 2.9 },
        { name: 'Shiv', engagementScore: 8.3, targetAchievement: 4.7, productivityScore: 3.9, cycleTime: 9.5, leadGeneration: 6.1, marginsImprovement: 1.5, inquirySize: 6.7, expense: 3.3, attendance: 1.7, closureRate: 8.1 },
        { name: 'Divakar', engagementScore: 3.9, targetAchievement: 4.7, productivityScore: 0.5, cycleTime: 7.9, leadGeneration: 0.9, marginsImprovement: 5.1, inquirySize: 8.1, expense: 2.9, attendance: 3.1, closureRate: 7.7 },
        { name: 'Aditya', engagementScore: 1.7, targetAchievement: 7.3, productivityScore: 6.9, cycleTime: 9.1, leadGeneration: 4.9, marginsImprovement: 5.9, inquirySize: 2.1, expense: 6.3, attendance: 7.7, closureRate: 0.9 },
        { name: 'Sachin', engagementScore: 5.7, targetAchievement: 7.1, productivityScore: 8.9, cycleTime: 9.1, leadGeneration: 6.5, marginsImprovement: 8.3, inquirySize: 2.1, expense: 0.7, attendance: 4.9, closureRate: 7.3 },
        { name: 'Vikas', engagementScore: 4.5, targetAchievement: 1.3, productivityScore: 3.5, cycleTime: 6.5, leadGeneration: 4.9, marginsImprovement: 1.7, inquirySize: 2.3, expense: 8.1, attendance: 7.7, closureRate: 2.5 },
        { name: 'Kishor', engagementScore: 9.1, targetAchievement: 2.7, productivityScore: 6.5, cycleTime: 2.1, leadGeneration: 5.9, marginsImprovement: 4.5, inquirySize: 1.9, expense: 5.5, attendance: 1.5, closureRate: 3.9 },
        { name: 'Govind', engagementScore: 7.9, targetAchievement: 1.1, productivityScore: 5.9, cycleTime: 5.3, leadGeneration: 6.9, marginsImprovement: 3.1, inquirySize: 4.1, expense: 3.9, attendance: 8.9, closureRate: 3.3 },
      ],
    };
  };

  const generatePerformanceTrackingData = () => {
    const tableData = Array.from({ length: 35 }, (_, i) => {
      const annualTarget = Math.random() * 500000 + 400000;
      const ytdTarget = Math.random() * 50000 + 20000;
      const ytdAccount = Math.floor(Math.random() * 10) + 1;
      const targetGap = annualTarget - ytdTarget;
      const pipeline = Math.random() * 10000 + 2000;
      const ppGap = Math.random() * 10000 + 5000;

      // Generate sparkline data (past 3 months)
      const sparkline = Array.from({ length: 3 }, () => ({
        value: Math.random() * 100 + 50,
      }));

      return {
        account: `A${i + 31}`,
        sparkline,
        annualTarget: Math.floor(annualTarget),
        ytdTarget: Math.floor(ytdTarget),
        ytdAccount,
        targetGap: Math.floor(targetGap),
        pipeline: Math.floor(pipeline),
        ppGap: Math.floor(ppGap),
      };
    });

    return { tableData };
  };

  const generateProductPortfolioData = () => {
    const products = [
      'Accelerator',
      'Borax Penta Hydrate - V B',
      'Degreasing',
      'Derustogem',
      'Double Cut ONYX 35',
      'DRYLUBE 36',
      'DRYLUBE 39A',
      'DRYLUBE 45 E',
      'DRYLUBE 45 T',
      'DUBOIS 200',
      'Gem Activate',
      'Gem Inhibitor D',
      'Gem Inhibitor H',
      'Gem Inhibitor S',
      'Gem Kleen',
      'Gem Kleen-2',
      'Gem Kleen-3',
      'Gem Kote 210',
      'Gem Kote 30',
      'GEM KOTE 30',
      'Gem Lube',
      'Gem OL-3',
      'Gem Passivation',
      'GEM PHOS 33',
      'GEM PHOS 333',
      'Gem Phos 30',
      'Gem Phos 300',
      'Gem Phos 330',
      'Gem Phos 333A',
      'Gem Phos 333E',
    ];

    // Generate date columns (monthly from Apr 2015 to Jun 2018)
    const dateColumns = [];
    const startDate = new Date('2015-04-01');
    const endDate = new Date('2018-06-01');
    let current = new Date(startDate);
    while (current <= endDate) {
      dateColumns.push(current.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
      current.setMonth(current.getMonth() + 1);
    }

    // Generate heatmap data
    const heatmap = products.map(product => ({
      product,
      values: Array.from({ length: dateColumns.length }, () => Math.floor(Math.random() * 1000)),
    }));

    // Generate table data
    const tableData = [
      { date: '2015-04-01', item: 'Accelerator', amount: 903979 },
      { date: '2015-04-01', item: 'Derustogem', amount: 12647 },
      { date: '2015-04-01', item: 'Gem Activate', amount: 48351 },
      { date: '2015-04-01', item: 'Gem Inhibitor H', amount: 134345 },
      { date: '2015-04-01', item: 'Gem Inhibitor S', amount: 38658 },
      { date: '2015-04-01', item: 'Gem Kleen', amount: 48351 },
      { date: '2015-04-01', item: 'Gem Kleen-3', amount: 17695 },
      { date: '2015-04-01', item: 'Gem Kote 210', amount: 45183 },
      { date: '2015-04-01', item: 'Gem Kote 30', amount: 5048 },
      { date: '2015-04-01', item: 'Gem Phos 300', amount: 2586299 },
      { date: '2015-04-01', item: 'Gem Phos 330', amount: 1025179 },
      { date: '2015-04-01', item: 'GEM PHOS 333', amount: 2903480 },
      { date: '2015-04-01', item: 'Gem Phos 333A', amount: 511964 },
      { date: '2015-04-01', item: 'Gem Phos 333E', amount: 374253 },
    ];

    return { heatmap, tableData, dateColumns };
  };

  const generateVoucherTypeData = () => {
    const chartData = [
      { date: 'Aug 1', base1: 2, base2: 0 },
      { date: 'Aug 2', base1: 4, base2: 9 },
      { date: 'Aug 3', base1: 4, base2: 10 },
      { date: 'Aug 4', base1: 3, base2: 6 },
      { date: 'Aug 5', base1: 3, base2: 15 },
      { date: 'Aug 6', base1: 5, base2: 0 },
    ];

    const tableData = [
      { date: '2015-04-01', item: 'Accelerator', amount: 903979 },
      { date: '2015-04-01', item: 'Derustogem', amount: 12647 },
      { date: '2015-04-01', item: 'Gem Activate', amount: 48351 },
      { date: '2015-04-01', item: 'Gem Inhibitor H', amount: 134345 },
      { date: '2015-04-01', item: 'Gem Inhibitor S', amount: 38658 },
      { date: '2015-04-01', item: 'Gem Kleen', amount: 48351 },
      { date: '2015-04-01', item: 'Gem Kleen-3', amount: 17695 },
    ];

    return { chartData, tableData };
  };

  const generateCustomerAttractivenessData = () => {
    const tableData = [
      { customerId: 'AARTI STEELS LIMITED', recencyDays: 5, transactionCount: 9, amount: 706620, frequencyScore: 5, monetaryScore: 5, customerAttractiveness: 555, customerActivity: 91.47, dateCalculated: '01-05-2015' },
      { customerId: 'ACCORD INDUSTRIES', recencyDays: 17, transactionCount: 1, amount: 133163, frequencyScore: 1, monetaryScore: 3, customerAttractiveness: 213, customerActivity: 21.46, dateCalculated: '01-05-2015' },
      { customerId: 'Atul Engineering Company INC', recencyDays: 8, transactionCount: 1, amount: 216935, frequencyScore: 1, monetaryScore: 4, customerAttractiveness: 414, customerActivity: 30.92, dateCalculated: '01-05-2015' },
      { customerId: 'AV WIRES PVT LTD', recencyDays: 16, transactionCount: 1, amount: 208248, frequencyScore: 1, monetaryScore: 4, customerAttractiveness: 314, customerActivity: 36.6, dateCalculated: '01-05-2015' },
      { customerId: 'BAJAJSONS LIMITED UNIT III', recencyDays: 2, transactionCount: 2, amount: 71569, frequencyScore: 3, monetaryScore: 2, customerAttractiveness: 532, customerActivity: 89.28, dateCalculated: '01-05-2015' },
      { customerId: 'BAJAJSONS LIMITED ROORKEE', recencyDays: 7, transactionCount: 4, amount: 111608, frequencyScore: 5, monetaryScore: 3, customerAttractiveness: 553, customerActivity: 78.49, dateCalculated: '01-05-2015' },
      { customerId: 'BAJRANG WIRE PRODUCTS (INDIA) PVT. LTD.', recencyDays: 13, transactionCount: 1, amount: 87715, frequencyScore: 1, monetaryScore: 2, customerAttractiveness: 312, customerActivity: 14.42, dateCalculated: '01-05-2015' },
      { customerId: 'BAJRANG WIRE PRODUCTS (INDIA) PVT.LTD-2', recencyDays: 20, transactionCount: 1, amount: 88197, frequencyScore: 1, monetaryScore: 2, customerAttractiveness: 112, customerActivity: 75.77, dateCalculated: '01-05-2015' },
      { customerId: 'BANSAL STEEL UDYOG', recencyDays: 6, transactionCount: 2, amount: 197000, frequencyScore: 3, monetaryScore: 4, customerAttractiveness: 534, customerActivity: 93.33, dateCalculated: '01-05-2015' },
      { customerId: 'Bansal High Carbons Pvt Ltd', recencyDays: 30, transactionCount: 1, amount: 304662, frequencyScore: 1, monetaryScore: 5, customerAttractiveness: 115, customerActivity: 83.69, dateCalculated: '01-05-2015' },
      { customerId: 'BANSAL WIRE INDUSTRIES LTD.', recencyDays: 2, transactionCount: 1, amount: 354836, frequencyScore: 1, monetaryScore: 5, customerAttractiveness: 515, customerActivity: 65.54, dateCalculated: '01-05-2015' },
      { customerId: 'BASANTA MAL TILAK RAM', recencyDays: 7, transactionCount: 8, amount: 216711, frequencyScore: 5, monetaryScore: 4, customerAttractiveness: 554, customerActivity: 39.6, dateCalculated: '01-05-2015' },
      { customerId: 'BD WIRE amp; ALLIED INDUSTRIES', recencyDays: 16, transactionCount: 1, amount: 96639, frequencyScore: 1, monetaryScore: 2, customerAttractiveness: 312, customerActivity: 59.73, dateCalculated: '01-05-2015' },
      { customerId: 'BEDMUTHA INDUSTRIES LTD', recencyDays: 2, transactionCount: 1, amount: 387488, frequencyScore: 1, monetaryScore: 5, customerAttractiveness: 515, customerActivity: 6.3, dateCalculated: '01-05-2015' },
      { customerId: 'CHINTAMENI METAL UDYOG PVT. LTD.', recencyDays: 18, transactionCount: 1, amount: 209649, frequencyScore: 1, monetaryScore: 4, customerAttractiveness: 214, customerActivity: 65.11, dateCalculated: '01-05-2015' },
    ];

    return { tableData };
  };

  const generateBoosterAnalysisData = () => {
    const tableData = [
      { lhs: 'RUSTOGEM', rhs: 'GEM KLEEN', booster: 14.93, invoiceCount: 3339 },
      { lhs: 'ADDITIVE', rhs: 'GEM PHOS', booster: 0.75, invoiceCount: 3339 },
      { lhs: 'ADDITIVE, GEM BIT', rhs: 'GEM PHOS', booster: 1.24, invoiceCount: 3339 },
      { lhs: 'GEM BIT, GEM PHOS', rhs: 'ADDITIVE', booster: 3.69, invoiceCount: 3339 },
      { lhs: 'GEM PASS, PAINT STRIPPER', rhs: 'GEM KOTE', booster: 36.23, invoiceCount: 3339 },
      { lhs: 'GEM KOTE, PAINT STRIPPER', rhs: 'GEM PASS', booster: 58.58, invoiceCount: 3339 },
      { lhs: 'GEM PASS, PAINT STRIPPER', rhs: 'GEM KLEEN', booster: 24.25, invoiceCount: 3339 },
      { lhs: 'GEM KLEEN, PAINT STRIPPER', rhs: 'GEM PASS', booster: 58.58, invoiceCount: 3339 },
      { lhs: 'GEM PASS, PAINT STRIPPER', rhs: 'RUSTOGEM', booster: 30.92, invoiceCount: 3339 },
      { lhs: 'PAINT STRIPPER, RUSTOGEM', rhs: 'GEM PASS', booster: 61.51, invoiceCount: 3339 },
      { lhs: 'GEM PASS, PAINT STRIPPER', rhs: 'ADDITIVE', booster: 2.63, invoiceCount: 3339 },
      { lhs: 'ADDITIVE, PAINT STRIPPER', rhs: 'GEM PASS', booster: 36.61, invoiceCount: 3339 },
      { lhs: 'GEM KOTE, PAINT STRIPPER', rhs: 'GEM KLEEN', booster: 22.01, invoiceCount: 3339 },
      { lhs: 'GEM KLEEN, PAINT STRIPPER', rhs: 'GEM KOTE', booster: 32.87, invoiceCount: 3339 },
      { lhs: 'GEM PASS, PAINT STRIPPER', rhs: 'RUSTOGEM', booster: 30.92, invoiceCount: 3339 },
      { lhs: 'RUSTOGEM, PAINT STRIPPER', rhs: 'GEM PASS', booster: 38.04, invoiceCount: 3339 },
    ];

    const boosters = tableData.map(row => row.booster);
    const minBooster = Math.min(...boosters);
    const maxBooster = Math.max(...boosters);

    return { tableData, minBooster, maxBooster };
  };

  const generateAttractivenessActivityData = () => {
    const groupings = ['Item', 'Product', 'Territory'];
    const timeSlices = ['Monthly', 'Quarterly', 'Yearly'];

    const tableData = [];

    // Generate data for each combination
    groupings.forEach(grouping => {
      timeSlices.forEach(timeSlice => {
        // Generate sample items/products/territories
        const items = grouping === 'Item' 
          ? ['GEM PHOS 333', 'GEM PHOS 330', 'GEM KLEEN', 'GEM KOTE', 'RUSTOGEM', 'ADDITIVE', 'GEM PASS', 'GEM BIT']
          : grouping === 'Product'
          ? ['Paint Pretreatment', 'Cold Forming', 'Acid Inhibitors', 'Cleaners', 'Lubricants']
          : ['North', 'South', 'East', 'West', 'Central'];

        items.forEach(item => {
          const attractiveness = Math.floor(Math.random() * 500) + 100;
          const activity = Math.random() * 100;
          
          // Determine segment based on attractiveness and activity
          let segment;
          if (attractiveness > 300 && activity > 50) {
            segment = 'Stars';
          } else if (attractiveness > 300 && activity <= 50) {
            segment = 'Sleepers';
          } else if (attractiveness <= 300 && activity > 50) {
            segment = 'Workhorses';
          } else {
            segment = 'Dogs';
          }

          tableData.push({
            grouping,
            timeSlice,
            groupingKey: item,
            attractiveness,
            activity,
            revenue: Math.floor(Math.random() * 1000000) + 100000,
            volume: Math.floor(Math.random() * 10000) + 1000,
            segment,
          });
        });
      });
    });

    return { tableData };
  };

  // Fetch all data using fetch API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, highlightsRes, quickOverviewRes, treemapRes, trendsRes, salesRes, growthRes, personRes, abcRes, lastYearRes, topProductsRes, customerABCRes, topCustomersRes, analysisProductRes, analysisCustomerRes] = await Promise.all([
        fetch('/api/filters/results-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(filters),
        }).then(res => res.json()).catch(() => ({ records: 4457, invoices: 2253 })),
        fetch('/api/highlights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...filters, ...highlightFilters }),
        }).then(res => res.json()).catch(() => defaultHighlights),
        fetch('/api/quick-overview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters, selectedYear, selectedQuarter, comparisonMode }),
        }).then(res => res.json()).catch(() => ({ salesProfit: generateDefaultChartData(), grossProfit: generateDefaultChartData() })),
        fetch('/api/item-group-treemap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(filters),
        }).then(res => res.json()).catch(() => treemapData),
        fetch('/api/monthly-trends', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters, selectedYear, comparisonMode }),
        }).then(res => res.json()).catch(() => ({ monthlySales: generateMonthlyData(), grossProfit: generateQuarterlyData() })),
        fetch('/api/sales-overview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters, selectedYear, comparisonMode }),
        }).then(res => res.json()).catch(() => salesOverviewData),
        fetch('/api/sales-growth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters, selectedYear, selectedQuarter }),
        }).then(res => res.json()).catch(() => generateSalesGrowthData()),
        fetch('/api/sales-person', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters, selectedYear, selectedQuarter }),
        }).then(res => res.json()).catch(() => generateSalesPersonData()),
        fetch('/api/product-abc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters, abcBand, selectedYear, comparisonMode }),
        }).then(res => res.json()).catch(() => generateProductABCData()),
        fetch('/api/sales-last-year', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters, selectedYear, comparisonMode }),
        }).then(res => res.json()).catch(() => generateSalesLastYearData()),
        fetch('/api/top-products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters, selectedYear, selectedQuarter, comparisonMode }),
        }).then(res => res.json()).catch(() => generateTopProductsData()),
        fetch('/api/customer-abc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters, customerABCBand, selectedYear, comparisonMode }),
        }).then(res => res.json()).catch(() => generateCustomerABCData()),
        fetch('/api/top-customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters, selectedYear, selectedQuarter, comparisonMode }),
        }).then(res => res.json()).catch(() => generateTopCustomersData()),
        fetch('/api/analysis-by-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters, year: productAnalysisYear }),
        }).then(res => res.json()).catch(() => generateAnalysisByProductData()),
        fetch('/api/analysis-by-customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters, year: customerAnalysisYear }),
        }).then(res => res.json()).catch(() => generateAnalysisByCustomerData()),
      ]);

      setSummary(summaryRes);
      setHighlights(highlightsRes);
      setQuickOverviewData(quickOverviewRes);
      setTreemapData(treemapRes);
      setMonthlyTrendsData(trendsRes);
      setSalesOverviewData(salesRes);
      setSalesGrowthData(growthRes);
      setSalesPersonData(personRes);
      setProductABCData(abcRes);
      setSalesLastYearData(lastYearRes);
      setTopProductsData(topProductsRes);
      setCustomerABCData(customerABCRes);
      setTopCustomersData(topCustomersRes);
      setAnalysisByProductData(analysisProductRes);
      setAnalysisByCustomerData(analysisCustomerRes);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Use default mock data on error
      setSalesGrowthData(generateSalesGrowthData());
      setSalesPersonData(generateSalesPersonData());
      setProductABCData(generateProductABCData());
      setSalesLastYearData(generateSalesLastYearData());
      setTopProductsData(generateTopProductsData());
      setCustomerABCData(generateCustomerABCData());
      setTopCustomersData(generateTopCustomersData());
      setAnalysisByProductData(generateAnalysisByProductData());
      setAnalysisByCustomerData(generateAnalysisByCustomerData());
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce(fetchData, 500);

  // Initialize default data
  useEffect(() => {
    setSalesGrowthData(generateSalesGrowthData());
    setSalesPersonData(generateSalesPersonData());
    setProductABCData(generateProductABCData());
    setSalesLastYearData(generateSalesLastYearData());
    setTopProductsData(generateTopProductsData());
    setCustomerABCData(generateCustomerABCData());
    setTopCustomersData(generateTopCustomersData());
    setAnalysisByProductData(generateAnalysisByProductData());
    setAnalysisByCustomerData(generateAnalysisByCustomerData());
    setReceivablesData(generateReceivablesData());
    setTopNByValueData(generateTopNByValueData());
    setTopNByVolumeData(generateTopNByVolumeData());
    setChannelHealthData(generateChannelHealthData());
    setChannelProductData(generateChannelProductData());
    setCampaignPerformanceData(generateCampaignPerformanceData());
    setVisitDetailsData(generateVisitDetailsData());
    setVisitDataTableData(generateVisitDataTableData());
    setPipelineInquiryFlowData(generatePipelineInquiryFlowData());
    setTop10InquiriesData(generateTop10InquiriesData());
    setForecastingData(generateForecastingData());
    setSalesRepCapabilityData(generateSalesRepCapabilityData());
    setPerformanceKPIData(generatePerformanceKPIData());
    setPerformanceTrackingData(generatePerformanceTrackingData());
    setProductPortfolioData(generateProductPortfolioData());
    setVoucherTypeData(generateVoucherTypeData());
    setCustomerAttractivenessData(generateCustomerAttractivenessData());
    setBoosterAnalysisData(generateBoosterAnalysisData());
    setAttractivenessActivityData(generateAttractivenessActivityData());
  }, []);

  // Only fetch on filter changes, not on initial mount (use default data)
  useEffect(() => {
    debouncedFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, highlightFilters, selectedYear, selectedQuarter, comparisonMode, abcBand, customerABCBand]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleHighlightFilterChange = (key, value) => {
    setHighlightFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        summary={summary}
      />

      {/* Highlights Section */}
      <HighlightsSection
        highlights={highlights}
        filters={highlightFilters}
        onFilterChange={handleHighlightFilterChange}
      />

      {/* Quick Overview Section */}
      <QuickOverviewSection
        data={quickOverviewData}
        selectedYear={selectedYear}
        selectedQuarter={selectedQuarter}
        comparisonMode={comparisonMode}
        onYearChange={setSelectedYear}
        onQuarterChange={setSelectedQuarter}
        onComparisonChange={setComparisonMode}
      />

      {/* Treemap Sections */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <TreemapSection
          title="Item Group"
          data={treemapData.itemGroup || { mainLabel: 'GEM PHOS', viewOptions: ['IG', 'PG'] }}
          viewMode={itemGroupView}
          onViewModeChange={setItemGroupView}
        />
        <TreemapSection
          title="Industry Type"
          data={treemapData.industryType || { mainLabel: 'Wire & Tube mfrs', viewOptions: ['PG', 'IT'] }}
          viewMode={industryTypeView}
          onViewModeChange={setIndustryTypeView}
        />
        <TreemapSection
          title="Product Group"
          data={treemapData.productGroup || { mainLabel: 'COLD FORMING/COLD EXTRUSION PRODUCTS', viewOptions: ['IG', 'IT'] }}
          viewMode={productGroupView}
          onViewModeChange={setProductGroupView}
        />
      </div>

      {/* Monthly Trends Section */}
      <MonthlyTrendsSection
        data={monthlyTrendsData}
        selectedYear={selectedYear}
        comparisonMode={comparisonMode}
        onYearChange={setSelectedYear}
        onComparisonChange={setComparisonMode}
      />

      {/* Sales Overview Section */}
      <SalesOverviewSection
        data={salesOverviewData}
        selectedYear={selectedYear}
        comparisonMode={comparisonMode}
        onYearChange={setSelectedYear}
        onComparisonChange={setComparisonMode}
      />

      {/* Sales Growth Analysis Section */}
      <SalesGrowthAnalysisSection
        data={salesGrowthData}
        selectedYear={selectedYear}
        selectedQuarter={selectedQuarter}
        onYearChange={setSelectedYear}
        onQuarterChange={setSelectedQuarter}
      />

      {/* Sales Person Overview Section */}
      <SalesPersonOverviewSection
        data={salesPersonData}
        selectedYear={selectedYear}
        selectedQuarter={selectedQuarter}
        onYearChange={setSelectedYear}
        onQuarterChange={setSelectedQuarter}
      />

      {/* Product ABC Section */}
      <ProductABCSection
        data={productABCData}
        abcBand={abcBand}
        selectedYear={selectedYear}
        comparisonMode={comparisonMode}
        onABCBandChange={setAbcBand}
        onYearChange={setSelectedYear}
        onComparisonChange={setComparisonMode}
      />

      {/* Sales Last Year vs Prior Section */}
      <SalesLastYearVsPriorSection
        data={salesLastYearData}
      />

      {/* Top 10 Products Section */}
      <TopProductsSection
        data={topProductsData}
        selectedYear={selectedYear}
        selectedQuarter={selectedQuarter}
        comparisonMode={comparisonMode}
        onYearChange={setSelectedYear}
        onQuarterChange={setSelectedQuarter}
        onComparisonChange={setComparisonMode}
      />

      {/* Customer ABC Section */}
      <CustomerABCSection
        data={customerABCData}
        abcBand={customerABCBand}
        selectedYear={selectedYear}
        comparisonMode={comparisonMode}
        onABCBandChange={setCustomerABCBand}
        onYearChange={setSelectedYear}
        onComparisonChange={setComparisonMode}
      />

      {/* Top 10 Customers Section */}
      <TopCustomersSection
        data={topCustomersData}
        selectedYear={selectedYear}
        selectedQuarter={selectedQuarter}
        comparisonMode={comparisonMode}
        onYearChange={setSelectedYear}
        onQuarterChange={setSelectedQuarter}
        onComparisonChange={setComparisonMode}
      />

      {/* Analysis by Product Section */}
      <AnalysisByProductSection
        data={analysisByProductData}
        selectedYear={productAnalysisYear}
        onYearChange={setProductAnalysisYear}
      />

      {/* Analysis by Customer Section */}
      <AnalysisByCustomerSection
        data={analysisByCustomerData}
        selectedYear={customerAnalysisYear}
        onYearChange={setCustomerAnalysisYear}
      />

      {/* Receivables Section */}
      <ReceivablesSection
        data={receivablesData}
        receivablesState={receivablesState}
        onReceivablesStateChange={setReceivablesState}
      />

      {/* Top N Products By Value Section */}
      <TopNProductsByValueSection
        data={topNByValueData}
        filters={filters}
      />

      {/* Top N Products By Volume Section */}
      <TopNProductsByVolumeSection
        data={topNByVolumeData}
        filters={filters}
      />

      {/* Channel Health Section */}
      <ChannelHealthSection data={channelHealthData} />

      {/* Channel Product Section */}
      <ChannelProductSection data={channelProductData} productName="Product A" />

      {/* Campaign Performance Section */}
      <CampaignPerformanceSection data={campaignPerformanceData} />

      {/* Visit Details Section */}
      <VisitDetailsSection data={visitDetailsData} />

      {/* Visit Data Table Section */}
      <VisitDataTableSection data={visitDataTableData} />

      {/* Pipeline / Inquiry Flow Section */}
      <PipelineInquiryFlowSection data={pipelineInquiryFlowData} />

      {/* Top 10 Inquiries Section */}
      <Top10InquiriesSection data={top10InquiriesData} />

      {/* Forecasting Section */}
      <ForecastingSection data={forecastingData} />

      {/* Sales Rep Capability Section */}
      <SalesRepCapabilitySection data={salesRepCapabilityData} />

      {/* Performance KPI Section */}
      <PerformanceKPISection data={performanceKPIData} />

      {/* Performance Tracking Section */}
      <PerformanceTrackingSection data={performanceTrackingData} />

      {/* Product Portfolio Section */}
      <ProductPortfolioSection data={productPortfolioData} />

      {/* Voucher Type Section */}
      <VoucherTypeSection data={voucherTypeData} />

      {/* Customer Attractiveness Section */}
      <CustomerAttractivenessSection data={customerAttractivenessData} />

      {/* Booster Analysis Section */}
      <BoosterAnalysisSection data={boosterAnalysisData} />

      {/* Attractiveness / Activity Analysis Section */}
      <AttractivenessActivityAnalysisSection data={attractivenessActivityData} />
    </div>
  );
};

export default BusinessPerformance;

