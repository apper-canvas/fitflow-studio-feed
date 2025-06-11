import React from 'react';
import SearchInputField from '@/components/molecules/SearchInputField';
import SelectInputField from '@/components/molecules/SelectInputField';
import Button from '@/components/atoms/Button';

const ClassFilterSection = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedDifficulty,
  onDifficultyChange,
  sortBy,
  onSortByChange,
  classTypes,
  difficulties,
  hasActiveFilters,
  onClearFilters
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <SearchInputField
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search classes or instructors..."
        />

        <SelectInputField
          value={selectedType}
          onChange={onTypeChange}
          options={classTypes.map(type => ({ value: type, label: type, className: 'capitalize' }))}
          defaultLabel="All Types"
        />

        <SelectInputField
          value={selectedDifficulty}
          onChange={onDifficultyChange}
          options={difficulties.map(diff => ({ value: diff, label: diff, className: 'capitalize' }))}
          defaultLabel="All Levels"
        />

        <SelectInputField
          value={sortBy}
          onChange={onSortByChange}
          options={[
            { value: 'name', label: 'Sort by Name' },
            { value: 'duration', label: 'Sort by Duration' },
            { value: 'difficulty', label: 'Sort by Difficulty' }
          ]}
          defaultLabel="Sort By" // This is actually the first option, not a default label placeholder
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

export default ClassFilterSection;