import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { CLASS_TYPE_COLORS } from '@/config/constants';

const ClassTypeFilterButton = ({ type, isActive, onClick }) => {
  return (
    <Button
      onClick={() => onClick(type)}
      className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
        isActive
          ? CLASS_TYPE_COLORS[type]
          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
      }`}
    >
      <span className="capitalize">{type}</span>
      {isActive && (
        <ApperIcon name="X" size={14} className="ml-1 inline" />
      )}
    </Button>
  );
};

export default ClassTypeFilterButton;