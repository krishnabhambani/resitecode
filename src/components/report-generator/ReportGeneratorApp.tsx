
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ReportFormData, GeneratedReport } from '../../lib/report-types';
import { reportGeneratorService } from '../../lib/gemini-report-service';
import ReportInputForm from './ReportInputForm';
import ReportPreview from './ReportPreview';
import { useToast } from '@/hooks/use-toast';

const ReportGeneratorApp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'form' | 'preview'>('form');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<ReportFormData>({
    title: '',
    subject: '',
    institution: '',
    author: '',
    wordCount: 1500,
    academicLevel: 'UG',
    reportType: 'Assignment Report',
    customInstructions: ''
  });

  const handleFormChange = (field: keyof ReportFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerateReport = async () => {
    if (!formData.title || !formData.subject || !formData.author) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Title, Subject, and Author).",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const report = await reportGeneratorService.generateReport(formData);
      setGeneratedReport(report);
      setCurrentStep('preview');
      toast({
        title: "Report Generated Successfully!",
        description: "Your academic report has been created. You can now review and customize it.",
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate the report. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto"
      >
        {currentStep === 'form' ? (
          <ReportInputForm
            formData={formData}
            onFormChange={handleFormChange}
            onGenerate={handleGenerateReport}
            isGenerating={isGenerating}
          />
        ) : (
          generatedReport && (
            <ReportPreview
              report={generatedReport}
              formData={formData}
              onBack={handleBackToForm}
            />
          )
        )}
      </motion.div>
    </div>
  );
};

export default ReportGeneratorApp;
