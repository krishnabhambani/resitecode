
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export class GeminiWebsiteService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = import.meta.env.VITE_BUILDER_API;
    
    if (!apiKey) {
      throw new Error('VITE_BUILDER_API is not set in environment variables');
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

  async generateWebsite(description: string): Promise<{ html: string; instructions: string }> {
    const websitePrompt = `
      Create a fully functional web application based on this description: "${description}"

      TECHNICAL REQUIREMENTS:
      - Return ONLY complete HTML code starting with <!DOCTYPE html>
      - Include embedded CSS in <style> tags and JavaScript in <script> tags within the HTML
      - Make it fully functional and interactive
      - Use modern CSS Grid/Flexbox for layouts
      - Include proper viewport meta tag
      - Add loading states and error handling where appropriate
      - Use CSS custom properties for theming
      - Include proper form validation if forms are present

      ACCESSIBILITY REQUIREMENTS (WCAG 2.1 AA):
      - Use semantic HTML5 elements (header, nav, main, section, aside, footer)
      - Include proper ARIA labels, roles, and descriptions
      - Ensure keyboard navigation support (tab order, focus management)
      - Use high contrast colors (minimum 4.5:1 ratio)
      - Make touch targets at least 44px in size
      - Include skip links for screen readers
      - Use proper heading hierarchy (h1, h2, h3, etc.)
      - Add alt text for all images
      - Include focus indicators for interactive elements

      IMAGE PLACEHOLDERS:
      - Use placeholder images from https://picsum.photos/ for any images needed
      - Format: <img src="https://picsum.photos/800/600" alt="Descriptive alt text" />
      - Add comments above images: <!-- Replace with your own image -->
      - Make sure images are responsive with CSS

      DESIGN REQUIREMENTS:
      - Clean, modern, professional appearance
      - Consistent color scheme with high contrast
      - Readable typography (minimum 16px font size)
      - Proper spacing and visual hierarchy
      - Responsive design that works on all devices (mobile-first)
      - Loading animations and smooth transitions
      - Visual feedback for user interactions

      The website should be complete, production-ready, and fully functional with HTML, CSS, and JavaScript.
    `;

    const instructionsPrompt = `
      Generate a brief, user-friendly guide for this web application: "${description}"

      Include:
      1. How to use the application (2-3 sentences)
      2. Key features (3-4 bullet points)
      3. Tips for customization (1-2 helpful tips)
      4. How to replace placeholder images

      Keep it concise and practical.
    `;

    try {
      console.log('Generating website for:', description);
      
      // Generate website HTML
      const websiteResult = await this.model.generateContent([websitePrompt]);
      const htmlText = await websiteResult.response.text();
      
      // Clean up the HTML response
      let cleanedHtml = htmlText.trim();
      if (cleanedHtml.includes('```html')) {
        cleanedHtml = cleanedHtml.replace(/```html\s*/, '').replace(/```\s*$/, '').trim();
      } else if (cleanedHtml.includes('```')) {
        cleanedHtml = cleanedHtml.replace(/```\s*/, '').replace(/```\s*$/, '').trim();
      }

      console.log('Website HTML generated, length:', cleanedHtml.length);
      
      // Generate instructions
      const instructionsResult = await this.model.generateContent([instructionsPrompt]);
      const instructionsText = await instructionsResult.response.text();
      
      console.log('Instructions generated');

      return {
        html: cleanedHtml,
        instructions: instructionsText.trim()
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate website content');
    }
  }
}

export const geminiWebsiteService = new GeminiWebsiteService();
