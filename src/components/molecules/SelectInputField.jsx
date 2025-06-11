import React from 'react';
import Input from '@/components/atoms/Input';

const SelectInputField = ({ value, onChange, options, defaultLabel, className = '' }) => {
  const selectOptions = [{ value: '', label: defaultLabel, className: 'capitalize' }, ...options];

  return (
    <Input
      type="select"
      value={value}
      onChange={onChange}
      options={selectOptions}
      className={className}
    />
  );
};

export default SelectInputField;