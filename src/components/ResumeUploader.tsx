import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, FileCheck, File, X, Loader2 } from 'lucide-react';
import { extractTextFromFile } from '../services/FileParserService';

interface ResumeUploaderProps {
  onTextExtracted: (text: string) => void;
  isAnalyzing: boolean;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onTextExtracted, isAnalyzing }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const fileType = file.type;
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];

    if (!validTypes.includes(fileType)) {
      setUploadError('Invalid file type. Please upload a PDF, DOCX, DOC, or TXT file.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      
      const text = await extractTextFromFile(file);
      
      if (!text || text.trim().length < 50) {
        setUploadError('Could not extract sufficient text from the file. Please try a different file.');
        return;
      }
      
      setUploadedFile(file);
      onTextExtracted(text);
    } catch (error) {
      console.error('Error extracting text:', error);
      setUploadError('Error processing file. Please try again with a different file.');
    } finally {
      setIsUploading(false);
    }
  }, [onTextExtracted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt']
    },
    disabled: isUploading || isAnalyzing || !!uploadedFile,
    maxFiles: 1
  });

  const removeFile = () => {
    setUploadedFile(null);
    onTextExtracted('');
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-lg font-semibold">Upload Your Resume</h2>
      
      <div 
        {...getRootProps()} 
        className={`
          border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors duration-200 min-h-[240px]
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'}
          ${uploadedFile ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : ''}
          ${isUploading || isAnalyzing ? 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="flex flex-col items-center text-center space-y-3">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Extracting text from your resume...</p>
          </div>
        ) : uploadedFile ? (
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative">
              <FileCheck className="w-16 h-16 text-green-500" />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="absolute -top-2 -right-2 p-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">{uploadedFile.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-3">
            <FileUp className={`w-16 h-16 ${isDragActive ? 'text-blue-500' : 'text-gray-400 dark:text-gray-600'}`} />
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isDragActive ? '' : 'or click to browse files'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Supports PDF, DOCX, DOC, and TXT
              </p>
            </div>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded-lg flex items-start">
          <X className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
      
      {!uploadError && uploadedFile && (
        <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-lg flex items-start">
          <FileCheck className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
          <span>Resume text successfully extracted! You can now add a job description to analyze your resume.</span>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;