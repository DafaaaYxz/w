import { GoogleGenAI } from "@google/genai";

// Lazy initialization variable
let aiInstance: GoogleGenAI | null = null;

// SAFELY access process.env to prevent "process is not defined" crashes in browser
const getApiKey = () => {
    try {
        // Check standard process.env (handled by Vite or Polyfill)
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
            return process.env.API_KEY;
        }
    } catch (e) {
        // Ignore error
    }
    return ''; // Return empty string instead of placeholder to let SDK handle validation later if needed
};

// Helper to get or create the AI client safely
const getAiClient = () => {
    if (!aiInstance) {
        const key = getApiKey();
        if (!key) {
            console.warn("Gemini API Key is missing. AI features will fail.");
            // We still return an instance, but it might fail on generation.
            // Using a dummy key to prevent constructor crash if SDK requires string
            aiInstance = new GoogleGenAI({ apiKey: 'MISSING_KEY' }); 
        } else {
            aiInstance = new GoogleGenAI({ apiKey: key });
        }
    }
    return aiInstance;
};

export const initializeGemini = (apiKey: string) => {
  console.log("Gemini API initialized with provided key.");
  // Re-initialize with new key if provided explicitly
  try {
      aiInstance = new GoogleGenAI({ apiKey });
  } catch (e) {
      console.error("Failed to re-initialize Gemini:", e);
  }
};

export const generateResponse = async (
  prompt: string,
  systemInstruction: string,
  base64Image?: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    
    const parts: any[] = [{ text: prompt }];

    if (base64Image) {
      // Remove data URL prefix if present for proper base64 extraction
      const cleanBase64 = base64Image.split(',')[1];
      parts.unshift({
        inlineData: {
          mimeType: 'image/jpeg', // Assuming jpeg for simplicity, or detect from string
          data: cleanBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.9,
      }
    });

    return response.text || "No response generated.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return `System Failure: ${error.message || "Unknown error occurred."}`;
  }
};