
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

// Helper: Get a client for a specific key
const createClientForKey = (key: string) => {
    return new GoogleGenAI({ apiKey: key });
};

export const generateResponse = async (
  prompt: string,
  systemInstruction: string,
  base64Image?: string
): Promise<string> => {
    // 1. Prepare Content Parts
    const parts: any[] = [{ text: prompt }];
    if (base64Image) {
        const cleanBase64 = base64Image.split(',')[1];
        parts.unshift({
            inlineData: {
                mimeType: 'image/jpeg', 
                data: cleanBase64
            }
        });
    }

    // 2. Determine Keys to use
    // If we have a pool, copy it so we can iterate. If not, use fallback env key.
    let availableKeys = keyPool.length > 0 ? [...keyPool] : [getEnvKey()];
    // Shuffle keys for randomness (Fisher-Yates)
    for (let i = availableKeys.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableKeys[i], availableKeys[j]] = [availableKeys[j], availableKeys[i]];
    }

    // Remove empty keys
    availableKeys = availableKeys.filter(k => k && k.length > 10);

    if (availableKeys.length === 0) {
        return "System Failure: No Valid API Keys Configuration Found.";
    }

    // 3. Retry Loop (Smart Key Rotation)
    let lastError: any = null;

    for (const apiKey of availableKeys) {
        try {
            const ai = createClientForKey(apiKey);
            
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

            // If successful, return immediately
            return response.text || "No response generated.";

        } catch (error: any) {
            lastError = error;
            const msg = error.message || "";
            
            // Check if we should retry with next key
            const isRetryable = msg.includes("429") || msg.includes("400") || msg.includes("Quota") || msg.includes("limit");
            
            if (isRetryable) {
                console.warn(`[Gemini] Key failed (${msg}). Rotating to next key...`);
                continue; // Try next iteration of loop
            } else {
                // If it's a different error (e.g. invalid prompt), throw it or stop
                console.error("[Gemini] Non-retryable error:", error);
                break; 
            }
        }
    }

    // 4. All attempts failed
    console.error("Gemini All Keys Failed:", lastError);
    let errorMsg = lastError?.message || "Unknown error";
    if (errorMsg.includes("429")) return "System Failure: All Neural Nodes Overloaded (429). Try again later.";
    if (errorMsg.includes("400")) return "System Failure: Invalid Key Configuration (400).";
    
    return `System Failure: ${errorMsg}`;
};
