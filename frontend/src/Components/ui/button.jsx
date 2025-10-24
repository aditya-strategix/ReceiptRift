import React from 'react';

export function Button({ children, className = '', variant, size, ...props }) {
  const base = 'inline-flex items-center justify-center rounded-md focus:outline-none';
  const sizeClass = size === 'icon' ? 'p-2' : 'px-4 py-2';
  return (
    <button {...props} className={`${base} ${sizeClass} ${className}`}>
      {children}
    </button>
  );
}