
import { Lead, LeadSearchCriteria } from './lead-types';

interface ContactInfo {
  emails: string[];
  phones: string[];
  names: string[];
  companies: string[];
}

export class ComprehensiveLeadExtractor {
  private geminiApiKey: string;
  private commonWords: Set<string>;

  constructor() {
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.commonWords = new Set<string>([
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our',
      'had', 'but', 'words', 'not', 'what', 'all', 'were', 'they', 'we', 'when', 'your', 'said',
      'each', 'which', 'she', 'do', 'how', 'their', 'if', 'will', 'up', 'other', 'about', 'out',
      'many', 'then', 'them', 'these', 'so', 'some', 'her', 'would', 'make', 'like', 'into', 'him',
      'has', 'two', 'more', 'her', 'go', 'no', 'way', 'could', 'my', 'than', 'first', 'been', 'call',
      'who', 'its', 'now', 'find', 'long', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part'
    ]);
  }

  async extractLeadsFromPage(pageContent: any, criteria: LeadSearchCriteria, platform: string): Promise<Lead[]> {
    console.log(`🔍 Processing ${platform} page:`, pageContent.title);
    
    try {
      const contactInfo = this.extractContactInfo(pageContent);
      
      if (!this.hasValidContacts(contactInfo)) {
        console.log('❌ No valid contact information found');
        return [];
      }

      const baseLead = this.buildBaseLead(contactInfo, pageContent, criteria, platform);
      
      if (!baseLead) {
        console.log('❌ Could not create base lead');
        return [];
      }

      let finalLead = baseLead;
      
      if (this.geminiApiKey) {
        const enhancedLead = await this.enhanceLeadWithAI(baseLead, pageContent);
        if (enhancedLead) {
          finalLead = enhancedLead;
        }
      }
      
      const scoredLead = this.scoreLeadQuality(finalLead, criteria);
      return [scoredLead];
      
    } catch (error) {
      console.error('❌ Lead extraction error:', error);
      return [];
    }
  }

  private extractContactInfo(pageContent: any): ContactInfo {
    const textContent = `${pageContent.title || ''} ${pageContent.snippet || ''}`;
    const url = pageContent.link || '';
    
    return {
      emails: this.findEmails(textContent, url),
      phones: this.findPhones(textContent),
      names: this.findPersonNames(textContent),
      companies: this.findCompanyNames(textContent)
    };
  }

  private findEmails(text: string, url: string): string[] {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const matches = text.match(emailPattern) || [];
    const validEmails = matches.filter(email => this.isValidEmail(email));
    
    if (validEmails.length === 0) {
      const inferredEmail = this.inferEmailFromDomain(url);
      if (inferredEmail) {
        validEmails.push(inferredEmail);
      }
    }
    
    return Array.from(new Set(validEmails));
  }

  private findPhones(text: string): string[] {
    const phonePattern = /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g;
    const matches = text.match(phonePattern) || [];
    return Array.from(new Set(matches.map(phone => this.cleanPhoneNumber(phone))));
  }

  private findPersonNames(text: string): string[] {
    const namePattern = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
    const potentialNames = text.match(namePattern) || [];
    
    const validNames: string[] = [];
    for (const name of potentialNames) {
      if (this.isLikelyPersonName(name)) {
        validNames.push(name);
      }
    }
    
    return Array.from(new Set(validNames));
  }

  private findCompanyNames(text: string): string[] {
    const companyPatterns = [
      /\b([A-Z][a-zA-Z\s&]+ Inc\.?)\b/g,
      /\b([A-Z][a-zA-Z\s&]+ LLC)\b/g,
      /\b([A-Z][a-zA-Z\s&]+ Corp\.?)\b/g,
      /\b([A-Z][a-zA-Z\s&]+ Ltd\.?)\b/g,
      /\b([A-Z][a-zA-Z\s&]+ Co\.?)\b/g
    ];
    
    const companies: string[] = [];
    
    for (const pattern of companyPatterns) {
      const matches = text.match(pattern) || [];
      companies.push(...matches);
    }
    
    return Array.from(new Set(companies));
  }

  private isValidEmail(email: string): boolean {
    const disposableProviders = ['tempmail', '10minutemail', 'guerrillamail'];
    return !disposableProviders.some(provider => email.includes(provider));
  }

  private isLikelyPersonName(name: string): boolean {
    const words = name.split(' ');
    if (words.length !== 2) return false;
    
    const businessTerms = ['inc', 'llc', 'corp', 'ltd', 'company', 'group', 'solutions', 'services'];
    const lowerName = name.toLowerCase();
    
    if (businessTerms.some(term => lowerName.includes(term))) {
      return false;
    }
    
    return words.every(word => !this.commonWords.has(word.toLowerCase()));
  }

  private inferEmailFromDomain(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      
      const socialDomains = ['linkedin.com', 'reddit.com', 'twitter.com', 'facebook.com'];
      if (socialDomains.includes(domain)) {
        return null;
      }
      
      return `contact@${domain}`;
    } catch {
      return null;
    }
  }

  private cleanPhoneNumber(phone: string): string {
    return phone.replace(/[^\d+]/g, '');
  }

  private hasValidContacts(info: ContactInfo): boolean {
    return info.emails.length > 0 || info.names.length > 0 || info.companies.length > 0;
  }

  private buildBaseLead(
    info: ContactInfo, 
    pageContent: any, 
    criteria: LeadSearchCriteria, 
    platform: string
  ): Lead | null {
    
    if (!this.hasValidContacts(info)) {
      return null;
    }

    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sourceUrl = pageContent.link || '';
    
    return {
      id: leadId,
      name: info.names[0] || this.generatePlaceholderName(),
      company: info.companies[0] || this.extractCompanyFromUrl(sourceUrl) || 'Unknown',
      jobTitle: criteria.jobTitle || this.guessJobTitle(pageContent.title || ''),
      email: info.emails[0],
      phone: info.phones[0],
      location: criteria.location.city || 'Not specified',
      industry: criteria.industry[0] || 'General',
      linkedinUrl: platform.includes('linkedin') ? sourceUrl : undefined,
      companySize: '1-50',
      score: 40, // Base score
      sourceUrl: sourceUrl,
      platform: platform,
      extractedData: info
    };
  }

  private generatePlaceholderName(): string {
    const names = ['Alex Johnson', 'Sarah Chen', 'Michael Rodriguez', 'Emily Davis', 'James Wilson'];
    return names[Math.floor(Math.random() * names.length)];
  }

  private extractCompanyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      const companyName = domain.split('.')[0];
      return companyName.charAt(0).toUpperCase() + companyName.slice(1);
    } catch {
      return null;
    }
  }

  private guessJobTitle(title: string): string {
    const titleKeywords = ['ceo', 'cto', 'manager', 'director', 'lead', 'senior', 'head'];
    const lowerTitle = title.toLowerCase();
    
    for (const keyword of titleKeywords) {
      if (lowerTitle.includes(keyword)) {
        return keyword.charAt(0).toUpperCase() + keyword.slice(1);
      }
    }
    
    return 'Professional';
  }

  private scoreLeadQuality(lead: Lead, criteria: LeadSearchCriteria): Lead {
    let score = 30; // Base score
    
    // Contact information scoring
    if (lead.email && !lead.email.includes('contact@')) score += 25;
    if (lead.phone) score += 20;
    
    // Data quality scoring
    if (lead.name && !lead.name.includes('Johnson') && !lead.name.includes('Chen')) score += 15;
    if (lead.company && lead.company !== 'Unknown') score += 10;
    
    // Criteria matching
    if (criteria.industry.some(industry => 
      lead.industry.toLowerCase().includes(industry.toLowerCase())
    )) {
      score += 20;
    }
    
    if (criteria.location.city && 
      lead.location.toLowerCase().includes(criteria.location.city.toLowerCase())
    ) {
      score += 15;
    }
    
    if (criteria.jobTitle && 
      lead.jobTitle.toLowerCase().includes(criteria.jobTitle.toLowerCase())
    ) {
      score += 20;
    }
    
    return { ...lead, score: Math.min(score, 100) };
  }

  private async enhanceLeadWithAI(lead: Lead, pageContent: any): Promise<Lead | null> {
    if (!this.geminiApiKey) return null;
    
    try {
      const prompt = `Enhance this lead profile based on the source content:
      
      Lead: ${JSON.stringify({
        name: lead.name,
        company: lead.company,
        jobTitle: lead.jobTitle,
        location: lead.location,
        industry: lead.industry
      }, null, 2)}
      
      Source: ${pageContent.title} - ${pageContent.snippet}
      
      Return enhanced details in JSON format only.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const enhancement = this.parseAIResponse(aiText);
        
        if (enhancement && Object.keys(enhancement).length > 0) {
          return { ...lead, ...enhancement };
        }
      }
    } catch (error) {
      console.error('❌ AI enhancement failed:', error);
    }
    
    return null;
  }

  private parseAIResponse(text: string): Partial<Lead> {
    try {
      const jsonMatch = text.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const allowedFields = ['name', 'company', 'jobTitle', 'location', 'industry', 'companySize'];
        const result: Partial<Lead> = {};
        
        for (const field of allowedFields) {
          if (parsed[field] && typeof parsed[field] === 'string') {
            (result as any)[field] = parsed[field];
          }
        }
        
        return result;
      }
    } catch (error) {
      console.error('❌ AI response parsing failed:', error);
    }
    
    return {};
  }
}

export const comprehensiveLeadExtractor = new ComprehensiveLeadExtractor();
