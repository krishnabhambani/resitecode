
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { 
  Download, 
  Copy, 
  Edit3, 
  Save, 
  X, 
  RefreshCw,
  FileText,
  Layout,
  Type
} from 'lucide-react';
import { GeneratedReport, ReportFormData } from '../../lib/report-types';
import { reportGeneratorService } from '../../lib/gemini-report-service';
import { useToast } from '@/hooks/use-toast';

interface ReportPreviewProps {
  report: GeneratedReport;
  formData: ReportFormData;
  onBack: () => void;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  report,
  formData,
  onBack
}) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [currentReport, setCurrentReport] = useState(report);
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);
  const [fontStyle, setFontStyle] = useState<'serif' | 'sans' | 'times'>('serif');
  const [layout, setLayout] = useState<'compact' | 'spacious'>('spacious');
  const { toast } = useToast();

  const sections = [
    { id: 'abstract', title: 'Abstract', content: currentReport.abstract },
    { id: 'introduction', title: 'Introduction', content: currentReport.introduction },
    { id: 'mainBody', title: 'Main Body', content: currentReport.mainBody },
    { id: 'conclusion', title: 'Conclusion', content: currentReport.conclusion },
    { id: 'references', title: 'References', content: currentReport.references },
  ];

  const handleEdit = (sectionId: string, content: string) => {
    setEditingSection(sectionId);
    setEditedContent(content);
  };

  const handleSaveEdit = () => {
    if (editingSection) {
      setCurrentReport({
        ...currentReport,
        [editingSection]: editedContent
      });
      setEditingSection(null);
      setEditedContent('');
      toast({
        title: "Section Updated",
        description: "Your changes have been saved successfully.",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditedContent('');
  };

  const handleRegenerate = async (sectionId: string) => {
    setIsRegenerating(sectionId);
    try {
      const currentContent = currentReport[sectionId as keyof GeneratedReport] as string;
      const newContent = await reportGeneratorService.regenerateSection(
        sectionId,
        formData,
        currentContent
      );
      
      setCurrentReport({
        ...currentReport,
        [sectionId]: newContent
      });
      
      toast({
        title: "Section Regenerated",
        description: "The section has been regenerated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate section. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(null);
    }
  };

  const handleCopyToClipboard = () => {
    const fullReport = sections.map(section => 
      `${section.title.toUpperCase()}\n\n${section.content}\n\n`
    ).join('');
    
    navigator.clipboard.writeText(fullReport);
    toast({
      title: "Copied to Clipboard",
      description: "The complete report has been copied to your clipboard.",
    });
  };

  const handleDownloadPDF = () => {
    const fullReport = sections.map(section => 
      `${section.title.toUpperCase()}\n\n${section.content}\n\n`
    ).join('');
    
    const blob = new Blob([fullReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.title.replace(/\s+/g, '_')}_report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Your report is being downloaded as a text file.",
    });
  };

  const handleDownloadDOCX = () => {
    const fullReport = sections.map(section => 
      `${section.title.toUpperCase()}\n\n${section.content}\n\n`
    ).join('');
    
    const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}} \\f0\\fs24 ${fullReport.replace(/\n/g, '\\par ')}}`;
    const blob = new Blob([rtfContent], { type: 'application/rtf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.title.replace(/\s+/g, '_')}_report.rtf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Your report is being downloaded as an RTF file that can be opened in Word.",
    });
  };

  const getFontClass = () => {
    switch (fontStyle) {
      case 'serif':
        return 'font-serif';
      case 'times':
        return 'font-times';
      case 'sans':
      default:
        return 'font-sans';
    }
  };

  const cleanContent = (content: string) => {
    return content.replace(/\*\*/g, '').replace(/\*/g, '');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
      {/* Header with proper spacing */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8"
      >
        <div className="space-y-2">
          <h1 className={`text-3xl font-bold text-white mb-4 ${getFontClass()}`}>{formData.title}</h1>
          <p className={`text-gray-300 text-lg ${getFontClass()}`}>By {formData.author}</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-white/30 text-black bg-white hover:bg-white"
          >
            ← Back to Form
          </Button>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="bg-black/70 border-white/30 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-6 items-center justify-between">
              {/* Style Controls */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <Type className="h-5 w-5 text-gray-400" />
                  <Button
                    size="sm"
                    variant={fontStyle === 'serif' ? 'default' : 'outline'}
                    onClick={() => setFontStyle('serif')}
                    className="h-9 px-4 text-black bg-white border-white/30 hover:bg-white"
                  >
                    Serif
                  </Button>
                  <Button
                    size="sm"
                    variant={fontStyle === 'sans' ? 'default' : 'outline'}
                    onClick={() => setFontStyle('sans')}
                    className="h-9 px-4 text-black bg-white border-white/30 hover:bg-white"
                  >
                    Sans
                  </Button>
                  <Button
                    size="sm"
                    variant={fontStyle === 'times' ? 'default' : 'outline'}
                    onClick={() => setFontStyle('times')}
                    className="h-9 px-4 text-black bg-white border-white/30 hover:bg-white"
                  >
                    Times New Roman
                  </Button>
                </div>
                
                <div className="flex items-center gap-3">
                  <Layout className="h-5 w-5 text-gray-400" />
                  <Button
                    size="sm"
                    variant={layout === 'compact' ? 'default' : 'outline'}
                    onClick={() => setLayout('compact')}
                    className="h-9 px-4 text-black bg-white border-white/30 hover:bg-white"
                  >
                    Compact
                  </Button>
                  <Button
                    size="sm"
                    variant={layout === 'spacious' ? 'default' : 'outline'}
                    onClick={() => setLayout('spacious')}
                    className="h-9 px-4 text-black bg-white border-white/30 hover:bg-white"
                  >
                    Spacious
                  </Button>
                </div>
              </div>

              {/* Download Controls */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleCopyToClipboard}
                  size="sm"
                  className="text-black bg-white border-white/30 hover:bg-white"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  size="sm"
                  className="text-black bg-white border-white/30 hover:bg-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  TXT
                </Button>
                <Button
                  onClick={handleDownloadDOCX}
                  size="sm"
                  className="bg-green-500 hover:bg-green-500 text-black"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Report Sections */}
      <div className="space-y-8">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="bg-black/70 border-white/30 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className={`text-xl font-bold text-white ${getFontClass()}`}>
                  {section.title}
                </CardTitle>
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    onClick={() => handleEdit(section.id, section.content)}
                    disabled={editingSection === section.id}
                    className="text-black bg-white border-white/30 hover:bg-white"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleRegenerate(section.id)}
                    disabled={isRegenerating === section.id || editingSection === section.id}
                    className="text-black bg-white border-white/30 hover:bg-white"
                  >
                    {isRegenerating === section.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {editingSection === section.id ? (
                  <div className="space-y-4">
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      rows={8}
                      className="bg-black/50 border-white/30 text-white resize-none"
                    />
                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        className="bg-green-500 hover:bg-green-500 text-black"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleCancelEdit}
                        className="text-black bg-white border-white/30 hover:bg-white"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`text-gray-200 whitespace-pre-wrap leading-relaxed ${getFontClass()} ${
                      layout === 'compact' ? 'space-y-3' : 'space-y-5'
                    }`}
                    style={{ 
                      lineHeight: layout === 'compact' ? '1.5' : '1.7',
                      fontSize: '12px'
                    }}
                  >
                    {cleanContent(section.content) || 'No content generated for this section.'}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReportPreview;
