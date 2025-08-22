import React from 'react';
import { Briefcase, Search, Loader2 } from 'lucide-react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isDisabled: boolean;
  isAnalyzing: boolean;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  value,
  onChange,
  onAnalyze,
  isDisabled,
  isAnalyzing,
}) => {
  const placeholder = `Paste the job description here. For example:

Job Title: Frontend Developer

Requirements:
- 3+ years of experience with React.js
- Strong knowledge of JavaScript, HTML, and CSS
- Experience with state management libraries (Redux, MobX)
- Familiarity with RESTful APIs and GraphQL
- Bachelor's degree in Computer Science or related field

Responsibilities:
- Develop and maintain user interface components
- Collaborate with UX designers and backend developers
- Optimize application for maximum performance`;

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-lg font-semibold">Job Description</h2>
      
      <div className="relative flex-grow">
        <div className="absolute top-3 left-3 text-gray-400 dark:text-gray-600">
          <Briefcase className="w-5 h-5" />
        </div>
        
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[240px] p-3 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500
                    transition-colors duration-200 resize-none"
          disabled={isAnalyzing}
        />
      </div>
      
      <button
        onClick={onAnalyze}
        disabled={isDisabled}
        className={`
          flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-all duration-200
          ${isDisabled
            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow'}
        `}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            <span>Analyze Resume</span>
          </>
        )}
      </button>
    </div>
  );
};

export default JobDescriptionInput;