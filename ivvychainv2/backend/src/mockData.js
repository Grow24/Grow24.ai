// Mock data generator for IVYCHAIN v2 Business Performance Dashboard

const getHighlights = () => {
  return [
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
    {
      title: 'NoseCorp',
      description: 'NoseCorp is now entering a period (Oct 2017), where the DSO deteriorates by 12 days versus its average.',
      badge: 'Account',
      badgeType: 'account',
    },
    {
      title: 'HopeCorp',
      description: 'HopeCorp is now entering a period (Oct 2017) where the DSO improves by 6 days versus its average.',
      badge: 'Account',
      badgeType: 'account',
    },
  ];
};

const getQuickOverview = (params) => {
  const periods = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return {
    salesProfit: periods.map(period => ({
      period,
      priorYTD: Math.random() * 10000000 + 50000000,
      currentYTD: Math.random() * 10000000 + 45000000,
    })),
    grossProfit: periods.map(period => ({
      period,
      priorYTD: Math.random() * 5000000 + 20000000,
      currentYTD: Math.random() * 5000000 + 18000000,
    })),
  };
};

const getTreemapData = () => {
  return {
    itemGroup: {
      mainLabel: 'GEM PHOS',
      viewOptions: ['IG', 'PG'],
    },
    industryType: {
      mainLabel: 'Wire & Tube mfrs',
      subLabels: ['Steel Wires & Tubes'],
      viewOptions: ['PG', 'IT'],
    },
    productGroup: {
      mainLabel: 'COLD FORMING/COLD EXTRUSION PRODUCTS',
      viewOptions: ['IG', 'IT'],
    },
  };
};

const getMonthlyTrends = (params) => {
  const months = ['APR 2016', 'MAY 2016', 'JUN 2016', 'JUL 2016', 'AUG 2016', 'SEP 2016', 'OCT 2016', 'NOV 2016', 'DEC 2016', 'JAN 2017', 'FEB 2017', 'MAR 2017'];
  const quarters = ['2015 Q1', '2015 Q2', '2015 Q3', '2015 Q4', '2016 Q1', '2016 Q2', '2016 Q3', '2016 Q4', '2017 Q1', '2017 Q2', '2017 Q3', '2017 Q4', '2018 Q1'];

  return {
    monthlySales: months.map(month => ({
      month,
      sales: Math.random() * 10000000 + 30000000,
      salesPriorTarget: Math.random() * 8000000 + 25000000,
      grossProfitPercent: Math.random() * 30 + 10,
    })),
    grossProfit: quarters.map(quarter => ({
      quarter,
      grossProfit: Math.random() * 20000000 + 40000000,
      gpPriorTarget: Math.random() * 25000000 + 50000000,
      sales: Math.random() * 50000000 + 60000000,
    })),
  };
};

const getSalesOverview = (params) => {
  const periods = ['2016 02', '2016 03', '2016 04', '2017 01'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return {
    grossProfitYTD: months.map(month => ({
      month,
      value: Math.random() * 5000000 + 20000000,
    })),
    salesYTD: months.map(month => ({
      month,
      current: Math.random() * 10000000 + 40000000,
      priorTarget: Math.random() * 8000000 + 35000000,
    })),
    costYTD: months.map(month => ({
      month,
      current: Math.random() * 8000000 + 30000000,
      priorTarget: Math.random() * 7000000 + 28000000,
    })),
    quantityYTD: months.map(month => ({
      month,
      current: Math.random() * 1000 + 5000,
      priorTarget: Math.random() * 900 + 4500,
    })),
    salesOverview: periods.map(period => ({
      period,
      sales: Math.random() * 30000000 + 40000000,
      lySales: Math.random() * 15000000 + 20000000,
      grossProfitPercent: Math.random() * 30 + 15,
    })),
  };
};

module.exports = {
  getHighlights,
  getQuickOverview,
  getTreemapData,
  getMonthlyTrends,
  getSalesOverview,
};

