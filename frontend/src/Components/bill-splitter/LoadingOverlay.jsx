import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {message}
        </h3>
        <p className="text-gray-500">This may take a few moments...</p>
      </div>
    </div>
  );
}