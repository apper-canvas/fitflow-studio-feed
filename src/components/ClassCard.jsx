import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import ApperIcon from './ApperIcon';

const ClassCard = ({ classItem, onBook, colorClass }) => {
  const isAvailable = classItem.bookedCount < classItem.capacity;
  const availableSpots = classItem.capacity - classItem.bookedCount;
  const fillPercentage = (classItem.bookedCount / classItem.capacity) * 100;

  const getAvailabilityStatus = () => {
    if (!isAvailable) return { text: 'Full', color: 'text-red-600' };
    if (availableSpots <= 2) return { text: `${availableSpots} spots left`, color: 'text-orange-600' };
    return { text: `${availableSpots} spots available`, color: 'text-green-600' };
  };

  const status = getAvailabilityStatus();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize border ${colorClass}`}>
              {classItem.type}
            </span>
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
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${fillPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-2 rounded-full transition-colors ${
              fillPercentage >= 90 ? 'bg-red-500' :
              fillPercentage >= 70 ? 'bg-orange-500' :
              fillPercentage >= 50 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
          />
        </div>
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

      {/* Book Button */}
      <motion.button
        whileHover={{ scale: isAvailable ? 1.02 : 1 }}
        whileTap={{ scale: isAvailable ? 0.98 : 1 }}
        onClick={() => isAvailable && onBook(classItem)}
        disabled={!isAvailable}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
          isAvailable
            ? 'gradient-primary text-white hover:shadow-lg'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isAvailable ? 'Book Now' : 'Class Full'}
      </motion.button>
    </motion.div>
  );
};

export default ClassCard;