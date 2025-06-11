import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { instructorService, classService } from '../services';

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [instructorsResult, classesResult] = await Promise.all([
        instructorService.getAll(),
        classService.getAll()
      ]);
      setInstructors(instructorsResult);
      setClasses(classesResult);
    } catch (err) {
      setError(err.message || 'Failed to load instructors');
      toast.error('Failed to load instructors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Get unique specialties
  const allSpecialties = instructors.reduce((acc, instructor) => {
    return [...acc, ...instructor.specialties];
  }, []);
  const uniqueSpecialties = [...new Set(allSpecialties)];

  // Get instructor's classes
  const getInstructorClasses = (instructorName) => {
    return classes.filter(cls => cls.instructor === instructorName);
  };

  // Filter instructors
  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch = instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || instructor.specialties.includes(selectedSpecialty);
    
    return matchesSearch && matchesSpecialty;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('');
  };

  const hasActiveFilters = searchTerm || selectedSpecialty;

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-full overflow-hidden">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader count={6} className="h-80" />
        </div>
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
          Meet Our Instructors
        </h1>
        <p className="text-gray-600 mt-1">
          Expert trainers dedicated to helping you achieve your fitness goals
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <ApperIcon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Specialty Filter */}
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="">All Specialties</option>
            {uniqueSpecialties.map(specialty => (
              <option key={specialty} value={specialty} className="capitalize">
                {specialty}
              </option>
            ))}
          </select>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                Search: "{searchTerm}"
              </span>
            )}
            {selectedSpecialty && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm capitalize">
                Specialty: {selectedSpecialty}
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredInstructors.length} of {instructors.length} instructors
        </p>
      </div>

      {/* Instructors Grid */}
      {filteredInstructors.length === 0 ? (
        <EmptyState
          icon="Users"
          title="No instructors found"
          description={hasActiveFilters ? "Try adjusting your filters to find more instructors" : "No instructors are available at the moment"}
          actionLabel={hasActiveFilters ? "Clear Filters" : undefined}
          onAction={hasActiveFilters ? clearFilters : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map((instructor, index) => {
            const instructorClasses = getInstructorClasses(instructor.name);
            
            return (
              <motion.div
                key={instructor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
              >
                {/* Instructor Photo */}
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
                  {instructor.photo ? (
                    <img
                      src={instructor.photo}
                      alt={instructor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ApperIcon name="User" size={48} className="text-gray-400" />
                    </div>
                  )}
                  
                  {/* Overlay with class count */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                    <span className="text-xs font-medium text-gray-700">
                      {instructorClasses.length} classes
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Name */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {instructor.name}
                  </h3>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {instructor.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium capitalize"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  {/* Bio */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {instructor.bio}
                  </p>

                  {/* Classes taught */}
                  {instructorClasses.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Classes:</h4>
                      <div className="flex flex-wrap gap-1">
                        {[...new Set(instructorClasses.map(cls => cls.type))].map((type, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs capitalize"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* View Classes Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      // Navigate to schedule filtered by this instructor
                      const url = new URL('/schedule', window.location.origin);
                      url.searchParams.set('instructor', instructor.name);
                      window.location.href = url.toString();
                    }}
                    className="w-full gradient-secondary text-white py-2 px-4 rounded-lg font-medium transition-all hover:shadow-lg"
                  >
                    View Classes
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Instructors;