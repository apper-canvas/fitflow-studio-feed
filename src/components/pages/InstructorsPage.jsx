import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PageHeader from '@/components/organisms/PageHeader';
import InstructorFilterSection from '@/components/organisms/InstructorFilterSection';
import InstructorGrid from '@/components/organisms/InstructorGrid';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import { instructorService, classService } from '@/services';

const InstructorsPage = () => {
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

  const allSpecialties = instructors.reduce((acc, instructor) => {
    return [...acc, ...instructor.specialties];
  }, []);
  const uniqueSpecialties = [...new Set(allSpecialties)];

  const getInstructorClasses = (instructorName) => {
    return classes.filter(cls => cls.instructor === instructorName);
  };

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

  const handleViewClasses = (instructorName) => {
    const url = new URL('/schedule', window.location.origin);
    url.searchParams.set('instructor', instructorName);
    window.location.href = url.toString();
  };

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
      <PageHeader
        title="Meet Our Instructors"
        description="Expert trainers dedicated to helping you achieve your fitness goals"
      />

      <InstructorFilterSection
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        selectedSpecialty={selectedSpecialty}
        onSpecialtyChange={(e) => setSelectedSpecialty(e.target.value)}
        uniqueSpecialties={uniqueSpecialties}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredInstructors.length} of {instructors.length} instructors
        </p>
      </div>

      <InstructorGrid
        instructors={filteredInstructors}
        getInstructorClasses={getInstructorClasses}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        onViewClasses={handleViewClasses}
      />
    </div>
  );
};

export default InstructorsPage;