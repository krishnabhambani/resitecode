
import { LeadSearchCriteria, Lead, LeadGenerationResult } from './lead-types';
import { comprehensiveLeadExtractor } from './comprehensive-lead-extractor';

class NewLeadGenerationService {
  private googleApiKey: string;
  private googleCx: string;

  constructor() {
    this.googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
    this.googleCx = import.meta.env.VITE_GOOGLE_CX || '';
    
    console.log('🔑 API Keys Check:', {
      hasGoogleKey: !!this.googleApiKey,
      hasGoogleCx: !!this.googleCx
    });
  }

  async generateLeads(criteria: LeadSearchCriteria): Promise<LeadGenerationResult> {
    console.log('🚀 Starting lead generation with simplified approach:', criteria);
    
    this.validateApiKeys();
    
    try {
      const platforms = criteria.targetPlatforms || ['linkedin', 'reddit', 'twitter'];
      const allLeads: Lead[] = [];
      const platformResults: { [platform: string]: { count: number; queries: string[] } } = {};
      
      for (const platform of platforms) {
        console.log(`🎯 Processing platform: ${platform}`);
        
        const platformQueries = this.buildSimpleQueries(criteria, platform);
        platformResults[platform] = { count: 0, queries: platformQueries };
        
        const platformLeads = await this.searchPlatform(platformQueries, criteria, platform);
        allLeads.push(...platformLeads);
        platformResults[platform].count = platformLeads.length;
        
        console.log(`✅ Found ${platformLeads.length} leads on ${platform}`);
        
        // Rate limiting between platforms
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const uniqueLeads = this.removeDuplicatesAcrossPlatforms(allLeads);
      const sortedLeads = uniqueLeads.sort((a, b) => b.score - a.score);
      
      console.log(`📊 Final results: ${sortedLeads.length} unique leads`);
      
      return {
        leads: sortedLeads,
        totalCount: sortedLeads.length,
        searchCriteria: criteria,
        generatedAt: new Date().toISOString(),
        googleDorkQuery: Object.values(platformResults).flatMap(r => r.queries).join(' | '),
        platformResults
      };
      
    } catch (error) {
      console.error('❌ Lead generation failed:', error);
      throw new Error(`Lead generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildSimpleQueries(criteria: LeadSearchCriteria, platform: string): string[] {
    const queries: string[] = [];
    const industry = criteria.industry[0] || '';
    const location = criteria.location.city || '';
    const role = criteria.jobTitle || '';
    
    console.log('🏗️ Building simple queries for:', { platform, industry, location, role });
    
    // Simplified, more effective queries
    if (platform === 'linkedin' || platform.includes('linkedin')) {
      if (industry) {
        queries.push(`site:linkedin.com/in ${industry}`);
      }
      if (location) {
        queries.push(`site:linkedin.com/in "${location}"`);
      }
      if (role) {
        queries.push(`site:linkedin.com/in "${role}"`);
      }
      if (industry && location) {
        queries.push(`site:linkedin.com/in ${industry} "${location}"`);
      }
    }
    
    else if (platform === 'reddit' || platform.includes('reddit')) {
      if (industry) {
        queries.push(`site:reddit.com ${industry} hiring`);
      }
      if (location) {
        queries.push(`site:reddit.com "${location}" jobs`);
      }
      if (role) {
        queries.push(`site:reddit.com "${role}" contact`);
      }
    }
    
    else if (platform === 'twitter' || platform.includes('twitter')) {
      if (industry) {
        queries.push(`site:twitter.com ${industry} contact`);
      }
      if (location) {
        queries.push(`site:twitter.com "${location}" email`);
      }
      if (role) {
        queries.push(`site:twitter.com "${role}" hiring`);
      }
    }
    
    else {
      // Custom platform
      const searchTerms = [industry, location, role].filter(Boolean);
      if (searchTerms.length > 0) {
        const siteQuery = platform.includes('.') ? `site:${platform}` : `site:${platform}.com`;
        queries.push(`${siteQuery} ${searchTerms.join(' ')}`);
      }
    }
    
    // Fallback basic queries if none generated
    if (queries.length === 0) {
      if (platform.includes('linkedin')) {
        queries.push('site:linkedin.com/in CEO');
      } else if (platform.includes('reddit')) {
        queries.push('site:reddit.com hiring remote');
      } else {
        queries.push(`site:${platform} contact email`);
      }
    }
    
    console.log(`✅ Built ${queries.length} simple queries for ${platform}:`, queries);
    return queries.slice(0, 3); // Limit to 3 queries per platform
  }

  private async searchPlatform(queries: string[], criteria: LeadSearchCriteria, platform: string): Promise<Lead[]> {
    const leads: Lead[] = [];
    const maxPages = Math.min(criteria.maxPages || 3, 5); // Limit to max 5 pages
    
    for (const query of queries) {
      console.log(`🔍 Executing query: ${query}`);
      
      for (let page = 0; page < maxPages; page++) {
        const startIndex = page * 10 + 1;
        
        try {
          const results = await this.executeGoogleSearch(query, startIndex);
          console.log(`📊 Page ${page + 1} returned ${results.length} results`);
          
          if (results.length === 0) break;
          
          // Extract leads from all results on this page
          for (const result of results) {
            const resultLeads = await comprehensiveLeadExtractor.extractLeadsFromPage(
              result, criteria, platform
            );
            leads.push(...resultLeads);
          }
          
          // Rate limiting between pages
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`❌ Query page ${page + 1} failed:`, error);
          break;
        }
      }
      
      // Rate limiting between queries
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    return leads;
  }

  private async executeGoogleSearch(query: string, startIndex: number = 1): Promise<any[]> {
    let searchUrl = `https://www.googleapis.com/customsearch/v1?key=${this.googleApiKey}&cx=${this.googleCx}&q=${encodeURIComponent(query)}&num=10&start=${startIndex}`;
    
    console.log('🌐 Google Search Query:', query);
    console.log('🔗 Search URL constructed');
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Google Search API error:', response.status, errorText);
      throw new Error(`Google Search API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📋 Google Search Response:', {
      totalResults: data.searchInformation?.totalResults,
      itemCount: data.items?.length || 0,
      query: data.queries?.request?.[0]?.searchTerms
    });
    
    return data.items || [];
  }

  private removeDuplicatesAcrossPlatforms(leads: Lead[]): Lead[] {
    const seen = new Map();
    
    return leads.filter(lead => {
      const key = lead.email || `${lead.name}-${lead.company}`;
      
      if (seen.has(key)) {
        const existing = seen.get(key);
        if (lead.score > existing.score) {
          seen.set(key, lead);
          return true;
        }
        return false;
      }
      
      seen.set(key, lead);
      return true;
    });
  }

  private validateApiKeys(): void {
    if (!this.googleApiKey) {
      throw new Error('Google API key is missing. Set VITE_GOOGLE_API_KEY environment variable.');
    }
    if (!this.googleCx) {
      throw new Error('Google CX is missing. Set VITE_GOOGLE_CX environment variable.');
    }
  }

  generateDorkPreview(criteria: LeadSearchCriteria): string {
    const platforms = criteria.targetPlatforms || ['linkedin', 'reddit', 'twitter'];
    
    let preview = '🔍 Simplified Google Search Queries:\n\n';
    
    platforms.forEach((platform, index) => {
      const queries = this.buildSimpleQueries(criteria, platform);
      preview += `${index + 1}. ${platform.toUpperCase()}\n`;
      queries.forEach((query, qIndex) => {
        preview += `   ${qIndex + 1}. ${query}\n`;
      });
      preview += '\n';
    });
    
    preview += `📊 Total Platforms: ${platforms.length}\n`;
    preview += `📄 Search Pages per Query: ${criteria.maxPages || 3}`;
    
    return preview;
  }

  async exportLeads(leads: Lead[], format: 'csv' | 'xlsx'): Promise<string> {
    if (format === 'csv') {
      const headers = ['Name', 'Company', 'Job Title', 'Email', 'Phone', 'Location', 'Industry', 'Platform', 'Score', 'Source URL'];
      const csvContent = [
        headers.join(','),
        ...leads.map(lead => [
          lead.name,
          lead.company,
          lead.jobTitle,
          lead.email || '',
          lead.phone || '',
          lead.location,
          lead.industry,
          lead.platform || '',
          lead.score,
          lead.sourceUrl || ''
        ].map(field => `"${field}"`).join(','))
      ].join('\n');
      
      return csvContent;
    }
    
    return 'XLSX export requires additional library implementation';
  }
}

export const newLeadGenerationService = new NewLeadGenerationService();
