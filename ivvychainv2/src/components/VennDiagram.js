import React from 'react';

const VennDiagram = () => {
  return (
    <div className="flex justify-center items-center my-8">
      <svg width="550" height="400" viewBox="0 0 550 400" className="max-w-full h-auto">
        {/* Who Circle - Orange (Top) */}
        <circle
          cx="275"
          cy="120"
          r="100"
          fill="#FF8C42"
          fillOpacity="0.4"
          stroke="#FF8C42"
          strokeWidth="2"
        />
        <text x="275" y="95" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#333">
          Who
        </text>
        <text x="275" y="115" textAnchor="middle" fontSize="11" fill="#333">
          Channel Partners, Consumers,
        </text>
        <text x="275" y="130" textAnchor="middle" fontSize="11" fill="#333">
          Suppliers, Leads, Accounts, Segments
        </text>

        {/* How Circle - Green (Bottom Left) */}
        <circle
          cx="180"
          cy="280"
          r="100"
          fill="#90EE90"
          fillOpacity="0.4"
          stroke="#90EE90"
          strokeWidth="2"
        />
        <text x="180" y="255" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#333">
          How
        </text>
        <text x="180" y="275" textAnchor="middle" fontSize="11" fill="#333">
          Channels, Campaigns,
        </text>
        <text x="180" y="290" textAnchor="middle" fontSize="11" fill="#333">
          Schemes, Internal Resources
        </text>
        <text x="180" y="305" textAnchor="middle" fontSize="11" fill="#333">
          (Sales reps), Visits
        </text>

        {/* What Circle - Light Blue (Bottom Right) */}
        <circle
          cx="370"
          cy="280"
          r="100"
          fill="#87CEEB"
          fillOpacity="0.4"
          stroke="#87CEEB"
          strokeWidth="2"
        />
        <text x="370" y="255" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#333">
          What
        </text>
        <text x="370" y="275" textAnchor="middle" fontSize="11" fill="#333">
          Products/Product
        </text>
        <text x="370" y="290" textAnchor="middle" fontSize="11" fill="#333">
          Groups, Territories,
        </text>
        <text x="370" y="305" textAnchor="middle" fontSize="11" fill="#333">
          Industry Groups
        </text>
      </svg>
    </div>
  );
};

export default VennDiagram;

