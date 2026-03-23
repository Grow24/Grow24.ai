import React, { useState } from 'react';
import Card from './shared/Card';
import TopNTrendCard from './TopNTrendCard';

const TopNProductsByValueSection = ({ data, filters }) => {
  const [mode, setMode] = useState('product');

  const products = data?.products || [];
  const customers = data?.customers || [];
  const items = mode === 'product' ? products : customers;

  return (
    <Card title="Top N Products By Value" className="mb-6">
      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setMode('product')}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            mode === 'product'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Product
        </button>
        <button
          onClick={() => setMode('customer')}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            mode === 'customer'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Customer
        </button>
      </div>

      {/* Trend/Seasonality Grid */}
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-2 gap-6">
            <TopNTrendCard
              title={`Trend : ${item.name} by value`}
              trendData={item.trendSeries}
              seasonalityData={item.seasonalitySeries}
              metric="value"
            />
            <TopNTrendCard
              title={`Seasonality : ${item.name} by value`}
              trendData={item.trendSeries}
              seasonalityData={item.seasonalitySeries}
              metric="value"
              isSeasonality={true}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopNProductsByValueSection;


