import React, { useState, useMemo } from 'react';
import Card from './shared/Card';

const BoosterAnalysisSection = ({ data }) => {
  const [minBooster, setMinBooster] = useState(data.minBooster || 0.489411765);
  const [maxBooster, setMaxBooster] = useState(data.maxBooster || 407.5);
  const [columnFilters, setColumnFilters] = useState({
    lhs: '',
    rhs: '',
    booster: '',
    invoiceCount: '',
  });
  const [visibleColumns, setVisibleColumns] = useState({
    lhs: true,
    rhs: true,
    booster: true,
    invoiceCount: true,
  });

  // Filter by booster range and column filters
  const filteredData = useMemo(() => {
    return data.tableData.filter(row => {
      const boosterMatch = row.booster >= minBooster && row.booster <= maxBooster;
      const lhsMatch = !columnFilters.lhs || row.lhs.toLowerCase().includes(columnFilters.lhs.toLowerCase());
      const rhsMatch = !columnFilters.rhs || row.rhs.toLowerCase().includes(columnFilters.rhs.toLowerCase());
      const boosterFilterMatch = !columnFilters.booster || row.booster.toString().includes(columnFilters.booster);
      const invoiceCountMatch = !columnFilters.invoiceCount || row.invoiceCount.toString().includes(columnFilters.invoiceCount);
      
      return boosterMatch && lhsMatch && rhsMatch && boosterFilterMatch && invoiceCountMatch;
    });
  }, [data.tableData, minBooster, maxBooster, columnFilters]);

  const handleCopy = () => {
    const visibleCols = Object.keys(visibleColumns).filter(key => visibleColumns[key]);
    const headers = visibleCols.map(col => col.toUpperCase());
    const csv = [
      headers,
      ...filteredData.map(row => visibleCols.map(col => row[col]))
    ].map(row => row.join(',')).join('\n');
    navigator.clipboard.writeText(csv);
  };

  const handleDownload = () => {
    const visibleCols = Object.keys(visibleColumns).filter(key => visibleColumns[key]);
    const headers = visibleCols.map(col => col.toUpperCase());
    const csv = [
      headers,
      ...filteredData.map(row => visibleCols.map(col => row[col]))
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'booster-analysis.csv';
    a.click();
  };

  const toggleColumnVisibility = (column) => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  return (
    <Card title="Booster Analysis" className="mb-6">
      {/* Header with Min/Max Booster */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-2">
          <button onClick={handleCopy} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
            Copy
          </button>
          <button onClick={() => window.print()} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
            Print
          </button>
          <button onClick={handleDownload} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
            Download
          </button>
          <div className="relative group">
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
              Column visibility
            </button>
            <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 p-2 min-w-[150px] hidden group-hover:block">
              {Object.keys(visibleColumns).map(col => (
                <label key={col} className="flex items-center gap-2 p-1 hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleColumns[col]}
                    onChange={() => toggleColumnVisibility(col)}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">{col.toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Min Booster value</label>
            <input
              type="number"
              value={minBooster}
              onChange={(e) => setMinBooster(parseFloat(e.target.value) || 0)}
              className="px-2 py-1 border border-gray-300 rounded text-sm w-32"
              step="0.01"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Max Booster value</label>
            <input
              type="number"
              value={maxBooster}
              onChange={(e) => setMaxBooster(parseFloat(e.target.value) || 0)}
              className="px-2 py-1 border border-gray-300 rounded text-sm w-32"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              {visibleColumns.lhs && (
                <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                  LHS <span className="text-xs">↑↓</span>
                </th>
              )}
              {visibleColumns.rhs && (
                <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                  RHS <span className="text-xs">↑↓</span>
                </th>
              )}
              {visibleColumns.booster && (
                <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                  Booster <span className="text-xs">↑↓</span>
                </th>
              )}
              {visibleColumns.invoiceCount && (
                <th className="border border-gray-300 px-4 py-2 text-left font-bold cursor-pointer">
                  Invoice Count <span className="text-xs">↑↓</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {visibleColumns.lhs && (
                  <td className="border border-gray-300 px-4 py-2">{row.lhs}</td>
                )}
                {visibleColumns.rhs && (
                  <td className="border border-gray-300 px-4 py-2">{row.rhs}</td>
                )}
                {visibleColumns.booster && (
                  <td className="border border-gray-300 px-4 py-2">{row.booster.toFixed(2)}</td>
                )}
                {visibleColumns.invoiceCount && (
                  <td className="border border-gray-300 px-4 py-2">{row.invoiceCount.toLocaleString()}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Column Filters */}
      <div className="mt-4 flex gap-2">
        {visibleColumns.lhs && (
          <input
            type="text"
            placeholder="All"
            className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
            value={columnFilters.lhs}
            onChange={(e) => setColumnFilters(prev => ({ ...prev, lhs: e.target.value }))}
          />
        )}
        {visibleColumns.rhs && (
          <input
            type="text"
            placeholder="All"
            className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
            value={columnFilters.rhs}
            onChange={(e) => setColumnFilters(prev => ({ ...prev, rhs: e.target.value }))}
          />
        )}
        {visibleColumns.booster && (
          <input
            type="text"
            placeholder="All"
            className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
            value={columnFilters.booster}
            onChange={(e) => setColumnFilters(prev => ({ ...prev, booster: e.target.value }))}
          />
        )}
        {visibleColumns.invoiceCount && (
          <input
            type="text"
            placeholder="All"
            className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
            value={columnFilters.invoiceCount}
            onChange={(e) => setColumnFilters(prev => ({ ...prev, invoiceCount: e.target.value }))}
          />
        )}
      </div>
    </Card>
  );
};

export default BoosterAnalysisSection;

