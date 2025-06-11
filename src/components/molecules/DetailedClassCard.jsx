import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { DIFFICULTY_COLORS, CLASS_TYPE_COLORS } from '@/config/constants';

const DetailedClassCard = ({ classItem }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all h-full"
    >
      {/* Class Type Badge */}
      <div className="flex items-center justify-between mb-4">
        <Badge className={CLASS_TYPE_COLORS[classItem.type] || 'bg-gray-100 text-gray-800 border-gray-200'}>
          {classItem.type}
        </Badge>
        <Badge className={DIFFICULTY_COLORS[classItem.difficulty] || 'bg-gray-100 text-gray-800 border-gray-200'}>
          {classItem.difficulty}
        </Badge>
      </div>

      {/* Class Name */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {classItem.name}
      </h3>

      {/* Instructor */}
      <div className="flex items-center gap-2 mb-4">
        <ApperIcon name="User" size={16} className="text-gray-400" />
        <span className="text-gray-600">{classItem.instructor}</span>
      </div>

      {/* Class Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Clock" size={14} />
          <span>{classItem.duration} minutes</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Users" size={14} />
          <span>{classItem.capacity} max capacity</span>
        </div>
      </div>

      {/* Equipment */}
      {classItem.equipment && classItem.equipment.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name="Package" size={14} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Equipment:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {classItem.equipment.map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {classItem.description || `Experience the perfect ${classItem.type} workout with our expert instructor ${classItem.instructor}. This ${classItem.difficulty} level class is designed to challenge and inspire you.`}
      </p>

      {/* View Schedule Button */}
      <Button
        onClick={() => window.location.href = '/schedule'}
        className="w-full gradient-primary text-white py-2 px-4 rounded-lg font-medium transition-all hover:shadow-lg"
      >
        View Schedule
      </Button>
    </motion.div>
  );
};

export default DetailedClassCard;