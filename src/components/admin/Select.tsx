/**
 * Select Component
 * Reusable form select dropdown with newspaper styling
 */

import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  placeholder?: string;
  children?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = React.memo(({
  label,
  error,
  helperText,
  options,
  placeholder,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block font-mono text-sm font-bold uppercase tracking-wide mb-2">
          {label}
          {props.required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <select
        className={`w-full px-4 py-2 border-2 border-ink font-body text-base focus:outline-none focus:ring-2 focus:ring-ink/20 bg-newsprint ${error ? 'border-red-600' : ''
          } ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options ? options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        )) : children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 font-mono">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-ink/60 font-mono">{helperText}</p>
      )}
    </div>
  );
});
