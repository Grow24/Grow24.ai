import React from 'react';

const PillButtons = ({ options = [], selected, onSelect, className = '' }) => {
  return (
    <div className={`flex gap-2 flex-wrap ${className}`}>
      {options.map((option) => {
        const value = typeof option === 'string' ? option : option.value;
        const label = typeof option === 'string' ? option : option.label;
        const isSelected = selected === value;

        return (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isSelected
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default PillButtons;

