import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable must be set");
}

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_PROMPT = `You are a helpful assistant for NI Heating Oil, a Northern Ireland heating oil price comparison platform. You help customers with:

1. Heating oil pricing questions and comparisons
2. Tank size recommendations (300L, 500L, 900L)
3. Local supplier information across Northern Ireland
4. Delivery costs and timing
5. Seasonal pricing advice
6. Energy efficiency tips

Key information about Northern Ireland heating oil:
- Most common tank sizes are 300L, 500L, and 900L
- Prices typically include VAT
- Rural areas may have higher delivery costs
- Winter demand can affect pricing
- Consumer Council provides official price monitoring

Be helpful, concise, and use authentic Belfast expressions occasionally like "bout ye?" (how are you?), "at's us nai" (that's us now/completed), but keep it professional. Focus on practical advice for heating oil customers in Northern Ireland.

If asked about specific current prices, direct users to check the comparison tool on the website as prices change frequently.`;

export async function generateChatResponse(
  messages: ChatMessage[]
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate chat response");
  }
}

export function validateChatMessage(message: any): message is ChatMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    typeof message.role === 'string' &&
    ['user', 'assistant', 'system'].includes(message.role) &&
    typeof message.content === 'string' &&
    message.content.trim().length > 0
  );
}