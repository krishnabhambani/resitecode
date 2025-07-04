
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JDAnalyzer } from "./JDAnalyzer";
import { ResumeForm } from "./ResumeForm";
import { ResumePreview } from "./ResumePreview";
import { ADSOptimizer } from "./ADSOptimizer";
import { ResumeData, JDAnalysis } from "@/lib/resume-types";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ResumeBuilderApp() {
  const [currentStep, setCurrentStep] = useState<'jd' | 'form' | 'preview' | 'optimize'>('jd');
  const [jdAnalysis, setJDAnalysis] = useState<JDAnalysis | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [originalResumeData, setOriginalResumeData] = useState<ResumeData | null>(null);
  const [adsScore, setAdsScore] = useState<number | null>(null);
  const { toast } = useToast();

  const handleJDAnalyzed = (analysis: JDAnalysis) => {
    setJDAnalysis(analysis);
    setCurrentStep('form');
    toast({
      title: "Job Description Analyzed",
      description: "AI has extracted key insights. Now build your resume!"
    });
  };

  const handleSkipJD = () => {
    setCurrentStep('form');
    toast({
      title: "Starting Resume Builder",
      description: "Creating your resume from scratch!"
    });
  };

  const handleResumeCreated = (data: ResumeData) => {
    setResumeData(data);
    setOriginalResumeData(data); // Store original version
    setCurrentStep('preview');
    toast({
      title: "Resume Created",
      description: "Your resume is ready for preview and optimization!"
    });
  };

  const handleOptimizeResume = () => {
    setCurrentStep('optimize');
  };

  const handleResumeOptimized = (optimizedData: ResumeData) => {
    setResumeData(optimizedData);
    toast({
      title: "Resume Optimized",
      description: "Your resume has been enhanced with AI recommendations!"
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Tabs value={currentStep} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 mb-8">
          <TabsTrigger 
            value="jd" 
            onClick={() => setCurrentStep('jd')}
            className="text-white data-[state=active]:bg-green-600"
          >
            1. Analyze JD
          </TabsTrigger>
          <TabsTrigger 
            value="form" 
            disabled={currentStep === 'jd'}
            onClick={() => setCurrentStep('form')}
            className="text-white data-[state=active]:bg-green-600"
          >
            2. Build Resume
          </TabsTrigger>
          <TabsTrigger 
            value="preview" 
            disabled={!resumeData}
            onClick={() => setCurrentStep('preview')}
            className="text-white data-[state=active]:bg-green-600"
          >
            3. Preview
          </TabsTrigger>
          <TabsTrigger 
            value="optimize" 
            disabled={!resumeData}
            onClick={() => setCurrentStep('optimize')}
            className="text-white data-[state=active]:bg-green-600"
          >
            4. Optimize
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="jd" className="mt-0">
            <motion.div
              key="jd"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <JDAnalyzer 
                onAnalyzed={handleJDAnalyzed}
                onSkip={handleSkipJD}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="form" className="mt-0">
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ResumeForm 
                jdAnalysis={jdAnalysis}
                onResumeCreated={handleResumeCreated}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ResumePreview 
                resumeData={resumeData!}
                onOptimize={handleOptimizeResume}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="optimize" className="mt-0">
            <motion.div
              key="optimize"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ADSOptimizer 
                resumeData={resumeData!}
                originalResumeData={originalResumeData!}
                jdAnalysis={jdAnalysis}
                onOptimized={handleResumeOptimized}
              />
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
