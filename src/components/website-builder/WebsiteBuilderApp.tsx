import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Download, History, Sparkles, Globe, Edit, Plus, Mic } from 'lucide-react';
import { geminiWebsiteService } from '@/lib/gemini-website-service';

interface GeneratedWebsite {
  id: string;
  description: string;
  html: string;
  instructions: string;
  timestamp: string;
}

export function WebsiteBuilderApp() {
  const [description, setDescription] = useState('');
  const [generatedWebsite, setGeneratedWebsite] = useState<GeneratedWebsite | null>(null);
  const [history, setHistory] = useState<GeneratedWebsite[]>([]);
  const [loading, setLoading] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [updatePrompt, setUpdatePrompt] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const voiceBtn = document.getElementById('voice-btn');
    const stopBtn = document.getElementById('stop-btn');
    if (!('webkitSpeechRecognition' in window) || !voiceBtn || !stopBtn) return;

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      toast({ title: '🎙 Voice Activated', description: 'You can speak now.' });
      window.speechSynthesis.speak(new SpeechSynthesisUtterance('Voice command activated.'));
    };

    recognition.onend = () => {
      toast({ title: '⏹ Voice Stopped', description: 'Voice command has been stopped.' });
      window.speechSynthesis.speak(new SpeechSynthesisUtterance('Voice command stopped.'));
    };

    recognition.onresult = (event: any) => {
      setDescription(event.results[0][0].transcript);
    };

    recognition.onerror = (event: any) => {
      toast({ title: '❗ Voice Error', description: event.error, variant: 'destructive' });
    };

    voiceBtn.onclick = () => recognition.start();
    stopBtn.onclick = () => recognition.stop();

    return () => recognition.stop();
  }, [toast]);

  const examples = [
    'A voice-controlled shopping list that works with screen readers',
    'A large-button calculator for people with motor difficulties',
    'A high-contrast daily planner with keyboard shortcuts',
    'A simple timer with visual and audio alerts',
    'A color-blind friendly expense tracker',
    'A voice-activated note-taking app',
    'An accessible photo gallery with keyboard navigation',
    'A screen reader friendly contact form'
  ];

  const injectViewport = (html: string) => {
    if (html.includes('name="viewport"')) return html;
    return html.replace('<head>', '<head><meta name="viewport" content="width=device-width, initial-scale=1">');
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({ title: 'Description Required', description: 'Please describe the website you want.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const result = await geminiWebsiteService.generateWebsite(description);
      const html = injectViewport(result.html);
      const newSite: GeneratedWebsite = {
        id: Date.now().toString(),
        description,
        html,
        instructions: result.instructions,
        timestamp: new Date().toISOString()
      };
      setGeneratedWebsite(newSite);
      setHistory(prev => [newSite, ...prev.slice(0, 9)]);
      toast({ title: '✅ Website Built', description: 'Your site is ready.' });
      window.speechSynthesis.speak(new SpeechSynthesisUtterance('Your website has been built successfully.'));
    } catch (e) {
      toast({ title: 'Generation Failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!updatePrompt.trim() || !generatedWebsite) {
      toast({ title: 'Update Prompt Required', description: 'Please describe your changes.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const prompt = `Update: "${generatedWebsite.description}". HTML: ${generatedWebsite.html} Changes: ${updatePrompt}`;
      const result = await geminiWebsiteService.generateWebsite(prompt);
      const html = injectViewport(result.html);
      const updated: GeneratedWebsite = {
        ...generatedWebsite,
        html,
        instructions: result.instructions,
        timestamp: new Date().toISOString()
      };
      setGeneratedWebsite(updated);
      setHistory(prev => [updated, ...prev.slice(0, 9)]);
      toast({ title: '✅ Website Updated', description: 'Your site has been updated.' });
      window.speechSynthesis.speak(new SpeechSynthesisUtterance('Your website has been updated.'));
    } catch (e) {
      toast({ title: 'Update Failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resetToNew = () => {
    setGeneratedWebsite(null);
    setDescription('');
    setUpdateMode(false);
    setUpdatePrompt('');
  };

  const downloadZip = async (html: string, filename = 'website') => {
    const cssMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
    const jsMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
    let clean = html;
    const css = cssMatch.map(s => s.replace(/<\/?style[^>]*>/gi, '')).join('\n');
    const js = jsMatch.map(s => s.replace(/<\/?script[^>]*>/gi, '')).join('\n');
    clean = clean
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '<link rel="stylesheet" href="styles.css">')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '<script src="script.js"></script>');
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    zip.file('index.html', clean);
    if (css) zip.file('styles.css', css);
    if (js) zip.file('script.js', js);
    zip.file('README.md', `# Website Files\n\n- index.html\n- styles.css\n- script.js`);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderInstructionsHTML = (text: string) =>
    text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-white mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mb-2">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="h-12 w-12 text-green-400" />
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">AI Website Builder</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Describe your idea, and get a working website instantly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {!generatedWebsite && (
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-yellow-400" /> Try These Ideas
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {examples.map((ex, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setDescription(ex)}
                        className="p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-600 text-gray-200 text-sm"
                      >
                        💡 {ex}
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">
                    {updateMode ? 'Update Website' : generatedWebsite ? 'Your Website' : 'Describe Your Website'}
                  </h2>
                  <div className="flex gap-2">
                    <Button id="voice-btn" className="bg-white text-black hover:bg-gray-200">
                      <Mic className="mr-2 h-4 w-4" /> Voice
                    </Button>
                    <Button id="stop-btn" className="bg-white text-black hover:bg-gray-200">
                      ■ Stop
                    </Button>
                    {generatedWebsite && (
                      <>
                        <Button onClick={() => setUpdateMode(!updateMode)} className="bg-white text-black hover:bg-gray-100">
                          <Edit className="mr-2 h-4 w-4" /> {updateMode ? 'Cancel' : 'Update Website'}
                        </Button>
                        <Button onClick={resetToNew} className="bg-blue-500 text-white hover:bg-blue-600">
                          <Plus className="mr-2 h-4 w-4" /> New
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {updateMode ? (
                  <>
                    <Textarea value={updatePrompt} onChange={e => setUpdatePrompt(e.target.value)} placeholder="Describe changes..." className="bg-gray-800/50 text-white" />
                    <Button onClick={handleUpdate} disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-red-500 py-3">
                      {loading ? 'Updating...' : 'Update Website'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Example: A voice-controlled to-do app..."
                      className="bg-gray-800/50 text-white"
                      disabled={!!generatedWebsite}
                    />
                    {!generatedWebsite && (
                      <Button onClick={handleGenerate} disabled={loading || !description.trim()} className="w-full bg-gradient-to-r from-green-500 to-blue-500 py-3">
                        {loading ? 'Generating...' : <><Sparkles className="mr-2 h-5 w-5" /> Generate Website</>}
                      </Button>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <AnimatePresence>
              {generatedWebsite && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/3">
                      <Card className="bg-gray-900/50 border-gray-700">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-white mb-2">Usage Instructions</h3>
                          <div className="text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: renderInstructionsHTML(generatedWebsite.instructions) }} />
                        </CardContent>
                      </Card>
                    </div>
                    <div className="lg:w-2/3">
                      <Card className="bg-gray-900/50 border-gray-700">
                        <CardContent className="p-6">
                          <div className="flex justify-between mb-2">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                              <Globe className="h-6 w-6 text-green-400" /> Preview
                            </h3>
                            <Button onClick={() => downloadZip(generatedWebsite.html, `website_${generatedWebsite.id}`)} className="bg-green-500 text-white hover:bg-green-600">
                              <Download className="mr-2 h-4 w-4" /> Download
                            </Button>
                          </div>
                          <div className="bg-white rounded overflow-hidden border">
                            <iframe title="Generated Website" srcDoc={generatedWebsite.html} className="w-full h-96 border-none" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <History className="h-6 w-6 text-blue-400" /> History
                </h3>
                {history.length === 0 ? (
                  <p className="text-gray-400 text-sm">No websites generated yet.</p>
                ) : (
                  history.slice(0, 5).map(site => (
                    <div key={site.id} className="p-3 mb-2 bg-gray-800/30 rounded border border-gray-600 cursor-pointer hover:bg-gray-700/30" onClick={() => setGeneratedWebsite(site)}>
                      <p className="text-white text-sm font-medium mb-1">{site.description}</p>
                      <div className="flex justify-between text-gray-400 text-xs">
                        <span>{new Date(site.timestamp).toLocaleDateString()}</span>
                        <Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); downloadZip(site.html, `website_${site.id}`); }} className="text-green-400 hover:text-green-300 h-6 px-2">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
