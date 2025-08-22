export interface Keyword {
  name: string;
  importance?: 'high' | 'medium' | 'low';
  variations?: string[];
}

export interface AnalysisResult {
  score: number;
  summary: string;
  matchedKeywords: Keyword[];
  missingKeywords: Keyword[];
  formattingFeedback: string[];
  suggestedImprovements: string[];
}