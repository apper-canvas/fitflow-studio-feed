import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format, parseISO, isFuture, isPast } from 'date-fns';
import PageHeader from '@/components/organisms/PageHeader';
import MyBookingsList from '@/components/organisms/MyBookingsList';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import FilterToggleGroup from '@/components/molecules/FilterToggleGroup';
import { bookingService, classService } from '@/services';

const MyBookingsPage = () => {
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
      <PageHeader
        title="My Bookings"
        description="Manage your upcoming and past class bookings"
      />

      <FilterToggleGroup
        tabs={[
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'past', label: 'Past' },
          { key: 'all', label: 'All' }
        ]}
        activeKey={filter}
        onSelect={setFilter}
        className="mb-6 max-w-md"
      />

      <MyBookingsList
        bookings={filteredBookings}
        filter={filter}
        cancellingId={cancellingId}
        onCancel={handleCancelBooking}
      />
    </div>
  );
};

export default MyBookingsPage;