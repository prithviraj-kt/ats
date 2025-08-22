import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { AnalysisResult } from '../types';

// Initialize the Google Generative AI SDK with the API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file.');
}
const genAI = new GoogleGenerativeAI(apiKey);

class AnalysisService {
  /**
   * Analyze resume against job description using Gemini API
   */
  async analyzeResume(resumeText: string, jobDescription: string): Promise<AnalysisResult> {
    try {
      // Configure the model
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-pro',
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });

      // Create the prompt for resume analysis
      const prompt = this.createAnalysisPrompt(resumeText, jobDescription);

      // Generate the response
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Parse the response to get structured data
      return this.parseAnalysisResponse(text);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      throw new Error('Failed to analyze resume. Please try again.');
    }
  }

  /**
   * Create the analysis prompt for Gemini API
   */
  private createAnalysisPrompt(resumeText: string, jobDescription: string): string {
    return `
      I need you to analyze a resume against a job description to determine how well it matches 
      for an Applicant Tracking System (ATS). Format your response as JSON without any additional text or explanation.
      
      Here's the resume:
      ${resumeText}
      
      Here's the job description:
      ${jobDescription}
      
      Perform the following analysis:
      
      1. Extract important keywords/skills from the job description
      2. Check which keywords are present in the resume (accounting for variations like "React.js", "ReactJS", "React" being the same)
      3. Calculate an ATS score (0-100) based on keyword matches, formatting, and overall resume quality
      4. Provide formatting feedback regarding ATS compatibility
      5. Suggest specific improvements
      
      Return the results in the following JSON format:
      {
        "score": 85,
        "summary": "Your resume matches many key requirements but is missing some important keywords...",
        "matchedKeywords": [
          { "name": "React", "variations": ["React.js", "ReactJS"] }
        ],
        "missingKeywords": [
          { "name": "Docker", "importance": "medium" }
        ],
        "formattingFeedback": [
          "Your resume appears to use a single-column layout, which is good for ATS systems."
        ],
        "suggestedImprovements": [
          "Add the missing 'Docker' keyword by highlighting relevant experience."
        ]
      }
      
      For the score, consider:
      - Keyword match percentage (60% of score)
      - Resume formatting for ATS (20% of score)
      - Overall quality and relevance (20% of score)
      
      For formatting, evaluate:
      - One column vs two columns (prefer one column)
      - Use of standard section headings
      - Appropriate use of bullet points
      - Lack of graphics, charts, and images
      - Simple, ATS-friendly formatting
      
      Set the "importance" of missing keywords to "high" for critical requirements and "medium" for preferred skills.
    `;
  }

  /**
   * Parse the textual response from Gemini into a structured AnalysisResult
   */
  private parseAnalysisResponse(responseText: string): AnalysisResult {
    try {
      // Find JSON in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;
      
      // Parse the JSON response
      const parsedResponse = JSON.parse(jsonString);
      
      // Convert to our expected format
      const result: AnalysisResult = {
        score: parsedResponse.score || 0,
        summary: parsedResponse.summary || 'Analysis completed',
        matchedKeywords: parsedResponse.matchedKeywords || [],
        missingKeywords: parsedResponse.missingKeywords || [],
        formattingFeedback: parsedResponse.formattingFeedback || [],
        suggestedImprovements: parsedResponse.suggestedImprovements || []
      };
      
      return result;
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      
      // Return a fallback result
      return {
        score: 0,
        summary: 'Failed to parse analysis results. Please try again.',
        matchedKeywords: [],
        missingKeywords: [],
        formattingFeedback: [],
        suggestedImprovements: ['Try analyzing again with more detailed resume content.']
      };
    }
  }
}

export default new AnalysisService();