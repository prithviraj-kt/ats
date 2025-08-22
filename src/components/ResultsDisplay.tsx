import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Percent, 
  Tag, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Download
} from 'lucide-react';
import { AnalysisResult, Keyword } from '../types';

interface ResultsDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
  resumeText: string;
  jobDescription: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  result, 
  onReset,
  resumeText,
  jobDescription
}) => {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    keywords: true,
    formatting: true,
    improvements: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'text-green-500 dark:text-green-400';
    if (score >= 60) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };

  const getScoreBackgroundClass = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  const downloadReport = () => {
    const reportContent = `

    
# ATS Resume Analysis Report

## ATS Score: ${result.score}/100

## Keyword Analysis
${result.matchedKeywords.map(k => `✅ ${k.name}`).join('\n')}

## Missing Keywords
${result.missingKeywords.map(k => `❌ ${k.name}${k.importance === 'high' ? ' (High Importance)' : ''}`).join('\n')}

## Formatting Analysis
${result.formattingFeedback.map(f => `- ${f}`).join('\n')}

## Suggested Improvements
${result.suggestedImprovements.map(i => `- ${i}`).join('\n')}

## Resume Text
${resumeText}

## Job Description
${jobDescription}
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ats-resume-analysis.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <button 
          onClick={onReset} 
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Back to Upload</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-bold">ATS Resume Analysis</h1>
            <button 
              onClick={downloadReport}
              className="flex items-center space-x-2 py-2 px-4 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </button>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-6 items-center">
          <div className={`flex-shrink-0 w-32 h-32 rounded-full flex items-center justify-center ${getScoreBackgroundClass(result.score)}`}>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColorClass(result.score)}`}>
                {result.score}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">ATS Score</div>
            </div>
          </div>
          
          <div className="flex-grow">
            <h2 className="text-xl font-semibold mb-2">Summary</h2>
            <p className="text-gray-700 dark:text-gray-300">{result.summary}</p>
          </div>
        </div>

        {/* Keywords Section */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <button 
            className="w-full p-6 flex justify-between items-center text-left"
            onClick={() => toggleSection('keywords')}
          >
            <div className="flex items-center">
              <Tag className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400" />
              <h2 className="text-xl font-semibold">Keyword Analysis</h2>
            </div>
            {expandedSections.keywords ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {expandedSections.keywords && (
            <div className="px-6 pb-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 dark:text-green-400" />
                  Matched Keywords ({result.matchedKeywords.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.matchedKeywords.map((keyword, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
                    >
                      {keyword.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <XCircle className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
                  Missing Keywords ({result.missingKeywords.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((keyword, index) => (
                    <span 
                      key={index} 
                      className={`
                        px-3 py-1 rounded-full text-sm
                        ${keyword.importance === 'high' 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'}
                      `}
                    >
                      {keyword.name}
                      {keyword.importance === 'high' && (
                        <span className="ml-1 text-xs">*</span>
                      )}
                    </span>
                  ))}
                </div>
                
                {result.missingKeywords.some(k => k.importance === 'high') && (
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">* High importance keywords</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Formatting Section */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <button 
            className="w-full p-6 flex justify-between items-center text-left"
            onClick={() => toggleSection('formatting')}
          >
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-3 text-purple-500 dark:text-purple-400" />
              <h2 className="text-xl font-semibold">Formatting Analysis</h2>
            </div>
            {expandedSections.formatting ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {expandedSections.formatting && (
            <div className="px-6 pb-6">
              <ul className="space-y-2">
                {result.formattingFeedback.map((feedback, index) => (
                  <li key={index} className="flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{feedback}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Improvements Section */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <button 
            className="w-full p-6 flex justify-between items-center text-left"
            onClick={() => toggleSection('improvements')}
          >
            <div className="flex items-center">
              <Percent className="w-5 h-5 mr-3 text-indigo-500 dark:text-indigo-400" />
              <h2 className="text-xl font-semibold">Suggested Improvements</h2>
            </div>
            {expandedSections.improvements ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {expandedSections.improvements && (
            <div className="px-6 pb-6">
              <ul className="space-y-2">
                {result.suggestedImprovements.map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-700 dark:text-gray-300">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;