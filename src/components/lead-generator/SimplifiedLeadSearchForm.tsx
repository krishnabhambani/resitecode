
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Target, MapPin, Briefcase, Clock, Globe, X } from 'lucide-react';
import { LeadSearchCriteria } from '@/lib/lead-types';

interface SimplifiedLeadSearchFormProps {
  searchCriteria: LeadSearchCriteria;
  onCriteriaChange: (criteria: LeadSearchCriteria) => void;
  onSearch: () => void;
  onPreviewDork: () => void;
  isSearching: boolean;
}

const SimplifiedLeadSearchForm: React.FC<SimplifiedLeadSearchFormProps> = ({
  searchCriteria,
  onCriteriaChange,
  onSearch,
  onPreviewDork,
  isSearching
}) => {
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Real Estate',
    'Manufacturing', 'Retail', 'Consulting', 'Digital Marketing', 'E-commerce',
    'EdTech', 'FinTech', 'Cybersecurity', 'AI/ML', 'SaaS'
  ];

  const timeRanges = [
    { value: 'h', label: '1 Hour' },
    { value: 'h10', label: '10 Hours' },
    { value: 'd', label: '1 Day' },
    { value: 'd3', label: '3 Days' },
    { value: 'w', label: '1 Week' },
    { value: 'm', label: '1 Month' },
    { value: 'y', label: '1 Year' }
  ];

  const availablePlatforms = [
    { id: 'linkedin', name: 'LinkedIn Profiles', domain: 'linkedin.com/in' },
    { id: 'reddit', name: 'Reddit Posts', domain: 'reddit.com' },
    { id: 'twitter', name: 'Twitter Profiles', domain: 'twitter.com' },
    { id: 'github', name: 'GitHub Profiles', domain: 'github.com' },
    { id: 'medium', name: 'Medium Articles', domain: 'medium.com' }
  ];

  const handleIndustryChange = (value: string) => {
    onCriteriaChange({
      ...searchCriteria,
      industry: [value]
    });
  };

  const handleLocationChange = (field: 'city' | 'state', value: string) => {
    onCriteriaChange({
      ...searchCriteria,
      location: { ...searchCriteria.location, [field]: value }
    });
  };

  const handleJobTitleChange = (value: string) => {
    onCriteriaChange({
      ...searchCriteria,
      jobTitle: value
    });
  };

  const handleTimeRangeChange = (value: string) => {
    onCriteriaChange({
      ...searchCriteria,
      timeRange: value
    });
  };

  const handleMaxPagesChange = (value: string) => {
    onCriteriaChange({
      ...searchCriteria,
      maxPages: parseInt(value)
    });
  };

  const handlePlatformToggle = (platformId: string, checked: boolean) => {
    const currentPlatforms = searchCriteria.targetPlatforms || ['linkedin', 'reddit', 'twitter'];
    let newPlatforms;
    
    if (checked) {
      newPlatforms = [...currentPlatforms, platformId];
    } else {
      newPlatforms = currentPlatforms.filter(p => p !== platformId);
    }
    
    onCriteriaChange({
      ...searchCriteria,
      targetPlatforms: newPlatforms
    });
  };

  const addCustomPlatform = (domain: string) => {
    if (domain.trim()) {
      const currentPlatforms = searchCriteria.targetPlatforms || [];
      onCriteriaChange({
        ...searchCriteria,
        targetPlatforms: [...currentPlatforms, domain.trim()]
      });
    }
  };

  const removeCustomPlatform = (platform: string) => {
    const currentPlatforms = searchCriteria.targetPlatforms || [];
    onCriteriaChange({
      ...searchCriteria,
      targetPlatforms: currentPlatforms.filter(p => p !== platform)
    });
  };

  const currentPlatforms = searchCriteria.targetPlatforms || ['linkedin', 'reddit', 'twitter'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-black/60 border-white/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <Target className="h-6 w-6 text-green-400" />
            Smart Lead Generator
          </CardTitle>
          <p className="text-gray-300">
            Find leads across multiple platforms using advanced Google dorking
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Industry Selection */}
          <div className="space-y-2">
            <Label className="text-white text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Target Industry *
            </Label>
            <Select 
              value={searchCriteria.industry[0] || ''} 
              onValueChange={handleIndustryChange}
            >
              <SelectTrigger className="bg-black/40 border-white/30 text-white">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/30">
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry} className="text-white hover:bg-white/10">
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <Label className="text-white text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">City *</Label>
                <Input
                  value={searchCriteria.location.city || ''}
                  onChange={(e) => handleLocationChange('city', e.target.value)}
                  placeholder="e.g., New York, Mumbai, London"
                  className="bg-black/40 border-white/30 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">State/Region</Label>
                <Input
                  value={searchCriteria.location.state || ''}
                  onChange={(e) => handleLocationChange('state', e.target.value)}
                  placeholder="e.g., California, Maharashtra"
                  className="bg-black/40 border-white/30 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Job Title */}
          <div className="space-y-2">
            <Label className="text-white text-lg">Target Role</Label>
            <Input
              value={searchCriteria.jobTitle}
              onChange={(e) => handleJobTitleChange(e.target.value)}
              placeholder="e.g., Software Engineer, Marketing Manager, CEO"
              className="bg-black/40 border-white/30 text-white placeholder:text-gray-400"
            />
          </div>

          {/* Target Platforms */}
          <div className="space-y-4">
            <Label className="text-white text-lg">Target Platforms</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availablePlatforms.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform.id}
                    checked={currentPlatforms.includes(platform.id)}
                    onCheckedChange={(checked) => handlePlatformToggle(platform.id, checked as boolean)}
                    className="border-white/30"
                  />
                  <Label htmlFor={platform.id} className="text-white text-sm">
                    {platform.name}
                  </Label>
                </div>
              ))}
            </div>
            
            {/* Custom Platform Input */}
            <div className="space-y-2">
              <Label className="text-white">Add Custom Platform</Label>
              <Input
                placeholder="e.g., stackoverflow.com, producthunt.com"
                className="bg-black/40 border-white/30 text-white placeholder:text-gray-400"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addCustomPlatform(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>

            {/* Selected Platforms */}
            {currentPlatforms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentPlatforms.map((platform) => (
                  <div key={platform} className="bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-1 flex items-center gap-2">
                    <span className="text-green-400 text-sm">
                      {availablePlatforms.find(p => p.id === platform)?.name || platform}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeCustomPlatform(platform)}
                      className="h-4 w-4 p-0 text-green-400 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Time Range and Search Pages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Range
              </Label>
              <Select 
                value={searchCriteria.timeRange || ''} 
                onValueChange={handleTimeRangeChange}
              >
                <SelectTrigger className="bg-black/40 border-white/30 text-white">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/30">
                  {timeRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value} className="text-white hover:bg-white/10">
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Search Pages
              </Label>
              <Select 
                value={searchCriteria.maxPages?.toString() || '3'} 
                onValueChange={handleMaxPagesChange}
              >
                <SelectTrigger className="bg-black/40 border-white/30 text-white">
                  <SelectValue placeholder="Select pages" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/30">
                  {[1, 2, 3, 5, 10].map((pages) => (
                    <SelectItem key={pages} value={pages.toString()} className="text-white hover:bg-white/10">
                      {pages} Page{pages > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={onPreviewDork}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Preview Search
            </Button>
            <Button
              onClick={onSearch}
              disabled={isSearching || (!searchCriteria.industry.length && !searchCriteria.location.city)}
              className="flex-1 bg-white hover:bg-gray-100 text-black font-medium py-3 text-lg"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Finding Leads...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Find Leads
                </>
              )}
            </Button>
          </div>

          {(!searchCriteria.industry.length && !searchCriteria.location.city) && (
            <p className="text-yellow-400 text-sm text-center">
              Please select at least an industry or location to start finding leads
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SimplifiedLeadSearchForm;
