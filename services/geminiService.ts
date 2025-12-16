import { GoogleGenAI, Type } from "@google/genai";
import { Bin } from "../types";

// Helper to get safe API client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("No API_KEY provided in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export interface OptimizationResult {
  analysis: string;
  recommendedRoute: string[];
  estimatedSavings: string;
}

export const generateOptimizationReport = async (bins: Bin[]): Promise<OptimizationResult | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  // Filter only bins that need attention to reduce token usage and focus context
  const criticalBins = bins.filter(b => b.fillLevel > 60 || b.temperature > 30);
  
  const prompt = `
    You are an AI logistics expert for a waste management company called "WasteAI".
    Analyze the following bin sensor data and propose an optimized collection route.
    Prioritize bins with 'CRITICAL' fill levels (>85%) or temperature anomalies (>30C).
    
    Current Date: ${new Date().toISOString()}
    
    Bin Data:
    ${JSON.stringify(criticalBins.map(b => ({
      id: b.id,
      location: b.locationName,
      fill: b.fillLevel,
      temp: b.temperature,
      type: b.type
    })))}

    Return a JSON object with the following structure:
    {
      "analysis": "A brief textual summary of the current situation and urgency.",
      "recommendedRoute": ["List of Bin IDs in order of collection"],
      "estimatedSavings": "A textual estimate of fuel/time saved vs standard route (e.g., '15% fuel reduction')"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            recommendedRoute: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            estimatedSavings: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as OptimizationResult;

  } catch (error) {
    console.error("Gemini optimization failed:", error);
    return {
      analysis: "AI Service currently unavailable. Proceeding with manual schedule.",
      recommendedRoute: [],
      estimatedSavings: "N/A"
    };
  }
};

export const chatWithAssistant = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
    const ai = getAiClient();
    if (!ai) return "API Key missing.";

    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history,
            config: {
                systemInstruction: "You are the WasteAI Studio Assistant. You help waste managers optimize operations, understand regulations, and manage fleet data. Keep answers concise and professional."
            }
        });
        
        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (error) {
        console.error("Chat error", error);
        return "I'm having trouble connecting to the WasteAI network right now.";
    }
}

export const analyzeWasteImage = async (base64Image: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI Service Unavailable";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: "Analyze this image for waste management purposes. Identify the type of waste (General, Recyclable, Hazardous, Organic, or Bulky), estimate the volume, and check for any illegal dumping or overflow issues. Keep the response concise (max 2 sentences)."
          }
        ]
      }
    });
    return response.text || "Could not analyze image.";
  } catch (error) {
    console.error("Image analysis failed:", error);
    return "Unable to process image at this time.";
  }
};