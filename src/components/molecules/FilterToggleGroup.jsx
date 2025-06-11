import React from 'react';
import Button from '@/components/atoms/Button';

const FilterToggleGroup = ({ tabs, activeKey, onSelect, className = '' }) => {
  return (
    <div className={`flex bg-gray-100 rounded-lg p-1 ${className}`}>
      {tabs.map((tab) => (
        <Button
          key={tab.key}
          onClick={() => onSelect(tab.key)}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeKey === tab.key
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default FilterToggleGroup;