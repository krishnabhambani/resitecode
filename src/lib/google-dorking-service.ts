
import { LeadSearchCriteria, GoogleDorkQuery } from './lead-types';

class GoogleDorkingService {
  generateGoogleDork(criteria: LeadSearchCriteria): GoogleDorkQuery {
    console.log('Generating Google Dork for criteria:', criteria);
    
    // Base query structure
    let baseQuery = 'site:linkedin.com/in OR site:about.me OR site:github.io';
    
    // Industry filters
    const industryFilter = criteria.industry.length > 0 
      ? criteria.industry.map(ind => `"${ind}"`).join(' OR ')
      : '';
    
    // Location hierarchy filter
    const locationParts = [];
    if (criteria.location.city) locationParts.push(`"${criteria.location.city}"`);
    if (criteria.location.state) locationParts.push(`"${criteria.location.state}"`);
    if (criteria.location.country) locationParts.push(`"${criteria.location.country}"`);
    const locationFilter = locationParts.join(' ');
    
    // Role/Job title filter
    const roleFilter = criteria.jobTitle ? `"${criteria.jobTitle}"` : '';
    
    // Keywords filters
    const keywordFilters = criteria.keywords.map(kw => `"${kw.trim()}"`);
    
    // Field/Domain filter
    const fieldFilter = criteria.field ? `"${criteria.field}"` : '';
    
    // Custom tags filters
    const customTagFilters = criteria.customTags.map(tag => `"${tag.trim()}"`);
    
    // Contact requirements (mandatory email and phone)
    const contactRequirements = '("@gmail.com" OR "@yahoo.com" OR "@outlook.com" OR "email") AND ("phone" OR "mobile" OR "contact" OR "+91" OR "call")';
    
    // Additional professional keywords
    const professionalKeywords = '"experience" OR "skills" OR "portfolio" OR "resume"';
    
    // Construct the complete query
    const queryParts = [baseQuery];
    
    if (industryFilter) queryParts.push(`(${industryFilter})`);
    if (locationFilter) queryParts.push(`(${locationFilter})`);
    if (roleFilter) queryParts.push(roleFilter);
    if (fieldFilter) queryParts.push(fieldFilter);
    
    // Add keyword filters
    if (keywordFilters.length > 0) {
      queryParts.push(`(${keywordFilters.join(' OR ')})`);
    }
    
    // Add custom tag filters
    if (customTagFilters.length > 0) {
      queryParts.push(`(${customTagFilters.join(' OR ')})`);
    }
    
    // Add contact requirements
    queryParts.push(`(${contactRequirements})`);
    queryParts.push(`(${professionalKeywords})`);
    
    const finalQuery = queryParts.join(' ');
    
    return {
      query: finalQuery,
      breakdown: {
        baseQuery,
        industryFilter,
        locationFilter,
        roleFilter,
        keywordFilters,
        fieldFilter,
        customTagFilters,
        contactRequirements
      }
    };
  }

  generateAlternativeQueries(criteria: LeadSearchCriteria): string[] {
    const alternatives = [];
    
    // LinkedIn specific query
    const linkedinQuery = this.generateLinkedInSpecificQuery(criteria);
    alternatives.push(linkedinQuery);
    
    // Company directory query
    const companyQuery = this.generateCompanyDirectoryQuery(criteria);
    alternatives.push(companyQuery);
    
    // Professional network query
    const networkQuery = this.generateProfessionalNetworkQuery(criteria);
    alternatives.push(networkQuery);
    
    return alternatives;
  }

  private generateLinkedInSpecificQuery(criteria: LeadSearchCriteria): string {
    let query = 'site:linkedin.com/in';
    
    if (criteria.jobTitle) query += ` "${criteria.jobTitle}"`;
    if (criteria.industry.length > 0) query += ` (${criteria.industry.map(ind => `"${ind}"`).join(' OR ')})`;
    if (criteria.location.city) query += ` "${criteria.location.city}"`;
    
    query += ' ("email" OR "contact") ("phone" OR "mobile")';
    
    return query;
  }

  private generateCompanyDirectoryQuery(criteria: LeadSearchCriteria): string {
    let query = 'site:crunchbase.com OR site:zoominfo.com OR site:apollo.io';
    
    if (criteria.industry.length > 0) query += ` (${criteria.industry.map(ind => `"${ind}"`).join(' OR ')})`;
    if (criteria.location.city) query += ` "${criteria.location.city}"`;
    if (criteria.jobTitle) query += ` "${criteria.jobTitle}"`;
    
    query += ' "email" "phone"';
    
    return query;
  }

  private generateProfessionalNetworkQuery(criteria: LeadSearchCriteria): string {
    let query = 'site:github.io OR site:medium.com OR site:dev.to OR site:behance.net';
    
    if (criteria.field) query += ` "${criteria.field}"`;
    if (criteria.keywords.length > 0) query += ` (${criteria.keywords.map(kw => `"${kw}"`).join(' OR ')})`;
    if (criteria.location.city) query += ` "${criteria.location.city}"`;
    
    query += ' ("contact" OR "hire" OR "email") ("phone" OR "mobile")';
    
    return query;
  }

  formatQueryForDisplay(dorkQuery: GoogleDorkQuery): string {
    return `
Generated Google Dork Query:
${dorkQuery.query}

Query Breakdown:
• Base Sites: ${dorkQuery.breakdown.baseQuery}
• Industry Filter: ${dorkQuery.breakdown.industryFilter || 'None'}
• Location Filter: ${dorkQuery.breakdown.locationFilter || 'None'}
• Role Filter: ${dorkQuery.breakdown.roleFilter || 'None'}
• Keywords: ${dorkQuery.breakdown.keywordFilters.join(', ') || 'None'}
• Field Filter: ${dorkQuery.breakdown.fieldFilter || 'None'}
• Custom Tags: ${dorkQuery.breakdown.customTagFilters.join(', ') || 'None'}
• Contact Requirements: ${dorkQuery.breakdown.contactRequirements}
    `.trim();
  }
}

export const googleDorkingService = new GoogleDorkingService();
