import React from 'react';
import { FileText, Zap } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-semibold">
              Resume<span className="text-blue-600 dark:text-blue-400">ATS</span>
            </span>
            <div className="ml-2 hidden sm:flex items-center text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
              <Zap className="w-3 h-3 mr-1" />
              <span>Gemini powered</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;