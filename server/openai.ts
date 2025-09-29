import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function askAssistant(question: string, context?: string): Promise<string> {
  try {
    const systemPrompt = `You are a helpful property management assistant. You help landlords and property managers with questions about their properties, tenants, maintenance, finances, and general property management best practices.

${context ? `Here is some context about the user's property management system: ${context}` : ''}

Please provide helpful, accurate, and professional responses. If you don't know something specific about their data, explain what information you would need or suggest how they can find it in their system.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process your request. Please try again.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "I'm currently experiencing technical difficulties. Please try your question again in a moment.";
  }
}

export async function analyzeMaintenanceRequest(description: string): Promise<{
  category: string;
  priority: string;
  estimatedCost: number;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are an expert property maintenance analyzer. Analyze maintenance requests and categorize them. Respond with JSON in this format: { "category": "category_name", "priority": "low|medium|high|urgent", "estimatedCost": number }`
        },
        {
          role: "user",
          content: `Analyze this maintenance request: ${description}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content!);
    return {
      category: result.category || "General",
      priority: result.priority || "medium",
      estimatedCost: result.estimatedCost || 0,
    };
  } catch (error) {
    console.error("Error analyzing maintenance request:", error);
    return {
      category: "General",
      priority: "medium",
      estimatedCost: 0,
    };
  }
}
