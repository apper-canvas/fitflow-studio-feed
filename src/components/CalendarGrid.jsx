import { motion } from 'framer-motion';
import { format, parseISO, isSameDay } from 'date-fns';
import ApperIcon from './ApperIcon';

const CalendarGrid = ({ weekDays, classes, onBookClass, classTypeColors }) => {
  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00'
  ];

  const getClassesForDayAndTime = (day, timeSlot) => {
    return classes.filter(cls => {
      const classDate = parseISO(cls.startTime);
      const classTime = format(classDate, 'HH:mm');
      return isSameDay(classDate, day) && classTime === timeSlot;
    });
  };

  const getAvailabilityColor = (bookedCount, capacity) => {
    const percentage = (bookedCount / capacity) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px] p-4 md:p-6 lg:p-8">
        {/* Calendar Grid */}
        <div className="grid grid-cols-8 gap-2">
          {/* Time column header */}
          <div className="font-medium text-gray-700 text-center py-3">
            Time
          </div>
          
          {/* Day headers */}
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="text-center py-3">
              <div className="font-medium text-gray-900">
                {format(day, 'EEE')}
              </div>
              <div className="text-sm text-gray-500">
                {format(day, 'MMM d')}
              </div>
            </div>
          ))}

          {/* Time slots and classes */}
          {timeSlots.map((timeSlot) => (
            <>
              {/* Time label */}
              <div key={`time-${timeSlot}`} className="text-sm text-gray-600 text-center py-4 border-t border-gray-100">
                {format(new Date(`2000-01-01T${timeSlot}`), 'h:mm a')}
              </div>
              
              {/* Day columns */}
              {weekDays.map((day) => {
                const dayClasses = getClassesForDayAndTime(day, timeSlot);
                
                return (
                  <div
                    key={`${day.toISOString()}-${timeSlot}`}
                    className="min-h-[60px] border-t border-gray-100 p-1"
                  >
                    {dayClasses.map((classItem, index) => (
                      <motion.div
                        key={classItem.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className={`relative rounded-lg p-2 mb-1 cursor-pointer border transition-all hover:shadow-md ${
                          classTypeColors[classItem.type] || 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                        onClick={() => onBookClass(classItem)}
                      >
                        {/* Class name */}
                        <div className="font-medium text-xs mb-1 truncate">
                          {classItem.name}
                        </div>
                        
                        {/* Instructor */}
                        <div className="text-xs opacity-75 truncate">
                          {classItem.instructor}
                        </div>
                        
                        {/* Duration and capacity */}
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-75">
                            {classItem.duration}m
                          </span>
                          
                          {/* Availability indicator */}
                          <div className="flex items-center gap-1">
                            <div
                              className={`w-2 h-2 rounded-full ${getAvailabilityColor(classItem.bookedCount, classItem.capacity)}`}
                              title={`${classItem.bookedCount}/${classItem.capacity} booked`}
                            />
                            <span className="text-xs opacity-75">
                              {classItem.capacity - classItem.bookedCount}
                            </span>
                          </div>
                        </div>

                        {/* Full indicator */}
                        {classItem.bookedCount >= classItem.capacity && (
                          <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-medium text-red-700">FULL</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                );
              })}
            </>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Availability Legend</h3>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Available ({"<"}50% full)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">Filling up (50-70% full)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Almost full (70-90% full)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Nearly full ({">"} 90% full)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;