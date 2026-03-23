import React from 'react';

const Checklist = () => {
  const items = [
    "Socio-economic data – (Census, 3rd party)",
    "Targeted Surveys",
    "'Hyper local' metrics",
    "Category Sales",
    "Trends – Category, Channel, Customers, Consumer HA&B",
    "Demographic changes",
    '"Extraneous variables" – temperature, rainfall etc.',
    "Commodity prices",
    "Exchange rates etc"
  ];

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <svg
            className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-gray-700">{item}</span>
        </div>
      ))}
    </div>
  );
};

export default Checklist;

