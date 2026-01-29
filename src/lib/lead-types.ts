
export interface LeadSearchCriteria {
  industry: string[];
  location: {
    city?: string;
    state?: string;
    country?: string;
  };
  companySize: string;
  jobTitle: string;
  keywords: string[];
  field: string;
  customTags: string[];
  emailRequired: boolean;
  phoneRequired: boolean;
  searchDepth: number; // Pages 1-5
  timeRange?: string; // New field for time-based search
  maxPages?: number; // New field for search pages
  targetPlatforms?: string[]; // New field for platform selection
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  jobTitle: string;
  email?: string;
  phone?: string;
  location: string;
  industry: string;
  linkedinUrl?: string;
  companySize: string;
  score: number;
  sourceUrl?: string;
  platform?: string; // Which platform this lead was found on
  extractedData?: any; // Raw extracted data for quality assessment
}

export interface LeadGenerationResult {
  leads: Lead[];
  totalCount: number;
  searchCriteria: LeadSearchCriteria;
  generatedAt: string;
  googleDorkQuery: string;
  platformResults?: {
    [platform: string]: {
      count: number;
      queries: string[];
    };
  };
}

export interface GoogleDorkQuery {
  query: string;
  breakdown: {
    baseQuery: string;
    industryFilter: string;
    locationFilter: string;
    roleFilter: string;
    keywordFilters: string[];
    fieldFilter: string;
    customTagFilters: string[];
    contactRequirements: string;
  };
}
