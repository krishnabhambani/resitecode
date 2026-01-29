import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Presentation } from "@/lib/types";
import { ChatInterface } from "./ChatInterface";
import { PresentationPreview } from "./PresentationPreview";
import { geminiService } from "@/lib/gemini-service";
import { useToast } from "@/hooks/use-toast";
import { SlideEditor } from "./SlideEditor";

export function AppBuilder() {
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'midnight' | 'skywave' | 'mint' | 'sunset' | 'ocean' | 'forest' | 'royal'>('light');
  const [editingSlide, setEditingSlide] = useState<number | null>(null);
  const { toast } = useToast();

  const handleGeneratePresentation = async (prompt: string, slideCount: number) => {
    try {
      setLoading(true);
      
      if (!prompt || prompt.trim() === "") {
        toast({
          title: "Missing Topic",
          description: "Please provide a topic for your presentation.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      let newPresentation;
      
      try {
        newPresentation = await geminiService.generatePresentation(prompt, slideCount);
        
        console.log("Generated presentation with", newPresentation.slides.length, "slides");
        console.log("Slides with image prompts:", newPresentation.slides.filter(s => s.imagePrompt).length);
        
        console.log("Starting enhanced image generation for all slides...");
        
        // Process images with better error handling
        const imagePromises = newPresentation.slides.map(async (slide, index) => {
          console.log(`[ImageProcess] Processing slide ${index + 1}: "${slide.title}"`);
          
          if (slide.imagePrompt) {
            console.log(`[ImageProcess] Image prompt for slide ${index + 1}:`, slide.imagePrompt);
            
            try {
              const imageUrl = await geminiService.generateImage(slide.imagePrompt);
              if (imageUrl) {
                console.log(`[ImageProcess] SUCCESS - Slide ${index + 1} got image:`, imageUrl);
                return { ...slide, imageUrl };
              } else {
                console.warn(`[ImageProcess] FAILED - No image found for slide ${index + 1}`);
                return { ...slide, imageUrl: null };
              }
            } catch (error) {
              console.error(`[ImageProcess] ERROR - Slide ${index + 1} image generation failed:`, error);
              return { ...slide, imageUrl: null };
            }
          } else {
            console.log(`[ImageProcess] No image prompt for slide ${index + 1}`);
            return { ...slide, imageUrl: null };
          }
        });
        
        const updatedSlides = await Promise.all(imagePromises);
        
        const slidesWithImages = updatedSlides.filter(s => s.imageUrl);
        console.log(`[ImageProcess] FINAL RESULT: ${slidesWithImages.length}/${updatedSlides.length} slides have images`);
        
        // Log each slide's image status
        updatedSlides.forEach((slide, index) => {
          console.log(`[ImageProcess] Slide ${index + 1} final image status:`, slide.imageUrl ? 'HAS IMAGE' : 'NO IMAGE');
          if (slide.imageUrl) {
            console.log(`[ImageProcess] Slide ${index + 1} image URL:`, slide.imageUrl);
          }
        });
        
        newPresentation = {
          ...newPresentation,
          slides: updatedSlides,
          theme: selectedTheme
        };
        
      } catch (apiError) {
        console.error("API Generation failed:", apiError);
        toast({
          title: "Generation Failed",
          description: "Failed to generate presentation content. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      setPresentation(newPresentation);
      toast({
        title: "Presentation Generated",
        description: `Your presentation is ready! ${newPresentation.slides.filter(s => s.imageUrl).length} slides have images.`
      });
    } catch (error) {
      console.error("Failed to generate presentation:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate your presentation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSlideModification = async (slideIndex: number, modification: string) => {
    if (!presentation) return;
    
    try {
      const modifiedSlide = await geminiService.modifySlide(slideIndex, modification, presentation);
      
      if (modifiedSlide.imagePrompt) {
        const newImageUrl = await geminiService.generateImage(modifiedSlide.imagePrompt);
        modifiedSlide.imageUrl = newImageUrl;
      }
      
      const updatedSlides = [...presentation.slides];
      updatedSlides[slideIndex] = modifiedSlide;
      
      setPresentation({
        ...presentation,
        slides: updatedSlides
      });
      
      setEditingSlide(null);
      
      toast({
        title: "Slide Updated",
        description: `Slide ${slideIndex + 1} has been successfully modified.`
      });
    } catch (error) {
      console.error("Failed to modify slide:", error);
      toast({
        title: "Modification Failed",
        description: "Failed to modify the slide. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'midnight' | 'skywave' | 'mint' | 'sunset' | 'ocean' | 'forest' | 'royal') => {
    setSelectedTheme(theme);
    
    if (presentation) {
      setPresentation({
        ...presentation,
        theme
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-[calc(100vh-64px)] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div 
          className="h-full border-r overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <ChatInterface 
            onSubmit={handleGeneratePresentation}
            loading={loading}
            onThemeChange={handleThemeChange}
            currentTheme={selectedTheme}
            presentation={presentation}
            onEditSlide={setEditingSlide}
            onSlideModification={handleSlideModification}
            editingSlide={editingSlide}
          />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div 
          className="h-full overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5 }}
        >
          <PresentationPreview 
            presentation={presentation}
            loading={loading}
            onEditSlide={setEditingSlide}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
