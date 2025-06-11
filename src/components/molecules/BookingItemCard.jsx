import React from 'react';
import { motion } from 'framer-motion';
import { format, parseISO, isFuture, isPast } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { CLASS_TYPE_COLORS } from '@/config/constants';

const BookingItemCard = ({ booking, cancellingId, onCancel, index }) => {
  const getStatusColor = (bookingItem) => {
    const classTime = new Date(bookingItem.classDetails.startTime);
    if (isPast(classTime)) return 'text-gray-500';
    if (bookingItem.status === 'confirmed') return 'text-success';
    return 'text-warning';
  };

  const getStatusText = (bookingItem) => {
    const classTime = new Date(bookingItem.classDetails.startTime);
    if (isPast(classTime)) return 'Completed';
    return bookingItem.status === 'confirmed' ? 'Confirmed' : 'Pending';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <Badge className={CLASS_TYPE_COLORS[booking.classDetails.type] || 'bg-pink-100 text-pink-800 border-pink-200'}>
              {booking.classDetails.type}
            </Badge>
            <span className={`text-sm font-medium ${getStatusColor(booking)}`}>
              {getStatusText(booking)}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {booking.classDetails.name}
          </h3>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <ApperIcon name="Calendar" size={14} />
              <span>{format(parseISO(booking.classDetails.startTime), 'EEEE, MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Clock" size={14} />
              <span>{format(parseISO(booking.classDetails.startTime), 'h:mm a')}</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="User" size={14} />
              <span>{booking.classDetails.instructor}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <ApperIcon name="Clock" size={14} />
              <span>{booking.classDetails.duration} mins</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <ApperIcon name="Users" size={14} />
              <span>{booking.classDetails.bookedCount}/{booking.classDetails.capacity}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <ApperIcon name="Activity" size={14} />
              <span className="capitalize">{booking.classDetails.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isFuture(new Date(booking.classDetails.startTime)) && (
            <Button
              onClick={() => onCancel(booking.id, booking.classDetails)}
              disabled={cancellingId === booking.id}
              className="px-4 py-2 text-error border border-error/20 rounded-lg hover:bg-error/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {cancellingId === booking.id ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-error/20 border-t-error rounded-full animate-spin"></div>
                  <span>Cancelling...</span>
                </div>
              ) : (
                'Cancel'
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Booking Details */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-500">
          <span>Booking ID: {booking.id}</span>
          <span>Booked on {format(parseISO(booking.bookedAt), 'MMM d, yyyy')}</span>
          {booking.position && (
            <span>Position #{booking.position}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookingItemCard;