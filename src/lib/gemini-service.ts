import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Presentation, SlideContent } from './types';
import { fetchImageFromGoogle, generateAIImage } from './image-search';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
  }

  private extractJsonFromResponse(text: string): string {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return jsonMatch[1].trim();
    }
    return text;
  }

  async generatePresentation(topic: string, slideCount: number): Promise<Presentation> {
    const systemPrompt = `
      You are an expert presentation designer. Create a comprehensive, professionally structured presentation about "${topic}" with exactly ${slideCount} slides.

      CRITICAL REQUIREMENTS:
      - SLIDE 1: Title slide with main presentation title and 3-4 engaging bullet points about what the presentation covers
      - SLIDE 2: Table of Contents/Agenda listing all upcoming slide topics
      - SLIDES 3-${slideCount-1}: Content slides, each covering a distinct aspect of ${topic}
      - FINAL SLIDE: Conclusion/Summary with key takeaways

      CONTENT EXCELLENCE STANDARDS:
      - Each slide must have 4-6 substantial bullet points (15-25 words each)
      - Bullet points should provide specific insights, data, examples, or actionable information
      - Avoid generic statements; include concrete details, statistics, or real-world applications
      - Each slide should tell a complete story about its subtopic
      - Progressive flow: each slide should build logically on the previous ones

      IMAGE SPECIFICATIONS:
      - Create highly specific, professional image prompts for each slide
      - Prompts should describe: subject, setting, style (photo/illustration/diagram), composition
      - Images must directly relate to the slide's specific content, not just the general topic
      - Include relevant visual elements like charts, infographics, or professional photography
      - Optimize for 16:9 presentation format

      OUTPUT FORMAT (JSON only, no markdown):
      {
        "title": "[Compelling presentation title]",
        "slides": [
          {
            "title": "[Slide title]",
            "content": ["[Detailed point 1]", "[Detailed point 2]", "[Detailed point 3]", "[Detailed point 4]"],
            "imagePrompt": "[Specific, detailed image description]"
          }
        ]
      }

      QUALITY CHECKLIST:
      ✓ Each slide has unique, valuable content with 4-6 bullet points
      ✓ Bullet points are informative and specific
      ✓ Image prompts are detailed and relevant
      ✓ Logical progression throughout presentation
      ✓ Professional tone and structure
    `;

    try {
      console.log(`Generating enhanced presentation on "${topic}" with ${slideCount} slides...`);
      const result = await this.model.generateContent([systemPrompt]);
      const rawText = await result.response.text();
      console.log("Raw Gemini response:", rawText.substring(0, 200) + "...");
      
      const cleanedText = this.extractJsonFromResponse(rawText);
      console.log("Cleaned JSON:", cleanedText.substring(0, 200) + "...");
      
      try {
        const data = JSON.parse(cleanedText);
        
        if (!data.title || !Array.isArray(data.slides)) {
          console.error("Invalid response format:", data);
          throw new Error('Invalid response format from Gemini');
        }
        
        return {
          title: data.title,
          slides: data.slides.map((slide: any) => ({
            title: slide.title,
            content: Array.isArray(slide.content) ? slide.content.slice(0, 6) : [],
            imagePrompt: slide.imagePrompt || `Professional high-quality image about ${slide.title} related to ${topic}, suitable for business presentation, 16:9 format`,
          })),
          theme: 'light',
        };
      } catch (e) {
        console.error('Failed to parse Gemini response:', e);
        throw new Error('Failed to parse presentation data from AI');
      }
    } catch (e) {
      console.error('Gemini API error:', e);
      throw new Error('Failed to generate presentation content');
    }
  }

  async generateImage(prompt: string): Promise<string | null> {
    console.log("[GeminiService] Starting image search for prompt:", prompt);
    
    // Try Google first
    try {
      const googleResult = await fetchImageFromGoogle(prompt);
      if (googleResult) {
        console.log("[GeminiService] Google Search successful:", googleResult);
        return googleResult;
      }
    } catch (error) {
      console.error("[GeminiService] Google Search failed:", error);
    }
    
    // Fallback to Unsplash
    try {
      const unsplashResult = await generateAIImage(prompt);
      if (unsplashResult) {
        console.log("[GeminiService] Unsplash fallback successful:", unsplashResult);
        return unsplashResult;
      }
    } catch (error) {
      console.error("[GeminiService] Unsplash fallback failed:", error);
    }
    
    console.warn("[GeminiService] All image generation methods failed for prompt:", prompt);
    return null;
  }

  // New: Only get AI/Unsplash fallback image
  async generateAIOnlyImage(prompt: string): Promise<string | null> {
    const aiImage = await generateAIImage(prompt);
    if (aiImage) {
      console.log("[GeminiService] Using AI fallback image:", aiImage);
      return aiImage;
    }
    return null;
  }

  async modifySlide(slideIndex: number, modification: string, currentPresentation: Presentation): Promise<SlideContent> {
    const currentSlide = currentPresentation.slides[slideIndex];
    
    const modificationPrompt = `
      Modify this presentation slide based on the user's request: "${modification}"
      
      Current slide:
      Title: ${currentSlide.title}
      Content: ${currentSlide.content.join(', ')}
      
      Return ONLY valid JSON with this exact structure:
      {
        "title": "[updated title]",
        "content": ["[point 1]", "[point 2]", "[point 3]", "[point 4]"],
        "imagePrompt": "[updated image description]"
      }
      
      Ensure content is professional, detailed, and relevant to the topic "${currentPresentation.title}".
    `;

    try {
      const result = await this.model.generateContent([modificationPrompt]);
      const rawText = await result.response.text();
      const cleanedText = this.extractJsonFromResponse(rawText);
      const data = JSON.parse(cleanedText);
      
      return {
        title: data.title || currentSlide.title,
        content: Array.isArray(data.content) ? data.content : currentSlide.content,
        imagePrompt: data.imagePrompt || currentSlide.imagePrompt,
        imageUrl: currentSlide.imageUrl,
      };
    } catch (error) {
      console.error('Failed to modify slide:', error);
      throw new Error('Failed to modify slide content');
    }
  }
}

export const geminiService = new GeminiService();
