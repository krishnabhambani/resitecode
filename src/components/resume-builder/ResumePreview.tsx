import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Zap, ExternalLink } from "lucide-react";
import { ResumeData } from "@/lib/resume-types";
import { useToast } from "@/hooks/use-toast";

interface ResumePreviewProps {
  resumeData: ResumeData;
  onOptimize: () => void;
}

export function ResumePreview({ resumeData, onOptimize }: ResumePreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Popup blocked');
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${resumeData.personalInfo.fullName} - Resume</title>
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
            <div class="name">${resumeData.personalInfo.fullName}</div>
            <div class="contact">
              ${resumeData.personalInfo.phone ? `${resumeData.personalInfo.phone} • ` : ''}
              ${resumeData.personalInfo.email || ''}
            </div>
            <div class="contact">
              ${resumeData.personalInfo.linkedin ? `<a href="${resumeData.personalInfo.linkedin}">LinkedIn</a> • ` : ''}
              ${resumeData.personalInfo.github ? `<a href="${resumeData.personalInfo.github}">GitHub</a> • ` : ''}
              ${resumeData.personalInfo.portfolio ? `<a href="${resumeData.personalInfo.portfolio}">Portfolio</a>` : ''}
            </div>
          </div>

          ${resumeData.summary ? `
          <div class="section">
            <div class="section-title">Professional Summary</div>
            <p>${resumeData.summary}</p>
          </div>
          ` : ''}

          ${resumeData.education.degree ? `
          <div class="section">
            <div class="section-title">Education</div>
            <div class="experience-item">
              <div class="job-header">
                <div>
                  <div class="job-title">${resumeData.education.degree}</div>
                  <div class="company">${resumeData.education.university}</div>
                </div>
                <div class="duration-location">
                  <div>${resumeData.education.duration}</div>
                  <div>${resumeData.education.location}</div>
                </div>
              </div>
            </div>
          </div>
          ` : ''}

          ${resumeData.experience.length > 0 && resumeData.experience[0].title ? `
          <div class="section">
            <div class="section-title">Experience</div>
            ${resumeData.experience.map(exp => `
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

          ${resumeData.projects.length > 0 && resumeData.projects[0].title ? `
          <div class="section">
            <div class="section-title">Projects</div>
            ${resumeData.projects.map(project => `
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
              ${Object.entries(resumeData.skills).filter(([key, skills]) => skills.length > 0).map(([key, skills]) => `
                <div class="skill-category">
                  <span class="skill-label">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                  <span class="skill-list">${skills.join(', ')}</span>
                </div>
              `).join('')}
            </div>
          </div>

          ${resumeData.achievements.length > 0 && resumeData.achievements[0].title ? `
          <div class="section">
            <div class="section-title">Achievements</div>
            ${resumeData.achievements.map(achievement => `
              <div class="achievement-item">
                <div class="project-title">${achievement.title}</div>
                <p>${achievement.description}</p>
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${resumeData.positions.length > 0 && resumeData.positions[0].role ? `
          <div class="section">
            <div class="section-title">Positions of Responsibility</div>
            ${resumeData.positions.map(position => `
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
        description: "Your resume is being prepared for download."
      });
    } catch (error) {
      console.error("PDF download failed:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resume Preview */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-gray-300 text-black">
            <CardContent className="p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">{resumeData.personalInfo.fullName}</h1>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                  {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                  {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                  {resumeData.personalInfo.linkedin && (
                    <a href={resumeData.personalInfo.linkedin} className="text-blue-600 hover:underline">
                      LinkedIn
                    </a>
                  )}
                  {resumeData.personalInfo.github && (
                    <a href={resumeData.personalInfo.github} className="text-blue-600 hover:underline">
                      GitHub
                    </a>
                  )}
                  {resumeData.personalInfo.portfolio && (
                    <a href={resumeData.personalInfo.portfolio} className="text-blue-600 hover:underline">
                      Portfolio
                    </a>
                  )}
                </div>
              </div>

              {/* Professional Summary */}
              {resumeData.summary && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2 text-gray-800 border-b-2 border-blue-500 pb-1">
                    PROFESSIONAL SUMMARY
                  </h2>
                  <p className="text-sm leading-relaxed">{resumeData.summary}</p>
                </div>
              )}

              {/* Education */}
              {resumeData.education.degree && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2 text-gray-800 border-b-2 border-blue-500 pb-1">
                    EDUCATION
                  </h2>
                  <div className="text-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">{resumeData.education.degree}</p>
                        <p className="text-gray-700">{resumeData.education.university}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600">{resumeData.education.duration}</p>
                        <p className="text-gray-600">{resumeData.education.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Experience */}
              {resumeData.experience.length > 0 && resumeData.experience[0].title && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2 text-gray-800 border-b-2 border-blue-500 pb-1">
                    EXPERIENCE
                  </h2>
                  <div className="space-y-4">
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <p className="font-semibold text-gray-800">{exp.title}</p>
                            <p className="font-medium text-gray-700">{exp.company}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-600">{exp.duration}</p>
                            <p className="text-gray-600">{exp.location}</p>
                          </div>
                        </div>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          {exp.description.map((desc, descIndex) => (
                            <li key={descIndex} className="leading-relaxed text-gray-700">
                              {desc.replace(/^•\s*/, '')}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {resumeData.projects.length > 0 && resumeData.projects[0].title && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2 text-gray-800 border-b-2 border-blue-500 pb-1">
                    PROJECTS
                  </h2>
                  <div className="space-y-3">
                    {resumeData.projects.map((project, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex items-start justify-between">
                          <p className="font-semibold text-gray-800">{project.title}</p>
                          {project.url && project.linkLabel && (
                            <a 
                              href={project.url} 
                              className="text-blue-600 hover:underline flex items-center gap-1"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {project.linkLabel}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <p className="leading-relaxed mt-1 text-gray-700">{project.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-2 text-gray-800 border-b-2 border-blue-500 pb-1">
                  TECHNICAL SKILLS
                </h2>
                <div className="text-sm space-y-1">
                  {Object.entries(resumeData.skills).filter(([key, skills]) => skills.length > 0).map(([key, skills]) => (
                    <p key={key} className="text-gray-700">
                      <span className="font-semibold text-gray-800">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                      </span>{" "}
                      {skills.join(", ")}
                    </p>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              {resumeData.achievements.length > 0 && resumeData.achievements[0].title && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2 text-gray-800 border-b-2 border-blue-500 pb-1">
                    ACHIEVEMENTS
                  </h2>
                  <div className="space-y-2">
                    {resumeData.achievements.map((achievement, index) => (
                      <div key={index} className="text-sm">
                        <p className="font-semibold text-gray-800">{achievement.title}</p>
                        <p className="leading-relaxed text-gray-700">{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Positions of Responsibility */}
              {resumeData.positions.length > 0 && resumeData.positions[0].role && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2 text-gray-800 border-b-2 border-blue-500 pb-1">
                    POSITIONS OF RESPONSIBILITY
                  </h2>
                  <div className="space-y-2">
                    {resumeData.positions.map((position, index) => (
                      <div key={index} className="text-sm">
                        <p className="font-semibold text-gray-800">{position.role} - {position.organization}</p>
                        <p className="leading-relaxed text-gray-700">{position.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions Panel */}
        <div className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Resume Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="w-full border-none"
                style={{ backgroundColor: 'white', color: 'black' }}
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? "Preparing..." : "Download Original Version"}
              </Button>
              
              <Button 
                onClick={onOptimize}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                Optimize with AI
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Resume Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Keep your resume to one page</li>
                <li>• Use action verbs to describe your experience</li>
                <li>• Quantify your achievements with numbers</li>
                <li>• Tailor your skills to match the job description</li>
                <li>• Use consistent formatting throughout</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
