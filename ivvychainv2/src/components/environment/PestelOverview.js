import React from 'react';

const PestelOverview = () => {
  const pestelCategories = [
    {
      id: 'political',
      title: 'Political',
      description: 'Govt policy, tax policy, Labor law, Environment law, Trade restrictions, instability in overseas markets'
    },
    {
      id: 'economic',
      title: 'Economic Growth',
      description: 'macro and micro growth factors. Macro factors such as GDP, interest rates, exchange rates, inflation, disposable income'
    },
    {
      id: 'global',
      title: 'Global trends',
      description: 'production, sales, offtake, installed capacity, expansion plans, inventory in trade'
    },
    {
      id: 'sales',
      title: 'Sales',
      description: "value/volume share, Market Estimates/Share Projections, 'product mix' evolution"
    },
    {
      id: 'socio-cultural',
      title: 'Socio cultural',
      description: 'Habits, Beliefs and Attitudes (HABA), population growth, age distribution, health consciousness, spending attitude, consumer clusters'
    },
    {
      id: 'technological',
      title: 'Technological',
      description: 'new ways of producing and distributing goods and services, communicating with TA'
    },
    {
      id: 'environmental',
      title: 'Environmental',
      description: 'scarcity in Raw material, pollution targets, ethical business, carbon footprint'
    },
    {
      id: 'legal',
      title: 'Legal',
      description: 'Health and safety, equal opportunity, consumer rights, CSR'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border-2 border-blue-500">
      {/* Header - Matching AdminLTE box-header style */}
      <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex items-center justify-between border-b-2 border-blue-700">
        <h3 className="text-xl font-bold">Environment</h3>
        <button 
          className="text-white hover:text-gray-200 focus:outline-none"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body - Matching AdminLTE box-body style */}
      <div className="p-6 bg-gray-50">
        <div className="space-y-3">
          {pestelCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white border-l-4 border-blue-500 pl-4 py-3 pr-4 rounded-r shadow-sm hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold text-gray-900 mb-1 text-base">{category.title}</h4>
              <p className="text-gray-700 text-sm leading-relaxed">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PestelOverview;

