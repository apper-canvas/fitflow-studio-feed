import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const InstructorCard = ({ instructor, classesCount, onViewClasses, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
    >
      {/* Instructor Photo */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
        {instructor.photo ? (
          <img
            src={instructor.photo}
            alt={instructor.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ApperIcon name="User" size={48} className="text-gray-400" />
          </div>
        )}
        
        {/* Overlay with class count */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="text-xs font-medium text-gray-700">
            {classesCount} classes
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {instructor.name}
        </h3>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1 mb-4">
          {instructor.specialties.map((specialty, idx) => (
            <Badge key={idx} className="bg-primary/10 text-primary">
              {specialty}
            </Badge>
          ))}
        </div>

        {/* Bio */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {instructor.bio}
        </p>

        {/* Classes taught */}
        {classesCount > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Classes:</h4>
            <div className="flex flex-wrap gap-1">
              {[...new Set(instructor.classes.map(cls => cls.type))].map((type, idx) => (
                <Badge key={idx} className="bg-gray-100 text-gray-600">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* View Classes Button */}
        <Button
          onClick={() => onViewClasses(instructor.name)}
          className="w-full gradient-secondary text-white py-2 px-4 rounded-lg font-medium transition-all hover:shadow-lg"
        >
          View Classes
        </Button>
      </div>
    </motion.div>
  );
};

export default InstructorCard;