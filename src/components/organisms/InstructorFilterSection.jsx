import React from 'react';
import SearchInputField from '@/components/molecules/SearchInputField';
import SelectInputField from '@/components/molecules/SelectInputField';
import Button from '@/components/atoms/Button';

const InstructorFilterSection = ({
  searchTerm,
  onSearchChange,
  selectedSpecialty,
  onSpecialtyChange,
  uniqueSpecialties,
  hasActiveFilters,
  onClearFilters
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <SearchInputField
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search instructors..."
        />

        <SelectInputField
          value={selectedSpecialty}
          onChange={onSpecialtyChange}
          options={uniqueSpecialties.map(specialty => ({ value: specialty, label: specialty, className: 'capitalize' }))}
          defaultLabel="All Specialties"
        />
      </div>

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
          <Button
            onClick={onClearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 underline ml-2 bg-transparent hover:bg-transparent"
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 1 }}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default InstructorFilterSection;