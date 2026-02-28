import React from 'react';

const Spinner = ({ size = 'md', center = false }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  const spinner = (
    <div className={`${sizes[size]} border-4 border-gray-200 border-t-forest-700 rounded-full animate-spin`} />
  );
  if (center) {
    return <div className="flex justify-center items-center py-16">{spinner}</div>;
  }
  return spinner;
};

export default Spinner;
