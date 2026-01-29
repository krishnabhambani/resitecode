
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Zap, Download, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { ResumeData, JDAnalysis, ADSOptimization } from "@/lib/resume-types";
import { geminiResumeService } from "@/lib/gemini-resume-service";
import { useToast } from "@/hooks/use-toast";

interface ADSOptimizerProps {
  resumeData: ResumeData;
  originalResumeData: ResumeData;
  jdAnalysis: JDAnalysis | null;
  onOptimized: (optimizedData: ResumeData) => void;
}

export function ADSOptimizer({ resumeData, originalResumeData, jdAnalysis, onOptimized }: ADSOptimizerProps) {
  const [adsScore, setAdsScore] = useState<ADSOptimization | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedResume, setOptimizedResume] = useState<ResumeData | null>(null);
  const [isDownloadingOriginal, setIsDownloadingOriginal] = useState(false);
  const [isDownloadingOptimized, setIsDownloadingOptimized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    calculateADS();
  }, []);

  const calculateADS = async () => {
    setIsAnalyzing(true);
    try {
      const score = await geminiResumeService.calculateADSScore(resumeData, jdAnalysis);
      setAdsScore(score);
    } catch (error) {
      console.error("ADS calculation failed:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to calculate ADS score. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const optimized = await geminiResumeService.optimizeResume(resumeData, jdAnalysis);
      setOptimizedResume(optimized);
      onOptimized(optimized);
      toast({
        title: "Resume Optimized",
        description: "Your resume has been enhanced with AI recommendations!"
      });
    } catch (error) {
      console.error("Optimization failed:", error);
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDownloadPDF = async (resumeToDownload: ResumeData, isOriginal: boolean = false) => {
    const setDownloadState = isOriginal ? setIsDownloadingOriginal : setIsDownloadingOptimized;
    try {
      setDownloadState(true);
      
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Popup blocked');
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${resumeToDownload.personalInfo.fullName} - Resume${isOriginal ? ' (Original)' : ' (AI Optimized)'}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Calibri', 'Arial', sans-serif; 
              font-size: 11pt; 
              line-height: 1.4; 
              color: #333; 
              background: white; 
              padding: 40px;
            }
            .header { text-align: center; margin-bottom: 30px; }
            .name { font-size: 24pt; font-weight: bold; color: #2c3e50; margin-bottom: 8px; }
            .contact { font-size: 10pt; color: #666; margin-bottom: 4px; }
            .contact a { color: #2980b9; text-decoration: none; }
            .section { margin-bottom: 25px; }
            .section-title { 
              font-size: 14pt; 
              font-weight: bold; 
              color: #2c3e50; 
              border-bottom: 2px solid #3498db; 
              padding-bottom: 4px; 
              margin-bottom: 12px; 
              text-transform: uppercase;
            }
            .experience-item, .project-item, .achievement-item { margin-bottom: 15px; }
            .job-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
            .job-title { font-weight: bold; font-size: 12pt; }
            .company { font-weight: 600; color: #555; }
            .duration-location { text-align: right; font-size: 10pt; color: #666; }
            .description ul { margin-left: 18px; margin-top: 4px; }
            .description li { margin-bottom: 3px; }
            .skills-grid { display: grid; grid-template-columns: 1fr; gap: 4px; }
            .skill-category { margin-bottom: 6px; }
            .skill-label { font-weight: bold; display: inline; margin-right: 8px; }
            .skill-list { display: inline; }
            .project-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
            .project-title { font-weight: bold; }
            .project-link { color: #2980b9; text-decoration: none; font-size: 10pt; }
            @media print {
              body { padding: 20px; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="name">${resumeToDownload.personalInfo.fullName}</div>
            <div class="contact">
              ${resumeToDownload.personalInfo.phone ? `${resumeToDownload.personalInfo.phone} • ` : ''}
              ${resumeToDownload.personalInfo.email || ''}
            </div>
            <div class="contact">
              ${resumeToDownload.personalInfo.linkedin ? `<a href="${resumeToDownload.personalInfo.linkedin}">LinkedIn</a> • ` : ''}
              ${resumeToDownload.personalInfo.github ? `<a href="${resumeToDownload.personalInfo.github}">GitHub</a> • ` : ''}
              ${resumeToDownload.personalInfo.portfolio ? `<a href="${resumeToDownload.personalInfo.portfolio}">Portfolio</a>` : ''}
            </div>
          </div>

          ${resumeToDownload.summary ? `
          <div class="section">
            <div class="section-title">Professional Summary</div>
            <p>${resumeToDownload.summary}</p>
          </div>
          ` : ''}

          ${resumeToDownload.education.degree ? `
          <div class="section">
            <div class="section-title">Education</div>
            <div class="experience-item">
              <div class="job-header">
                <div>
                  <div class="job-title">${resumeToDownload.education.degree}</div>
                  <div class="company">${resumeToDownload.education.university}</div>
                </div>
                <div class="duration-location">
                  <div>${resumeToDownload.education.duration}</div>
                  <div>${resumeToDownload.education.location}</div>
                </div>
              </div>
            </div>
          </div>
          ` : ''}

          ${resumeToDownload.experience.length > 0 && resumeToDownload.experience[0].title ? `
          <div class="section">
            <div class="section-title">Experience</div>
            ${resumeToDownload.experience.map(exp => `
              <div class="experience-item">
                <div class="job-header">
                  <div>
                    <div class="job-title">${exp.title}</div>
                    <div class="company">${exp.company}</div>
                  </div>
                  <div class="duration-location">
                    <div>${exp.duration}</div>
                    <div>${exp.location}</div>
                  </div>
                </div>
                <div class="description">
                  <ul>
                    ${exp.description.map(desc => `<li>${desc.replace(/^•\s*/, '')}</li>`).join('')}
                  </ul>
                </div>
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${resumeToDownload.projects.length > 0 && resumeToDownload.projects[0].title ? `
          <div class="section">
            <div class="section-title">Projects</div>
            ${resumeToDownload.projects.map(project => `
              <div class="project-item">
                <div class="project-header">
                  <div class="project-title">${project.title}</div>
                  ${project.url && project.linkLabel ? `<a href="${project.url}" class="project-link">${project.linkLabel}</a>` : ''}
                </div>
                <p>${project.description}</p>
              </div>
            `).join('')}
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">Technical Skills</div>
            <div class="skills-grid">
              ${Object.entries(resumeToDownload.skills).filter(([key, skills]) => skills.length > 0).map(([key, skills]) => `
                <div class="skill-category">
                  <span class="skill-label">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                  <span class="skill-list">${skills.join(', ')}</span>
                </div>
              `).join('')}
            </div>
          </div>

          ${resumeToDownload.achievements.length > 0 && resumeToDownload.achievements[0].title ? `
          <div class="section">
            <div class="section-title">Achievements</div>
            ${resumeToDownload.achievements.map(achievement => `
              <div class="achievement-item">
                <div class="project-title">${achievement.title}</div>
                <p>${achievement.description}</p>
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${resumeToDownload.positions.length > 0 && resumeToDownload.positions[0].role ? `
          <div class="section">
            <div class="section-title">Positions of Responsibility</div>
            ${resumeToDownload.positions.map(position => `
              <div class="achievement-item">
                <div class="project-title">${position.role} - ${position.organization}</div>
                <p>${position.description}</p>
              </div>
            `).join('')}
          </div>
          ` : ''}
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);

      toast({
        title: "Download Started",
        description: `Your ${isOriginal ? 'original' : 'optimized'} resume is being prepared for download.`
      });
    } catch (error) {
      console.error("PDF download failed:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDownloadState(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5" />
              ATS Compatibility Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isAnalyzing ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-300">Analyzing your resume...</p>
              </div>
            ) : adsScore ? (
              <>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{adsScore.score}/100</div>
                  <Progress value={adsScore.score} className="w-full h-3 mb-4" />
                  <p className="text-gray-300">
                    {adsScore.score >= 80 ? "Excellent!" : 
                     adsScore.score >= 60 ? "Good, but can be improved" : 
                     "Needs significant improvement"}
                  </p>
                </div>

                {adsScore.recommendations.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {adsScore.recommendations.map((rec, index) => (
                        <li key={index} className="text-gray-300 flex items-start gap-2">
                          <span className="text-yellow-500 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {adsScore.missingKeywords.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Missing Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {adsScore.missingKeywords.map((keyword, index) => (
                        <span key={index} className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  {!optimizedResume ? (
                    <Button 
                      onClick={handleOptimize}
                      disabled={isOptimizing}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      {isOptimizing ? "Optimizing..." : "Apply AI Optimization"}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 flex-1 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span>Resume Optimized Successfully!</span>
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>

        {/* Download Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-center">Original Version</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleDownloadPDF(originalResumeData, true)}
                disabled={isDownloadingOriginal}
                className="w-full bg-white text-black border-none"
                style={{ backgroundColor: 'white', color: 'black' }}
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloadingOriginal ? "Preparing..." : "Download Original Version"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-center">AI Optimized Version</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleDownloadPDF(optimizedResume || resumeData, false)}
                disabled={!optimizedResume || isDownloadingOptimized}
                className="w-full bg-white text-black border-none"
                style={{ backgroundColor: 'white', color: 'black' }}
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloadingOptimized ? "Preparing..." : 
                 !optimizedResume ? "Optimize First" : "Download Optimized Version"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
