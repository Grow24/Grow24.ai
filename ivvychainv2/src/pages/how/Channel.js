import React, { useState } from 'react';

const Channel = () => {
  const [activeTab, setActiveTab] = useState('channelMaster'); // 'channelMaster' or 'channelHealth'
  const [timePeriod, setTimePeriod] = useState('Current Month');
  const [showEntries, setShowEntries] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const channelQuestions = [
    "what are my sales through different Channels",
    "evolution trends of my business through different Channels",
    "what are the strong and weak channels for Lead Generation",
    "How is the channel usage amongst my T.A. ?",
    "Are there any omni-channel trends which influence Sales ?",
    "what Sales patterns do we see of the different Channel participants (e.g. Dealer vs Store)",
    "how have different Channel participants responded to different Campaigns/Schemes",
    "How does inventory, offtake, consumption vary by Channel Partner. Are there any temporal patterns ?",
    "Are there any co-occurrence patterns ?",
    "Are there any cannibalization patterns ?",
    "Key Drivers of Sales for each Channel Partner",
    "Is there channel leakage ?",
    "what's the Channel ROI ? (costs incurred, Inquiries sourced, Inquiries closed)",
    "How are the channels reacting to Reward programs?",
    "What is the Channel coverage?",
    "What are the Returns by Channel Partner ?",
    "What products are high/low velocity?"
  ];

  // Channel Master Data
  const channelMasterData = [
    { id: 1, channelName: 'Direct', channelType: 'Physical', level1: 1, level2: '', level3: '' },
    { id: 2, channelName: 'E-Commerce', channelType: 'Digital', level1: 2, level2: '', level3: '' },
    { id: 3, channelName: 'TV-Analog', channelType: 'Analog', level1: 3, level2: '', level3: '' },
    { id: 4, channelName: 'HFS-A', channelType: 'Physical', level1: 2, level2: 'HFS', level3: '' },
    { id: 5, channelName: 'HFS-B', channelType: 'Physical', level1: 2, level2: 'HFS', level3: '' },
    { id: 6, channelName: 'HFS-A-214', channelType: 'Physical', level1: 3, level2: 'HFS', level3: 'HFS-A' },
    { id: 7, channelName: 'TV-Digital', channelType: 'Digital', level1: 2, level2: '', level3: '' },
    { id: 8, channelName: 'Blog', channelType: 'Digital', level1: 1, level2: '', level3: '' },
    { id: 9, channelName: 'Website', channelType: 'Digital', level1: 1, level2: '', level3: '' },
    { id: 10, channelName: 'Exhibition', channelType: 'Physical', level1: 1, level2: '', level3: '' },
    { id: 11, channelName: 'Conference', channelType: 'Physical', level1: 1, level2: '', level3: '' },
    { id: 12, channelName: 'MR', channelType: 'Physical', level1: 1, level2: '', level3: '' },
    { id: 13, channelName: 'HFS', channelType: 'Physical', level1: 1, level2: '', level3: '' },
    { id: 14, channelName: 'Workshop', channelType: 'Physical', level1: 2, level2: '', level3: '' },
    { id: 15, channelName: 'Garage', channelType: 'Physical', level1: 2, level2: '', level3: '' }
  ];

  // Channel Participant Master
  const channelParticipantMaster = [
    { id: 1, cpType: 'Distributor', cpOwner: 'Customer' },
    { id: 2, cpType: 'Wholesaler', cpOwner: 'Customer' },
    { id: 3, cpType: 'Retailer', cpOwner: 'Customer' },
    { id: 4, cpType: 'Sub-Dealer', cpOwner: 'Customer' },
    { id: 5, cpType: 'Workshop', cpOwner: 'Customer' },
    { id: 6, cpType: 'Garage', cpOwner: 'Customer' },
    { id: 7, cpType: 'Service-Center', cpOwner: 'Customer' },
    { id: 8, cpType: 'Dealer', cpOwner: 'Customer' },
    { id: 9, cpType: 'Fleet Operator', cpOwner: 'Customer' },
    { id: 10, cpType: 'Builder', cpOwner: 'Customer' },
    { id: 11, cpType: 'Architect', cpOwner: 'Influencer' },
    { id: 12, cpType: 'Factory', cpOwner: 'Owned' },
    { id: 13, cpType: 'Warehouse', cpOwner: 'Owned' },
    { id: 14, cpType: 'Supplier', cpOwner: 'Suppliers' },
    { id: 15, cpType: 'Store', cpOwner: 'Customer' },
    { id: 16, cpType: 'Showroom', cpOwner: 'Customer' },
    { id: 17, cpType: 'Outlet', cpOwner: 'Customer' },
    { id: 18, cpType: 'Agency', cpOwner: 'Customer' }
  ];

  // Channel Participant Name
  const channelParticipantName = [
    { cpId: 1, cpName: 'Maha Dist', address: 'A1', territory: 'T1', cpType: 'Customer', cpSubType: 'Distributor' },
    { cpId: 2, cpName: 'Shloka Ltd', address: 'A2', territory: 'T2', cpType: 'Customer', cpSubType: 'Builder' },
    { cpId: 3, cpName: 'Micro Shyam', address: 'A3', territory: 'T3', cpType: 'Customer', cpSubType: 'Retailer' },
    { cpId: 4, cpName: 'Chota Guru', address: 'A4', territory: 'T4', cpType: 'Customer', cpSubType: 'Retailer' },
    { cpId: 5, cpName: 'Decoratation Guru', address: 'A5', territory: 'T5', cpType: 'Influencer', cpSubType: 'Architect' }
  ];

  // Channel Structure
  const channelStructure = [
    { channelId: 1, cpFrom: 1, cpTo: 3 },
    { channelId: 1, cpFrom: 1, cpTo: 4 },
    { channelId: 3, cpFrom: 3, cpTo: 1 },
    { channelId: 3, cpFrom: 3, cpTo: 5 },
    { channelId: 3, cpFrom: 3, cpTo: 2 }
  ];

  // Product Movement In Channel
  const productMovement = [
    { productId: 'ID- 13423', cpFrom: 2, cpTo: 1, channelId: 4, dateFrom: '03-02-2018', dateTo: '03-02-2018' },
    { productId: 'ID - 98532', cpFrom: 3, cpTo: 2, channelId: 1, dateFrom: '06-05-2018', dateTo: '07-05-2018' },
    { productId: 'ID- 13424', cpFrom: 4, cpTo: 1, channelId: 2, dateFrom: '01-01-2018', dateTo: '03-01-2018' },
    { productId: 'ID - 98533', cpFrom: 5, cpTo: 2, channelId: 2, dateFrom: '02-03-2018', dateTo: '02-03-2018' },
    { productId: 'ID- 13425', cpFrom: 4, cpTo: 3, channelId: 3, dateFrom: '06-05-2018', dateTo: '06-05-2018' },
    { productId: 'ID - 98534', cpFrom: 1, cpTo: 3, channelId: 1, dateFrom: '01-01-2018', dateTo: '01-01-2018' },
    { productId: 'ID- 13426', cpFrom: 1, cpTo: 5, channelId: 1, dateFrom: '02-03-2018', dateTo: '02-03-2018' },
    { productId: 'ID - 98535', cpFrom: 1, cpTo: 4, channelId: 3, dateFrom: '06-05-2018', dateTo: '06-05-2018' },
    { productId: 'ID- 13427', cpFrom: 2, cpTo: 1, channelId: 4, dateFrom: '01-01-2018', dateTo: '04-01-2018' },
    { productId: 'ID - 98536', cpFrom: 1, cpTo: 1, channelId: 1, dateFrom: '02-03-2018', dateTo: '02-03-2018' },
    { productId: 'ID- 13428', cpFrom: 3, cpTo: 2, channelId: 2, dateFrom: '03-04-2018', dateTo: '05-04-2018' },
    { productId: 'ID - 98537', cpFrom: 4, cpTo: 3, channelId: 1, dateFrom: '04-05-2018', dateTo: '04-05-2018' },
    { productId: 'ID- 13429', cpFrom: 5, cpTo: 1, channelId: 3, dateFrom: '05-06-2018', dateTo: '07-06-2018' },
    { productId: 'ID - 98538', cpFrom: 2, cpTo: 4, channelId: 2, dateFrom: '06-07-2018', dateTo: '06-07-2018' }
  ];

  // Product BOM
  const productBOM = [
    { pk: 1, productId: 'ID-4123', amount: 3, volumeOfMeasure: 'pieces', level: 2, parentId: 'ID-422', treePart: 'intermediate' },
    { pk: 2, productId: 'ID-2314', amount: 2, volumeOfMeasure: 'pieces', level: 2, parentId: 'ID-673', treePart: 'intermediate' },
    { pk: 3, productId: 'ID-505', amount: 3, volumeOfMeasure: 'kgs', level: 4, parentId: 'ID-850', treePart: 'leaf' },
    { pk: 4, productId: 'ID-1304', amount: 1, volumeOfMeasure: 'kgs', level: 4, parentId: 'ID-541', treePart: 'leaf' },
    { pk: 5, productId: 'ID-3113', amount: 2, volumeOfMeasure: 'pieces', level: 1, parentId: 'ID-852', treePart: 'parent' },
    { pk: 6, productId: 'ID-4922', amount: 2, volumeOfMeasure: 'pieces', level: 2, parentId: 'ID-854', treePart: 'leaf' },
    { pk: 7, productId: 'ID-6731', amount: 1, volumeOfMeasure: 'kgs', level: 3, parentId: 'ID-422', treePart: 'leaf' },
    { pk: 8, productId: 'ID-8540', amount: 3, volumeOfMeasure: 'kgs', level: 4, parentId: 'ID-673', treePart: 'leaf' },
    { pk: 9, productId: 'ID-8541', amount: 4, volumeOfMeasure: 'pieces', level: 1, parentId: 'ID-850', treePart: 'parent' },
    { pk: 10, productId: 'ID-8542', amount: 5, volumeOfMeasure: 'pieces', level: 2, parentId: 'ID-541', treePart: 'intermediate' },
    { pk: 11, productId: 'ID-8543', amount: 2, volumeOfMeasure: 'kgs', level: 3, parentId: 'ID-673', treePart: 'intermediate' },
    { pk: 12, productId: 'ID-8544', amount: 1, volumeOfMeasure: 'pieces', level: 4, parentId: 'ID-422', treePart: 'leaf' },
    { pk: 13, productId: 'ID-8545', amount: 3, volumeOfMeasure: 'kgs', level: 2, parentId: 'ID-850', treePart: 'intermediate' },
    { pk: 14, productId: 'ID-8546', amount: 4, volumeOfMeasure: 'pieces', level: 3, parentId: 'ID-541', treePart: 'leaf' }
  ];

  // Spare Part - Vehicle Link
  const sparePartVehicleLink = [
    { pk: 1, productId: 'ID-4123', vehicle: 'V5', ownership: 'New', vintageStart: 'Jul-01', vintageEnd: 'Jan-16' },
    { pk: 2, productId: 'ID-2314', vehicle: 'V235', ownership: 'New', vintageStart: 'Aug-06', vintageEnd: 'Jan-18' },
    { pk: 3, productId: 'ID-505', vehicle: 'V65', ownership: 'New', vintageStart: 'Sep-11', vintageEnd: 'Apr-09' },
    { pk: 4, productId: 'ID-1304', vehicle: 'V50', ownership: 'New', vintageStart: 'Feb-05', vintageEnd: 'Jul-01' },
    { pk: 5, productId: 'ID-3113', vehicle: 'V65', ownership: 'Both', vintageStart: 'Apr-09', vintageEnd: 'Aug-06' },
    { pk: 6, productId: 'ID-4922', vehicle: 'V20', ownership: 'New', vintageStart: 'Apr-09', vintageEnd: 'Sep-11' },
    { pk: 7, productId: 'ID-6731', vehicle: 'V5', ownership: 'Repurp', vintageStart: 'Jul-01', vintageEnd: 'Feb-05' },
    { pk: 8, productId: 'ID-8540', vehicle: 'V235', ownership: 'New', vintageStart: 'Aug-06', vintageEnd: 'Apr-09' },
    { pk: 9, productId: 'ID-8541', vehicle: 'V65', ownership: 'New', vintageStart: 'Sep-11', vintageEnd: 'Jan-16' },
    { pk: 10, productId: 'ID-8542', vehicle: 'V50', ownership: 'Both', vintageStart: 'Apr-09', vintageEnd: 'Jan-18' },
    { pk: 11, productId: 'ID-8543', vehicle: 'V20', ownership: 'New', vintageStart: 'Feb-05', vintageEnd: 'Jul-01' },
    { pk: 12, productId: 'ID-8544', vehicle: 'V5', ownership: 'Repurp', vintageStart: 'Apr-09', vintageEnd: 'Aug-06' },
    { pk: 13, productId: 'ID-8545', vehicle: 'V235', ownership: 'Both', vintageStart: 'Sep-11', vintageEnd: 'Apr-09' },
    { pk: 14, productId: 'ID-8546', vehicle: 'V65', ownership: 'New', vintageStart: 'Jul-01', vintageEnd: 'Jan-16' },
    { pk: 15, productId: 'ID-8547', vehicle: 'V50', ownership: 'New', vintageStart: 'Aug-06', vintageEnd: 'Jan-18' },
    { pk: 16, productId: 'ID-8548', vehicle: 'V20', ownership: 'Repurp', vintageStart: 'Sep-11', vintageEnd: 'Apr-09' },
    { pk: 17, productId: 'ID-8549', vehicle: 'V5', ownership: 'Both', vintageStart: 'Feb-05', vintageEnd: 'Jul-01' }
  ];

  // Channel Health - Revenue Data
  const revenueValueData = [
    { channel: 'Direct', revenue: 1261522 },
    { channel: 'E-Commerce', revenue: 15465 },
    { channel: 'Blog', revenue: 16516 },
    { channel: 'Website', revenue: 121226 },
    { channel: 'HFS', revenue: 501277 },
    { channel: 'Conference', revenue: 843260.7 },
    { channel: 'MR', revenue: 185244.4 }
  ];

  const revenueVolumeData = [
    { channel: 'Direct', revenue: 261 },
    { channel: 'E-Commerce', revenue: 123 },
    { channel: 'Blog', revenue: 40 },
    { channel: 'Website', revenue: 100 },
    { channel: 'HFS', revenue: 120 },
    { channel: 'Conference', revenue: 60 },
    { channel: 'MR', revenue: 68 }
  ];

  // New Business Data
  const newBusinessData = [
    { channel: 'Blog', cp: 'Customer', cpType: 'Distributor', newLeads: 51, leadsClosed: 45, revenueVal: 655121, revenueVol: 2, pipelineVal: 648600, pipelineVol: 5 },
    { channel: 'Website', cp: 'Owned', cpType: 'Factory', newLeads: 61, leadsClosed: 55, revenueVal: 465161, revenueVol: 3, pipelineVal: 458640, pipelineVol: 2 },
    { channel: 'Conference', cp: 'Owned', cpType: 'Factory', newLeads: 43, leadsClosed: 37, revenueVal: 56465, revenueVol: 4, pipelineVal: 49944, pipelineVol: 7 },
    { channel: 'HFS', cp: 'Owned', cpType: 'Factory', newLeads: 32, leadsClosed: 26, revenueVal: 26161, revenueVol: 1, pipelineVal: 19640, pipelineVol: 5 },
    { channel: 'Exhibition', cp: 'Suppliers', cpType: 'Warehouse', newLeads: 12, leadsClosed: 6, revenueVal: 51195, revenueVol: 3, pipelineVal: 44674, pipelineVol: 4 },
    { channel: 'E-Commerce', cp: 'Owned', cpType: 'Warehouse', newLeads: 65, leadsClosed: 59, revenueVal: 465161, revenueVol: 2, pipelineVal: 458640, pipelineVol: 5 },
    { channel: 'Blog', cp: 'Customer', cpType: 'Workshop', newLeads: 15, leadsClosed: 9, revenueVal: 56465, revenueVol: 3, pipelineVal: 49944, pipelineVol: 1 },
    { channel: 'Website', cp: 'Owned', cpType: 'Factory', newLeads: 23, leadsClosed: 17, revenueVal: 26161, revenueVol: 4, pipelineVal: 19640, pipelineVol: 1 },
    { channel: 'Conference', cp: 'Owned', cpType: 'Warehouse', newLeads: 30, leadsClosed: 24, revenueVal: 51195, revenueVol: 5, pipelineVal: 44674, pipelineVol: 1 },
    { channel: 'HFS', cp: 'Owned', cpType: 'Warehouse', newLeads: 50, leadsClosed: 44, revenueVal: 465161, revenueVol: 2, pipelineVal: 458640, pipelineVol: 4 },
    { channel: 'Direct', cp: 'Customer', cpType: 'Distributor', newLeads: 45, leadsClosed: 40, revenueVal: 325161, revenueVol: 3, pipelineVal: 318640, pipelineVol: 2 },
    { channel: 'MR', cp: 'Owned', cpType: 'Factory', newLeads: 28, leadsClosed: 22, revenueVal: 42161, revenueVol: 2, pipelineVal: 39640, pipelineVol: 3 },
    { channel: 'Exhibition', cp: 'Customer', cpType: 'Retailer', newLeads: 18, leadsClosed: 12, revenueVal: 32195, revenueVol: 2, pipelineVal: 28674, pipelineVol: 2 },
    { channel: 'E-Commerce', cp: 'Owned', cpType: 'Factory', newLeads: 55, leadsClosed: 49, revenueVal: 385161, revenueVol: 4, pipelineVal: 378640, pipelineVol: 3 }
  ];

  // Product Mix Data
  const productMixData = [
    { channel: 'HFS', product: 'A', y2015_16: 15, y2016_17: 12, y2017_18: 21 },
    { channel: 'HFS', product: 'B', y2015_16: 10, y2016_17: 55, y2017_18: 12 },
    { channel: 'HFS', product: 'C', y2015_16: 21, y2016_17: 22, y2017_18: 32 },
    { channel: 'HFS', product: 'D', y2015_16: 12, y2016_17: 10, y2017_18: 10 },
    { channel: 'HFS', product: 'E', y2015_16: 11, y2016_17: 22, y2017_18: 32 },
    { channel: 'MR', product: 'A', y2015_16: 21, y2016_17: 22, y2017_18: 32 },
    { channel: 'MR', product: 'B', y2015_16: 12, y2016_17: 10, y2017_18: 10 },
    { channel: 'MR', product: 'C', y2015_16: 15, y2016_17: 12, y2017_18: 21 },
    { channel: 'MR', product: 'D', y2015_16: 10, y2016_17: 55, y2017_18: 12 },
    { channel: 'MR', product: 'E', y2015_16: 11, y2016_17: 22, y2017_18: 32 }
  ];

  // Data Table Component
  const DataTable = ({ title, headers, data, showEntries: entries, searchValue, onSearchChange, onEntriesChange, hideTitle = false }) => {
    const filteredData = data.filter(row => 
      Object.values(row).some(val => 
        String(val).toLowerCase().includes(searchValue.toLowerCase())
      )
    );
    const paginatedData = filteredData.slice(0, entries);
    const totalEntries = filteredData.length;

    return (
      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
        <div className="box-body" style={{ padding: '15px' }}>
          {title && !hideTitle && <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>{title}</h3>}
          
          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ marginRight: '5px' }}>Show</label>
              <select 
                value={entries} 
                onChange={(e) => onEntriesChange(Number(e.target.value))}
                style={{ padding: '5px 10px', border: '1px solid #d2d6de', borderRadius: '4px' }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </div>
            <div>
              <label style={{ marginRight: '5px' }}>Search:</label>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{ padding: '5px 10px', border: '1px solid #d2d6de', borderRadius: '4px', width: '200px' }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-bordered table-striped" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead style={{ background: '#f4f4f4' }}>
                <tr>
                  {headers.map((header, idx) => (
                    <th key={idx} style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold', cursor: 'pointer' }}>
                      {header} <i className="fa fa-sort"></i>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, idx) => (
                  <tr key={idx}>
                    {headers.map((header, colIdx) => {
                      const key = Object.keys(row)[colIdx];
                      return (
                        <td key={colIdx} style={{ padding: '10px', border: '1px solid #ddd' }}>
                          {row[key] || ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>
              Showing 1 to {Math.min(entries, totalEntries)} of {totalEntries} entries
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button className="btn btn-default" style={{ padding: '5px 10px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
                Previous
              </button>
              <button className="btn btn-default" style={{ padding: '5px 10px', border: '1px solid #3c8dbc', borderRadius: '4px', background: '#3c8dbc', color: '#fff', cursor: 'pointer' }}>
                1
              </button>
              {totalEntries > entries && (
                <button className="btn btn-default" style={{ padding: '5px 10px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
                  2
                </button>
              )}
              <button className="btn btn-default" style={{ padding: '5px 10px', border: '1px solid #d2d6de', borderRadius: '4px', background: '#fff', cursor: 'pointer' }}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="content-header" style={{ backgroundColor: '#ecf0f5', minHeight: 'calc(100vh - 50px)', padding: '20px' }}>
      {/* HOW Header Box */}
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
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Channels</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {channelQuestions.map((question, index) => (
              <li key={index} style={{ marginBottom: '12px', paddingLeft: '20px', position: 'relative', color: '#333', fontSize: '14px', lineHeight: '1.6' }}>
                <span style={{ position: 'absolute', left: '0', color: '#666' }}>•</span>
                {question}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Tabs: Channel Master and Channel Health */}
      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
        <div className="box-body" style={{ padding: '15px' }}>
          <ul className="nav nav-tabs" style={{ borderBottom: '2px solid #ddd', marginBottom: '20px', listStyle: 'none', padding: 0, display: 'flex' }}>
            <li className={activeTab === 'channelMaster' ? 'active' : ''} style={{ marginRight: '5px' }}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveTab('channelMaster'); }}
                style={{
                  padding: '10px 20px',
                  display: 'inline-block',
                  border: 'none',
                  borderBottom: activeTab === 'channelMaster' ? '3px solid #3c8dbc' : 'none',
                  background: 'transparent',
                  color: activeTab === 'channelMaster' ? '#3c8dbc' : '#666',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'channelMaster' ? 'bold' : 'normal',
                  textDecoration: 'none'
                }}
              >
                Channel Master
              </a>
            </li>
            <li className={activeTab === 'channelHealth' ? 'active' : ''}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveTab('channelHealth'); }}
                style={{
                  padding: '10px 20px',
                  display: 'inline-block',
                  border: 'none',
                  borderBottom: activeTab === 'channelHealth' ? '3px solid #3c8dbc' : 'none',
                  background: 'transparent',
                  color: activeTab === 'channelHealth' ? '#3c8dbc' : '#666',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'channelHealth' ? 'bold' : 'normal',
                  textDecoration: 'none'
                }}
              >
                Channel Health
              </a>
            </li>
          </ul>

          {/* Channel Master Tab Content */}
          {activeTab === 'channelMaster' && (
            <div>
              {/* CHANNEL MASTER DATA Header */}
              <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                <div className="box-header" style={{ backgroundColor: '#3c8dbc', color: '#fff', padding: '10px 15px', borderBottom: '1px solid #367fa9' }}>
                  <h3 className="box-title" style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                    CHANNEL MASTER DATA
                  </h3>
                  <div className="box-tools pull-right">
                    <button className="btn btn-box-tool" data-widget="collapse" style={{ color: '#fff', background: 'transparent', border: 'none', padding: '5px', cursor: 'pointer' }}>
                      <i className="fa fa-minus"></i>
                    </button>
                  </div>
                </div>
                <div className="box-body" style={{ padding: '15px' }}>
                  {/* Two tables side by side */}
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {/* Channel Master Data */}
                    <div style={{ flex: '1', minWidth: '400px' }}>
                      <DataTable
                        title="Channel Master Data"
                        headers={['#', 'Channel Name', 'Channel Type', 'Level 1', 'Level 2', 'Level 3']}
                        data={channelMasterData.map((row, idx) => ({
                          '#': idx + 1,
                          'Channel Name': row.channelName,
                          'Channel Type': row.channelType,
                          'Level 1': row.level1 || '',
                          'Level 2': row.level2 || '',
                          'Level 3': row.level3 || ''
                        }))}
                        showEntries={showEntries}
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        onEntriesChange={setShowEntries}
                      />
                    </div>

                    {/* Channel Participant Master */}
                    <div style={{ flex: '1', minWidth: '400px' }}>
                      <DataTable
                        title="Channel Participant Master"
                        headers={['#', 'CP Type', 'CP Owner']}
                        data={channelParticipantMaster.map((row, idx) => ({
                          '#': idx + 1,
                          'CP Type': row.cpType,
                          'CP Owner': row.cpOwner
                        }))}
                        showEntries={showEntries}
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        onEntriesChange={setShowEntries}
                      />
                    </div>
                  </div>

                  {/* Channel Participant Name and Channel Structure side by side */}
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
                    {/* Channel Participant Name */}
                    <div style={{ flex: '1', minWidth: '400px' }}>
                      <DataTable
                        title="Channel Participant Name"
                        headers={['CP ID', 'CP Name', 'Address', 'Territory', 'CP Type', 'CP SubType']}
                        data={channelParticipantName.map(row => ({
                          'CP ID': row.cpId,
                          'CP Name': row.cpName,
                          'Address': row.address,
                          'Territory': row.territory,
                          'CP Type': row.cpType,
                          'CP SubType': row.cpSubType
                        }))}
                        showEntries={showEntries}
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        onEntriesChange={setShowEntries}
                      />
                    </div>

                    {/* Channel Structure */}
                    <div style={{ flex: '1', minWidth: '400px' }}>
                      <DataTable
                        title="Channel Structure"
                        headers={['Channel ID', 'CP From', 'CP To']}
                        data={channelStructure.map(row => ({
                          'Channel ID': row.channelId,
                          'CP From': row.cpFrom,
                          'CP To': row.cpTo
                        }))}
                        showEntries={showEntries}
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        onEntriesChange={setShowEntries}
                      />
                    </div>
                  </div>

                  {/* Product Movement In Channel */}
                  <DataTable
                    title="Product Movement In Channel"
                    headers={['Product Id', 'CP From', 'CP To', 'Channel ID', 'Date From', 'Date To']}
                    data={productMovement.map(row => ({
                      'Product Id': row.productId,
                      'CP From': row.cpFrom,
                      'CP To': row.cpTo,
                      'Channel ID': row.channelId,
                      'Date From': row.dateFrom,
                      'Date To': row.dateTo
                    }))}
                    showEntries={showEntries}
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    onEntriesChange={setShowEntries}
                  />

                  {/* Product BOM */}
                  <DataTable
                    title="Product BOM"
                    headers={['P.K', 'Product ID', 'Amount', 'Volume of Measure', 'Level', 'Parent ID', 'Tree Part']}
                    data={productBOM.map(row => ({
                      'P.K': row.pk,
                      'Product ID': row.productId,
                      'Amount': row.amount,
                      'Volume of Measure': row.volumeOfMeasure,
                      'Level': row.level,
                      'Parent ID': row.parentId,
                      'Tree Part': row.treePart
                    }))}
                    showEntries={showEntries}
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    onEntriesChange={setShowEntries}
                  />

                  {/* Spare Part - Vehicle Link */}
                  <DataTable
                    title="Spare Part - Vehicle Link"
                    headers={['P.K', 'Product ID', 'Vehicle', 'Ownership', 'Vintage Start', 'Vintage End']}
                    data={sparePartVehicleLink.map(row => ({
                      'P.K': row.pk,
                      'Product ID': row.productId,
                      'Vehicle': row.vehicle,
                      'Ownership': row.ownership,
                      'Vintage Start': row.vintageStart,
                      'Vintage End': row.vintageEnd
                    }))}
                    showEntries={showEntries}
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    onEntriesChange={setShowEntries}
                  />

                  {/* Channel Participant Link */}
                  <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                    <div className="box-body" style={{ padding: '15px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>Channel Participant Link</h3>
                      <p style={{ color: '#666' }}>Channel Participant Link data will be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Channel Health Tab Content */}
          {activeTab === 'channelHealth' && (
            <div>
              {/* CHANNEL HEALTH Header */}
              <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                <div className="box-header" style={{ backgroundColor: '#3c8dbc', color: '#fff', padding: '10px 15px', borderBottom: '1px solid #367fa9' }}>
                  <h3 className="box-title" style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                    CHANNEL HEALTH
                  </h3>
                  <div className="box-tools pull-right">
                    <button className="btn btn-box-tool" data-widget="collapse" style={{ color: '#fff', background: 'transparent', border: 'none', padding: '5px', cursor: 'pointer' }}>
                      <i className="fa fa-minus"></i>
                    </button>
                  </div>
                </div>
                <div className="box-body" style={{ padding: '15px' }}>
                  {/* Revenue Value and Volume side by side */}
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    {/* All Channel - Revenue(Val) */}
                    <div style={{ flex: '1', minWidth: '400px' }}>
                      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                        <div className="box-body" style={{ padding: '15px' }}>
                          {/* Time Period Filter */}
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ marginRight: '5px', fontWeight: 'bold' }}>Time Period:</label>
                            <select 
                              value={timePeriod}
                              onChange={(e) => setTimePeriod(e.target.value)}
                              style={{ padding: '5px 10px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                            >
                              <option>Current Month</option>
                              <option>Last Month</option>
                              <option>Current Quarter</option>
                              <option>Last Quarter</option>
                              <option>Current Year</option>
                              <option>Last Year</option>
                            </select>
                          </div>
                          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>All Channel - Revenue(Val)</h3>
                          <DataTable
                            title=""
                            headers={['Channel', 'Revenue (Value)']}
                            data={revenueValueData.map(row => ({
                              'Channel': row.channel,
                              'Revenue (Value)': row.revenue.toLocaleString()
                            }))}
                            showEntries={showEntries}
                            searchValue={searchTerm}
                            onSearchChange={setSearchTerm}
                            onEntriesChange={setShowEntries}
                            hideTitle={true}
                          />
                        </div>
                      </div>
                    </div>

                    {/* All Channel - Revenue(Vol) */}
                    <div style={{ flex: '1', minWidth: '400px' }}>
                      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                        <div className="box-body" style={{ padding: '15px' }}>
                          {/* Time Period Filter */}
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ marginRight: '5px', fontWeight: 'bold' }}>Time Period:</label>
                            <select 
                              value={timePeriod}
                              onChange={(e) => setTimePeriod(e.target.value)}
                              style={{ padding: '5px 10px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                            >
                              <option>Current Month</option>
                              <option>Last Month</option>
                              <option>Current Quarter</option>
                              <option>Last Quarter</option>
                              <option>Current Year</option>
                              <option>Last Year</option>
                            </select>
                          </div>
                          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>All Channel - Revenue(Vol)</h3>
                          <DataTable
                            title=""
                            headers={['Channel', 'Revenue (Volume)']}
                            data={revenueVolumeData.map(row => ({
                              'Channel': row.channel,
                              'Revenue (Volume)': row.revenue.toLocaleString()
                            }))}
                            showEntries={showEntries}
                            searchValue={searchTerm}
                            onSearchChange={setSearchTerm}
                            onEntriesChange={setShowEntries}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Trends side by side */}
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    {/* All Channel - Revenue trends(Val) */}
                    <div style={{ flex: '1', minWidth: '400px' }}>
                      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                        <div className="box-body" style={{ padding: '15px' }}>
                          {/* Time Period Filter */}
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ marginRight: '5px', fontWeight: 'bold' }}>Time Period:</label>
                            <select 
                              value={timePeriod}
                              onChange={(e) => setTimePeriod(e.target.value)}
                              style={{ padding: '5px 10px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                            >
                              <option>Current Month</option>
                              <option>Last Month</option>
                              <option>Current Quarter</option>
                              <option>Last Quarter</option>
                              <option>Current Year</option>
                              <option>Last Year</option>
                            </select>
                          </div>
                          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>All Channel - Revenue trends(Val)</h3>
                          <DataTable
                            title=""
                            headers={['Channel', 'Revenue (Value)']}
                            data={revenueValueData.map(row => ({
                              'Channel': row.channel,
                              'Revenue (Value)': row.revenue.toLocaleString()
                            }))}
                            showEntries={showEntries}
                            searchValue={searchTerm}
                            onSearchChange={setSearchTerm}
                            onEntriesChange={setShowEntries}
                            hideTitle={true}
                          />
                        </div>
                      </div>
                    </div>

                    {/* All Channel - Revenue(Vol) - Second instance */}
                    <div style={{ flex: '1', minWidth: '400px' }}>
                      <div className="box box-solid" style={{ marginBottom: '20px', borderRadius: '3px', background: '#fff', borderTop: '3px solid #d2d6de', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                        <div className="box-body" style={{ padding: '15px' }}>
                          {/* Time Period Filter */}
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ marginRight: '5px', fontWeight: 'bold' }}>Time Period:</label>
                            <select 
                              value={timePeriod}
                              onChange={(e) => setTimePeriod(e.target.value)}
                              style={{ padding: '5px 10px', border: '1px solid #d2d6de', borderRadius: '4px' }}
                            >
                              <option>Current Month</option>
                              <option>Last Month</option>
                              <option>Current Quarter</option>
                              <option>Last Quarter</option>
                              <option>Current Year</option>
                              <option>Last Year</option>
                            </select>
                          </div>
                          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>All Channel - Revenue(Vol)</h3>
                          <DataTable
                            title=""
                            headers={['Channel', 'Revenue (Volume)']}
                            data={revenueVolumeData.map(row => ({
                              'Channel': row.channel,
                              'Revenue (Volume)': row.revenue.toLocaleString()
                            }))}
                            showEntries={showEntries}
                            searchValue={searchTerm}
                            onSearchChange={setSearchTerm}
                            onEntriesChange={setShowEntries}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* All Channel - New Business */}
                  <DataTable
                    title="All Channel - New Business"
                    headers={['Channel', 'C.P', 'Cp Type', 'New Leads', 'Leads Closed', 'Revenue Val', 'Revenue Vol', 'Pipeline Val', 'Pipeline Vol']}
                    data={newBusinessData.map(row => ({
                      'Channel': row.channel,
                      'C.P': row.cp,
                      'Cp Type': row.cpType,
                      'New Leads': row.newLeads,
                      'Leads Closed': row.leadsClosed,
                      'Revenue Val': row.revenueVal.toLocaleString(),
                      'Revenue Vol': row.revenueVol,
                      'Pipeline Val': row.pipelineVal.toLocaleString(),
                      'Pipeline Vol': row.pipelineVol
                    }))}
                    showEntries={showEntries}
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    onEntriesChange={setShowEntries}
                  />

                  {/* All Channel - Product Mix(Vol) */}
                  <DataTable
                    title="All Channel - Product Mix(Vol)"
                    headers={['Channel', 'Product', '2015-16', '2016-17', '2017-18']}
                    data={productMixData.map(row => ({
                      'Channel': row.channel,
                      'Product': row.product,
                      '2015-16': row.y2015_16,
                      '2016-17': row.y2016_17,
                      '2017-18': row.y2017_18
                    }))}
                    showEntries={showEntries}
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    onEntriesChange={setShowEntries}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Channel;
