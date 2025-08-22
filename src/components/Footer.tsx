import React from 'react';
import { Github, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 px-4 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} ResumeATS - Optimize your resume for ATS
        </p>
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            Built with <Heart className="w-4 h-4 mx-1 text-red-500" /> and Gemini AI
          </span>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;