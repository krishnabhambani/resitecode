
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Target, Plus, X, MapPin, Briefcase, Code, Tags } from 'lucide-react';
import { LeadSearchCriteria } from '@/lib/lead-types';

interface AdvancedLeadSearchFormProps {
  searchCriteria: LeadSearchCriteria;
  onCriteriaChange: (criteria: LeadSearchCriteria) => void;
  onSearch: () => void;
  onPreviewDork: () => void;
  isSearching: boolean;
}

const AdvancedLeadSearchForm: React.FC<AdvancedLeadSearchFormProps> = ({
  searchCriteria,
  onCriteriaChange,
  onSearch,
  onPreviewDork,
  isSearching
}) => {
  const [newIndustry, setNewIndustry] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newCustomTag, setNewCustomTag] = useState('');

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Real Estate',
    'Manufacturing', 'Retail', 'Consulting', 'Digital Marketing', 'E-commerce',
    'EdTech', 'FinTech', 'Cybersecurity', 'AI/ML', 'Blockchain', 'SaaS',
    'Construction', 'Food & Beverage', 'Automotive', 'Legal Services'
  ];

  const fields = [
    'Software Development', 'Data Science', 'Digital Marketing', 'Sales',
    'Product Management', 'Design (UI/UX)', 'DevOps', 'Cybersecurity',
    'AI/Machine Learning', 'Business Development', 'Content Marketing',
    'HR/Recruiting', 'Finance', 'Operations', 'Customer Success'
  ];

  const companySizes = ['1-10', '10-50', '50-100', '100-500', '500-1000', '1000+'];

  const addIndustry = () => {
    if (newIndustry && !searchCriteria.industry.includes(newIndustry)) {
      onCriteriaChange({
        ...searchCriteria,
        industry: [...searchCriteria.industry, newIndustry]
      });
      setNewIndustry('');
    }
  };

  const removeIndustry = (industry: string) => {
    onCriteriaChange({
      ...searchCriteria,
      industry: searchCriteria.industry.filter(i => i !== industry)
    });
  };

  const addKeyword = () => {
    if (newKeyword && !searchCriteria.keywords.includes(newKeyword)) {
      onCriteriaChange({
        ...searchCriteria,
        keywords: [...searchCriteria.keywords, newKeyword]
      });
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    onCriteriaChange({
      ...searchCriteria,
      keywords: searchCriteria.keywords.filter(k => k !== keyword)
    });
  };

  const addCustomTag = () => {
    if (newCustomTag && !searchCriteria.customTags.includes(newCustomTag)) {
      onCriteriaChange({
        ...searchCriteria,
        customTags: [...searchCriteria.customTags, newCustomTag]
      });
      setNewCustomTag('');
    }
  };

  const removeCustomTag = (tag: string) => {
    onCriteriaChange({
      ...searchCriteria,
      customTags: searchCriteria.customTags.filter(t => t !== tag)
    });
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
            Smart Lead Generation Assistant
          </CardTitle>
          <p className="text-gray-300">
            Dynamic Google Dorking-based lead generation with real-time data extraction
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Industries Section */}
          <div className="space-y-4">
            <Label className="text-white text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Target Industries
            </Label>
            <div className="flex gap-2">
              <Select value={newIndustry} onValueChange={setNewIndustry}>
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
              <Button onClick={addIndustry} size="sm" className="bg-white hover:bg-gray-100 text-black">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchCriteria.industry.map((industry) => (
                <Badge key={industry} className="bg-green-500/20 text-green-400 flex items-center gap-1">
                  {industry}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeIndustry(industry)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <Label className="text-white text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Hierarchy
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-white">City</Label>
                <Input
                  value={searchCriteria.location.city || ''}
                  onChange={(e) => onCriteriaChange({
                    ...searchCriteria,
                    location: { ...searchCriteria.location, city: e.target.value }
                  })}
                  placeholder="e.g., Lucknow, Prayagraj"
                  className="bg-black/40 border-white/30 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">State</Label>
                <Input
                  value={searchCriteria.location.state || ''}
                  onChange={(e) => onCriteriaChange({
                    ...searchCriteria,
                    location: { ...searchCriteria.location, state: e.target.value }
                  })}
                  placeholder="e.g., Uttar Pradesh"
                  className="bg-black/40 border-white/30 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Country</Label>
                <Input
                  value={searchCriteria.location.country || ''}
                  onChange={(e) => onCriteriaChange({
                    ...searchCriteria,
                    location: { ...searchCriteria.location, country: e.target.value }
                  })}
                  placeholder="e.g., India"
                  className="bg-black/40 border-white/30 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Role and Field */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white">Target Role</Label>
              <Input
                value={searchCriteria.jobTitle}
                onChange={(e) => onCriteriaChange({
                  ...searchCriteria,
                  jobTitle: e.target.value
                })}
                placeholder="e.g., Hiring Manager, Backend Developer"
                className="bg-black/40 border-white/30 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Field/Domain</Label>
              <Select 
                value={searchCriteria.field} 
                onValueChange={(value) => onCriteriaChange({
                  ...searchCriteria,
                  field: value
                })}
              >
                <SelectTrigger className="bg-black/40 border-white/30 text-white">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/30">
                  {fields.map((field) => (
                    <SelectItem key={field} value={field} className="text-white hover:bg-white/10">
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Keywords Section */}
          <div className="space-y-4">
            <Label className="text-white text-lg flex items-center gap-2">
              <Code className="h-5 w-5" />
              Additional Keywords
            </Label>
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="e.g., remote, Python, outsourcing"
                className="bg-black/40 border-white/30 text-white placeholder:text-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              />
              <Button onClick={addKeyword} size="sm" className="bg-white hover:bg-gray-100 text-black">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchCriteria.keywords.map((keyword) => (
                <Badge key={keyword} className="bg-blue-500/20 text-blue-400 flex items-center gap-1">
                  {keyword}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeKeyword(keyword)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Custom Tags Section */}
          <div className="space-y-4">
            <Label className="text-white text-lg flex items-center gap-2">
              <Tags className="h-5 w-5" />
              Custom Tags (Fully Editable)
            </Label>
            <div className="flex gap-2">
              <Input
                value={newCustomTag}
                onChange={(e) => setNewCustomTag(e.target.value)}
                placeholder="e.g., freelancer platforms, startup funding"
                className="bg-black/40 border-white/30 text-white placeholder:text-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
              />
              <Button onClick={addCustomTag} size="sm" className="bg-white hover:bg-gray-100 text-black">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchCriteria.customTags.map((tag) => (
                <Badge key={tag} className="bg-purple-500/20 text-purple-400 flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeCustomTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white">Company Size</Label>
              <Select 
                value={searchCriteria.companySize} 
                onValueChange={(value) => onCriteriaChange({
                  ...searchCriteria,
                  companySize: value
                })}
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
            <div className="space-y-2">
              <Label className="text-white">Search Depth (Pages)</Label>
              <Select 
                value={searchCriteria.searchDepth?.toString() || '3'} 
                onValueChange={(value) => onCriteriaChange({
                  ...searchCriteria,
                  searchDepth: parseInt(value)
                })}
              >
                <SelectTrigger className="bg-black/40 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/30">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()} className="text-white hover:bg-white/10">
                      {num} page{num > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Requirements */}
          <div className="space-y-4">
            <Label className="text-white text-lg">Contact Requirements</Label>
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emailRequired"
                  checked={searchCriteria.emailRequired}
                  onCheckedChange={(checked) => onCriteriaChange({
                    ...searchCriteria,
                    emailRequired: !!checked
                  })}
                  className="border-white/30"
                />
                <Label htmlFor="emailRequired" className="text-white">
                  Email Required ✅
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="phoneRequired"
                  checked={searchCriteria.phoneRequired}
                  onCheckedChange={(checked) => onCriteriaChange({
                    ...searchCriteria,
                    phoneRequired: !!checked
                  })}
                  className="border-white/30"
                />
                <Label htmlFor="phoneRequired" className="text-white">
                  Phone Required ✅
                </Label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={onPreviewDork}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Preview Google Dork
            </Button>
            <Button
              onClick={onSearch}
              disabled={isSearching || (searchCriteria.industry.length === 0 && !searchCriteria.location.city)}
              className="flex-1 bg-white hover:bg-gray-100 text-black font-medium py-3 text-lg"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Crawling Pages 1-{searchCriteria.searchDepth || 3}...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Generate Smart Leads
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdvancedLeadSearchForm;
