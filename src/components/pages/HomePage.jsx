import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-8"
        >
          <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Zap" className="w-10 h-10 text-white" />
          </div>
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
          Welcome to <span className="text-primary">FitFlow Studio</span>
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Your fitness journey starts here. Book classes, track your progress, and achieve your goals with our expert instructors.
        </p>
        
        <Button
          onClick={() => navigate('/schedule')}
          className="gradient-primary text-white py-4 px-8 rounded-lg font-medium text-lg transition-all hover:shadow-lg"
        >
          View Class Schedule
          <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2 inline" />
        </Button>
      </motion.div>
    </div>
  );
};

export default HomePage;