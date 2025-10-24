import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-5 ${
        isSuccess ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
      } border-l-4 rounded-lg shadow-lg p-4`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        )}
        <p className={`flex-1 text-sm font-medium ${isSuccess ? 'text-green-900' : 'text-red-900'}`}>
          {message}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="flex-shrink-0 -mt-1 -mr-1"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}