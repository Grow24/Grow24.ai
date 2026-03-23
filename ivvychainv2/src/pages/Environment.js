import React, { useState } from 'react';
import PestelOverview from '../components/environment/PestelOverview';
import SurveyModule from '../components/environment/SurveyModule';
import OicaModule from '../components/environment/OicaModule';
import CensusModule from '../components/environment/CensusModule';
import GdpModule from '../components/environment/GdpModule';
import ExchangeRateModule from '../components/environment/ExchangeRateModule';
import InflationModule from '../components/environment/InflationModule';
import SiamModule from '../components/environment/SiamModule';
import SecondHandVehiclesModule from '../components/environment/SecondHandVehiclesModule';

const Environment = () => {
  const [activeModule, setActiveModule] = useState('survey');

  const modules = [
    { id: 'overview', label: 'Overview' },
    { id: 'survey', label: 'Survey' },
    { id: 'oica', label: 'OICA' },
    { id: 'census', label: 'Census' },
    { id: 'gdp', label: 'GDP Analysis' },
    { id: 'exchange-rate', label: 'Exchange Rate Analysis' },
    { id: 'inflation', label: 'Inflation Analysis' },
    { id: 'siam', label: 'SIAM Data Analysis' },
    { id: 'second-hand', label: 'Second Hand Vehicles' },
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'overview':
        return <PestelOverview />;
      case 'survey':
        return <SurveyModule />;
      case 'oica':
        return <OicaModule />;
      case 'census':
        return <CensusModule />;
      case 'gdp':
        return <GdpModule />;
      case 'exchange-rate':
        return <ExchangeRateModule />;
      case 'inflation':
        return <InflationModule />;
      case 'siam':
        return <SiamModule />;
      case 'second-hand':
        return <SecondHandVehiclesModule />;
      default:
        return <PestelOverview />;
    }
  };

  return (
    <div className="p-6">
      {/* Performance Improvement Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Performance Improvement</h1>
        
        {/* Module Selection - Radio Buttons matching original design */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4">
            {modules.map((module) => (
              <label
                key={module.id}
                className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 transition-colors ${
                  activeModule === module.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="module-select"
                  checked={activeModule === module.id}
                  onChange={() => setActiveModule(module.id)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm font-medium ${
                  activeModule === module.id ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  {module.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Active Module Content */}
      {renderModule()}
    </div>
  );
};

export default Environment;

