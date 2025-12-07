
import { GoogleGenAI } from "@google/genai";

// Store the pool of available keys
let keyPool: string[] = [];

// Fallback to process.env if no keys provided in config
const getEnvKey = () => {
    try {
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
            return process.env.API_KEY;
        }
        // Fallback for window.process polyfill
        if ((window as any).process?.env?.API_KEY) {
            return (window as any).process.env.API_KEY;
        }
    } catch (e) {
        // Ignore
    }
    return '';
};

// Initialize or update the key pool
export const initializeGemini = (apiKeys: string[]) => {
    // Sanitize keys: Trim whitespace, remove empty strings
    const sanitizedKeys = apiKeys
        .map(k => k.trim())
        .filter(k => k.length > 0);
    
    keyPool = sanitizedKeys;
    
    console.log(`[GeminiService] Initialized with ${keyPool.length} active keys.`);
};

// Get a client instance using a random key from the pool
const getAiClient = () => {
    let selectedKey = '';

    if (keyPool.length > 0) {
        // Simple rotation: Pick random key to distribute load
        const randomIndex = Math.floor(Math.random() * keyPool.length);
        selectedKey = keyPool[randomIndex];
    } else {
        // Try fallback
        selectedKey = getEnvKey();
    }

    if (!selectedKey) {
        throw new Error("No Valid API Keys Available. Please configure keys in Admin Panel.");
    }

    // Return new instance with the selected key
    return new GoogleGenAI({ apiKey: selectedKey });
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
          mimeType: 'image/jpeg', 
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
    
    // enhance error message for UI
    let msg = error.message || "Unknown error occurred.";
    if (msg.includes("400") || msg.includes("INVALID_ARGUMENT")) {
        msg = "API Key Invalid or Expired (400). Check Admin Config.";
    } else if (msg.includes("429")) {
        msg = "Rate Limit Exceeded (429). Rotating keys...";
    }
    
    return `System Failure: ${msg}`;
  }
};
