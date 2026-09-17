import React from 'react';

interface PageBackgroundProps {
  children?: React.ReactNode;
}

export const PageBackground: React.FC<PageBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-full">
      <div className="relative z-10">{children}</div>
    </div>
  );
};


