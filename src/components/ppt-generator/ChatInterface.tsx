
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownIcon, SendIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ChatMessage, Presentation } from "@/lib/types";
import { SlideEditor } from "./SlideEditor";

interface ChatInterfaceProps {
  onSubmit: (prompt: string, slideCount: number) => Promise<void>;
  loading: boolean;
  onThemeChange?: (theme: 'light' | 'dark' | 'midnight' | 'skywave' | 'mint' | 'sunset' | 'ocean' | 'forest' | 'royal') => void;
  currentTheme?: 'light' | 'dark' | 'midnight' | 'skywave' | 'mint' | 'sunset' | 'ocean' | 'forest' | 'royal';
  presentation?: Presentation | null;
  onEditSlide?: (slideIndex: number | null) => void;
  onSlideModification?: (slideIndex: number, modification: string) => Promise<void>;
  editingSlide?: number | null;
}

export function ChatInterface({ 
  onSubmit, 
  loading, 
  onThemeChange, 
  currentTheme = 'light',
  presentation,
  onEditSlide,
  onSlideModification,
  editingSlide
}: ChatInterfaceProps) {
  const [prompt, setPrompt] = useState<string>("");
  const [slideCount, setSlideCount] = useState<number>(6);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI presentation assistant. Tell me what presentation you'd like to create, and I'll generate it for you. After creation, you can click on any slide to edit its content."
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleSubmit = async () => {
    if (!prompt.trim() || loading) return;
    
    const userMessage: ChatMessage = {
      role: "user",
      content: prompt
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    const typingMessage: ChatMessage = {
      role: "assistant",
      content: "Generating your enhanced presentation with optimized content and relevant images..."
    };
    
    setMessages(prev => [...prev, typingMessage]);
    setPrompt("");
    
    try {
      await onSubmit(prompt, slideCount);
      
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages.pop();
        return [...newMessages, {
          role: "assistant", 
          content: "Your presentation is ready! I've created professional slides with relevant content and images. You can now view, edit individual slides, or download the PPT file."
        }];
      });
    } catch (error) {
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages.pop();
        return [...newMessages, {
          role: "assistant", 
          content: "I encountered an error while creating your presentation. Please try again with a different topic or check your internet connection."
        }];
      });
    }
  };
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex items-center gap-4 p-4 border-b bg-white">
        <div className="flex-grow">
          <label htmlFor="slide-count" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Slides
          </label>
          <Select 
            value={slideCount.toString()}
            onValueChange={(value) => setSlideCount(parseInt(value))}
            disabled={loading}
          >
            <SelectTrigger 
              id="slide-count" 
              className="w-full bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus:ring-green-400"
              style={{ backgroundColor: '#18181b', color: '#fff' }}
            >
              <SelectValue placeholder="Select slides" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border border-gray-700 z-50">
              {[4, 5, 6, 7, 8, 9, 10].map((num) => (
                <SelectItem key={num} value={num.toString()} className="text-white hover:bg-gray-800">
                  {num} slides
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {onThemeChange && (
          <div className="flex-grow">
            <label htmlFor="theme-select" className="block text-sm font-medium text-gray-700 mb-1">
              Theme
            </label>
            <Select 
              value={currentTheme}
              onValueChange={(value) => onThemeChange(value as 'light' | 'dark' | 'midnight' | 'skywave' | 'mint' | 'sunset' | 'ocean' | 'forest' | 'royal')}
              disabled={loading}
            >
              <SelectTrigger 
                id="theme-select" 
                className="w-full bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus:ring-green-400"
                style={{ backgroundColor: '#18181b', color: '#fff' }}
              >
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-white border border-gray-700 z-50">
                <SelectItem value="light" className="text-white hover:bg-gray-800">Light</SelectItem>
                <SelectItem value="dark" className="text-white hover:bg-gray-800">Dark</SelectItem>
                <SelectItem value="midnight" className="text-white hover:bg-gray-800">Midnight</SelectItem>
                <SelectItem value="skywave" className="text-white hover:bg-gray-800">Skywave</SelectItem>
                <SelectItem value="mint" className="text-white hover:bg-gray-800">Mint</SelectItem>
                <SelectItem value="sunset" className="text-white hover:bg-gray-800">Sunset</SelectItem>
                <SelectItem value="ocean" className="text-white hover:bg-gray-800">Ocean</SelectItem>
                <SelectItem value="forest" className="text-white hover:bg-gray-800">Forest</SelectItem>
                <SelectItem value="royal" className="text-white hover:bg-gray-800">Royal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card className={`max-w-[80%] ${message.role === 'user' ? 'bg-green-500 text-white' : 'bg-white border-gray-200'}`}>
                <CardContent className="py-3 px-4">
                  <span className={message.role === 'user' ? 'text-white' : 'text-gray-900'}>
                    {message.content}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Show slide editor if editing */}
        {editingSlide !== null && presentation && onSlideModification && onEditSlide && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SlideEditor
              slide={presentation.slides[editingSlide]}
              slideIndex={editingSlide}
              onSave={onSlideModification}
              onCancel={() => onEditSlide(null)}
            />
          </motion.div>
        )}
        
        {/* Show slide quick-edit options when presentation exists */}
        {presentation && !editingSlide && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-3 px-4">
                <p className="text-sm text-blue-800 font-medium mb-2">💡 Quick Actions:</p>
                <div className="flex flex-wrap gap-2">
                  {presentation.slides.map((slide, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => onEditSlide && onEditSlide(index)}
                      className="text-xs bg-white hover:bg-blue-100"
                    >
                      Edit Slide {index + 1}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {messages.length > 4 && (
        <motion.div 
          className="absolute bottom-20 right-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          whileHover={{ scale: 1.1 }}
        >
          <Button 
            size="icon" 
            variant="secondary"
            className="rounded-full shadow-lg bg-white text-gray-900 hover:bg-gray-100"
            onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
          >
            <ArrowDownIcon className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
      
      <div className="p-4 border-t bg-white">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex gap-2"
        >
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your presentation topic..."
            disabled={loading}
            className="flex-grow bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
            style={{ backgroundColor: '#18181b', color: '#fff' }}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!prompt.trim() || loading}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            {loading ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
