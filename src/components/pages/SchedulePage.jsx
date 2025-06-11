import React, { useState, useEffect } from 'react';
import { addDays, startOfWeek } from 'date-fns';
import { toast } from 'react-toastify';
import ScheduleView from '@/components/organisms/ScheduleView';
import BookingModal from '@/components/molecules/BookingModal';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import { classService, bookingService } from '@/services';

const SchedulePage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // week or day
  const [activeFilters, setActiveFilters] = useState([]);

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

  const clearFilters = () => {
    setActiveFilters([]);
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
      <ScheduleView
        classes={classes}
        currentWeek={currentWeek}
        onNavigateWeek={navigateWeek}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeFilters={activeFilters}
        onToggleFilter={toggleFilter}
        onClearFilters={clearFilters}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        onBookClass={handleBookClass}
      />

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
    </div>
  );
};

export default SchedulePage;