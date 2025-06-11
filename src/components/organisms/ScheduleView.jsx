import React from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import PageHeader from '@/components/organisms/PageHeader';
import FilterToggleGroup from '@/components/molecules/FilterToggleGroup';
import WeekNavigation from '@/components/molecules/WeekNavigation';
import ClassTypeFilterButton from '@/components/molecules/ClassTypeFilterButton';
import CalendarGrid from '@/components/organisms/CalendarGrid';
import DaySelector from '@/components/molecules/DaySelector';
import ClassCard from '@/components/molecules/ClassCard'; // For day view
import EmptyState from '@/components/molecules/EmptyState';
import { motion } from 'framer-motion';
import { CLASS_TYPE_COLORS } from '@/config/constants';

const ScheduleView = ({
  classes,
  currentWeek,
  onNavigateWeek,
  viewMode,
  onViewModeChange,
  activeFilters,
  onToggleFilter,
  onClearFilters,
  selectedDay,
  onSelectDay,
  onBookClass
}) => {
  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(startOfWeek(currentWeek), i)
  );

  const allClassTypes = ['yoga', 'pilates', 'hiit', 'spin', 'strength', 'cardio'];

  const filteredClasses = classes.filter(cls => {
    if (activeFilters.length === 0) return true;
    return activeFilters.includes(cls.type);
  });

  const getClassesForDay = (day) => {
    return filteredClasses.filter(cls => 
      isSameDay(parseISO(cls.startTime), day)
    ).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-4 md:p-6 lg:p-8 bg-white border-b border-gray-200">
        <PageHeader
          title="Class Schedule"
          description="Book your perfect workout session"
        >
          {/* View Toggle */}
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <FilterToggleGroup
              tabs={[
                { key: 'week', label: 'Week' },
                { key: 'day', label: 'Day' }
              ]}
              activeKey={viewMode}
              onSelect={onViewModeChange}
              className="max-w-md"
            />
          </div>
        </PageHeader>

        {/* Week Navigation */}
        <WeekNavigation weekDays={weekDays} onNavigate={onNavigateWeek} />

        {/* Class Type Filters */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {allClassTypes.map((type) => (
              <ClassTypeFilterButton
                key={type}
                type={type}
                isActive={activeFilters.includes(type)}
                onClick={onToggleFilter}
              />
            ))}
            {activeFilters.length > 0 && (
              <Button
                onClick={onClearFilters}
                className="px-3 py-1 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 underline bg-transparent hover:bg-transparent"
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 1 }}
              >
                Clear all
              </Button>
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
            onBookClass={onBookClass}
            classTypeColors={CLASS_TYPE_COLORS}
          />
        ) : (
          <div className="p-4 md:p-6 lg:p-8">
            {/* Day Selector */}
            <DaySelector weekDays={weekDays} selectedDay={selectedDay} onSelectDay={onSelectDay} />

            {/* Day Classes */}
            <div className="space-y-4">
              {getClassesForDay(selectedDay).length === 0 ? (
                <EmptyState
                  icon="Calendar"
                  title="No classes scheduled"
                  description={`No classes found for ${format(selectedDay, 'EEEE, MMM d')}`}
                  actionLabel="View Full Week"
                  onAction={() => onViewModeChange('week')}
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
                        onBook={onBookClass}
                        colorClass={CLASS_TYPE_COLORS[classItem.type]}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleView;