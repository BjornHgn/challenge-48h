import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="logo">
      <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Cercle TBM */}
        <circle cx="20" cy="20" r="18" fill="#2C5282" />
        <text x="20" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">TBM</text>
        
        {/* Texte "Transports Bordeaux Métropole" */}
        <text x="45" y="25" fill="#2D3748" fontSize="14" fontWeight="500">
          Transports Bordeaux Métropole
        </text>
      </svg>
    </div>
  );
};

export default Logo; 