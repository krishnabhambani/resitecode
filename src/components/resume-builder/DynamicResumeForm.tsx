
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Plus, Trash2, X } from "lucide-react";
import { ResumeData, JDAnalysis } from "@/lib/resume-types";
import { geminiResumeService } from "@/lib/gemini-resume-service";
import { useToast } from "@/hooks/use-toast";

interface DynamicResumeFormProps {
  jdAnalysis: JDAnalysis | null;
  onResumeCreated: (data: ResumeData) => void;
}

export function DynamicResumeForm({ jdAnalysis, onResumeCreated }: DynamicResumeFormProps) {
  const [loading, setLoading] = useState(false);
  const [enhancingExperience, setEnhancingExperience] = useState<number | null>(null);
  const [customSections, setCustomSections] = useState<Array<{name: string, fields: Array<{key: string, value: string}>}>>([]);
  const [newSectionName, setNewSectionName] = useState("");
  const [skillCategories, setSkillCategories] = useState([
    { name: "Programming Languages", key: "programmingLanguages", skills: [] as string[] },
    { name: "Frameworks", key: "frameworks", skills: [] as string[] },
    { name: "Tools", key: "tools", skills: [] as string[] },
    { name: "Soft Skills", key: "softSkills", skills: [] as string[] }
  ]);
  const { toast } = useToast();
  
  const { register, handleSubmit, control, watch, setValue, getValues } = useForm<ResumeData>({
    defaultValues: {
      personalInfo: {
        fullName: "",
        phone: "",
        email: "",
        linkedin: "",
        github: "",
        portfolio: ""
      },
      summary: jdAnalysis?.suggestedSummary || "",
      education: {
        degree: "",
        university: "",
        location: "",
        duration: ""
      },
      experience: [{ title: "", company: "", duration: "", location: "", description: [""] }],
      projects: [{ title: "", description: "", linkLabel: "", url: "" }],
      skills: {
        programmingLanguages: [],
        frameworks: [],
        tools: [],
        softSkills: []
      },
      achievements: [{ title: "", description: "" }],
      positions: [{ role: "", organization: "", description: "" }]
    }
  });

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: "experience"
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: "projects"
  });

  const { fields: achievementFields, append: appendAchievement, remove: removeAchievement } = useFieldArray({
    control,
    name: "achievements"
  });

  const { fields: positionFields, append: appendPosition, remove: removePosition } = useFieldArray({
    control,
    name: "positions"
  });

  const addSkillCategory = () => {
    const newCategory = {
      name: `Custom Skills ${skillCategories.length + 1}`,
      key: `customSkills${skillCategories.length + 1}`,
      skills: []
    };
    setSkillCategories([...skillCategories, newCategory]);
  };

  const removeSkillCategory = (index: number) => {
    if (skillCategories.length > 1) {
      const updated = skillCategories.filter((_, i) => i !== index);
      setSkillCategories(updated);
    }
  };

  const addSkillToCategory = (categoryIndex: number) => {
    const updated = [...skillCategories];
    updated[categoryIndex].skills.push("");
    setSkillCategories(updated);
  };

  const updateSkill = (categoryIndex: number, skillIndex: number, value: string) => {
    const updated = [...skillCategories];
    updated[categoryIndex].skills[skillIndex] = value;
    setSkillCategories(updated);
  };

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const updated = [...skillCategories];
    updated[categoryIndex].skills.splice(skillIndex, 1);
    setSkillCategories(updated);
  };

  const addCustomSection = () => {
    if (newSectionName.trim()) {
      setCustomSections([...customSections, {
        name: newSectionName,
        fields: [{ key: "", value: "" }]
      }]);
      setNewSectionName("");
    }
  };

  const addCustomField = (sectionIndex: number) => {
    const updated = [...customSections];
    updated[sectionIndex].fields.push({ key: "", value: "" });
    setCustomSections(updated);
  };

  const updateCustomField = (sectionIndex: number, fieldIndex: number, type: 'key' | 'value', value: string) => {
    const updated = [...customSections];
    updated[sectionIndex].fields[fieldIndex][type] = value;
    setCustomSections(updated);
  };

  const removeCustomSection = (sectionIndex: number) => {
    setCustomSections(customSections.filter((_, i) => i !== sectionIndex));
  };

  const enhanceExperience = async (index: number) => {
    if (!jdAnalysis) {
      toast({
        title: "No JD Analysis",
        description: "Job description analysis is required for AI enhancement.",
        variant: "destructive"
      });
      return;
    }

    try {
      setEnhancingExperience(index);
      const experience = getValues(`experience.${index}`);
      const enhanced = await geminiResumeService.enhanceExperience(experience.title, jdAnalysis);
      setValue(`experience.${index}.description`, enhanced);
      toast({
        title: "Experience Enhanced",
        description: "AI has improved your experience descriptions!"
      });
    } catch (error) {
      console.error("Enhancement failed:", error);
      toast({
        title: "Enhancement Failed",
        description: "Failed to enhance experience. Please try again.",
        variant: "destructive"
      });
    } finally {
      setEnhancingExperience(null);
    }
  };

  const onSubmit = async (data: ResumeData) => {
    try {
      setLoading(true);
      
      // Process skills from the skill categories
      const processedSkills: any = {};
      skillCategories.forEach(category => {
        processedSkills[category.key] = category.skills.filter(skill => skill.trim() !== "");
      });
      
      const processedData = {
        ...data,
        skills: processedSkills,
        customSections: customSections
      };
      
      onResumeCreated(processedData);
    } catch (error) {
      console.error("Resume creation failed:", error);
      toast({
        title: "Resume Creation Failed",
        description: "Failed to create resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
        {/* Personal Information */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Full Name</Label>
              <Input {...register("personalInfo.fullName")} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label className="text-gray-300">Phone</Label>
              <Input {...register("personalInfo.phone")} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label className="text-gray-300">Email</Label>
              <Input {...register("personalInfo.email")} type="email" className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label className="text-gray-300">LinkedIn</Label>
              <Input {...register("personalInfo.linkedin")} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label className="text-gray-300">GitHub</Label>
              <Input {...register("personalInfo.github")} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label className="text-gray-300">Portfolio</Label>
              <Input {...register("personalInfo.portfolio")} className="bg-gray-700 border-gray-600 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Professional Summary */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Professional Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              {...register("summary")} 
              placeholder="Professional summary based on your experience and goals..."
              rows={4}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Education</CardTitle>
            <Button 
              type="button" 
              onClick={() => {/* Add education logic */}}
              size="sm" 
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Degree</Label>
              <Input {...register("education.degree")} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label className="text-gray-300">University</Label>
              <Input {...register("education.university")} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label className="text-gray-300">Location</Label>
              <Input {...register("education.location")} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label className="text-gray-300">Duration</Label>
              <Input {...register("education.duration")} placeholder="2019-2023" className="bg-gray-700 border-gray-600 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Experience Section */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Experience</CardTitle>
            <Button 
              type="button" 
              onClick={() => appendExperience({ title: "", company: "", duration: "", location: "", description: [""] })}
              size="sm" 
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {experienceFields.map((field, index) => (
              <div key={field.id} className="border border-gray-600 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-white">Experience {index + 1}</h4>
                  <div className="flex gap-2">
                    {jdAnalysis && (
                      <Button
                        type="button"
                        onClick={() => enhanceExperience(index)}
                        disabled={enhancingExperience === index}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {enhancingExperience === index ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "AI Enhance"
                        )}
                      </Button>
                    )}
                    <Button
                      type="button"
                      onClick={() => {/* Add field logic */}}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Field
                    </Button>
                    {experienceFields.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeExperience(index)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Job Title</Label>
                    <Input {...register(`experience.${index}.title`)} className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300">Company</Label>
                    <Input {...register(`experience.${index}.company`)} className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300">Duration</Label>
                    <Input {...register(`experience.${index}.duration`)} placeholder="Jan 2022 - Present" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300">Location</Label>
                    <Input {...register(`experience.${index}.location`)} placeholder="Remote / New York, NY" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                </div>
                
                <div>
                  <Label className="text-gray-300">Description (one point per line)</Label>
                  <Textarea 
                    {...register(`experience.${index}.description.0`)}
                    placeholder="• Led development of responsive web applications using React and TypeScript&#10;• Collaborated with cross-functional teams to deliver high-quality software solutions&#10;• Implemented automated testing reducing bugs by 40%"
                    rows={4}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills Section - Redesigned */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Skills</CardTitle>
            <Button
              type="button"
              onClick={addSkillCategory}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {skillCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="border border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">{category.name}</h4>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => addSkillToCategory(categoryIndex)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                    {skillCategories.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeSkillCategory(categoryIndex)}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="flex gap-2">
                      <Input
                        value={skill}
                        onChange={(e) => updateSkill(categoryIndex, skillIndex, e.target.value)}
                        placeholder="Enter skill"
                        className="bg-gray-700 border-gray-600 text-white flex-1"
                      />
                      <Button
                        type="button"
                        onClick={() => removeSkill(categoryIndex, skillIndex)}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white px-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                {category.skills.length === 0 && (
                  <p className="text-gray-400 text-sm italic">No skills added yet. Click "Add Skill" to get started.</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Projects Section */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Projects</CardTitle>
            <Button 
              type="button" 
              onClick={() => appendProject({ title: "", description: "", linkLabel: "", url: "" })}
              size="sm" 
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {projectFields.map((field, index) => (
              <div key={field.id} className="border border-gray-600 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-white">Project {index + 1}</h4>
                  {projectFields.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeProject(index)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Project Title</Label>
                    <Input {...register(`projects.${index}.title`)} className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300">Link Label</Label>
                    <Input {...register(`projects.${index}.linkLabel`)} placeholder="GitHub, Demo, etc." className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-300">Project URL</Label>
                    <Input {...register(`projects.${index}.url`)} placeholder="https://..." className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                </div>
                
                <div>
                  <Label className="text-gray-300">Description</Label>
                  <Textarea 
                    {...register(`projects.${index}.description`)}
                    placeholder="Describe your project, technologies used, and key achievements..."
                    rows={3}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Custom Sections */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Custom Sections</CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="Section name (e.g., Languages, Certifications)"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white w-64"
              />
              <Button
                type="button"
                onClick={addCustomSection}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {customSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border border-gray-600 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-white">{section.name}</h4>
                  <Button
                    type="button"
                    onClick={() => removeCustomSection(sectionIndex)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {section.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="grid grid-cols-5 gap-2">
                      <Input
                        placeholder="Label"
                        value={field.key}
                        onChange={(e) => updateCustomField(sectionIndex, fieldIndex, 'key', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white col-span-2"
                      />
                      <Input
                        placeholder="Value"
                        value={field.value}
                        onChange={(e) => updateCustomField(sectionIndex, fieldIndex, 'value', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white col-span-3"
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => addCustomField(sectionIndex)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Field
                  </Button>
                </div>
              </div>
            ))}
            {customSections.length === 0 && (
              <p className="text-gray-400 text-center py-4">No custom sections added yet.</p>
            )}
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Creating Resume...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Create Resume
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
