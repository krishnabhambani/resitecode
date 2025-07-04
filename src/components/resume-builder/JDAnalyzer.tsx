
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, ArrowRight, SkipForward } from "lucide-react";
import { JDAnalysis } from "@/lib/resume-types";
import { geminiResumeService } from "@/lib/gemini-resume-service";
import { useToast } from "@/hooks/use-toast";

interface JDAnalyzerProps {
  onAnalyzed: (analysis: JDAnalysis) => void;
  onSkip: () => void;
}

export function JDAnalyzer({ onAnalyzed, onSkip }: JDAnalyzerProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<JDAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeJD = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please paste a job description to analyze.",
        variant: "destructive"
      });
      return;
    }

    try {
      setAnalyzing(true);
      const result = await geminiResumeService.analyzeJobDescription(jobDescription);
      setAnalysis(result);
      console.log("JD Analysis result:", result);
    } catch (error) {
      console.error("JD Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze job description. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const proceedWithAnalysis = () => {
    if (analysis) {
      onAnalyzed(analysis);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Job Description Analysis</h1>
          <p className="text-gray-300">
            Paste the job description below to get AI-powered insights for your resume optimization.
          </p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Paste Job Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste the complete job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              className="bg-gray-700 border-gray-600 text-white"
            />
            
            <div className="flex gap-4">
              <Button 
                onClick={analyzeJD}
                disabled={analyzing || !jobDescription.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing JD...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>
              
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Don't have a Job Description?</p>
                <Button 
                  onClick={onSkip}
                  variant="outline"
                  className="bg-white text-black hover:bg-gray-100 border-none"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Continue Without JD
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {analysis && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-green-400 mb-3">Key Skills Required</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keySkills.map((skill, index) => (
                    <Badge key={index} className="bg-green-600 text-white">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-blue-400 mb-3">Tools & Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.tools.map((tool, index) => (
                    <Badge key={index} className="bg-blue-600 text-white">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-purple-400 mb-3">Key Responsibilities</h4>
                <ul className="space-y-1">
                  {analysis.responsibilities.map((responsibility, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-yellow-400 mb-3">Suggested Professional Summary</h4>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-300 italic">{analysis.suggestedSummary}</p>
                </div>
              </div>

              <Button 
                onClick={proceedWithAnalysis}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Continue to Resume Builder
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
