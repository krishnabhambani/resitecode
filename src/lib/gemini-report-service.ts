
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ReportFormData, GeneratedReport } from './report-types';

const API_KEY = import.meta.env.VITE_GEMINI_REPORT_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export class ReportGeneratorService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  async generateReport(formData: ReportFormData): Promise<GeneratedReport> {
    const prompt = this.buildPrompt(formData);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseReportSections(text);
    } catch (error) {
      console.error('Error generating report:', error);
      throw new Error('Failed to generate report. Please try again.');
    }
  }

  async regenerateSection(
    sectionName: string, 
    formData: ReportFormData, 
    currentContent: string
  ): Promise<string> {
    const prompt = `
      Regenerate the ${sectionName} section for an academic report with the following details:
      
      Title: ${formData.title}
      Subject: ${formData.subject}
      Academic Level: ${formData.academicLevel}
      Report Type: ${formData.reportType}
      Word Count Target: ${formData.wordCount}
      
      Current ${sectionName}:
      ${currentContent}
      
      Additional Instructions: ${formData.customInstructions}
      
      Please provide a new, improved version of the ${sectionName} section that is well-structured, academically sound, and aligns with the report requirements. Format it properly with appropriate headings and subheadings where necessary.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error regenerating section:', error);
      throw new Error('Failed to regenerate section. Please try again.');
    }
  }

  private buildPrompt(formData: ReportFormData): string {
    return `
      Generate a comprehensive academic report with the following specifications:
      
      Title: ${formData.title}
      Subject/Topic: ${formData.subject}
      Institution: ${formData.institution || 'Not specified'}
      Author: ${formData.author}
      Target Word Count: ${formData.wordCount}
      Academic Level: ${formData.academicLevel}
      Report Type: ${formData.reportType}
      
      Additional Instructions/Context:
      ${formData.customInstructions || 'None provided'}
      
      Please create a well-structured academic report that includes:
      
      1. **ABSTRACT** (150-250 words): A concise summary of the entire report
      
      2. **INTRODUCTION** (10-15% of word count): Background, context, objectives, and scope
      
      3. **MAIN BODY** (70-80% of word count): Detailed content with appropriate headings and subheadings. Include:
         - Methodology (if applicable)
         - Analysis/Discussion
         - Findings/Results
         - Use bullet points where appropriate
         - Ensure logical flow and clear transitions
      
      4. **CONCLUSION** (5-10% of word count): Summary of key findings and implications
      
      5. **REFERENCES** (if applicable): Properly formatted citations and bibliography
      
      Requirements:
      - Maintain academic writing standards
      - Use clear, professional language
      - Ensure content is original and plagiarism-free
      - Follow logical structure with smooth transitions
      - Include relevant headings and subheadings
      - Use bullet points and numbered lists where appropriate
      - Align with ${formData.academicLevel} level expectations
      
      Format the response with clear section markers:
      [ABSTRACT]
      [INTRODUCTION]
      [MAIN_BODY]
      [CONCLUSION]
      [REFERENCES]
    `;
  }

  private parseReportSections(text: string): GeneratedReport {
    const sections = {
      abstract: '',
      introduction: '',
      mainBody: '',
      conclusion: '',
      references: '',
      fullReport: text
    };

    // Extract sections using markers
    const abstractMatch = text.match(/\[ABSTRACT\](.*?)(?=\[|$)/s);
    const introMatch = text.match(/\[INTRODUCTION\](.*?)(?=\[|$)/s);
    const mainBodyMatch = text.match(/\[MAIN_BODY\](.*?)(?=\[|$)/s);
    const conclusionMatch = text.match(/\[CONCLUSION\](.*?)(?=\[|$)/s);
    const referencesMatch = text.match(/\[REFERENCES\](.*?)(?=\[|$)/s);

    if (abstractMatch) sections.abstract = abstractMatch[1].trim();
    if (introMatch) sections.introduction = introMatch[1].trim();
    if (mainBodyMatch) sections.mainBody = mainBodyMatch[1].trim();
    if (conclusionMatch) sections.conclusion = conclusionMatch[1].trim();
    if (referencesMatch) sections.references = referencesMatch[1].trim();

    // If sections weren't found with markers, try to split the text intelligently
    if (!sections.abstract && !sections.introduction) {
      const paragraphs = text.split('\n\n');
      if (paragraphs.length >= 4) {
        sections.abstract = paragraphs[0];
        sections.introduction = paragraphs[1];
        sections.mainBody = paragraphs.slice(2, -2).join('\n\n');
        sections.conclusion = paragraphs[paragraphs.length - 2];
        sections.references = paragraphs[paragraphs.length - 1];
      }
    }

    return sections;
  }
}

export const reportGeneratorService = new ReportGeneratorService();
