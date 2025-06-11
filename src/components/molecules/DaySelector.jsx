import React from 'react';
import { format, isSameDay } from 'date-fns';
import Button from '@/components/atoms/Button';

const DaySelector = ({ weekDays, selectedDay, onSelectDay }) => {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      {weekDays.map((day) => (
        <Button
          key={day.toISOString()}
          onClick={() => onSelectDay(day)}
          className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isSameDay(selectedDay, day)
              ? 'bg-primary text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="text-center">
            <div className="text-xs opacity-75">{format(day, 'EEE')}</div>
            <div>{format(day, 'd')}</div>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default DaySelector;