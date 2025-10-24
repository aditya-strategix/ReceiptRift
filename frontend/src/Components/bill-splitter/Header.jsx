import React from 'react';
import { Receipt, RotateCcw } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function Header({ onReset }) {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Party Bill Splitter</h1>
              <p className="text-xs md:text-sm text-blue-100">Split bills fairly and easily</p>
            </div>
          </div>
          <Button
            onClick={onReset}
            variant="ghost"
            className="text-white hover:bg-white/20 gap-2"
            aria-label="Reset application"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </div>
    </header>
  );
}