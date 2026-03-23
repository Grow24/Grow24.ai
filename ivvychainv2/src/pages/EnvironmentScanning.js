import React from 'react';
import VennDiagram from '../components/VennDiagram';
import Checklist from '../components/Checklist';

const EnvironmentScanning = () => {
  return (
    <div className="p-8">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          IVYCHAIN (integrated Business Performance Improvement)
        </h1>
        <h2 className="text-2xl font-bold text-gray-800">
          Environment Scanning
        </h2>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column - Venn Diagram */}
        <div className="flex flex-col items-center">
          <VennDiagram />
        </div>

        {/* Right Column - Checklist */}
        <div className="flex flex-col justify-start pt-8">
          <Checklist />
        </div>
      </div>
    </div>
  );
};

export default EnvironmentScanning;

