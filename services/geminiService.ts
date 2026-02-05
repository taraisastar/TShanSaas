
import { GoogleGenAI, Type } from "@google/genai";

export const generateTenantContent = async (description: string, name: string) => {
  // The string 'process.env.API_KEY' is replaced by GitHub Actions during build.
  // We check for several "uninitialized" states.
  const apiKey = process.env.API_KEY;
  
  const isInvalid = !apiKey || 
                    apiKey === 'undefined' || 
                    apiKey === 'PLACEHOLDER' || 
                    apiKey.includes('process.env');

  if (isInvalid) {
    throw new Error("[SYS-E01] AUTHENTICATION_ERROR: API Key is not injected. Check GitHub Repository Secrets for 'GEMINI_API_KEY'.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate professional landing page content for a company named "${name}". The business description is: "${description}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            heroTitle: { type: Type.STRING },
            heroSubtitle: { type: Type.STRING },
            aboutSection: { type: Type.STRING },
            suggestedColor: { type: Type.STRING, description: "A hex code that fits the brand" }
          },
          required: ["heroTitle", "heroSubtitle", "aboutSection", "suggestedColor"]
        }
      }
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("AI Service Error:", err);
    throw new Error("[SYS-E02] HANDSHAKE_ERROR: External API call failed. Verify usage quotas.");
  }
};
