import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, isFuture, isPast } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { bookingService, classService } from '../services';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('upcoming'); // upcoming, past, all
  const [cancellingId, setCancellingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [bookingsResult, classesResult] = await Promise.all([
        bookingService.getAll(),
        classService.getAll()
      ]);
      setBookings(bookingsResult);
      setClasses(classesResult);
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
      toast.error('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getClassDetails = (classId) => {
    return classes.find(c => c.id === classId);
  };

  const getBookingsWithDetails = () => {
    return bookings
      .map(booking => ({
        ...booking,
        classDetails: getClassDetails(booking.classId)
      }))
      .filter(booking => booking.classDetails) // Only show bookings with valid class details
      .sort((a, b) => new Date(a.classDetails.startTime) - new Date(b.classDetails.startTime));
  };

  const filteredBookings = getBookingsWithDetails().filter(booking => {
    const classTime = new Date(booking.classDetails.startTime);
    switch (filter) {
      case 'upcoming':
        return isFuture(classTime);
      case 'past':
        return isPast(classTime);
      default:
        return true;
    }
  });

  const handleCancelBooking = async (bookingId, classDetails) => {
    setCancellingId(bookingId);
    try {
      await bookingService.delete(bookingId);
      
      // Update class booked count
      const updatedClasses = classes.map(c => 
        c.id === classDetails.id 
          ? { ...c, bookedCount: Math.max(0, c.bookedCount - 1) }
          : c
      );
      setClasses(updatedClasses);
      
      // Remove booking from list
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      
      toast.success(`Cancelled ${classDetails.name} booking`);
    } catch (err) {
      toast.error('Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (booking) => {
    const classTime = new Date(booking.classDetails.startTime);
    if (isPast(classTime)) return 'text-gray-500';
    if (booking.status === 'confirmed') return 'text-success';
    return 'text-warning';
  };

  const getStatusText = (booking) => {
    const classTime = new Date(booking.classDetails.startTime);
    if (isPast(classTime)) return 'Completed';
    return booking.status === 'confirmed' ? 'Confirmed' : 'Pending';
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-full overflow-hidden">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
        <SkeletonLoader count={5} className="h-32 mb-4" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-full overflow-hidden">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
          My Bookings
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your upcoming and past class bookings
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6 max-w-md">
        {[
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'past', label: 'Past' },
          { key: 'all', label: 'All' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filter === tab.key
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          icon="BookOpen"
          title={filter === 'upcoming' ? 'No upcoming bookings' : filter === 'past' ? 'No past bookings' : 'No bookings found'}
          description={filter === 'upcoming' ? 'Book your first class to get started with your fitness journey!' : 'Your completed classes will appear here.'}
          actionLabel={filter === 'upcoming' ? 'Browse Classes' : undefined}
          onAction={filter === 'upcoming' ? () => window.location.href = '/classes' : undefined}
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium capitalize border ${
                        booking.classDetails.type === 'yoga' ? 'bg-green-100 text-green-800 border-green-200' :
                        booking.classDetails.type === 'pilates' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        booking.classDetails.type === 'hiit' ? 'bg-red-100 text-red-800 border-red-200' :
                        booking.classDetails.type === 'spin' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        booking.classDetails.type === 'strength' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                        'bg-pink-100 text-pink-800 border-pink-200'
                      }`}>
                        {booking.classDetails.type}
                      </div>
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
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCancelBooking(booking.id, booking.classDetails)}
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
                      </motion.button>
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
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MyBookings;