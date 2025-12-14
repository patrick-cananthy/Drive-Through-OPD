import { GoogleGenAI, Type } from "@google/genai";
import { Vitals } from '../types';

// NOTE: In a production app, never expose API keys on the client side.
// This is for demonstration purposes within the constraints of the environment.
// The prompt instructions say to use process.env.API_KEY.

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface AIAnalysisResult {
  analysis: string;
  suggestions: string[];
}

export const analyzePatientCondition = async (
  age: number,
  gender: string,
  symptoms: string,
  vitals?: Vitals
): Promise<AIAnalysisResult> => {
  if (!process.env.API_KEY) {
    return {
      analysis: "AI Assistant Unavailable: Missing API Key.",
      suggestions: []
    };
  }

  try {
    const vitalString = vitals
      ? `BP: ${vitals.systolic}/${vitals.diastolic} mmHg, Temp: ${vitals.temperature}°C, Pulse: ${vitals.pulse} bpm`
      : 'Vitals not yet recorded';

    const prompt = `
      Act as a medical assistant for a Drive-Through OPD in Ghana.
      Patient: ${age} year old ${gender}.
      Symptoms: ${symptoms}.
      Vitals: ${vitalString}.
      
      1. Provide a brief clinical analysis and recommendation (under 100 words).
      2. Provide a list of 4 likely ICD-10 diagnoses formatted as "Code - Name" (e.g., "A09 - Infectious gastroenteritis").
      
      Return the response in JSON format.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response generated");

    return JSON.parse(text) as AIAnalysisResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
        analysis: "Error generating AI analysis. Please rely on clinical judgment.",
        suggestions: []
    };
  }
};