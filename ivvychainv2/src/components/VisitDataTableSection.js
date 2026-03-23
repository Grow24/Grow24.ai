import React, { useState } from 'react';
import Card from './shared/Card';

const VisitDataTableSection = ({ data }) => {
  const [activeTab, setActiveTab] = useState('dataTable'); // 'dataTable' | 'visitSpecific' | 'checkInOut'
  const [searchTerm, setSearchTerm] = useState('');
  const [salesRepFilter, setSalesRepFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('2016-12-31');
  const [dateTo, setDateTo] = useState('2017-01-11');

  const filteredData = data?.tableData?.filter(row => {
    const matchesSearch = !searchTerm || 
      row.visitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.accLeadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.status.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  const handleCopy = () => {
    const csv = [
      ['Date', 'Visit Name', 'Acc/Lead Name', 'Status'],
      ...filteredData.map(row => [row.date, row.visitName, row.accLeadName, row.status])
    ].map(row => row.join(',')).join('\n');
    navigator.clipboard.writeText(csv);
  };

  const handleExcel = () => {
    // Similar to CSV but with Excel formatting
    handleDownload('xlsx');
  };

  const handleCSV = () => {
    handleDownload('csv');
  };

  const handlePDF = () => {
    window.print();
  };

  const handleDownload = (format) => {
    const csv = [
      ['Date', 'Visit Name', 'Acc/Lead Name', 'Status'],
      ...filteredData.map(row => [row.date, row.visitName, row.accLeadName, row.status])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visit-data.${format}`;
    a.click();
  };

  return (
    <Card className="mb-6">
      {/* Tabs */}
      <div className="mb-4 flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('dataTable')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'dataTable'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Data Table
        </button>
        <button
          onClick={() => setActiveTab('visitSpecific')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'visitSpecific'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Visit Specific
        </button>
        <button
          onClick={() => setActiveTab('checkInOut')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'checkInOut'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Check In/Out
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-4 items-center flex-wrap">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <input
              key={i}
              type="text"
              placeholder="A"
              className="w-12 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          ))}
        </div>
        <select
          className="px-3 py-2 border border-gray-300 rounded text-sm"
          value={salesRepFilter}
          onChange={(e) => setSalesRepFilter(e.target.value)}
        >
          <option>All</option>
          <option>Sales Rep 1</option>
          <option>Sales Rep 2</option>
        </select>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          />
          <span className="text-sm text-gray-600">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'dataTable' && (
        <div>
          {/* Action Buttons */}
          <div className="mb-4 flex gap-2 items-center justify-between">
            <div className="flex gap-2">
              <button onClick={handleCopy} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
                Copy
              </button>
              <button onClick={handleExcel} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
                Excel
              </button>
              <button onClick={handleCSV} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
                CSV
              </button>
              <button onClick={handlePDF} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
                PDF
              </button>
              <button onClick={() => window.print()} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
                Print
              </button>
            </div>
            <div>
              <input
                type="text"
                placeholder="Search:"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          {/* Table */}
          <div className="grid grid-cols-2 gap-6">
            <div className="overflow-x-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold">#</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold">Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold">Visit Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold">Acc/Lead Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.date}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.visitName}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.accLeadName}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Map Placeholder */}
            <div className="border border-gray-300 rounded p-4 bg-gray-50">
              <div className="text-center text-gray-500">
                <div className="text-lg font-semibold mb-2">Map View</div>
                <div className="text-sm">Map integration would go here</div>
                <div className="text-xs mt-2">(Leaflet/Google Maps with visit location markers)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'visitSpecific' && (
        <div className="p-8 text-center text-gray-500">
          <div className="text-lg font-semibold mb-2">Visit Specific Details</div>
          <div className="text-sm">Detailed per-visit metrics and analytics</div>
        </div>
      )}

      {activeTab === 'checkInOut' && (
        <div className="p-8 text-center text-gray-500">
          <div className="text-lg font-semibold mb-2">Check In/Out</div>
          <div className="text-sm">Time-stamped check-ins, distance tracking, and location data</div>
        </div>
      )}
    </Card>
  );
};

export default VisitDataTableSection;


