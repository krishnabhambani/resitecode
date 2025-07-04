
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Target, Users, MapPin } from 'lucide-react';
import { LeadSearchCriteria } from '@/lib/lead-types';

interface LeadSearchFormProps {
  searchCriteria: LeadSearchCriteria;
  onCriteriaChange: (field: keyof LeadSearchCriteria, value: any) => void;
  onSearch: () => void;
  isSearching: boolean;
}

const LeadSearchForm: React.FC<LeadSearchFormProps> = ({
  searchCriteria,
  onCriteriaChange,
  onSearch,
  isSearching
}) => {
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Real Estate',
    'Manufacturing', 'Retail', 'Consulting', 'Digital Marketing', 'E-commerce',
    'Construction', 'Food & Beverage', 'Automotive', 'Legal Services', 'Travel & Tourism'
  ];

  const companySizes = [
    '1-10', '10-50', '50-100', '100-500', '500-1000', '1000+'
  ];

  const handleIndustryChange = (value: string) => {
    onCriteriaChange('industry', [value]);
  };

  const handleLocationChange = (field: 'city' | 'state' | 'country', value: string) => {
    const newLocation = { ...searchCriteria.location, [field]: value };
    onCriteriaChange('location', newLocation);
  };

  const handleKeywordsChange = (value: string) => {
    const keywords = value.split(',').map(k => k.trim()).filter(k => k);
    onCriteriaChange('keywords', keywords);
  };

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
            AI-Powered Lead Generation
          </CardTitle>
          <p className="text-gray-300">
            Generate real leads from across the web using advanced AI and search technology
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-white flex items-center gap-2">
                <Users className="h-4 w-4" />
                Industry *
              </Label>
              <Select 
                value={searchCriteria.industry[0] || ''} 
                onValueChange={handleIndustryChange}
              >
                <SelectTrigger className="bg-black/40 border-white/30 text-white">
                  <SelectValue placeholder="Select target industry" />
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

            {/* Location - City */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-white flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                City *
              </Label>
              <Input
                id="city"
                value={searchCriteria.location.city || ''}
                onChange={(e) => handleLocationChange('city', e.target.value)}
                placeholder="e.g., Lucknow"
                className="bg-black/40 border-white/30 text-white placeholder:text-gray-400"
              />
            </div>

            {/* Location - State */}
            <div className="space-y-2">
              <Label htmlFor="state" className="text-white">State</Label>
              <Input
                id="state"
                value={searchCriteria.location.state || ''}
                onChange={(e) => handleLocationChange('state', e.target.value)}
                placeholder="e.g., Uttar Pradesh"
                className="bg-black/40 border-white/30 text-white placeholder:text-gray-400"
              />
            </div>

            {/* Location - Country */}
            <div className="space-y-2">
              <Label htmlFor="country" className="text-white">Country</Label>
              <Input
                id="country"
                value={searchCriteria.location.country || ''}
                onChange={(e) => handleLocationChange('country', e.target.value)}
                placeholder="e.g., India"
                className="bg-black/40 border-white/30 text-white placeholder:text-gray-400"
              />
            </div>

            {/* Company Size */}
            <div className="space-y-2">
              <Label htmlFor="companySize" className="text-white">Company Size</Label>
              <Select 
                value={searchCriteria.companySize} 
                onValueChange={(value) => onCriteriaChange('companySize', value)}
              >
                <SelectTrigger className="bg-black/40 border-white/30 text-white">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/30">
                  {companySizes.map((size) => (
                    <SelectItem key={size} value={size} className="text-white hover:bg-white/10">
                      {size} employees
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-white">Target Role</Label>
              <Input
                id="jobTitle"
                value={searchCriteria.jobTitle}
                onChange={(e) => onCriteriaChange('jobTitle', e.target.value)}
                placeholder="e.g., CEO, Marketing Manager, Owner"
                className="bg-black/40 border-white/30 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label htmlFor="keywords" className="text-white">Additional Keywords</Label>
            <Textarea
              id="keywords"
              value={searchCriteria.keywords.join(', ')}
              onChange={(e) => handleKeywordsChange(e.target.value)}
              placeholder="Enter specific services, products, or company names..."
              className="bg-black/40 border-white/30 text-white placeholder:text-gray-400"
            />
          </div>

          {/* Contact Requirements */}
          <div className="space-y-4">
            <Label className="text-white text-lg">Contact Requirements</Label>
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emailRequired"
                  checked={searchCriteria.emailRequired}
                  onCheckedChange={(checked) => onCriteriaChange('emailRequired', !!checked)}
                  className="border-white/30"
                />
                <Label htmlFor="emailRequired" className="text-white">
                  Email Required
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="phoneRequired"
                  checked={searchCriteria.phoneRequired}
                  onCheckedChange={(checked) => onCriteriaChange('phoneRequired', !!checked)}
                  className="border-white/30"
                />
                <Label htmlFor="phoneRequired" className="text-white">
                  Phone Required
                </Label>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={onSearch}
            disabled={isSearching || (searchCriteria.industry.length === 0 && !searchCriteria.location.city)}
            className="w-full bg-white hover:bg-gray-100 text-black font-medium py-3 text-lg"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                Generating Leads...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Generate Real Leads
              </>
            )}
          </Button>
          
          {(searchCriteria.industry.length === 0 && !searchCriteria.location.city) && (
            <p className="text-yellow-400 text-sm text-center">
              Please select at least an industry or location to start generating leads
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LeadSearchForm;
