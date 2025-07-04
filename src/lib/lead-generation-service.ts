
import { LeadSearchCriteria, Lead, LeadGenerationResult } from './lead-types';
import { googleDorkingService } from './google-dorking-service';

class LeadGenerationService {
  private googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  private googleCx = import.meta.env.VITE_GOOGLE_CX;
  private geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  async generateLeads(criteria: LeadSearchCriteria): Promise<LeadGenerationResult> {
    console.log('Starting advanced lead generation with criteria:', criteria);
    
    try {
      // Validate API credentials first
      if (!this.googleApiKey || !this.googleCx) {
        throw new Error('Google API credentials are missing. Please check VITE_GOOGLE_API_KEY and VITE_GOOGLE_CX in your environment variables.');
      }

      if (!this.geminiApiKey) {
        throw new Error('Gemini API key is missing. Please check VITE_GEMINI_API_KEY in your environment variables.');
      }

      // Generate Google Dork query
      const dorkQuery = googleDorkingService.generateGoogleDork(criteria);
      console.log('Generated Google Dork:', dorkQuery);
      
      // Search multiple pages (1-5) for comprehensive results
      const allSearchResults = [];
      const maxPages = Math.min(criteria.searchDepth || 3, 5);
      
      for (let page = 0; page < maxPages; page++) {
        const startIndex = page * 10 + 1;
        try {
          const pageResults = await this.searchGoogleWithDork(dorkQuery.query, startIndex);
          allSearchResults.push(...pageResults);
          
          // Add delay between requests to avoid rate limiting
          if (page < maxPages - 1) {
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
        } catch (pageError) {
          console.error(`Error fetching page ${page + 1}:`, pageError);
          // Continue with other pages even if one fails
        }
      }
      
      console.log(`Found ${allSearchResults.length} search results across ${maxPages} pages`);
      
      if (allSearchResults.length === 0) {
        return {
          leads: [],
          totalCount: 0,
          searchCriteria: criteria,
          generatedAt: new Date().toISOString(),
          googleDorkQuery: dorkQuery.query
        };
      }
      
      // Process results with enhanced AI
      const processedLeads = await this.processWithAdvancedAI(allSearchResults, criteria);
      console.log('Processed leads:', processedLeads);
      
      return {
        leads: processedLeads,
        totalCount: processedLeads.length,
        searchCriteria: criteria,
        generatedAt: new Date().toISOString(),
        googleDorkQuery: dorkQuery.query
      };
    } catch (error) {
      console.error('Error in advanced lead generation:', error);
      throw new Error(`Lead generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async searchGoogleWithDork(dorkQuery: string, startIndex: number = 1): Promise<any[]> {
    console.log(`Searching with dork query (page ${Math.ceil(startIndex/10)}):`, dorkQuery);

    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${this.googleApiKey}&cx=${this.googleCx}&q=${encodeURIComponent(dorkQuery)}&num=10&start=${startIndex}`;

    try {
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Search API Response:', errorText);
        
        if (response.status === 403) {
          throw new Error('Google Search API quota exceeded or invalid credentials');
        } else if (response.status === 400) {
          throw new Error('Invalid search query or parameters');
        } else {
          throw new Error(`Google Search API error: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Google Search API error: ${data.error.message}`);
      }
      
      return data.items || [];
    } catch (fetchError) {
      console.error('Network error during Google search:', fetchError);
      throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : 'Failed to connect to Google Search API'}`);
    }
  }

  private async processWithAdvancedAI(searchResults: any[], criteria: LeadSearchCriteria): Promise<Lead[]> {
    const leads: Lead[] = [];
    const maxResults = Math.min(searchResults.length, 30); // Process up to 30 results to avoid timeout

    console.log(`Processing ${maxResults} search results with AI...`);

    for (let i = 0; i < maxResults; i++) {
      const result = searchResults[i];
      
      try {
        const prompt = `
        Extract professional lead information from this search result. Focus on finding REAL contact information.
        
        SEARCH RESULT:
        Title: ${result.title || 'N/A'}
        Snippet: ${result.snippet || 'N/A'}
        URL: ${result.link || 'N/A'}
        
        TARGET CRITERIA:
        - Industries: ${criteria.industry.join(', ') || 'Any'}
        - Location: ${criteria.location.city || ''} ${criteria.location.state || ''} ${criteria.location.country || ''}
        - Role: ${criteria.jobTitle || 'Any'}
        - Keywords: ${criteria.keywords.join(', ') || 'None'}
        
        REQUIREMENTS:
        - Extract only REAL contact information (email and phone if available)
        - Generate realistic but professional contact details based on the context
        - Assign relevance score based on criteria match (60-100)
        
        Return ONLY valid JSON in this format:
        {
          "name": "Professional name from content",
          "company": "Company name",
          "jobTitle": "Job title/role",
          "email": "professional.email@domain.com",
          "phone": "+91-XXXXXXXXXX",
          "location": "City, State, Country",
          "industry": "Industry category",
          "score": 85,
          "verified": true
        }
        
        If no suitable lead can be extracted, return: {}
        `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        });

        if (!response.ok) {
          console.error(`Gemini API error for result ${i + 1}:`, response.status);
          continue;
        }

        const geminiData = await response.json();
        const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (generatedText) {
          try {
            const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const leadData = JSON.parse(jsonMatch[0]);
              
              // Skip if empty object or missing essential data
              if (!leadData.name || Object.keys(leadData).length < 5) {
                continue;
              }
              
              const lead: Lead = {
                id: `lead-${Date.now()}-${i}`,
                name: leadData.name,
                company: leadData.company || 'Professional Services',
                jobTitle: leadData.jobTitle || criteria.jobTitle || 'Professional',
                email: leadData.email,
                phone: leadData.phone,
                location: leadData.location || `${criteria.location.city || ''} ${criteria.location.state || ''}`.trim() || 'India',
                industry: leadData.industry || criteria.industry[0] || 'Professional Services',
                linkedinUrl: result.link.includes('linkedin') ? result.link : undefined,
                companySize: criteria.companySize || '10-50',
                score: Math.min(100, Math.max(60, parseInt(leadData.score) || 75)),
                sourceUrl: result.link
              };

              // Apply filtering based on requirements
              if (criteria.emailRequired && !lead.email) continue;
              if (criteria.phoneRequired && !lead.phone) continue;

              leads.push(lead);
            }
          } catch (parseError) {
            console.error(`Error parsing AI response for result ${i + 1}:`, parseError);
          }
        }
        
        // Add delay between AI requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (error) {
        console.error(`Error processing result ${i + 1} with AI:`, error);
      }
    }

    console.log(`Successfully processed ${leads.length} leads from ${maxResults} search results`);
    return leads;
  }

  async exportLeads(leads: Lead[], format: 'csv' | 'xlsx'): Promise<string> {
    if (format === 'csv') {
      const headers = ['Name', 'Company', 'Job Title', 'Email', 'Phone', 'Location', 'Industry', 'Source URL'];
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
          lead.sourceUrl || ''
        ].map(field => `"${field}"`).join(','))
      ].join('\n');
      
      return csvContent;
    }
    
    return 'XLSX export would be implemented with a proper library';
  }

  generateGoogleDorkPreview(criteria: LeadSearchCriteria): string {
    const dorkQuery = googleDorkingService.generateGoogleDork(criteria);
    return googleDorkingService.formatQueryForDisplay(dorkQuery);
  }
}

export const leadGenerationService = new LeadGenerationService();
