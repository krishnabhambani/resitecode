import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LeadSearchCriteria, LeadGenerationResult } from '@/lib/lead-types';
import { newLeadGenerationService } from '@/lib/new-lead-generation-service';
import SimplifiedLeadSearchForm from './SimplifiedLeadSearchForm';
import LeadsResults from './LeadsResults';
import GoogleDorkPreview from './GoogleDorkPreview';
import { useToast } from '@/hooks/use-toast';

const LeadGeneratorApp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'search' | 'results'>('search');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<LeadGenerationResult | null>(null);
  const [showDorkPreview, setShowDorkPreview] = useState(false);
  const [dorkPreview, setDorkPreview] = useState('');
  const { toast } = useToast();

  const [searchCriteria, setSearchCriteria] = useState<LeadSearchCriteria>({
    industry: [],
    location: {
      city: '',
      state: '',
    },
    companySize: '',
    jobTitle: '',
    keywords: [],
    field: '',
    customTags: [],
    emailRequired: true,
    phoneRequired: false,
    searchDepth: 3,
    timeRange: 'w', // Default to 1 week
    maxPages: 3, // Default to 3 pages
    targetPlatforms: ['linkedin', 'reddit', 'twitter'] // Default platforms
  });

  const handleCriteriaChange = (criteria: LeadSearchCriteria) => {
    console.log('🔄 Criteria changed:', criteria);
    setSearchCriteria(criteria);
  };

  const handlePreviewDork = () => {
    try {
      const preview = newLeadGenerationService.generateDorkPreview(searchCriteria);
      setDorkPreview(preview);
      setShowDorkPreview(true);
    } catch (error) {
      toast({
        title: "Preview Error",
        description: "Unable to generate Google Dork preview. Please check your search criteria.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async () => {
    console.log('🎯 Starting comprehensive search with criteria:', searchCriteria);
    
    if (searchCriteria.industry.length === 0 && !searchCriteria.location.city) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least one search criteria (Industry or Location).",
        variant: "destructive",
      });
      return;
    }

    if (!searchCriteria.targetPlatforms || searchCriteria.targetPlatforms.length === 0) {
      toast({
        title: "No Platforms Selected",
        description: "Please select at least one platform to search.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      toast({
        title: "🚀 Advanced Multi-Platform Search Started",
        description: `Searching ${searchCriteria.targetPlatforms.length} platforms with ${searchCriteria.maxPages} pages each for comprehensive lead data...`,
      });

      const searchResults = await newLeadGenerationService.generateLeads(searchCriteria);
      console.log('📊 Search completed:', searchResults);
      
      setResults(searchResults);
      setCurrentStep('results');
      
      toast({
        title: searchResults.totalCount > 0 ? "🎯 Quality Leads Found!" : "🔍 Search Completed",
        description: searchResults.totalCount > 0 
          ? `Found ${searchResults.totalCount} qualified leads with contact information across ${searchCriteria.targetPlatforms.length} platforms.`
          : "No leads found with current criteria. Try adjusting your search parameters or adding more platforms.",
      });
    } catch (error) {
      console.error('❌ Error generating leads:', error);
      toast({
        title: "Search Failed",
        description: "Failed to generate leads. Please check your API configuration and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleBackToSearch = () => {
    setCurrentStep('search');
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 pb-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto max-w-4xl"
      >
        {currentStep === 'search' ? (
          <SimplifiedLeadSearchForm
            searchCriteria={searchCriteria}
            onCriteriaChange={handleCriteriaChange}
            onSearch={handleSearch}
            onPreviewDork={handlePreviewDork}
            isSearching={isSearching}
          />
        ) : (
          results && (
            <LeadsResults
              results={results}
              onBackToSearch={handleBackToSearch}
            />
          )
        )}

        {showDorkPreview && (
          <GoogleDorkPreview
            dorkPreview={dorkPreview}
            onClose={() => setShowDorkPreview(false)}
          />
        )}
      </motion.div>
    </div>
  );
};

export default LeadGeneratorApp;
