import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const base = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium';
  const variantClass = variant === 'secondary' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800';
  return <span className={`${base} ${variantClass} ${className}`}>{children}</span>;
}