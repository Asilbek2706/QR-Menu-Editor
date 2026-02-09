
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

const langNames = {
  uz: "Uzbek",
  ru: "Russian",
  en: "English"
};

export const generateItemDescription = async (itemName: string, category: string, lang: Language): Promise<string> => {
  // Use the API key directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Act as a world-class culinary copywriter. Write a mouth-watering, appetizing, 2-sentence description for a menu item named "${itemName}" in the category "${category}". Write it in ${langNames[lang]} language. Do not use quotes.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // response.text is a property, not a method
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "";
  }
};
