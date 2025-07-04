
export interface ResumeData {
  personalInfo: {
    fullName: string;
    phone: string;
    email: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  summary: string;
  education: {
    degree: string;
    university: string;
    location: string;
    duration: string;
  };
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    location: string;
    description: string[];
  }>;
  projects: Array<{
    title: string;
    description: string;
    linkLabel: string;
    url: string;
  }>;
  skills: {
    programmingLanguages: string[];
    frameworks: string[];
    tools: string[];
    softSkills: string[];
  };
  achievements: Array<{
    title: string;
    description: string;
  }>;
  positions: Array<{
    role: string;
    organization: string;
    description: string;
  }>;
  customSections?: Array<{
    name: string;
    fields: Array<{
      key: string;
      value: string;
    }>;
  }>;
}

export interface JDAnalysis {
  keySkills: string[];
  tools: string[];
  responsibilities: string[];
  industryKeywords: string[];
  suggestedSummary: string;
  missingSkills: string[];
}

export interface ADSOptimization {
  score: number;
  missingKeywords: string[];
  recommendations: string[];
  improvedSections: {
    summary?: string;
    experience?: string[];
    skills?: string[];
  };
}
