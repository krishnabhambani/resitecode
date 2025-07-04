
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ReportFormData, REPORT_TYPES, ACADEMIC_LEVELS } from '../../lib/report-types';
import { FileText, Sparkles } from 'lucide-react';

interface ReportInputFormProps {
  formData: ReportFormData;
  onFormChange: (field: keyof ReportFormData, value: string | number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const ReportInputForm: React.FC<ReportInputFormProps> = ({
  formData,
  onFormChange,
  onGenerate,
  isGenerating
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="bg-black/70 border-white/30 backdrop-blur-sm">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <FileText className="h-8 w-8 text-green-400" />
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              Report Generator
            </CardTitle>
          </motion.div>
          <p className="text-gray-300 text-lg">
            Create comprehensive academic reports with AI-powered content generation
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Report Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white font-medium">
                Report Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => onFormChange('title', e.target.value)}
                placeholder="Enter report title"
                className="bg-black/50 border-white/30 text-white placeholder-gray-400"
              />
            </div>

            {/* Subject/Topic */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-white font-medium">
                Subject/Topic *
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => onFormChange('subject', e.target.value)}
                placeholder="Enter subject or topic"
                className="bg-black/50 border-white/30 text-white placeholder-gray-400"
              />
            </div>

            {/* Institution */}
            <div className="space-y-2">
              <Label htmlFor="institution" className="text-white font-medium">
                Institution/College Name
              </Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => onFormChange('institution', e.target.value)}
                placeholder="Enter institution name (optional)"
                className="bg-black/50 border-white/30 text-white placeholder-gray-400"
              />
            </div>

            {/* Author Name */}
            <div className="space-y-2">
              <Label htmlFor="author" className="text-white font-medium">
                Author Name *
              </Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => onFormChange('author', e.target.value)}
                placeholder="Enter author name"
                className="bg-black/50 border-white/30 text-white placeholder-gray-400"
              />
            </div>

            {/* Word Count */}
            <div className="space-y-2">
              <Label htmlFor="wordCount" className="text-white font-medium">
                Target Word Count *
              </Label>
              <Input
                id="wordCount"
                type="number"
                value={formData.wordCount}
                onChange={(e) => onFormChange('wordCount', parseInt(e.target.value) || 0)}
                placeholder="Enter word count"
                min="500"
                max="10000"
                className="bg-black/50 border-white/30 text-white placeholder-gray-400"
              />
            </div>

            {/* Academic Level */}
            <div className="space-y-2">
              <Label className="text-white font-medium">
                Academic Level *
              </Label>
              <Select
                value={formData.academicLevel}
                onValueChange={(value) => onFormChange('academicLevel', value)}
              >
                <SelectTrigger className="bg-black/50 border-white/30 text-white">
                  <SelectValue placeholder="Select academic level" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/30">
                  {ACADEMIC_LEVELS.map((level) => (
                    <SelectItem key={level} value={level} className="text-white hover:bg-white/10">
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Report Type */}
          <div className="space-y-2">
            <Label className="text-white font-medium">
              Report Type *
            </Label>
            <Select
              value={formData.reportType}
              onValueChange={(value) => onFormChange('reportType', value)}
            >
              <SelectTrigger className="bg-black/50 border-white/30 text-white">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/30">
                {REPORT_TYPES.map((type) => (
                  <SelectItem key={type} value={type} className="text-white hover:bg-white/10">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Instructions */}
          <div className="space-y-2">
            <Label htmlFor="customInstructions" className="text-white font-medium">
              Additional Instructions/Context
            </Label>
            <Textarea
              id="customInstructions"
              value={formData.customInstructions}
              onChange={(e) => onFormChange('customInstructions', e.target.value)}
              placeholder="Provide specific points, instructions, structure, or data you want included (optional)"
              rows={4}
              className="bg-black/50 border-white/30 text-white placeholder-gray-400 resize-none"
            />
          </div>

          {/* Generate Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex justify-center pt-4"
          >
            <Button
              onClick={onGenerate}
              disabled={isGenerating || !formData.title || !formData.subject || !formData.author}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-semibold px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Report
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReportInputForm;
