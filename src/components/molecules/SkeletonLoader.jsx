import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 1, className = "h-20" }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg ${className}`}
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s ease-in-out infinite'
          }}
        />
      ))}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </>
  );
};

export default SkeletonLoader;