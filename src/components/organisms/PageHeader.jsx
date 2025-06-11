import React from 'react';

const PageHeader = ({ title, description, children }) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
        {title}
      </h1>
      {description && (
        <p className="text-gray-600 mt-1">
          {description}
        </p>
      )}
      {children}
    </div>
  );
};

export default PageHeader;