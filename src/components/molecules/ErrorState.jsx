import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-6"
        >
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto" />
        </motion.div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {onRetry && (
          <Button
            onClick={onRetry}
            className="gradient-primary text-white px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg"
          >
            Try Again
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default ErrorState;