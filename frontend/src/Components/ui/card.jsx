import React from 'react';

export const Card = React.forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={`rounded-xl bg-white ${className}`}>
      {children}
    </div>
  );
});
Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={`px-4 py-3 border-b ${className}`}>
      {children}
    </div>
  );
});
CardHeader.displayName = 'CardHeader';

export const CardContent = React.forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={`p-4 ${className}`}>
      {children}
    </div>
  );
});
CardContent.displayName = 'CardContent';

export const CardTitle = React.forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <h3 ref={ref} {...props} className={`text-lg font-semibold ${className}`}>
      {children}
    </h3>
  );
});
CardTitle.displayName = 'CardTitle';