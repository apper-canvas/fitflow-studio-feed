import React from 'react';
import DetailedClassCard from '@/components/molecules/DetailedClassCard';
import EmptyState from '@/components/molecules/EmptyState';

const ClassGrid = ({ classes, hasActiveFilters, onClearFilters }) => {
  return (
    &lt;&gt;
      {classes.length === 0 ? (
        <EmptyState
          icon="Activity"
          title="No classes found"
          description={hasActiveFilters ? "Try adjusting your filters to find more classes" : "No classes are available at the moment"}
          actionLabel={hasActiveFilters ? "Clear Filters" : undefined}
          onAction={hasActiveFilters ? onClearFilters : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <DetailedClassCard key={classItem.id} classItem={classItem} />
          ))}
        </div>
      )}
    </>
  );
};

export default ClassGrid;