
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { JDAnalysis, ResumeData, ADSOptimization } from './resume-types';

export class GeminiResumeService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
  }

  private extractJsonFromResponse(text: string): string {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return jsonMatch[1].trim();
    }
    return text;
  }

  async analyzeJobDescription(jobDescription: string): Promise<JDAnalysis> {
    const prompt = `
      Extract the most relevant hard skills, soft skills, tools, technologies, and role responsibilities from the following Job Description. These will be used to guide resume creation and optimization.

      Job Description:
      ${jobDescription}

      Return ONLY valid JSON with this structure:
      {
        "keySkills": ["skill1", "skill2", "skill3"],
        "tools": ["tool1", "tool2", "tool3"],
        "responsibilities": ["responsibility1", "responsibility2"],
        "industryKeywords": ["keyword1", "keyword2"],
        "suggestedSummary": "A 3-4 line professional summary based on this JD",
        "missingSkills": ["additional skills that might be valuable"]
      }
    `;

    try {
      const result = await this.model.generateContent([prompt]);
      const rawText = await result.response.text();
      const cleanedText = this.extractJsonFromResponse(rawText);
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('JD Analysis failed:', error);
      throw new Error('Failed to analyze job description');
    }
  }

  async enhanceExperience(jobTitle: string, jdAnalysis: JDAnalysis): Promise<string[]> {
    const prompt = `
      Given this job title "${jobTitle}" and the following job requirements, suggest 4-5 impactful experience descriptions with metrics that would align well with this role.

      Key Skills Required: ${jdAnalysis.keySkills.join(', ')}
      Tools: ${jdAnalysis.tools.join(', ')}
      Responsibilities: ${jdAnalysis.responsibilities.join(', ')}

      Return ONLY valid JSON array:
      ["Enhanced experience point 1", "Enhanced experience point 2", "Enhanced experience point 3", "Enhanced experience point 4"]
    `;

    try {
      const result = await this.model.generateContent([prompt]);
      const rawText = await result.response.text();
      const cleanedText = this.extractJsonFromResponse(rawText);
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Experience enhancement failed:', error);
      return ["Enhanced job responsibilities with focus on results", "Collaborated with cross-functional teams", "Implemented solutions that improved efficiency"];
    }
  }

  async calculateADSScore(resumeData: ResumeData, jdAnalysis: JDAnalysis | null): Promise<ADSOptimization> {
    // If no JD analysis, provide general scoring
    if (!jdAnalysis) {
      return this.calculateGeneralScore(resumeData);
    }

    const prompt = `
      Evaluate how well this resume matches the Job Description requirements. Be VERY STRICT in scoring - provide realistic, harsh scoring based on actual content quality and keyword matching.

      SCORING CRITERIA (Be extremely harsh and realistic):
      - Empty resume with no meaningful content: 5-15 points
      - Minimal basic info only: 15-25 points
      - Some content but poor quality/no JD match: 25-40 points  
      - Decent content with some JD alignment: 40-60 points
      - Good content with solid JD match: 60-75 points
      - Strong professional content with excellent JD alignment: 75-85 points
      - Exceptional content with perfect JD match: 85-95 points

      Resume Content Analysis:
      Personal Info: ${resumeData.personalInfo.fullName ? 'Present' : 'Missing'}, ${resumeData.personalInfo.email ? 'Has email' : 'No email'}
      Summary: "${resumeData.summary || 'No summary provided'}" (Length: ${resumeData.summary?.length || 0} chars)
      Skills: ${Object.values(resumeData.skills).flat().filter(Boolean).join(', ') || 'No skills listed'} (Count: ${Object.values(resumeData.skills).flat().filter(Boolean).length})
      Experience Count: ${resumeData.experience.filter(exp => exp.title?.trim()).length}
      Experience Details: ${resumeData.experience.map(exp => `${exp.title || 'No title'} at ${exp.company || 'No company'}: ${exp.description.join(' ') || 'No description'}`).join(' | ')}
      Education: ${resumeData.education.degree || 'No education listed'}
      Projects Count: ${resumeData.projects.filter(proj => proj.title?.trim()).length}

      Job Requirements:
      Key Skills: ${jdAnalysis.keySkills.join(', ')}
      Tools: ${jdAnalysis.tools.join(', ')}
      Keywords: ${jdAnalysis.industryKeywords.join(', ')}

      Calculate a REALISTIC score based on:
      1. How many JD keywords appear in resume
      2. Skills match percentage  
      3. Experience relevance to role
      4. Overall content quality and completeness
      5. Professional formatting and structure

      Be harsh - if resume is mostly empty or generic, score should be 20-40. Only give high scores for truly excellent resumes.

      Return ONLY valid JSON:
      {
        "score": 35,
        "missingKeywords": ["specific missing keywords from JD that should be in resume"],
        "recommendations": ["Specific actionable improvements based on gaps found"],
        "improvedSections": {
          "summary": "Enhanced summary with better keyword alignment if current summary exists",
          "experience": ["Improved experience point 1", "Improved experience point 2"],
          "skills": ["Missing relevant skill 1", "Missing relevant skill 2"]
        }
      }
    `;

    try {
      const result = await this.model.generateContent([prompt]);
      const rawText = await result.response.text();
      const cleanedText = this.extractJsonFromResponse(rawText);
      const parsed = JSON.parse(cleanedText);
      
      // Ensure score is realistic and not inflated
      if (parsed.score > 95) parsed.score = 95;
      if (parsed.score < 5) parsed.score = 5;
      
      return parsed;
    } catch (error) {
      console.error('ADS calculation failed:', error);
      throw new Error('Failed to calculate ADS score');
    }
  }

  private async calculateGeneralScore(resumeData: ResumeData): Promise<ADSOptimization> {
    // Calculate strict completeness score without JD
    let score = 0;
    const recommendations: string[] = [];
    const missingKeywords: string[] = [];

    // Very strict scoring based on actual content
    if (resumeData.personalInfo.fullName?.trim() && resumeData.personalInfo.email?.trim()) {
      score += 10;
    } else {
      recommendations.push("Complete all required contact information (name and email)");
    }

    if (resumeData.summary && resumeData.summary.trim().length > 100) {
      score += 20;
    } else if (resumeData.summary && resumeData.summary.trim().length > 30) {
      score += 10;
      recommendations.push("Expand your professional summary with more detail");
    } else {
      recommendations.push("Add a comprehensive professional summary (100+ characters)");
    }

    const validExperience = resumeData.experience.filter(exp => exp.title?.trim() && exp.company?.trim());
    if (validExperience.length >= 2) {
      score += 25;
    } else if (validExperience.length === 1) {
      score += 15;
      recommendations.push("Add more work experience entries");
    } else {
      recommendations.push("Add relevant work experience with job titles and companies");
    }

    if (resumeData.education.degree?.trim() && resumeData.education.university?.trim()) {
      score += 15;
    } else if (resumeData.education.degree?.trim()) {
      score += 10;
      recommendations.push("Add university/institution name to education");
    } else {
      recommendations.push("Include education details (degree and institution)");
    }

    const allSkills = Object.values(resumeData.skills).flat().filter(skill => skill?.trim());
    if (allSkills.length >= 8) {
      score += 20;
    } else if (allSkills.length >= 4) {
      score += 15;
      recommendations.push("Add more relevant technical and soft skills");
    } else if (allSkills.length > 0) {
      score += 8;
      recommendations.push("Significantly expand your skills section");
    } else {
      recommendations.push("Add relevant skills to your resume");
    }

    const validProjects = resumeData.projects.filter(proj => proj.title?.trim() && proj.description?.trim());
    if (validProjects.length >= 2) {
      score += 10;
    } else if (validProjects.length === 1) {
      score += 5;
      recommendations.push("Add more project examples");
    } else {
      recommendations.push("Include relevant projects with descriptions");
    }

    // Cap score at 70 for general scoring (no JD analysis)
    score = Math.min(score, 70);

    return {
      score,
      missingKeywords,
      recommendations,
      improvedSections: {
        summary: resumeData.summary ? 
          `Enhanced: ${resumeData.summary.substring(0, 80)}... [Add more specific achievements and career goals]` : 
          "Create a compelling professional summary highlighting your key strengths, relevant experience, and career objectives (3-4 sentences minimum).",
        experience: [
          "Add quantifiable achievements with specific metrics (e.g., 'Increased sales by 25%')",
          "Include action verbs and specific technologies/tools used",
          "Focus on results and impact rather than just responsibilities"
        ],
        skills: [
          "Add industry-relevant technical skills",
          "Include specific programming languages/frameworks if applicable", 
          "Add relevant soft skills like leadership, communication, problem-solving"
        ]
      }
    };
  }

  async optimizeResume(resumeData: ResumeData, jdAnalysis: JDAnalysis | null): Promise<ResumeData> {
    const jdContext = jdAnalysis ? 
      `Job Requirements for optimization:
       Key Skills: ${jdAnalysis.keySkills.join(', ')}
       Tools: ${jdAnalysis.tools.join(', ')}
       Industry Keywords: ${jdAnalysis.industryKeywords.join(', ')}
       Responsibilities: ${jdAnalysis.responsibilities.join(', ')}` : 
      "No specific job requirements - optimize for general improvement and professional impact";

    const prompt = `
      Enhance this resume content by improving weak sections and adding more impactful, professional descriptions. Keep the exact same JSON structure but improve content quality significantly.

      Current Resume Data:
      ${JSON.stringify(resumeData, null, 2)}

      ${jdContext}

      Instructions for optimization:
      1. Enhance the professional summary to be more compelling and keyword-rich
      2. Improve experience descriptions with stronger action verbs and quantifiable achievements
      3. Add missing relevant skills if they align with experience
      4. Enhance project descriptions to highlight technical skills and impact
      5. Keep all existing structure intact - only improve the content quality
      6. Make descriptions more professional and achievement-focused
      7. Add metrics and numbers where appropriate
      8. Ensure keyword alignment with job requirements if provided

      Return the complete optimized resume in the exact same JSON structure with improved content.
    `;

    try {
      const result = await this.model.generateContent([prompt]);
      const rawText = await result.response.text();
      const cleanedText = this.extractJsonFromResponse(rawText);
      const optimizedResume = JSON.parse(cleanedText);
      
      // Ensure we maintain the original structure
      return {
        ...resumeData,
        ...optimizedResume,
        personalInfo: { ...resumeData.personalInfo, ...optimizedResume.personalInfo },
        education: { ...resumeData.education, ...optimizedResume.education },
        skills: { ...resumeData.skills, ...optimizedResume.skills }
      };
    } catch (error) {
      console.error('Resume optimization failed:', error);
      throw new Error('Failed to optimize resume');
    }
  }
}

export const geminiResumeService = new GeminiResumeService();
