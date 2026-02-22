/**
 * Textarea Component
 * Reusable form textarea with newspaper styling
 */

import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = React.memo(({
  label,
  error,
  helperText,
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
      <textarea
        className={`w-full px-4 py-2 border-2 border-ink font-body text-base focus:outline-none focus:ring-2 focus:ring-ink/20 resize-vertical min-h-[120px] ${error ? 'border-red-600' : ''
          } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 font-mono">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-ink/60 font-mono">{helperText}</p>
      )}
    </div>
  );
});
