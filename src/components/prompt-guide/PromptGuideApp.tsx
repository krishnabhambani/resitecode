
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Wand2, ArrowRight, Edit, MessageCircle, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { refinePrompt } from '@/lib/prompt-refiner-service';

const PromptGuideApp = () => {
  const [rawInput, setRawInput] = useState('');
  const [targetModel, setTargetModel] = useState('gemini');
  const [refinedPrompt, setRefinedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editablePrompt, setEditablePrompt] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  const editSectionRef = useRef<HTMLDivElement>(null);

  const handleRefinePrompt = async () => {
    if (!rawInput.trim()) {
      toast.error('Please enter some text to refine');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔄 Starting prompt refinement...');
      console.log('Raw input:', rawInput);
      console.log('Target model:', targetModel);
      
      const refined = await refinePrompt(rawInput, targetModel);
      console.log('✅ Refined prompt received:', refined);
      
      setRefinedPrompt(refined);
      setEditablePrompt(refined);
      setShowComparison(true);
      setIsEditing(false);
      toast.success('Prompt refined successfully!');
    } catch (error) {
      console.error('❌ Error refining prompt:', error);
      toast.error('Failed to refine prompt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePrompt = async () => {
    if (!editablePrompt.trim()) {
      toast.error('Please enter some text to update');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔄 Starting prompt update...');
      console.log('Editable prompt:', editablePrompt);
      console.log('Target model:', targetModel);
      
      const refined = await refinePrompt(editablePrompt, targetModel);
      console.log('✅ Updated prompt received:', refined);
      
      setRefinedPrompt(refined);
      setEditablePrompt(refined);
      setIsEditing(false);
      toast.success('Prompt updated successfully!');
    } catch (error) {
      console.error('❌ Error updating prompt:', error);
      toast.error('Failed to update prompt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatUpdate = async () => {
    if (!chatInput.trim()) {
      toast.error('Please enter your modification request');
      return;
    }

    if (!refinedPrompt.trim()) {
      toast.error('No prompt to update. Please generate a prompt first.');
      return;
    }

    setIsChatLoading(true);
    try {
      console.log('🔄 Starting chat-based prompt update...');
      console.log('Chat input:', chatInput);
      console.log('Current prompt:', refinedPrompt);
      
      const updateInstruction = `Here is the current prompt:

"${refinedPrompt}"

User's modification request: ${chatInput}

Please modify the above prompt based on the user's request. Only make the specific changes they mentioned - don't rewrite the entire prompt unless necessary. Keep the same structure and style, but incorporate their requested changes (additions, removals, or modifications).

Return only the updated prompt, nothing else.`;
      
      const updatedPrompt = await refinePrompt(updateInstruction, targetModel);
      console.log('✅ Chat-updated prompt received:', updatedPrompt);
      
      setRefinedPrompt(updatedPrompt);
      setEditablePrompt(updatedPrompt);
      setShowChatbot(false);
      setChatInput('');
      toast.success('Prompt updated successfully!');
    } catch (error) {
      console.error('❌ Error updating prompt via chat:', error);
      toast.error('Failed to update prompt. Please try again.');
    } finally {
      setIsChatLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadPrompt = () => {
    const blob = new Blob([refinedPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'refined-prompt.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Prompt downloaded!');
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditablePrompt(refinedPrompt);
    // Scroll to the edit section smoothly
    setTimeout(() => {
      editSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditablePrompt(refinedPrompt);
  };

  // Function to format text with proper markdown rendering
  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wand2 className="h-8 w-8 text-green-400" />
            <h1 className="text-4xl font-bold text-white">Prompt Guide</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your raw ideas into polished, structured prompts for any AI model
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-gray-900/80 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm">1</span>
                Raw Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your raw idea or messy instructions here...

Example: 'I want to build a tool that takes Excel upload and sends email with different names using Brevo. It should have dynamic fields like name and message. Should be automated.'"
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                className="min-h-[200px] bg-gray-800/80 border-gray-600 text-white placeholder-gray-400"
              />
              
              <div className="space-y-3">
                <label className="text-sm text-gray-300">Available Models:</label>
                <Select value={targetModel} onValueChange={setTargetModel}>
                  <SelectTrigger className="bg-gray-800/80 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="gemini" className="text-white">Google Gemini 2.0 Flash (recommended)</SelectItem>
                    <SelectItem value="chatgpt" className="text-white">OpenAI ChatGPT</SelectItem>
                    <SelectItem value="claude" className="text-white">Anthropic Claude</SelectItem>
                    <SelectItem value="general" className="text-white">General Purpose</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleRefinePrompt}
                  disabled={isLoading || !rawInput.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Refining Prompt...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Wand2 className="h-4 w-4" />
                      Refine Prompt
                    </div>
                  )}
                </Button>

                {refinedPrompt && (
                  <Button
                    onClick={() => setShowChatbot(true)}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Update Current Generated Prompt
                    </div>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="bg-gray-900/80 border-gray-700 backdrop-blur-sm" ref={editSectionRef}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm">2</span>
                Refined Prompt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {refinedPrompt ? (
                <>
                  {isEditing ? (
                    <div className="space-y-4">
                      <Textarea
                        value={editablePrompt}
                        onChange={(e) => setEditablePrompt(e.target.value)}
                        className="min-h-[200px] bg-gray-800/80 border-gray-600 text-white placeholder-gray-400"
                        placeholder="Edit your refined prompt here..."
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleUpdatePrompt}
                          disabled={isLoading || !editablePrompt.trim()}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Updating...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Wand2 className="h-4 w-4" />
                              Update Prompt
                            </div>
                          )}
                        </Button>
                        <Button
                          onClick={cancelEditing}
                          className="flex-1 text-black bg-white hover:bg-gray-100"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-gray-800/80 border border-gray-600 rounded-lg p-4 min-h-[200px]">
                        <div 
                          className="text-gray-200 whitespace-pre-wrap text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: formatText(refinedPrompt) }}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyToClipboard(refinedPrompt)}
                          className="flex-1 text-black bg-white hover:bg-gray-100"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          onClick={downloadPrompt}
                          className="flex-1 text-black bg-white hover:bg-gray-100"
                        >
                          Download
                        </Button>
                      </div>
                      
                      <Button
                        onClick={startEditing}
                        className="w-full text-black bg-white hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit This Prompt
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center py-20 text-gray-400">
                  <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Your refined prompt will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chatbot Interface Modal */}
        {showChatbot && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl bg-gray-900 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-400" />
                  Update Current Generated Prompt
                </CardTitle>
                <Button
                  onClick={() => setShowChatbot(false)}
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-sm text-gray-300">
                    Tell me what you would like to modify in your current prompt. For example:
                  </p>
                  <ul className="text-xs text-gray-400 mt-2 space-y-1">
                    <li>• "Remove target pages and reference design"</li>
                    <li>• "Add more target points about user authentication"</li>
                    <li>• "Change the output format to JSON instead of HTML"</li>
                  </ul>
                </div>
                
                <Textarea
                  placeholder="What would you like to modify in the current prompt? Be specific about what to add, remove, or change..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="min-h-[120px] bg-gray-800/80 border-gray-600 text-white placeholder-gray-400"
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleChatUpdate}
                    disabled={isChatLoading || !chatInput.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isChatLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Updating Prompt...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Update Prompt
                      </div>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowChatbot(false)}
                    className="text-black bg-white hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Before & After Comparison */}
        {showComparison && rawInput && refinedPrompt && (
          <Card className="mt-8 bg-gray-900/80 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-green-400" />
                Before → After Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-red-400 mb-3">BEFORE (Raw Input)</h4>
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">{rawInput}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-3">AFTER (Refined Prompt)</h4>
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <div 
                      className="text-gray-300 text-sm whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: formatText(refinedPrompt) }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips Section */}
        <Card className="mt-8 bg-gray-900/80 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">💡 Tips for Better Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="text-white font-medium mb-2">Input Tips:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Be specific about your goal</li>
                  <li>• Mention input/output formats</li>
                  <li>• Include any constraints or requirements</li>
                  <li>• Don't worry about grammar or structure</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">What Gets Improved:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Clear role definition for the AI</li>
                  <li>• Structured task breakdown</li>
                  <li>• Specific input/output formats</li>
                  <li>• Professional language and clarity</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromptGuideApp;
