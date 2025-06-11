import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import CalendarGrid from '../components/CalendarGrid';
import BookingModal from '../components/BookingModal';
import ClassCard from '../components/ClassCard';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { classService, bookingService } from '../services';

const classTypeColors = {
  yoga: 'bg-green-100 text-green-800 border-green-200',
  pilates: 'bg-purple-100 text-purple-800 border-purple-200',
  hiit: 'bg-red-100 text-red-800 border-red-200',
  spin: 'bg-blue-100 text-blue-800 border-blue-200',
  strength: 'bg-orange-100 text-orange-800 border-orange-200',
  cardio: 'bg-pink-100 text-pink-800 border-pink-200'
};

const Schedule = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // week or day
  const [activeFilters, setActiveFilters] = useState([]);

  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(startOfWeek(currentWeek), i)
  );

  const classTypes = ['yoga', 'pilates', 'hiit', 'spin', 'strength', 'cardio'];

  const loadClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await classService.getAll();
      setClasses(result);
    } catch (err) {
      setError(err.message || 'Failed to load classes');
      toast.error('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const filteredClasses = classes.filter(cls => {
    if (activeFilters.length === 0) return true;
    return activeFilters.includes(cls.type);
  });

  const getClassesForDay = (day) => {
    return filteredClasses.filter(cls => 
      isSameDay(parseISO(cls.startTime), day)
    ).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  };

  const handleBookClass = (classItem) => {
    setSelectedClass(classItem);
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = async (classItem) => {
    try {
      const booking = {
        classId: classItem.id,
        userId: 'user123', // In real app, get from auth
        status: 'confirmed',
        bookedAt: new Date().toISOString(),
        position: classItem.bookedCount + 1
      };
      
      await bookingService.create(booking);
      
      // Update class booked count
      const updatedClass = { ...classItem, bookedCount: classItem.bookedCount + 1 };
      setClasses(prev => prev.map(c => c.id === classItem.id ? updatedClass : c));
      
      toast.success(`Successfully booked ${classItem.name}!`);
      setBookingModalOpen(false);
      setSelectedClass(null);
    } catch (err) {
      toast.error('Failed to book class. Please try again.');
    }
  };

  const toggleFilter = (type) => {
    setActiveFilters(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const navigateWeek = (direction) => {
    setCurrentWeek(prev => addDays(prev, direction * 7));
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-full overflow-hidden">
        <SkeletonLoader count={8} className="h-24 mb-4" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={loadClasses}
      />
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 md:p-6 lg:p-8 bg-white border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
              Class Schedule
            </h1>
            <p className="text-gray-600 mt-1">
              Book your perfect workout session
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'week' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'day' 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Day
              </button>
            </div>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-50 transition-all"
          >
            <ApperIcon name="ChevronLeft" size={20} />
          </button>
          
          <h2 className="text-lg font-semibold text-gray-900">
            {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
          </h2>
          
          <button
            onClick={() => navigateWeek(1)}
            className="p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-50 transition-all"
          >
            <ApperIcon name="ChevronRight" size={20} />
          </button>
        </div>

        {/* Class Type Filters */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {classTypes.map((type) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleFilter(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                  activeFilters.includes(type)
                    ? classTypeColors[type]
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="capitalize">{type}</span>
                {activeFilters.includes(type) && (
                  <ApperIcon name="X" size={14} className="ml-1 inline" />
                )}
              </motion.button>
            ))}
            {activeFilters.length > 0 && (
              <button
                onClick={() => setActiveFilters([])}
                className="px-3 py-1 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === 'week' ? (
          <CalendarGrid
            weekDays={weekDays}
            classes={filteredClasses}
            onBookClass={handleBookClass}
            classTypeColors={classTypeColors}
          />
        ) : (
          <div className="p-4 md:p-6 lg:p-8">
            {/* Day Selector */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {weekDays.map((day) => (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isSameDay(selectedDay, day)
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xs opacity-75">{format(day, 'EEE')}</div>
                    <div>{format(day, 'd')}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Day Classes */}
            <div className="space-y-4">
              {getClassesForDay(selectedDay).length === 0 ? (
                <EmptyState
                  icon="Calendar"
                  title="No classes scheduled"
                  description={`No classes found for ${format(selectedDay, 'EEEE, MMM d')}`}
                  actionLabel="View Full Week"
                  onAction={() => setViewMode('week')}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid gap-4"
                >
                  {getClassesForDay(selectedDay).map((classItem, index) => (
                    <motion.div
                      key={classItem.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ClassCard
                        classItem={classItem}
                        onBook={handleBookClass}
                        colorClass={classTypeColors[classItem.type]}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingModalOpen && selectedClass && (
          <BookingModal
            classItem={selectedClass}
            onConfirm={handleConfirmBooking}
            onClose={() => {
              setBookingModalOpen(false);
              setSelectedClass(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Schedule;