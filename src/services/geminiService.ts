import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '' 
});

export const geminiModel = "gemini-3-flash-preview";

export interface ItineraryPlan {
  title: string;
  days: {
    day: number;
    activities: {
      time: string;
      title: string;
      description: string;
      location: string;
    }[];
  }[];
  tips: string[];
}

export async function getTravelAdvice(prompt: string): Promise<{ text: string, sources?: { uri: string, title: string }[] }> {
  try {
    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      config: {
        systemInstruction: "You are an elite travel concierge for 'Rwanda Hub'. Provide real-time, accurate, and culturally sensitive travel advice for Rwanda. Use Google Search to verify current events, weather, safety, and operational status of venues. Always provide grounded and professional recommendations.",
        temperature: 0.7,
        tools: [{ googleSearch: {} }]
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
      uri: chunk.web?.uri || "",
      title: chunk.web?.title || "Real-time source"
    })).filter(s => s.uri !== "") || [];

    return { 
      text: response.text || "I'm sorry, I couldn't provide advice at this time.",
      sources
    };
  } catch (error) {
    console.error("Gemini Error (Advice):", error);
    return { text: "Error: Unable to connect to AI Hub." };
  }
}

export async function translateWithAI(text: string, from: string, to: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: [
        {
          role: "user",
          parts: [{ text: `Translate this text from ${from} to ${to}: "${text}". Only return the translated text without any explanation or quotes.` }]
        }
      ],
      config: {
        systemInstruction: "You are a specialized linguistic translator for Rwandan local languages and international languages common in Rwanda (English, French, Kinyarwanda, Swahili). Provide accurate, context-aware translations.",
        temperature: 0.1,
      }
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Error (Translation):", error);
    return "";
  }
}

export async function generateItinerary(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: geminiModel,
      contents: [
        {
          role: "user",
          parts: [{ text: `You are an expert Rwanda Travel Guide. Create a detailed travel itinerary for: ${prompt}. Focus on local culture, safety, and unique experiences. Provide the response in clear Markdown.` }]
        }
      ],
      config: {
        systemInstruction: "You are an elite travel concierge for 'Rwanda Hub', a premium travel platform. Your goal is to provide high-end, culturally rich, and practical travel advice for Rwanda.",
        temperature: 0.7,
      }
    });

    return response.text || "I'm sorry, I couldn't generate an itinerary at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error: Unable to connect to the AI Pilot. Please check your connection.";
  }
}
