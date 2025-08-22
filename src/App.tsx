import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import ResumeUploader from './components/ResumeUploader';
import JobDescriptionInput from './components/JobDescriptionInput';
import ResultsDisplay from './components/ResultsDisplay';
import { AnalysisResult } from './types';
import AnalysisService from './services/AnalysisService';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText) {
      setError('Please upload a resume first');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    try {
      const analysisResult = await AnalysisService.analyzeResume(resumeText, jobDescription);
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setResumeText(null);
  };

  return (
    <ThemeProvider>
      <Layout>
        {!result ? (
          <div className="w-full max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
            <ResumeUploader 
              onTextExtracted={setResumeText} 
              isAnalyzing={isAnalyzing} 
            />
            <JobDescriptionInput 
              value={jobDescription}
              onChange={setJobDescription}
              onAnalyze={handleAnalyze}
              isDisabled={!resumeText || isAnalyzing}
              isAnalyzing={isAnalyzing}
            />
            {error && (
              <div className="md:col-span-2 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}
          </div>
        ) : (
          <ResultsDisplay 
            result={result} 
            onReset={resetAnalysis} 
            resumeText={resumeText || ''} 
            jobDescription={jobDescription} 
          />
        )}
      </Layout>
    </ThemeProvider>
  );
}

export default App;