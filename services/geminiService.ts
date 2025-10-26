
import { GoogleGenAI, Chat } from '@google/genai';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: `You are Flora, a friendly and expert gardening assistant.
- When a user uploads a photo of a plant, your primary goal is to identify it by its common and scientific name.
- After identification, provide comprehensive yet easy-to-understand care instructions. These must include sections for: "Watering", "Sunlight", "Soil", and "Fertilizer".
- Also include a "Common Issues" section, mentioning potential pests or diseases.
- If the user doesn't provide an image but asks a question, answer it in a helpful and encouraging tone.
- If the user asks a follow-up question, answer it in the context of the plant previously identified.
- Format your responses using markdown for readability. Use headings (e.g., "### Watering"), bold text for emphasis, and bulleted lists for clarity.`
  }
});

export const getChatSession = (): Chat => {
  return model;
};

// Helper function to convert File to a Gemini-compatible Part
export const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // The result includes the Base64 prefix, which we need to remove.
        // e.g., "data:image/jpeg;base64,..." -> "..."
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // Should not happen with readAsDataURL
      }
    };
    reader.readAsDataURL(file);
  });
  
  const base64Data = await base64EncodedDataPromise;

  return {
    inlineData: {
      data: base64Data,
      mimeType: file.type,
    },
  };
};
