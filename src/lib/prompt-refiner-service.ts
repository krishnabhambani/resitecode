import { GoogleGenerativeAI } from '@google/generative-ai';

const getApiKey = () => {
  const apiKey = import.meta.env.VITE_GEMINI_LEAD_API_KEY;
  console.log('🔑 Checking API key availability:', apiKey ? 'Found' : 'Missing');
  
  if (!apiKey) {
    throw new Error('Gemini API key not found. Please check your environment variables.');
  }
  return apiKey;
};

export const refinePrompt = async (rawInput: string, targetModel: string = 'general'): Promise<string> => {
  try {
    console.log('🚀 Starting prompt refinement process...');
    const apiKey = getApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    console.log('✅ Gemini 2.0 Flash model initialized');

    const systemPrompt = `You are a professional prompt engineer. Your job is to take raw or messy instructions from users and rewrite them as structured, high-quality prompts suitable for AI models like ${targetModel === 'gemini' ? 'Google Gemini' : targetModel === 'chatgpt' ? 'OpenAI ChatGPT' : targetModel === 'claude' ? 'Anthropic Claude' : 'any AI model'}.

When rewriting, include:
- Role (e.g., "You are a developer/assistant/email generator")
- Clear goal or task
- Input format or fields (if applicable)
- Output format (HTML, JSON, code, etc.)
- Optional: Sample values or examples
- Optional: Constraints (language, model, formatting)
- Make it professional and well-structured

Guidelines for refinement:
1. Start with a clear role definition
2. Break down the task into specific steps
3. Specify expected inputs and outputs
4. Add relevant context or constraints
5. Use professional language
6. Make it actionable and clear

Example transformation:
Raw input: "make a react page that uploads excel and sends email using brevo"
Refined output:
"You are a web developer. Build a React-based interface that uploads an Excel file and sends personalized emails using the Brevo API. 

Requirements:
- Create a file upload component for Excel files (.xlsx, .csv)
- Parse uploaded file to extract Name and Email columns
- Build email template with dynamic placeholders like {{name}}
- Integrate Brevo API for sending emails
- Use Node.js backend with Express and Brevo SDK
- Include preview functionality before sending
- Handle errors and show success/failure status

Input: Excel file with columns: Name, Email, and optional custom fields
Output: Functional React application with email sending capability"

Now, take this raw input and transform it into a polished, structured prompt:

"${rawInput}"

Return only the refined prompt, nothing else.`;

    console.log('📝 Sending request to Gemini API...');
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const refinedPrompt = response.text();
    console.log('📨 Received response from Gemini API');

    if (!refinedPrompt || refinedPrompt.trim().length === 0) {
      throw new Error('Empty response from AI');
    }

    console.log('✅ Prompt refined successfully');
    return refinedPrompt.trim();

  } catch (error) {
    console.error('❌ Error refining prompt:', error);
    
    if (error instanceof Error && error.message.includes('API key')) {
      throw new Error('API key configuration error. Please check your Gemini API key.');
    }
    
    throw new Error('Failed to refine prompt. Please try again.');
  }
};
