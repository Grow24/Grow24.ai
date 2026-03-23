import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Card from '../shared/Card';
import DataTable from './shared/DataTable';

const CensusModule = () => {
  const [activeTab, setActiveTab] = useState('graphs'); // 'graphs' | 'table'
  const [countryFilter, setCountryFilter] = useState('India');
  const [stateFilter, setStateFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [graphData, setGraphData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [states, setStates] = useState(['All']);
  const [districts] = useState(['All']);

  useEffect(() => {
    // Mock data - replace with API call
    const mockStates = [
      'ANDAMAN AND NICOBAR ISLANDS',
      'ANDHRA PRADESH',
      'ARUNACHAL PRADESH',
      'ASSAM',
      'BIHAR',
      'CHANDIGARH',
      'CHHATTISGARH',
      'DADRA AND NAGAR HAVELI',
      'DAMAN AND DIU',
      'GOA',
      'GUJARAT',
      'HARYANA',
      'HIMACHAL PRADESH',
      'JAMMU AND KASHMIR',
      'JHARKHAND',
      'KARNATAKA',
      'KERALA',
      'LAKSHADWEEP',
      'MADHYA PRADESH',
      'MAHARASHTRA',
      'MANIPUR',
      'MEGHALAYA',
      'MIZORAM',
      'NAGALAND',
      'NCT OF DELHI',
      'ORISSA',
      'PONDICHERRY',
      'PUNJAB',
      'RAJASTHAN',
      'SIKKIM',
      'TAMIL NADU',
      'TRIPURA',
      'UTTAR PRADESH',
      'UTTARAKHAND',
      'WEST BENGAL',
    ];

    const mockGraphData = [
      { state: 'WEST BENGAL', population: 91276115 },
      { state: 'UTTARAKHAND', population: 10116752 },
      { state: 'UTTAR PRADESH', population: 199812341 },
      { state: 'TRIPURA', population: 3673917 },
      { state: 'TAMIL NADU', population: 72147030 },
      { state: 'SIKKIM', population: 610577 },
      { state: 'RAJASTHAN', population: 68548437 },
      { state: 'PUNJAB', population: 27743338 },
      { state: 'PONDICHERRY', population: 1247953 },
      { state: 'ORISSA', population: 41974218 },
      { state: 'NCT OF DELHI', population: 16787941 },
      { state: 'NAGALAND', population: 1978502 },
      { state: 'MIZORAM', population: 1097206 },
      { state: 'MEGHALAYA', population: 2966889 },
      { state: 'MANIPUR', population: 2855794 },
      { state: 'MAHARASHTRA', population: 112374333 },
      { state: 'MADHYA PRADESH', population: 72626809 },
      { state: 'LAKSHADWEEP', population: 64473 },
      { state: 'KERALA', population: 33406061 },
      { state: 'KARNATAKA', population: 61095297 },
      { state: 'JHARKHAND', population: 32988134 },
      { state: 'JAMMU AND KASHMIR', population: 12541302 },
      { state: 'HIMACHAL PRADESH', population: 6864602 },
      { state: 'HARYANA', population: 25351462 },
      { state: 'GUJARAT', population: 60439692 },
      { state: 'GOA', population: 1458545 },
      { state: 'DAMAN AND DIU', population: 243247 },
      { state: 'DADRA AND NAGAR HAVELI', population: 343709 },
      { state: 'CHHATTISGARH', population: 25545198 },
      { state: 'CHANDIGARH', population: 1055450 },
      { state: 'BIHAR', population: 104099452 },
      { state: 'ASSAM', population: 31169272 },
      { state: 'ARUNACHAL PRADESH', population: 1383727 },
      { state: 'ANDHRA PRADESH', population: 49577103 },
      { state: 'ANDAMAN AND NICOBAR ISLANDS', population: 380581 },
    ];

    const mockTableData = [
      { state: 'JAMMU AND KASHMIR', district: 'Kupwara', population: 870354, male: 474190, female: 396164 },
      { state: 'JAMMU AND KASHMIR', district: 'Badgam', population: 753745, male: 398041, female: 355704 },
      { state: 'JAMMU AND KASHMIR', district: 'Leh(Ladakh)', population: 133487, male: 78971, female: 54516 },
      { state: 'JAMMU AND KASHMIR', district: 'Kargil', population: 140802, male: 77785, female: 63017 },
      { state: 'JAMMU AND KASHMIR', district: 'Punch', population: 476835, male: 251899, female: 224936 },
      { state: 'JAMMU AND KASHMIR', district: 'Rajouri', population: 642415, male: 345351, female: 297064 },
      { state: 'JAMMU AND KASHMIR', district: 'Kathua', population: 616435, male: 326109, female: 290326 },
      { state: 'JAMMU AND KASHMIR', district: 'Baramula', population: 1008039, male: 534733, female: 473306 },
      { state: 'JAMMU AND KASHMIR', district: 'Bandipore', population: 392232, male: 207680, female: 184552 },
      { state: 'JAMMU AND KASHMIR', district: 'Srinagar', population: 1236829, male: 651124, female: 585705 },
    ];

    setStates(['All', ...mockStates]);
    setGraphData(mockGraphData.sort((a, b) => b.population - a.population));
    setTableData(mockTableData);
  }, [countryFilter, stateFilter, districtFilter]);

  const filteredGraphData = stateFilter === 'All'
    ? graphData
    : graphData.filter((d) => d.state === stateFilter);

  const filteredTableData = tableData.filter((row) => {
    if (stateFilter !== 'All' && row.state !== stateFilter) return false;
    if (districtFilter !== 'All' && row.district !== districtFilter) return false;
    return true;
  });

  const tableColumns = [
    { key: 'state', label: 'State name' },
    { key: 'district', label: 'District name' },
    { key: 'population', label: 'Population', render: (val) => val.toLocaleString() },
    { key: 'male', label: 'Male', render: (val) => val.toLocaleString() },
    { key: 'female', label: 'Female', render: (val) => val.toLocaleString() },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Census</h1>

      {/* Filters */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Country</label>
          <select
            value={countryFilter}
            onChange={(e) => {
              setCountryFilter(e.target.value);
              setStateFilter('All');
              setDistrictFilter('All');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="India">India</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select State</label>
          <select
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value);
              setDistrictFilter('All');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          >
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select District</label>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          >
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-300">
        <button
          onClick={() => setActiveTab('graphs')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'graphs'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Graphs
        </button>
        <button
          onClick={() => setActiveTab('table')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'table'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Table
        </button>
      </div>

      {/* Graphs Tab */}
      {activeTab === 'graphs' && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Population by State</h3>
          <ResponsiveContainer width="100%" height={Math.max(600, filteredGraphData.length * 25)}>
            <BarChart
              data={filteredGraphData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 200, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                label={{ value: 'Population', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                type="category"
                dataKey="state"
                width={180}
                tick={{ fontSize: 11 }}
              />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Bar dataKey="population" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Table Tab */}
      {activeTab === 'table' && (
        <DataTable
          data={filteredTableData}
          columns={tableColumns}
          pageSize={10}
        />
      )}
    </div>
  );
};

export default CensusModule;

