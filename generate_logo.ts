import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateLogo() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: "A professional and modern circular school logo for 'Nakeebpur School'. The logo should feature a book, a torch, or a rising sun, symbolizing education and growth. Use a color palette of blue and gold. Minimalist design, high quality, suitable for a mobile app icon.",
        },
      ],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      console.log(part.inlineData.data);
    }
  }
}

generateLogo();
