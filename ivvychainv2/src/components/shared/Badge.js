import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-200 text-gray-800',
    inquiry: 'bg-orange-500 text-white',
    account: 'bg-orange-500 text-white',
    primary: 'bg-blue-500 text-white',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;

