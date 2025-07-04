
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, Phone, MapPin, Building, User, ExternalLink, 
  Download, Copy, Star, ArrowLeft
} from 'lucide-react';
import { Lead, LeadGenerationResult } from '@/lib/lead-types';
import { leadGenerationService } from '@/lib/lead-generation-service';
import { useToast } from '@/hooks/use-toast';

interface LeadsResultsProps {
  results: LeadGenerationResult;
  onBackToSearch: () => void;
}

const LeadsResults: React.FC<LeadsResultsProps> = ({ results, onBackToSearch }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'company'>('score');
  const { toast } = useToast();

  const sortedLeads = [...results.leads].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.score - a.score;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'company':
        return a.company.localeCompare(b.company);
      default:
        return 0;
    }
  });

  const handleCopyLead = (lead: Lead) => {
    const leadText = `${lead.name}\n${lead.company}\n${lead.jobTitle}\n${lead.email || 'Email not available'}\n${lead.phone || 'Phone not available'}\n${lead.location}`;
    navigator.clipboard.writeText(leadText);
    toast({
      title: "Lead Copied!",
      description: "Lead information has been copied to your clipboard.",
    });
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const csvContent = await leadGenerationService.exportLeads(results.leads, 'csv');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Export Successful!",
        description: "Your leads have been exported to a CSV file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export leads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatLocation = (location: any) => {
    if (typeof location === 'string') {
      return location;
    }
    if (typeof location === 'object' && location !== null) {
      const parts = [];
      if (location.city) parts.push(location.city);
      if (location.state) parts.push(location.state);
      if (location.country) parts.push(location.country);
      return parts.join(', ') || 'Location not specified';
    }
    return 'Location not specified';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card className="bg-black/60 border-white/30 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Star className="h-6 w-6 text-green-400" />
                Generated Leads ({results.totalCount})
              </CardTitle>
              <p className="text-gray-300 mt-2">
                AI-powered leads matching your search criteria
              </p>
            </div>
            <Button
              onClick={onBackToSearch}
              className="bg-white hover:bg-gray-100 text-black"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              New Search
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                {results.searchCriteria.industry.length > 0 ? results.searchCriteria.industry.join(', ') : 'All Industries'}
              </Badge>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                {formatLocation(results.searchCriteria.location)}
              </Badge>
              {results.searchCriteria.companySize && (
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                  {results.searchCriteria.companySize} employees
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-black/40 border border-white/30 text-white rounded px-3 py-1 text-sm"
              >
                <option value="score">Sort by Match Score</option>
                <option value="name">Sort by Name</option>
                <option value="company">Sort by Company</option>
              </select>
              <Button
                onClick={handleExportCSV}
                disabled={isExporting}
                size="sm"
                className="bg-white hover:bg-gray-100 text-black"
              >
                {isExporting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      {results.leads.length === 0 ? (
        <Card className="bg-black/60 border-white/30 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <p className="text-gray-300 text-lg">
              No leads found matching your criteria. Try adjusting your search parameters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedLeads.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="bg-black/60 border-white/30 backdrop-blur-sm hover:border-green-400/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{lead.name}</h3>
                        <div className={`px-2 py-1 rounded text-xs text-white ${getScoreColor(lead.score)}`}>
                          {lead.score}% Match
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-300">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-green-400" />
                          <span>{lead.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-400" />
                          <span>{lead.jobTitle}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-purple-400" />
                          <span>{lead.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-white/30 text-white">
                            {lead.industry}
                          </Badge>
                          <Badge variant="outline" className="border-white/30 text-white">
                            {lead.companySize} employees
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleCopyLead(lead)}
                      size="sm"
                      className="bg-white hover:bg-gray-100 text-black"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>

                  {/* Contact Information */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-white/20">
                    {lead.email ? (
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        <span>{lead.email}</span>
                      </a>
                    ) : (
                      <span className="flex items-center gap-2 text-gray-500">
                        <Mail className="h-4 w-4" />
                        <span>Email not available</span>
                      </span>
                    )}
                    
                    {lead.phone ? (
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        <span>{lead.phone}</span>
                      </a>
                    ) : (
                      <span className="flex items-center gap-2 text-gray-500">
                        <Phone className="h-4 w-4" />
                        <span>Phone not available</span>
                      </span>
                    )}
                    
                    {lead.linkedinUrl && (
                      <a
                        href={lead.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default LeadsResults;
