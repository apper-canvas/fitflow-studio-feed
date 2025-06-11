import React from 'react';
import { AnimatePresence } from 'framer-motion';
import BookingItemCard from '@/components/molecules/BookingItemCard';
import EmptyState from '@/components/molecules/EmptyState';

const MyBookingsList = ({ bookings, filter, cancellingId, onCancel }) => {
  return (
    &lt;&gt;
      {bookings.length === 0 ? (
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
            {bookings.map((booking, index) => (
              <BookingItemCard
                key={booking.id}
                booking={booking}
                cancellingId={cancellingId}
                onCancel={onCancel}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default MyBookingsList;