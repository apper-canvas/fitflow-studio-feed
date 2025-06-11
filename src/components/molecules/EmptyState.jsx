import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ 
  icon = "Package", 
  title = "No items found", 
  description = "There are no items to display at the moment.", 
  actionLabel,
  onAction 
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-6"
        >
          <ApperIcon name={icon} size={48} className="text-gray-300 mx-auto" />
        </motion.div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            className="gradient-primary text-white px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg"
          >
            {actionLabel}
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default EmptyState;