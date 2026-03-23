import React from 'react';

const Card = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {title && <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;

