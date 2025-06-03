import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = '#00b1eb' }) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const borderWidth = size === 'sm' ? 'border-2' : 'border-4';

  return (
    <div 
      className={`${sizeMap[size]} ${borderWidth} border-t-transparent border-solid rounded-full animate-spin`}
      style={{ borderColor: `${color} transparent transparent transparent` }}
      role="status"
      aria-label="loading"
    />
  );
};

export default Spinner;