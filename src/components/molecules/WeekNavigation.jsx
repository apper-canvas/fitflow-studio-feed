import React from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const WeekNavigation = ({ weekDays, onNavigate }) => {
  return (
    <div className="flex items-center justify-between mt-6">
      <Button
        onClick={() => onNavigate(-1)}
        className="p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-50 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <ApperIcon name="ChevronLeft" size={20} />
      </Button>
      
      <h2 className="text-lg font-semibold text-gray-900">
        {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
      </h2>
      
      <Button
        onClick={() => onNavigate(1)}
        className="p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-50 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <ApperIcon name="ChevronRight" size={20} />
      </Button>
    </div>
  );
};

export default WeekNavigation;