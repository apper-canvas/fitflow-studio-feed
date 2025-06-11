import React from 'react';

const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  options = [], // For select type
  ...props
}) => {
  if (type === 'select') {
    return (
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className={option.className}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${className}`}
      {...props}
    />
  );
};

export default Input;