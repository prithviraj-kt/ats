import * as pdfjs from 'pdfjs-dist';
import * as mammoth from 'mammoth';

// Set worker path for PDF.js
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Extract text from various document formats
 */
export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = file.type;
  let text = '';

  try {
    if (fileType === 'application/pdf') {
      text = await extractFromPdf(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/msword'
    ) {
      text = await extractFromWord(file);
    } else if (fileType === 'text/plain') {
      text = await extractFromText(file);
    } else {
      throw new Error('Unsupported file type');
    }

    return text.trim();
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error('Failed to extract text from file');
  }
};

/**
 * Extract text from PDF files using PDF.js
 */
const extractFromPdf = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map(item => 'str' in item ? item.str : '')
      .join(' ');
    text += pageText + '\n';
  }

  return text;
};

/**
 * Extract text from Word documents using mammoth.js
 */
const extractFromWord = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

/**
 * Extract text from plain text files
 */
const extractFromText = async (file: File): Promise<string> => {
  return await file.text();
};