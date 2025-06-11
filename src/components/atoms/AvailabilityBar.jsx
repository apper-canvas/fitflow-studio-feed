import React from 'react';
import { motion } from 'framer-motion';

const AvailabilityBar = ({ value, max, className = '' }) => {
  const fillPercentage = (value / max) * 100;

  const getColorClass = () => {
    if (fillPercentage >= 90) return 'bg-red-500';
    if (fillPercentage >= 70) return 'bg-orange-500';
    if (fillPercentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${fillPercentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`h-2 rounded-full transition-colors ${getColorClass()}`}
      />
    </div>
  );
};

export default AvailabilityBar;