import React, { useState } from 'react';

const Employee = () => {
  const [selectedSalesRep, setSelectedSalesRep] = useState('All');
  const [mainTab, setMainTab] = useState('performance'); // 'performance' or 'whatIfSimulator'
  const [activeTab, setActiveTab] = useState('visitsOnly');
  const [timePeriod, setTimePeriod] = useState('weekly');
  const [colorOption, setColorOption] = useState('inqStages');
  const [dateRange, setDateRange] = useState({ from: '2016-12-31', to: '2017-01-11' });
  const [activePerformanceTab, setActivePerformanceTab] = useState('salesRepCapability');
  const [selectedAccount, setSelectedAccount] = useState('All');
  const [performanceFilter, setPerformanceFilter] = useState('bestPerformer');
  const [timePeriodFilter, setTimePeriodFilter] = useState('monthly');
  const [dataTableTab, setDataTableTab] = useState('dataTable'); // 'dataTable', 'visitSpecific', 'checkInOut'

  const businessMetricsQuestions = [
    "Are we seeing a mix of New Business vs Base Business ?",
    "Are we getting healthy Gross and Net Margins ?",
    "How is the Sales-rep performing on various metrics in both absolute and relative terms ? - Sales cycle times, Cost to complete Inquiries, repeat business etc.",
    "Are we securing Repeatable Business ?",
    "Are we selling the right combination of Consumable vs Non Consumable items ?",
    "How is the rep performing on forecast on Sales Order, Invoice, Cash basis ?",
    "Are we factoring in seasonalities of the client's business?",
    "Are we targeting Leads and Territories consistent with strategic growth of the company ?",
    "Are we cross-selling/up-selling/down-selling?",
    "Is the rep making good use of Schemes ?",
    "What are his sales patterns w.r.t Pricing vs MRP?"
  ];

  const visitTrackingQuestions = [
    "What is the visit pattern ?",
    "Are Visits making an impact on New Business and Collections ?"
  ];

  // Mock data for KPIs - All 6 boxes
  const kpiData = {
    target: 23,
    actual: 11,
    targetShortfall: 12,
    pipelineDue: 9,
    activeInq: 5,
    pipelinePercent: 75
  };

  const quarters = [
    { name: 'Quarter 1', target: 62204, active: 50, pipeline: 36, targetShortfall: 18500, color: '#00a65a' },
    { name: 'Quarter 2', target: 71605, active: 71, pipeline: 42, targetShortfall: 18210, color: '#00a65a' },
    { name: 'Quarter 3', target: 145705, active: 101, pipeline: 72, targetShortfall: 16000, color: '#3c8dbc' },
    { name: 'Quarter 4', target: 183455, active: 122, pipeline: 95, targetShortfall: 13307, color: '#00a65a' },
    { name: 'Year', target: 62204, active: 50, pipeline: 36, targetShortfall: 18500, color: '#00a65a' }
  ];

  const inquiryStats = {
    won: 17,
    lost: 6,
    open: 17,
    total: 17,
    openPercent: 70
  };

  const financialData = {
    inquiries: { bestGuess: 2650000, expected: 2240000, total: 4890000 },
    accounts: { bestGuess: 1465000, expected: 1100000, total: 2565000 },
    leads: { bestGuess: 1185000, expected: 1140000, total: 2325000 }
  };

  // Mock visit details data
  const visitDetails = [
    { accountName: 'A1', bestGuessAmount: 53122, probability: 80.26, amount: 32000, stage: 'Quotation', days: 23 },
    { accountName: 'A2', bestGuessAmount: 34422, probability: 72.55, amount: 32265, stage: 'Closed Won', days: 66 },
    { accountName: 'A3', bestGuessAmount: 21000, probability: 70.66, amount: 17650, stage: 'Closed Lost', days: 56 },
    { accountName: 'A4', bestGuessAmount: 112471.4, probability: 65.32, amount: 85000, stage: 'Trial', days: 45 },
    { accountName: 'A5', bestGuessAmount: 89000, probability: 75.21, amount: 72000, stage: 'New', days: 12 },
    { accountName: 'A6', bestGuessAmount: 65000, probability: 68.45, amount: 45000, stage: 'Quotation', days: 34 },
    { accountName: 'A7', bestGuessAmount: 78000, probability: 72.11, amount: 56000, stage: 'Trial', days: 28 },
    { accountName: 'A8', bestGuessAmount: 92000, probability: 75.88, amount: 70000, stage: 'Negotiation', days: 19 },
    { accountName: 'A9', bestGuessAmount: 45000, probability: 65.22, amount: 30000, stage: 'New', days: 8 },
    { accountName: 'A10', bestGuessAmount: 110000, probability: 78.33, amount: 86000, stage: 'Quotation', days: 41 },
    { accountName: 'A11', bestGuessAmount: 67000, probability: 69.77, amount: 47000, stage: 'Trial', days: 25 },
    { accountName: 'A12', bestGuessAmount: 83000, probability: 73.44, amount: 61000, stage: 'Negotiation', days: 31 },
    { accountName: 'A13', bestGuessAmount: 55000, probability: 67.11, amount: 37000, stage: 'New', days: 15 },
    { accountName: 'A14', bestGuessAmount: 95000, probability: 76.66, amount: 73000, stage: 'Quotation', days: 37 }
  ];

  // Top 10 Inquiries data
  const topInquiries = visitDetails.slice(0, 10);

  // Pipeline/Inquiry Flow data
  const pipelineData = [
    { date: '2017-01-02', stage: 'New', id: '1', status: 'Pipeline', name: 'A1', soAmt: 390000 },
    { date: '2017-01-05', stage: 'Req', id: '2', status: 'Pipeline', name: 'A2', soAmt: 780000 },
    { date: '2017-01-08', stage: 'Trial', id: '3', status: 'Pipeline', name: 'A3', soAmt: 1170000 },
    { date: '2017-01-12', stage: 'Quotation', id: '4', status: 'Pipeline', name: 'A4', soAmt: 1560000 },
    { date: '2017-01-15', stage: 'Negotiation', id: '5', status: 'Pipeline', name: 'A5', soAmt: 1950000 },
    { date: '2017-01-18', stage: 'CW', id: '6', status: 'CW', name: 'A6', soAmt: 2340000 },
    { date: '2017-01-22', stage: 'CL', id: '7', status: 'CL', name: 'A7', soAmt: 2730000 },
    { date: '2017-01-25', stage: 'New', id: '8', status: 'Pipeline', name: 'A8', soAmt: 3120000 },
    { date: '2017-01-28', stage: 'Trial', id: '9', status: 'Pipeline', name: 'A9', soAmt: 3510000 },
    { date: '2017-02-01', stage: 'Quotation', id: '10', status: 'Pipeline', name: 'A10', soAmt: 3900000 }
  ];

  // Sales Performance data
  const salesRepData = [
    { name: 'Rajesh', engagementScore: 3.7, targetAchievement: 5.3, productivityScore: 2.3, cycleTime: 1.3 },
    { name: 'Shiv', engagementScore: 9.1, targetAchievement: 6.5, productivityScore: 1.1, cycleTime: 2.5 },
    { name: 'Divakar', engagementScore: 4.1, targetAchievement: 2.7, productivityScore: 9.3, cycleTime: 4.3 },
    { name: 'Aditya', engagementScore: 8.1, targetAchievement: 3.1, productivityScore: 2.5, cycleTime: 4.5 },
    { name: 'Sachin', engagementScore: 4.3, targetAchievement: 5.5, productivityScore: 4.7, cycleTime: 3.9 },
    { name: 'Vikas', engagementScore: 2.5, targetAchievement: 1.9, productivityScore: 1.7, cycleTime: 0.9 },
    { name: 'Kishor', engagementScore: 5.7, targetAchievement: 3.1, productivityScore: 4.5, cycleTime: 1.9 },
    { name: 'Govind', engagementScore: 5.1, targetAchievement: 4.5, productivityScore: 9.3, cycleTime: 1.7 }
  ];

  // Performance KPI data
  const performanceKPIData = salesRepData.map(rep => ({
    ...rep,
    leadGeneration: (rep.engagementScore * 1.2).toFixed(1),
    marginsImprovement: (rep.targetAchievement * 0.8).toFixed(1),
    inquirySize: (rep.productivityScore * 1.5).toFixed(1),
    expense: (rep.cycleTime * 1000).toFixed(0),
    attendance: (95 + Math.random() * 5).toFixed(1),
    closureRate: (rep.engagementScore * 10).toFixed(1)
  }));

  // Performance Tracking data
  const performanceTrackingData = [
    { account: 'A1', annualTarget: 425053, ytdTarget: 21331, ytdAccount: 2, targetGap: 403722, pipeline: 2650, ppGap: 6562 },
    { account: 'A2', annualTarget: 243436, ytdTarget: 15315, ytdAccount: 3, targetGap: 228121, pipeline: 6590, ppGap: 6532 },
    { account: 'A3', annualTarget: 453640, ytdTarget: 45342, ytdAccount: 5, targetGap: 408298, pipeline: 4686, ppGap: 1665 },
    { account: 'A4', annualTarget: 325000, ytdTarget: 16250, ytdAccount: 1, targetGap: 308750, pipeline: 3200, ppGap: 4500 },
    { account: 'A5', annualTarget: 567890, ytdTarget: 28395, ytdAccount: 4, targetGap: 539495, pipeline: 8900, ppGap: 12000 }
  ];

  // Booster Analysis data
  const boosterData = [
    { lhs: 'GEM BIT', rhs: 'ADDITIVE', booster: 3.69, invoiceCount: 3339 },
    { lhs: 'GEM BIT', rhs: 'GEM PHOS', booster: 1.24, invoiceCount: 3339 },
    { lhs: 'DERUSTOGEM', rhs: 'GEM KLEEN', booster: 20.21, invoiceCount: 3339 },
    { lhs: 'DERUSTOGEM', rhs: 'ADDITIVE', booster: 2.63, invoiceCount: 3339 },
    { lhs: 'LUBE', rhs: 'GEM PHOS', booster: 0.64, invoiceCount: 3339 },
    { lhs: 'SVM', rhs: 'GEM PHOS', booster: 0.53, invoiceCount: 3339 },
    { lhs: 'GEM PASS', rhs: 'GEM KOTE', booster: 27.81, invoiceCount: 3339 },
    { lhs: 'GEM PASS', rhs: 'GEM KLEEN', booster: 17.13, invoiceCount: 3339 },
    { lhs: 'GEM PASS', rhs: 'RUSTOGEM', booster: 24.41, invoiceCount: 3339 },
    { lhs: 'GEM KOTE', rhs: 'GEM KLEEN', booster: 10.03, invoiceCount: 3339 },
    { lhs: 'GEM KOTE', rhs: 'RUSTOGEM', booster: 17.61, invoiceCount: 3339 },
    { lhs: 'RUSTOGEM', rhs: 'GEM KOTE', booster: 17.61, invoiceCount: 3339 },
    { lhs: 'GEM KLEEN', rhs: 'RUSTOGEM', booster: 14.93, invoiceCount: 3339 },
    { lhs: 'RUSTOGEM', rhs: 'GEM KLEEN', booster: 14.93, invoiceCount: 3339 },
    { lhs: 'ADDITIVE', rhs: 'GEM PHOS', booster: 0.75, invoiceCount: 3339 }
  ];

  const MetricCard = ({ title, stats }) => (
    <div className="box" style={{ borderRadius: '3px', background: '#fff', borderTop: '3px solid #00a65a', boxShadow: '0 1px 1px rgba(0,0,0,0.1)', marginBottom: '20px', flex: '1', marginRight: '10px', minWidth: '150px' }}>
      <div className="box-header" style={{ backgroundColor: '#00a65a', color: '#fff', padding: '8px 15px', borderBottom: '1px solid #00a65a' }}>
        <h3 className="box-title" style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{title}</h3>
      </div>
      <div className="box-body" style={{ padding: '15px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>{stats.won}</div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>WON</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>{stats.lost}</div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>LOST</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>{stats.openPercent}%</div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>OPEN</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>{stats.total}</div>
        <div style={{ fontSize: '12px', color: '#666' }}>TOTAL</div>
      </div>
    </div>
  );

  const SummaryCard = ({ data }) => (
    <div className="box" style={{ borderRadius: '3px', background: '#fff', borderLeft: '3px solid #00a65a', boxShadow: '0 1px 1px rgba(0,0,0,0.1)', marginBottom: '20px', flex: '1', marginLeft: '10px', minWidth: '200px' }}>
      <div className="box-body" style={{ padding: '15px' }}>
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>{data.bestGuess.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>BEST GUESS AMOUNT</div>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>{data.expected.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>EXPECTED AMOUNT</div>
        </div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>{data.total.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>TOTAL</div>
        </div>
      </div>
    </div>
  );

  // Main component return
  return (
    <div className="content-header" style={{ backgroundColor: '#ecf0f5', minHeight: 'calc(100vh - 50px)', padding: '20px' }}>
      {/* Main Tabs: Performance and What if Simulator */}
      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
        <div className="box-body" style={{ padding: '15px' }}>
          <ul className="nav nav-tabs" style={{ borderBottom: '2px solid #ddd', marginBottom: '20px', listStyle: 'none', padding: 0, display: 'flex' }}>
            <li className={mainTab === 'performance' ? 'active' : ''} style={{ marginRight: '5px' }}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setMainTab('performance'); }}
                style={{
                  padding: '10px 20px',
                  display: 'inline-block',
                  border: 'none',
                  borderBottom: mainTab === 'performance' ? '3px solid #3c8dbc' : 'none',
                  background: 'transparent',
                  color: mainTab === 'performance' ? '#3c8dbc' : '#666',
                  cursor: 'pointer',
                  fontWeight: mainTab === 'performance' ? 'bold' : 'normal',
                  textDecoration: 'none'
                }}
              >
                Performance
              </a>
            </li>
            <li className={mainTab === 'whatIfSimulator' ? 'active' : ''}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setMainTab('whatIfSimulator'); }}
                style={{
                  padding: '10px 20px',
                  display: 'inline-block',
                  border: 'none',
                  borderBottom: mainTab === 'whatIfSimulator' ? '3px solid #3c8dbc' : 'none',
                  background: 'transparent',
                  color: mainTab === 'whatIfSimulator' ? '#3c8dbc' : '#666',
                  cursor: 'pointer',
                  fontWeight: mainTab === 'whatIfSimulator' ? 'bold' : 'normal',
                  textDecoration: 'none'
                }}
              >
                What if Simulator
              </a>
            </li>
          </ul>

          {mainTab === 'whatIfSimulator' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>What if Simulator</h3>
              <p style={{ color: '#666' }}>What if Simulator content will be displayed here</p>
            </div>
          )}
        </div>
      </div>

      {/* HOW Header Box - Only show in Performance tab */}
      {mainTab === 'performance' && (
      <div className="box box-solid box-primary" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #3c8dbc', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
        <div className="box-header" style={{ backgroundColor: '#3c8dbc', color: '#fff', padding: '10px 15px', borderBottom: '1px solid #367fa9' }}>
          <h3 className="box-title" style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
            <i className="fa fa-question-circle mr-2"></i>
            HOW
          </h3>
          <div className="box-tools pull-right">
            <button className="btn btn-box-tool" data-widget="collapse" style={{ color: '#fff', background: 'transparent', border: 'none', padding: '5px', cursor: 'pointer' }}>
              <i className="fa fa-minus"></i>
            </button>
          </div>
        </div>
        <div className="box-body" style={{ padding: '15px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>EMPLOYEE</h2>
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>Business metrics :</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {businessMetricsQuestions.map((question, index) => (
                <li key={index} style={{ marginBottom: '12px', paddingLeft: '20px', position: 'relative', color: '#333', fontSize: '14px', lineHeight: '1.6' }}>
                  <span style={{ position: 'absolute', left: '0', color: '#666' }}>•</span>
                  {question}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>Visit tracking</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {visitTrackingQuestions.map((question, index) => (
                <li key={index} style={{ marginBottom: '12px', paddingLeft: '20px', position: 'relative', color: '#333', fontSize: '14px', lineHeight: '1.6' }}>
                  <span style={{ position: 'absolute', left: '0', color: '#666' }}>•</span>
                  {question}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      )}

      {/* Sales Rep Filter - Only show in Performance tab */}
      {mainTab === 'performance' && (
      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
        <div className="box-header" style={{ padding: '10px 15px', borderBottom: '1px solid #f4f4f4' }}>
          <div className="box-tools pull-right">
            <button className="btn btn-box-tool" data-widget="collapse" style={{ background: 'transparent', border: 'none', padding: '5px', cursor: 'pointer' }}>
              <i className="fa fa-minus"></i>
            </button>
          </div>
        </div>
        <div className="box-body" style={{ padding: '15px' }}>
          <div className="row">
            <div className="col-sm-5">
              <div className="form-group">
                <label className="control-label" htmlFor="salesRepSelect" style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block' }}>
                  Select SalesRep
                </label>
                <select
                  id="salesRepSelect"
                  className="form-control"
                  value={selectedSalesRep}
                  onChange={(e) => setSelectedSalesRep(e.target.value)}
                  style={{ width: '100%', padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                >
                  <option value="All">All</option>
                  <option value="Shiv">Shiv</option>
                  <option value="Aditya">Aditya</option>
                  <option value="Vikas">Vikas</option>
                  <option value="Govind">Govind</option>
                  <option value="Chetan">Chetan</option>
                  <option value="Sachin">Sachin</option>
                  <option value="Vicker">Vicker</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Sales Rep KPIs - All 6 boxes */}
      {mainTab === 'performance' && (
      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
        <div className="box-body" style={{ padding: '15px' }}>
          <h3 align="center" style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
            <strong>Sales Rep :</strong>
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '-10px', marginRight: '-10px' }}>
            {/* TARGET */}
            <div style={{ width: '16.66%', padding: '0 10px', marginBottom: '15px' }}>
              <div className="small-box bg-green" style={{ borderRadius: '3px', background: '#00a65a', color: '#fff', padding: '10px', position: 'relative', display: 'block', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                <div className="inner" style={{ padding: '10px' }}>
                  <h3 style={{ fontSize: '38px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#fff' }}>{kpiData.target}</h3>
                  <p style={{ fontSize: '15px', margin: 0, color: '#fff' }}><strong>TARGET</strong></p>
                </div>
                <div className="icon-large" style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '70px', color: 'rgba(0,0,0,0.15)' }}>
                  <i className="fa fa-line-chart"></i>
                </div>
              </div>
            </div>

            {/* ACTUAL */}
            <div style={{ width: '16.66%', padding: '0 10px', marginBottom: '15px' }}>
              <div className="small-box bg-green" style={{ borderRadius: '3px', background: '#00a65a', color: '#fff', padding: '10px', position: 'relative', display: 'block', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                <div className="inner" style={{ padding: '10px' }}>
                  <h3 style={{ fontSize: '38px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#fff' }}>{kpiData.actual}</h3>
                  <p style={{ fontSize: '15px', margin: 0, color: '#fff' }}><strong>ACTUAL</strong></p>
                </div>
                <div className="icon-large" style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '70px', color: 'rgba(0,0,0,0.15)' }}>
                  <i className="fa fa-bar-chart"></i>
                </div>
              </div>
            </div>

            {/* Target Shortfall */}
            <div style={{ width: '16.66%', padding: '0 10px', marginBottom: '15px' }}>
              <div className="small-box bg-green" style={{ borderRadius: '3px', background: '#00a65a', color: '#fff', padding: '10px', position: 'relative', display: 'block', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                <div className="inner" style={{ padding: '10px' }}>
                  <h3 style={{ fontSize: '38px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#fff' }}>{kpiData.targetShortfall}</h3>
                  <p style={{ fontSize: '15px', margin: 0, color: '#fff' }}><strong>Target Shortfall</strong></p>
                </div>
                <div className="icon-large" style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '70px', color: 'rgba(0,0,0,0.15)' }}>
                  <i className="fa fa-pie-chart"></i>
                </div>
              </div>
            </div>

            {/* Pipeline Due */}
            <div style={{ width: '16.66%', padding: '0 10px', marginBottom: '15px' }}>
              <div className="small-box bg-green" style={{ borderRadius: '3px', background: '#00a65a', color: '#fff', padding: '10px', position: 'relative', display: 'block', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                <div className="inner" style={{ padding: '10px' }}>
                  <h3 style={{ fontSize: '38px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#fff' }}>{kpiData.pipelineDue}</h3>
                  <p style={{ fontSize: '15px', margin: 0, color: '#fff' }}><strong>Pipeline Due</strong></p>
                </div>
                <div className="icon-large" style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '70px', color: 'rgba(0,0,0,0.15)' }}>
                  <i className="fa fa-pie-chart"></i>
                </div>
              </div>
            </div>

            {/* Active Inq */}
            <div style={{ width: '16.66%', padding: '0 10px', marginBottom: '15px' }}>
              <div className="small-box bg-green" style={{ borderRadius: '3px', background: '#00a65a', color: '#fff', padding: '10px', position: 'relative', display: 'block', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                <div className="inner" style={{ padding: '10px' }}>
                  <h3 style={{ fontSize: '38px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#fff' }}>{kpiData.activeInq}</h3>
                  <p style={{ fontSize: '15px', margin: 0, color: '#fff' }}><strong>Active Inq</strong></p>
                </div>
                <div className="icon-large" style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '70px', color: 'rgba(0,0,0,0.15)' }}>
                  <i className="fa fa-bar-chart"></i>
                </div>
              </div>
            </div>

            {/* Pipeline %} */}
            <div style={{ width: '16.66%', padding: '0 10px', marginBottom: '15px' }}>
              <div className="small-box bg-green" style={{ borderRadius: '3px', background: '#00a65a', color: '#fff', padding: '10px', position: 'relative', display: 'block', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                <div className="inner" style={{ padding: '10px' }}>
                  <h3 style={{ fontSize: '38px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#fff' }}>{kpiData.pipelinePercent}</h3>
                  <p style={{ fontSize: '15px', margin: 0, color: '#fff' }}><strong>Pipeline %</strong></p>
                </div>
                <div className="icon-large" style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '70px', color: 'rgba(0,0,0,0.15)' }}>
                  <i className="fa fa-percent"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Quarters */}
          <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', marginLeft: '-10px', marginRight: '-10px' }}>
            {quarters.map((quarter, idx) => (
              <div key={idx} style={{ width: '20%', padding: '0 10px', marginBottom: '15px' }}>
                <div className="small-box" style={{ borderRadius: '3px', background: quarter.color, color: '#fff', padding: '10px', position: 'relative', display: 'block', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                  <div className="inner" style={{ padding: '10px' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#fff' }}>{quarter.name}</h3>
                    <div style={{ fontSize: '14px', marginBottom: '5px' }}><strong>{quarter.target.toLocaleString()}</strong> TARGET</div>
                    <div style={{ fontSize: '14px', marginBottom: '5px' }}><strong>{quarter.active}</strong> ACTIVE</div>
                    <div style={{ fontSize: '14px', marginBottom: '5px' }}><strong>{quarter.pipeline}</strong> PIPELINE</div>
                    <div style={{ fontSize: '14px' }}><strong>{quarter.targetShortfall.toLocaleString()}</strong> TARGET SHORTFALL</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Inquiries Section - Only show in Performance tab */}
      {mainTab === 'performance' && (
      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
        <div className="box-body" style={{ padding: '15px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px', textAlign: 'center' }}>Inquiries</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <MetricCard title="Inquiries" stats={inquiryStats} />
            <MetricCard title="Average Inq Size" stats={inquiryStats} />
            <MetricCard title="Avg Sales Cycle" stats={inquiryStats} />
            <MetricCard title="Average Expense" stats={inquiryStats} />
            <SummaryCard data={financialData.inquiries} />
          </div>
        </div>
      </div>
      )}

      {/* Accounts Section - Only show in Performance tab */}
      {mainTab === 'performance' && (
      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
        <div className="box-body" style={{ padding: '15px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px', textAlign: 'center' }}>Accounts</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <MetricCard title="Inquiries" stats={inquiryStats} />
            <MetricCard title="Average Inq Size" stats={inquiryStats} />
            <MetricCard title="Avg Sales Cycle" stats={inquiryStats} />
            <MetricCard title="Average Expense" stats={inquiryStats} />
            <SummaryCard data={financialData.accounts} />
          </div>
        </div>
      </div>
      )}

      {/* Leads Section - Only show in Performance tab */}
      {mainTab === 'performance' && (
      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
        <div className="box-body" style={{ padding: '15px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px', textAlign: 'center' }}>Leads</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <MetricCard title="Inquiries" stats={inquiryStats} />
            <MetricCard title="Average Inq Size" stats={inquiryStats} />
            <MetricCard title="Avg Sales Cycle" stats={inquiryStats} />
            <MetricCard title="Average Expense" stats={inquiryStats} />
            <SummaryCard data={financialData.leads} />
          </div>
        </div>
      </div>
      )}

      {/* VISIT DETAILS Section - Only show in Performance tab */}
      {mainTab === 'performance' && (
      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
        <div className="box-body" style={{ padding: '15px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>VISIT DETAILS</h2>
          
          {/* Data Table Tabs */}
          <ul className="nav nav-pills" style={{ marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
            <li className={dataTableTab === 'dataTable' ? 'active' : ''} style={{ marginRight: '5px' }}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setDataTableTab('dataTable'); }}
                style={{
                  padding: '10px 20px',
                  display: 'inline-block',
                  border: 'none',
                  borderBottom: dataTableTab === 'dataTable' ? '3px solid #3c8dbc' : 'none',
                  background: 'transparent',
                  color: dataTableTab === 'dataTable' ? '#3c8dbc' : '#666',
                  cursor: 'pointer',
                  fontWeight: dataTableTab === 'dataTable' ? 'bold' : 'normal',
                  textDecoration: 'none'
                }}
              >
                Data Table
              </a>
            </li>
            <li className={dataTableTab === 'visitSpecific' ? 'active' : ''} style={{ marginRight: '5px' }}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setDataTableTab('visitSpecific'); }}
                style={{
                  padding: '10px 20px',
                  display: 'inline-block',
                  border: 'none',
                  borderBottom: dataTableTab === 'visitSpecific' ? '3px solid #3c8dbc' : 'none',
                  background: 'transparent',
                  color: dataTableTab === 'visitSpecific' ? '#3c8dbc' : '#666',
                  cursor: 'pointer',
                  fontWeight: dataTableTab === 'visitSpecific' ? 'bold' : 'normal',
                  textDecoration: 'none'
                }}
              >
                Visit Specific
              </a>
            </li>
            <li className={dataTableTab === 'checkInOut' ? 'active' : ''}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setDataTableTab('checkInOut'); }}
                style={{
                  padding: '10px 20px',
                  display: 'inline-block',
                  border: 'none',
                  borderBottom: dataTableTab === 'checkInOut' ? '3px solid #3c8dbc' : 'none',
                  background: 'transparent',
                  color: dataTableTab === 'checkInOut' ? '#3c8dbc' : '#666',
                  cursor: 'pointer',
                  fontWeight: dataTableTab === 'checkInOut' ? 'bold' : 'normal',
                  textDecoration: 'none'
                }}
              >
                Check In/Out
              </a>
            </li>
          </ul>

          {dataTableTab === 'dataTable' && (
            <div>
          
          {/* Filters */}
          <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
            <div>
              <label style={{ marginRight: '5px', fontWeight: 'bold' }}>Account/Lead:</label>
              <select className="form-control" style={{ display: 'inline-block', width: '150px', padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}>
                <option>All</option>
              </select>
            </div>
            <div>
              <label style={{ marginRight: '5px', fontWeight: 'bold' }}>Name:</label>
              <select className="form-control" style={{ display: 'inline-block', width: '150px', padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}>
                <option>All</option>
              </select>
            </div>
            <div>
              <label style={{ marginRight: '5px', fontWeight: 'bold' }}>Select Date Range:</label>
              <input type="date" value={dateRange.from} onChange={(e) => setDateRange({...dateRange, from: e.target.value})} style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', marginRight: '5px' }} />
              <span>to</span>
              <input type="date" value={dateRange.to} onChange={(e) => setDateRange({...dateRange, to: e.target.value})} style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', marginLeft: '5px' }} />
            </div>
          </div>

          {/* Tab Buttons */}
          <div style={{ marginBottom: '15px' }}>
            <button
              onClick={() => setActiveTab('visitsOnly')}
              style={{
                padding: '8px 20px',
                border: 'none',
                borderRadius: '20px',
                backgroundColor: activeTab === 'visitsOnly' ? '#3c8dbc' : '#e0e0e0',
                color: activeTab === 'visitsOnly' ? '#fff' : '#333',
                marginRight: '10px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Visits Only
            </button>
            <button
              onClick={() => setActiveTab('allInq')}
              style={{
                padding: '8px 20px',
                border: 'none',
                borderRadius: '20px',
                backgroundColor: activeTab === 'allInq' ? '#3c8dbc' : '#e0e0e0',
                color: activeTab === 'allInq' ? '#fff' : '#333',
                marginRight: '10px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              All Inq
            </button>
            <button
              onClick={() => setActiveTab('allAccounts')}
              style={{
                padding: '8px 20px',
                border: 'none',
                borderRadius: '20px',
                backgroundColor: activeTab === 'allAccounts' ? '#3c8dbc' : '#e0e0e0',
                color: activeTab === 'allAccounts' ? '#fff' : '#333',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              All Accounts
            </button>
          </div>

          {/* Time Period Buttons */}
          <div style={{ marginBottom: '15px' }}>
            <button
              onClick={() => setTimePeriod('weekly')}
              style={{
                padding: '8px 20px',
                border: 'none',
                borderRadius: '20px',
                backgroundColor: timePeriod === 'weekly' ? '#3c8dbc' : '#e0e0e0',
                color: timePeriod === 'weekly' ? '#fff' : '#333',
                marginRight: '10px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimePeriod('monthly')}
              style={{
                padding: '8px 20px',
                border: 'none',
                borderRadius: '20px',
                backgroundColor: timePeriod === 'monthly' ? '#3c8dbc' : '#e0e0e0',
                color: timePeriod === 'monthly' ? '#fff' : '#333',
                marginRight: '10px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimePeriod('quarterly')}
              style={{
                padding: '8px 20px',
                border: 'none',
                borderRadius: '20px',
                backgroundColor: timePeriod === 'quarterly' ? '#3c8dbc' : '#e0e0e0',
                color: timePeriod === 'quarterly' ? '#fff' : '#333',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Quarterly
            </button>
          </div>

          {/* Choose Color Options */}
          <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Choose color:</span>
            <button
              onClick={() => setColorOption('inqStages')}
              style={{
                padding: '8px 20px',
                border: 'none',
                borderRadius: '20px',
                backgroundColor: colorOption === 'inqStages' ? '#3c8dbc' : '#e0e0e0',
                color: colorOption === 'inqStages' ? '#fff' : '#333',
                marginRight: '10px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Inq Stages
            </button>
            <button
              onClick={() => setColorOption('byValue')}
              style={{
                padding: '8px 20px',
                border: 'none',
                borderRadius: '20px',
                backgroundColor: colorOption === 'byValue' ? '#3c8dbc' : '#e0e0e0',
                color: colorOption === 'byValue' ? '#fff' : '#333',
                marginRight: '10px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              By Value
            </button>
            <button
              onClick={() => setColorOption('visitStatus')}
              style={{
                padding: '8px 20px',
                border: 'none',
                borderRadius: '20px',
                backgroundColor: colorOption === 'visitStatus' ? '#3c8dbc' : '#e0e0e0',
                color: colorOption === 'visitStatus' ? '#fff' : '#333',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Visit Status
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-copy"></i> Copy
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-print"></i> Print
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-download"></i> Download
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-columns"></i> Column visibility
            </button>
          </div>

          {/* Data Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-bordered table-striped" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead style={{ background: '#f4f4f4' }}>
                <tr>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>
                    Account Name <i className="fa fa-sort"></i>
                  </th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>
                    Best Guess Amount <i className="fa fa-sort"></i>
                  </th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>
                    Probability <i className="fa fa-sort"></i>
                  </th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>
                    Amount <i className="fa fa-sort"></i>
                  </th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>
                    Stage <i className="fa fa-sort"></i>
                  </th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>
                    Days <i className="fa fa-sort"></i>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visitDetails.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.accountName}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.bestGuessAmount.toLocaleString()}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.probability}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.amount.toLocaleString()}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.stage}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </div>
          )}

          {dataTableTab === 'visitSpecific' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>Visit Specific</h3>
              <p style={{ color: '#666' }}>Visit Specific content will be displayed here</p>
            </div>
          )}

          {dataTableTab === 'checkInOut' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>Check In/Out</h3>
              {/* Map and Table Layout */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                {/* Left: Table */}
                <div style={{ flex: '1' }}>
                  <table className="table table-bordered" style={{ width: '100%', background: '#fff' }}>
                    <thead style={{ background: '#f4f4f4' }}>
                      <tr>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Visit Name</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Acc/Lead Name</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td style={{ padding: '10px', border: '1px solid #ddd' }}>01-May</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>1</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>A1</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>Success</td></tr>
                      <tr><td style={{ padding: '10px', border: '1px solid #ddd' }}>02-May</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>2</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>A2</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>Success</td></tr>
                      <tr><td style={{ padding: '10px', border: '1px solid #ddd' }}>03-May</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>3</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>A3</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>Success</td></tr>
                    </tbody>
                  </table>
                </div>
                {/* Right: Map */}
                <div style={{ flex: '1', height: '400px', background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', color: '#999' }}>
                    <i className="fa fa-map-marker-alt" style={{ fontSize: '48px', marginBottom: '10px' }}></i>
                    <div>Map View</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Pipeline / Inquiry Flow Section - Only show in Performance tab */}
      {mainTab === 'performance' && (
      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
        <div className="box-body" style={{ padding: '15px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Pipeline / Inquiry Flow</h2>
          
          {/* Filters */}
          <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
            <div>
              <label style={{ marginRight: '5px', fontWeight: 'bold' }}>Filter inq by date:</label>
              <input type="date" value="2017-01-02" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', marginRight: '5px' }} />
              <span>to</span>
              <input type="date" value="2017-03-30" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', marginLeft: '5px' }} />
            </div>
            <div>
              <label style={{ marginRight: '5px', fontWeight: 'bold' }}>Inquiry Status:</label>
              <select className="form-control" style={{ display: 'inline-block', width: '150px', padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}>
                <option>All</option>
              </select>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div style={{ height: '300px', background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center', color: '#999' }}>
              <i className="fa fa-line-chart" style={{ fontSize: '48px', marginBottom: '10px' }}></i>
              <div>Pipeline / Inquiry Flow Chart</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-copy"></i> Copy
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-print"></i> Print
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-download"></i> Download
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-columns"></i> Column visibility
            </button>
          </div>

          {/* Pipeline Data Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-bordered table-striped" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead style={{ background: '#f4f4f4' }}>
                <tr>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Date <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Stage <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>ID <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Status <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>NAME <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>SO_Amt <i className="fa fa-sort"></i></th>
                </tr>
              </thead>
              <tbody>
                {pipelineData.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.date}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.stage}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.id}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.status}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.name}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.soAmt.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* Top 10 Inquiries Section - Only show in Performance tab */}
      {mainTab === 'performance' && (
      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
        <div className="box-body" style={{ padding: '15px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Top 10 Inquiries</h2>
          
          {/* Action Buttons */}
          <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-copy"></i> Copy
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-print"></i> Print
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-download"></i> Download
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-columns"></i> Column visibility
            </button>
          </div>

          {/* Top 10 Inquiries Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-bordered table-striped" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead style={{ background: '#f4f4f4' }}>
                <tr>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Account_Name <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Best_Guess_Amount <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Probability <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Amount <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Stage <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Days <i className="fa fa-sort"></i></th>
                </tr>
              </thead>
              <tbody>
                {topInquiries.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.accountName}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.bestGuessAmount.toLocaleString()}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', position: 'relative' }}>
                      <div style={{ position: 'relative', width: '100%', height: '20px', background: '#f5b7b7', borderRadius: '3px' }}>
                        <div style={{ width: `${row.probability}%`, height: '100%', background: '#f5b7b7', borderRadius: '3px' }}></div>
                        <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontSize: '12px', fontWeight: 'bold' }}>{row.probability}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', position: 'relative' }}>
                      <div style={{ position: 'relative', width: '100%', height: '20px', background: '#ffc107', borderRadius: '3px' }}>
                        <div style={{ width: `${(row.amount / 100000) * 100}%`, height: '100%', background: '#ffc107', borderRadius: '3px', maxWidth: '100%' }}></div>
                        <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontSize: '12px', fontWeight: 'bold' }}>{row.amount.toLocaleString()}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{idx + 1}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* Sales Performance Section - Only show in Performance tab */}
      {mainTab === 'performance' && (
      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
        <div className="box-body" style={{ padding: '15px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Sales Performance</h2>
          
          {/* Tabs */}
          <div style={{ marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
            <button
              onClick={() => setActivePerformanceTab('salesRepCapability')}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderBottom: activePerformanceTab === 'salesRepCapability' ? '3px solid #3c8dbc' : 'none',
                background: 'transparent',
                color: activePerformanceTab === 'salesRepCapability' ? '#3c8dbc' : '#666',
                cursor: 'pointer',
                fontWeight: activePerformanceTab === 'salesRepCapability' ? 'bold' : 'normal',
                marginRight: '20px'
              }}
            >
              Sales Rep Capability
            </button>
            <button
              onClick={() => setActivePerformanceTab('salesCapabilityMaturity')}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderBottom: activePerformanceTab === 'salesCapabilityMaturity' ? '3px solid #3c8dbc' : 'none',
                background: 'transparent',
                color: activePerformanceTab === 'salesCapabilityMaturity' ? '#3c8dbc' : '#666',
                cursor: 'pointer',
                fontWeight: activePerformanceTab === 'salesCapabilityMaturity' ? 'bold' : 'normal'
              }}
            >
              Sales Capability Maturity Model
            </button>
          </div>

          {/* Filters */}
          <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
            <div>
              <label style={{ marginRight: '5px', fontWeight: 'bold' }}>Select Account:</label>
              <select 
                className="form-control" 
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                style={{ display: 'inline-block', width: '150px', padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}
              >
                <option value="All">All</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setPerformanceFilter('bestPerformer')}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  borderRadius: '20px',
                  backgroundColor: performanceFilter === 'bestPerformer' ? '#3c8dbc' : '#e0e0e0',
                  color: performanceFilter === 'bestPerformer' ? '#fff' : '#333',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Best Performer
              </button>
              <button
                onClick={() => setPerformanceFilter('avgPerformer')}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  borderRadius: '20px',
                  backgroundColor: performanceFilter === 'avgPerformer' ? '#3c8dbc' : '#e0e0e0',
                  color: performanceFilter === 'avgPerformer' ? '#fff' : '#333',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Avg Performer
              </button>
              <button
                onClick={() => setPerformanceFilter('worstPerformer')}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  borderRadius: '20px',
                  backgroundColor: performanceFilter === 'worstPerformer' ? '#3c8dbc' : '#e0e0e0',
                  color: performanceFilter === 'worstPerformer' ? '#fff' : '#333',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Worst Performer
              </button>
            </div>
          </div>

          {/* Radar Chart Placeholder */}
          <div style={{ height: '400px', background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center', color: '#999' }}>
              <i className="fa fa-spider" style={{ fontSize: '48px', marginBottom: '10px' }}></i>
              <div>Sales Rep Capability Radar Chart</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-copy"></i> Copy
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-print"></i> Print
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-download"></i> Download
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-columns"></i> Column visibility
            </button>
          </div>

          {/* Sales Performance Data Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-bordered table-striped" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead style={{ background: '#f4f4f4' }}>
                <tr>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Name <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>EngagementScore <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>TargetAchievement <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>ProductivityScore <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>CycleTime <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>LeadG <i className="fa fa-sort"></i></th>
                </tr>
              </thead>
              <tbody>
                {salesRepData.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.name}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.engagementScore}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.targetAchievement}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.productivityScore}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.cycleTime}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>-</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '10px', fontSize: '12px', color: '#666' }}>Showing 1 to 8 of 8 entries</div>
          </div>
        </div>
      </div>
      )}

      {/* Performance KPI Section - Only show in Performance tab */}
      {mainTab === 'performance' && (
      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
        <div className="box-body" style={{ padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 }}>Performance KPI</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label style={{ marginRight: '5px', fontWeight: 'bold' }}>Select Account:</label>
              <select className="form-control" style={{ width: '150px', padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}>
                <option>All</option>
              </select>
            </div>
          </div>

          {/* Time Period Filters */}
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            {['Monthly', 'Quarterly', 'Yearly', 'MTD', 'QTD', 'YTD'].map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriodFilter(period.toLowerCase())}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  borderRadius: '20px',
                  backgroundColor: timePeriodFilter === period.toLowerCase() ? '#3c8dbc' : '#e0e0e0',
                  color: timePeriodFilter === period.toLowerCase() ? '#fff' : '#333',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-copy"></i> Copy
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-print"></i> Print
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-download"></i> Download
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-columns"></i> Column visibility
            </button>
          </div>

          {/* Performance KPI Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-bordered table-striped" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead style={{ background: '#f4f4f4' }}>
                <tr>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Name <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>EngagementScore <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>TargetAchievement <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>ProductivityScore <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>CycleTime <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>LeadGeneration <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>MarginsImprovement <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>InquirySize <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Expense <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Attendance <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>ClosureRate <i className="fa fa-sort"></i></th>
                </tr>
              </thead>
              <tbody>
                {performanceKPIData.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.name}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', position: 'relative' }}>
                      <div style={{ position: 'relative', width: '100px', height: '20px', background: '#e3f2fd', borderRadius: '3px' }}>
                        <div style={{ width: `${(row.engagementScore / 10) * 100}%`, height: '100%', background: '#2196f3', borderRadius: '3px' }}></div>
                        <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontSize: '11px', fontWeight: 'bold' }}>{row.engagementScore}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', position: 'relative' }}>
                      <div style={{ position: 'relative', width: '100px', height: '20px', background: '#e3f2fd', borderRadius: '3px' }}>
                        <div style={{ width: `${(row.targetAchievement / 10) * 100}%`, height: '100%', background: '#2196f3', borderRadius: '3px' }}></div>
                        <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontSize: '11px', fontWeight: 'bold' }}>{row.targetAchievement}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', position: 'relative' }}>
                      <div style={{ position: 'relative', width: '100px', height: '20px', background: '#e3f2fd', borderRadius: '3px' }}>
                        <div style={{ width: `${(row.productivityScore / 10) * 100}%`, height: '100%', background: '#2196f3', borderRadius: '3px' }}></div>
                        <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontSize: '11px', fontWeight: 'bold' }}>{row.productivityScore}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.cycleTime}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.leadGeneration}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.marginsImprovement}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.inquirySize}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.expense}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.attendance}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.closureRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '10px', fontSize: '12px', color: '#666' }}>Showing 1 to 8 of 8 entries</div>
          </div>
        </div>
      </div>
      )}

      {/* Performance Tracking Section - Only show in Performance tab */}
      {mainTab === 'performance' && (
      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
        <div className="box-body" style={{ padding: '15px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Performance Tracking</h2>
          
          {/* Action Buttons */}
          <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-copy"></i> Copy
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-print"></i> Print
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-download"></i> Download
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-columns"></i> Column visibility
            </button>
          </div>

          {/* Performance Tracking Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-bordered table-striped" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead style={{ background: '#f4f4f4' }}>
                <tr>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Account <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Sparkline (Past 3 Months) <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Annual Target <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>YTD Target <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>YTD Account <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Target Gap <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Pipeline <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>P/P Gap <i className="fa fa-sort"></i></th>
                </tr>
              </thead>
              <tbody>
                {performanceTrackingData.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.account}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      <svg width="100" height="30" style={{ display: 'block' }}>
                        <polyline
                          points={`0,${15 + Math.sin(idx) * 5} 25,${15 + Math.sin(idx + 1) * 5} 50,${15 + Math.sin(idx + 2) * 5} 75,${15 + Math.sin(idx + 3) * 5} 100,${15 + Math.sin(idx + 4) * 5}`}
                          fill="none"
                          stroke="#ff9800"
                          strokeWidth="2"
                        />
                      </svg>
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.annualTarget.toLocaleString()}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.ytdTarget.toLocaleString()}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.ytdAccount}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.targetGap.toLocaleString()}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.pipeline.toLocaleString()}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.ppGap.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* Booster Analysis Section - Only show in Performance tab */}
      {mainTab === 'performance' && (
      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
        <div className="box-body" style={{ padding: '15px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Booster Analysis</h2>
          
          {/* Filters */}
          <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
            <div>
              <label style={{ marginRight: '5px', fontWeight: 'bold' }}>Min Booster value:</label>
              <input type="number" step="0.01" defaultValue="0.489411765" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', width: '150px' }} />
            </div>
            <div>
              <label style={{ marginRight: '5px', fontWeight: 'bold' }}>Max Booster value:</label>
              <input type="number" step="0.01" defaultValue="407.5" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', width: '150px' }} />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-copy"></i> Copy
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-print"></i> Print
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-download"></i> Download
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-columns"></i> Column visibility
            </button>
          </div>

          {/* Booster Analysis Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-bordered table-striped" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead style={{ background: '#f4f4f4' }}>
                <tr>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>LHS <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>RHS <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Booster <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Invoice Count <i className="fa fa-sort"></i></th>
                </tr>
              </thead>
              <tbody>
                {boosterData.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.lhs}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.rhs}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.booster}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.invoiceCount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* Forecasting Section - Only show in Performance tab */}
      {mainTab === 'performance' && (
      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
        <div className="box-body" style={{ padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 }}>Forecasting</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select className="form-control" style={{ width: '120px', padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}>
                <option>FLU1</option>
              </select>
              <select className="form-control" style={{ width: '120px', padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}>
                <option>All</option>
              </select>
              <select className="form-control" style={{ width: '200px', padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}>
                <option>Cum. Forecasting vs Cum. Actual</option>
              </select>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div style={{ height: '400px', background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center', color: '#999' }}>
              <i className="fa fa-line-chart" style={{ fontSize: '48px', marginBottom: '10px' }}></i>
              <div>Cumulative Forecasting vs Cumulative Actual Chart</div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Product Portfolio Section - Only show in Performance tab */}
      {mainTab === 'performance' && (
      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
        <div className="box-body" style={{ padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 }}>Product Portfolio</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select className="form-control" style={{ width: '120px', padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}>
                <option>All</option>
              </select>
              <input type="date" defaultValue="2016-12-31" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }} />
              <input type="date" defaultValue="2017-01-11" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }} />
              <select className="form-control" style={{ width: '120px', padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}>
                <option>All</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-copy"></i> Copy
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-print"></i> Print
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-download"></i> Download
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-columns"></i> Column visibility
            </button>
          </div>

          {/* Heatmap Placeholder */}
          <div style={{ height: '500px', background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center', color: '#999' }}>
              <i className="fa fa-th" style={{ fontSize: '48px', marginBottom: '10px' }}></i>
              <div>Product Portfolio Heatmap</div>
            </div>
          </div>

          {/* Product Portfolio Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-bordered table-striped" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead style={{ background: '#f4f4f4' }}>
                <tr>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Date <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Item <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>amount <i className="fa fa-sort"></i></th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '10px', border: '1px solid #ddd' }}>2015-04-01</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>Accelerator</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>903979</td></tr>
                <tr><td style={{ padding: '10px', border: '1px solid #ddd' }}>2015-04-01</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>Derustogem</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>12647</td></tr>
                <tr><td style={{ padding: '10px', border: '1px solid #ddd' }}>2015-04-01</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>Gem Activate</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>48351</td></tr>
                <tr><td style={{ padding: '10px', border: '1px solid #ddd' }}>2015-04-01</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>Gem Inhibitor H</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>134345</td></tr>
                <tr><td style={{ padding: '10px', border: '1px solid #ddd' }}>2015-04-01</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>Gem Phos 300</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>2586299</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* Voucher Type Section - Only show in Performance tab */}
      {mainTab === 'performance' && (
      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
        <div className="box-body" style={{ padding: '15px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Voucher Type</h2>
          
          {/* Filters */}
          <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
            <div>
              <label style={{ marginRight: '5px', fontWeight: 'bold' }}>Account/Lead:</label>
              <select className="form-control" style={{ display: 'inline-block', width: '150px', padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}>
                <option>All</option>
              </select>
            </div>
            <div>
              <label style={{ marginRight: '5px', fontWeight: 'bold' }}>Date Range:</label>
              <input type="date" defaultValue="2016-12-31" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', marginRight: '5px' }} />
              <span>to</span>
              <input type="date" defaultValue="2017-01-11" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', marginLeft: '5px' }} />
            </div>
            <div>
              <label style={{ marginRight: '5px', fontWeight: 'bold' }}>Voucher Type:</label>
              <select className="form-control" style={{ display: 'inline-block', width: '150px', padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px' }}>
                <option>All</option>
              </select>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div style={{ height: '300px', background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center', color: '#999' }}>
              <i className="fa fa-bar-chart" style={{ fontSize: '48px', marginBottom: '10px' }}></i>
              <div>Inquiry Count Chart</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-copy"></i> Copy
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-print"></i> Print
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-download"></i> Download
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-columns"></i> Column visibility
            </button>
          </div>

          {/* Voucher Type Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-bordered table-striped" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead style={{ background: '#f4f4f4' }}>
                <tr>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Date <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Item <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>amount <i className="fa fa-sort"></i></th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '10px', border: '1px solid #ddd' }}>2015-04-01</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>Accelerator</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>903979</td></tr>
                <tr><td style={{ padding: '10px', border: '1px solid #ddd' }}>2015-04-01</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>Derustogem</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>12647</td></tr>
                <tr><td style={{ padding: '10px', border: '1px solid #ddd' }}>2015-04-01</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>Gem Activate</td><td style={{ padding: '10px', border: '1px solid #ddd' }}>48351</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* Customer Attractiveness Section - Only show in Performance tab */}
      {mainTab === 'performance' && (
      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
        <div className="box-body" style={{ padding: '15px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Customer Attractiveness</h2>
          
          {/* Tabs */}
          <div style={{ marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
            <button
              style={{
                padding: '10px 20px',
                border: 'none',
                borderBottom: '3px solid #3c8dbc',
                background: 'transparent',
                color: '#3c8dbc',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginRight: '20px'
              }}
            >
              AA Table
            </button>
            <button
              style={{
                padding: '10px 20px',
                border: 'none',
                borderBottom: 'none',
                background: 'transparent',
                color: '#666',
                cursor: 'pointer',
                fontWeight: 'normal',
                marginRight: '20px'
              }}
            >
              Attractiveness Map
            </button>
            <button
              style={{
                padding: '10px 20px',
                border: 'none',
                borderBottom: 'none',
                background: 'transparent',
                color: '#666',
                cursor: 'pointer',
                fontWeight: 'normal'
              }}
            >
              Delta Map
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-copy"></i> Copy
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-print"></i> Print
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-download"></i> Download
            </button>
            <button className="btn btn-default" style={{ padding: '6px 12px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
              <i className="fa fa-columns"></i> Column visibility
            </button>
          </div>

          {/* Customer Attractiveness Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-bordered table-striped" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead style={{ background: '#f4f4f4' }}>
                <tr>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>customer_id <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>recency_days <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>transaction_count <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>amount <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>frequency_score <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>monetary_score <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Customer Attractiveness <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>Customer Activity <i className="fa fa-sort"></i></th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>date_calculated <i className="fa fa-sort"></i></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>AARTI STEELS LIMITED</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>5</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>9</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>706620</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>5</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>555</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>91.47</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>01-05-2015</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>01-05-2015</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>ACCORD INDUSTRIES</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>17</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>1</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>133163</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>1</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>3</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>213</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>21.46</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>01-05-2015</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>BANSAL STEEL UDYOG</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>6</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>2</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>197000</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>3</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>4</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>534</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>93.33</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>01-05-2015</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Employee;
