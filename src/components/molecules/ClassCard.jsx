import React from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import AvailabilityBar from '@/components/atoms/AvailabilityBar';
import { CLASS_TYPE_COLORS } from '@/config/constants';

const ClassCard = ({ classItem, onBook, footerComponent, colorClass = CLASS_TYPE_COLORS[classItem.type] }) => {
  const isAvailable = classItem.bookedCount &lt; classItem.capacity;
  const availableSpots = classItem.capacity - classItem.bookedCount;

  const getAvailabilityStatus = () => {
    if (!isAvailable) return { text: 'Full', color: 'text-red-600' };
    if (availableSpots &lt;= 2) return { text: `${availableSpots} spots left`, color: 'text-orange-600' };
    return { text: `${availableSpots} spots available`, color: 'text-green-600' };
  };

  const status = getAvailabilityStatus();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all h-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={colorClass}>
              {classItem.type}
            </Badge>
            <span className={`text-sm font-medium ${status.color}`}>
              {status.text}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
            {classItem.name}
          </h3>
          
          <div className="flex items-center gap-1 text-gray-600">
            <ApperIcon name="User" size={14} />
            <span className="text-sm">{classItem.instructor}</span>
          </div>
        </div>
      </div>

      {/* Class Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Clock" size={14} />
          <span>{format(parseISO(classItem.startTime), 'h:mm a')}</span>
          <span>•</span>
          <span>{classItem.duration} mins</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Activity" size={14} />
          <span className="capitalize">{classItem.difficulty} level</span>
        </div>
      </div>

      {/* Capacity Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Capacity</span>
          <span>{classItem.bookedCount}/{classItem.capacity}</span>
        </div>
        <AvailabilityBar value={classItem.bookedCount} max={classItem.capacity} />
      </div>

      {/* Equipment */}
      {classItem.equipment && classItem.equipment.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-1 mb-2">
            <ApperIcon name="Package" size={14} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-700">Equipment needed:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {classItem.equipment.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {item}
              </span>
            ))}
            {classItem.equipment.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{classItem.equipment.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Button / Custom Footer */}
      {footerComponent ? footerComponent : (
        <Button
          onClick={() => isAvailable && onBook(classItem)}
          disabled={!isAvailable}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            isAvailable
              ? 'gradient-primary text-white hover:shadow-lg'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={{ scale: isAvailable ? 1.02 : 1 }}
          whileTap={{ scale: isAvailable ? 0.98 : 1 }}
        >
          {isAvailable ? 'Book Now' : 'Class Full'}
        </Button>
      )}
    </motion.div>
  );
};

export default ClassCard;