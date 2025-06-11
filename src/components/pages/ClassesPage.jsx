import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PageHeader from '@/components/organisms/PageHeader';
import ClassFilterSection from '@/components/organisms/ClassFilterSection';
import ClassGrid from '@/components/organisms/ClassGrid';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import { classService } from '@/services';

const ClassesPage = () => {
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

  const classTypes = [...new Set(classes.map(c => c.type))];
  const difficulties = [...new Set(classes.map(c => c.difficulty))];

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
      <PageHeader
        title="All Classes"
        description="Discover the perfect workout for your fitness goals"
      />

      <ClassFilterSection
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        selectedType={selectedType}
        onTypeChange={(e) => setSelectedType(e.target.value)}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={(e) => setSelectedDifficulty(e.target.value)}
        sortBy={sortBy}
        onSortByChange={(e) => setSortBy(e.target.value)}
        classTypes={classTypes}
        difficulties={difficulties}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredClasses.length} of {classes.length} classes
        </p>
      </div>

      <ClassGrid
        classes={filteredClasses}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />
    </div>
  );
};

export default ClassesPage;