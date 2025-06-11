import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import ClassCard from '../components/ClassCard';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { classService } from '../services';

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  advanced: 'bg-red-100 text-red-800 border-red-200'
};

const classTypeColors = {
  yoga: 'bg-green-100 text-green-800 border-green-200',
  pilates: 'bg-purple-100 text-purple-800 border-purple-200',
  hiit: 'bg-red-100 text-red-800 border-red-200',
  spin: 'bg-blue-100 text-blue-800 border-blue-200',
  strength: 'bg-orange-100 text-orange-800 border-orange-200',
  cardio: 'bg-pink-100 text-pink-800 border-pink-200'
};

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, duration, difficulty

  const loadClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await classService.getAll();
      setClasses(result);
    } catch (err) {
      setError(err.message || 'Failed to load classes');
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  // Get unique class types and difficulties
  const classTypes = [...new Set(classes.map(c => c.type))];
  const difficulties = [...new Set(classes.map(c => c.difficulty))];

  // Filter and sort classes
  const filteredClasses = classes
    .filter(classItem => {
      const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           classItem.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !selectedType || classItem.type === selectedType;
      const matchesDifficulty = !selectedDifficulty || classItem.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesType && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'duration':
          return a.duration - b.duration;
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedDifficulty('');
    setSortBy('name');
  };

  const hasActiveFilters = searchTerm || selectedType || selectedDifficulty || sortBy !== 'name';

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-full overflow-hidden">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader count={6} className="h-64" />
        </div>
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
    <div className="p-4 md:p-6 lg:p-8 max-w-full overflow-hidden">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
          All Classes
        </h1>
        <p className="text-gray-600 mt-1">
          Discover the perfect workout for your fitness goals
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <ApperIcon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search classes or instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Class Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="">All Types</option>
            {classTypes.map(type => (
              <option key={type} value={type} className="capitalize">
                {type}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="">All Levels</option>
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty} className="capitalize">
                {difficulty}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="name">Sort by Name</option>
            <option value="duration">Sort by Duration</option>
            <option value="difficulty">Sort by Difficulty</option>
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
            {selectedType && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm capitalize">
                Type: {selectedType}
              </span>
            )}
            {selectedDifficulty && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm capitalize">
                Level: {selectedDifficulty}
              </span>
            )}
            {sortBy !== 'name' && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                Sorted by {sortBy}
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
          Showing {filteredClasses.length} of {classes.length} classes
        </p>
      </div>

      {/* Classes Grid */}
      {filteredClasses.length === 0 ? (
        <EmptyState
          icon="Activity"
          title="No classes found"
          description={hasActiveFilters ? "Try adjusting your filters to find more classes" : "No classes are available at the moment"}
          actionLabel={hasActiveFilters ? "Clear Filters" : undefined}
          onAction={hasActiveFilters ? clearFilters : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classItem, index) => (
            <motion.div
              key={classItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all h-full">
                {/* Class Type Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize border ${classTypeColors[classItem.type] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                    {classItem.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize border ${difficultyColors[classItem.difficulty] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                    {classItem.difficulty}
                  </span>
                </div>

                {/* Class Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {classItem.name}
                </h3>

                {/* Instructor */}
                <div className="flex items-center gap-2 mb-4">
                  <ApperIcon name="User" size={16} className="text-gray-400" />
                  <span className="text-gray-600">{classItem.instructor}</span>
                </div>

                {/* Class Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="Clock" size={14} />
                    <span>{classItem.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="Users" size={14} />
                    <span>{classItem.capacity} max capacity</span>
                  </div>
                </div>

                {/* Equipment */}
                {classItem.equipment && classItem.equipment.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ApperIcon name="Package" size={14} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Equipment:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {classItem.equipment.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {classItem.description || `Experience the perfect ${classItem.type} workout with our expert instructor ${classItem.instructor}. This ${classItem.difficulty} level class is designed to challenge and inspire you.`}
                </p>

                {/* View Schedule Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = '/schedule'}
                  className="w-full gradient-primary text-white py-2 px-4 rounded-lg font-medium transition-all hover:shadow-lg"
                >
                  View Schedule
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Classes;