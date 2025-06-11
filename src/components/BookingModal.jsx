import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import ApperIcon from './ApperIcon';

const BookingModal = ({ classItem, onConfirm, onClose }) => {
  if (!classItem) return null;

  const isAvailable = classItem.bookedCount < classItem.capacity;
  const availableSpots = classItem.capacity - classItem.bookedCount;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-bold text-gray-900">
                Book Class
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            {/* Class type badge */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize border ${
                classItem.type === 'yoga' ? 'bg-green-100 text-green-800 border-green-200' :
                classItem.type === 'pilates' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                classItem.type === 'hiit' ? 'bg-red-100 text-red-800 border-red-200' :
                classItem.type === 'spin' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                classItem.type === 'strength' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                'bg-pink-100 text-pink-800 border-pink-200'
              }`}>
                {classItem.type}
              </span>
              <span className={`text-sm font-medium ${
                isAvailable ? 'text-green-600' : 'text-red-600'
              }`}>
                {isAvailable ? `${availableSpots} spots left` : 'Class Full'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Class Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {classItem.name}
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ApperIcon name="User" size={18} className="text-gray-400" />
                  <span className="text-gray-700">{classItem.instructor}</span>
                </div>

                <div className="flex items-center gap-3">
                  <ApperIcon name="Calendar" size={18} className="text-gray-400" />
                  <span className="text-gray-700">
                    {format(parseISO(classItem.startTime), 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <ApperIcon name="Clock" size={18} className="text-gray-400" />
                  <span className="text-gray-700">
                    {format(parseISO(classItem.startTime), 'h:mm a')} ({classItem.duration} minutes)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <ApperIcon name="Activity" size={18} className="text-gray-400" />
                  <span className="text-gray-700 capitalize">
                    {classItem.difficulty} level
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <ApperIcon name="Users" size={18} className="text-gray-400" />
                  <span className="text-gray-700">
                    {classItem.bookedCount}/{classItem.capacity} participants
                  </span>
                </div>
              </div>
            </div>

            {/* Equipment */}
            {classItem.equipment && classItem.equipment.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ApperIcon name="Package" size={16} />
                  Equipment needed:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {classItem.equipment.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Availability Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Class capacity</span>
                <span>{classItem.bookedCount}/{classItem.capacity}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    (classItem.bookedCount / classItem.capacity) * 100 >= 90 ? 'bg-red-500' :
                    (classItem.bookedCount / classItem.capacity) * 100 >= 70 ? 'bg-orange-500' :
                    (classItem.bookedCount / classItem.capacity) * 100 >= 50 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${(classItem.bookedCount / classItem.capacity) * 100}%` }}
                />
              </div>
            </div>

            {/* Booking Terms */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Booking Policy
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• You can cancel up to 2 hours before class starts</li>
                <li>• Late cancellations may result in a charge</li>
                <li>• Please arrive 10 minutes early</li>
                <li>• Bring your own water bottle</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </motion.button>
              
              <motion.button
                whileHover={{ scale: isAvailable ? 1.02 : 1 }}
                whileTap={{ scale: isAvailable ? 0.98 : 1 }}
                onClick={() => isAvailable && onConfirm(classItem)}
                disabled={!isAvailable}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  isAvailable
                    ? 'gradient-primary text-white hover:shadow-lg'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isAvailable ? 'Confirm Booking' : 'Class Full'}
              </motion.button>
            </div>

            {!isAvailable && (
              <p className="text-center text-sm text-gray-500 mt-3">
                This class is currently full. Check back later for cancellations.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;