import React from 'react';
import InstructorCard from '@/components/molecules/InstructorCard';
import EmptyState from '@/components/molecules/EmptyState';

const InstructorGrid = ({ instructors, getInstructorClasses, hasActiveFilters, onClearFilters, onViewClasses }) => {
  return (
    &lt;&gt;
      {instructors.length === 0 ? (
        <EmptyState
          icon="Users"
          title="No instructors found"
          description={hasActiveFilters ? "Try adjusting your filters to find more instructors" : "No instructors are available at the moment"}
          actionLabel={hasActiveFilters ? "Clear Filters" : undefined}
          onAction={hasActiveFilters ? onClearFilters : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map((instructor, index) => {
            const instructorClasses = getInstructorClasses(instructor.name);
            return (
              <InstructorCard
                key={instructor.id}
                instructor={{ ...instructor, classes: instructorClasses }} // Pass classes for display
                classesCount={instructorClasses.length}
                onViewClasses={onViewClasses}
                index={index}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default InstructorGrid;