import React from 'react';

const ButtonGroup = ({ options, selected, onSelect, className = '' }) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      {options.map((option) => {
        const value = typeof option === 'string' ? option : option.value;
        const label = typeof option === 'string' ? option : option.label;
        const isSelected = selected === value;
        
        return (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              isSelected
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default ButtonGroup;

