import React from 'react';
import Select from './shared/Select';
import DateRangePicker from './shared/DateRangePicker';

const FilterPanel = ({ filters, onFilterChange, summary }) => {
  const filterOptions = ['All', 'Option 1', 'Option 2', 'Option 3'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Filter</h2>
      <div className="grid grid-cols-4 gap-4">
        <Select
          label="Accounts"
          value={filters.accounts}
          onChange={(value) => onFilterChange('accounts', value)}
          options={filterOptions}
        />
        <Select
          label="Items"
          value={filters.items}
          onChange={(value) => onFilterChange('items', value)}
          options={filterOptions}
        />
        <Select
          label="Item Group"
          value={filters.itemGroup}
          onChange={(value) => onFilterChange('itemGroup', value)}
          options={filterOptions}
        />
        <Select
          label="Product Group"
          value={filters.productGroup}
          onChange={(value) => onFilterChange('productGroup', value)}
          options={filterOptions}
        />
        <Select
          label="Unit of Measure"
          value={filters.unitOfMeasure}
          onChange={(value) => onFilterChange('unitOfMeasure', value)}
          options={filterOptions}
        />
        <DateRangePicker
          label="Start Period – End Period"
          startDate={filters.startPeriod}
          endDate={filters.endPeriod}
          onStartChange={(value) => onFilterChange('startPeriod', value)}
          onEndChange={(value) => onFilterChange('endPeriod', value)}
        />
        <Select
          label="Industry Group"
          value={filters.industryGroup}
          onChange={(value) => onFilterChange('industryGroup', value)}
          options={filterOptions}
        />
        <Select
          label="Territory"
          value={filters.territory}
          onChange={(value) => onFilterChange('territory', value)}
          options={filterOptions}
        />
      </div>
      {summary && (
        <div className="mt-4 text-sm text-gray-600">
          {summary.records} records selected & {summary.invoices} invoices selected
        </div>
      )}
    </div>
  );
};

export default FilterPanel;

