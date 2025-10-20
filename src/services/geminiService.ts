import axios from "axios";
import Constants from "expo-constants"; //

// Safely access the 'extra' field where we injected the secrets
const extra = Constants.expoConfig?.extra ?? {};

const GEMINI_API_KEY = extra.GEMINI_API_KEY;
const GEMINI_API_URL = extra.GEMINI_API_URL;

interface Message {
  text: string;
  isUser: boolean;
  timestamp: number;
}

class GeminiService {
  private systemPrompt = `You are AIVAK, a professional AI business assistant designed for small and medium business owners aged 35+. 

**YOUR PERSONALITY:**
- Professional yet friendly and approachable
- Knowledgeable about business operations
- Focused on practical, actionable advice
- Clear and detailed in explanations
- Uses formatting for better readability

**YOUR EXPERTISE:**
- **Financial Management**: Cash flow, budgeting, invoicing, accounting
- **Business Strategy**: Growth planning, market analysis, competitive positioning  
- **Operations**: Process optimization, workflow management, productivity
- **Marketing & Sales**: Customer acquisition, retention, digital marketing
- **Leadership**: Team management, hiring, performance management
- **Technology**: Business software, automation, digital transformation

**RESPONSE GUIDELINES:**
- Provide detailed, comprehensive answers (150-300 words)
- Use **bold text** for key points and important terms
- Use bullet points for actionable steps
- Include specific examples when relevant
- Ask follow-up questions to better assist
- Format responses with clear structure using markdown

**RESPONSE STRUCTURE:**
1. **Brief direct answer** to the question
2. **Detailed explanation** with context
3. **Actionable steps** or recommendations
4. **Follow-up question** to continue the conversation

Remember: You're helping business owners make informed decisions that impact their success.`;

  async generateResponse(
    userMessage: string,
    conversationHistory: Message[]
  ): Promise<string> {
    try {
      // Build conversation context
      const contextMessages = this.buildConversationContext(
        conversationHistory,
        userMessage
      );

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `${this.systemPrompt}\n\nConversation Context:\n${contextMessages}\n\nUser Question: ${userMessage}\n\nYour Response:`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
          stopSequences: [],
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      };

      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return this.processResponse(
          response.data.candidates[0].content.parts[0].text
        );
      }

      return "I'm having trouble generating a response right now. Could you please rephrase your question or try again?";
    } catch (error: any) {
      console.error("Gemini API Error:", error.response?.data || error.message);

      if (error.code === "ECONNABORTED") {
        return "I'm taking longer than usual to respond. Please try your question again.";
      }

      return "I'm experiencing some technical difficulties. Please try your question again in a moment.";
    }
  }

  private buildConversationContext(
    messages: Message[],
    currentMessage: string
  ): string {
    // Get last 6 messages for context (excluding welcome message)
    const recentMessages = messages
      .filter((msg) => !msg.text.includes("Hello") && !msg.text.includes("👋"))
      .slice(-6)
      .map(
        (msg) =>
          `${msg.isUser ? "User" : "AIVAK"}: ${msg.text.substring(0, 200)}`
      )
      .join("\n");

    return recentMessages;
  }

  private processResponse(response: string): string {
    // Clean up the response
    let processedResponse = response.trim();

    // Remove any AI prefix if present
    processedResponse = processedResponse.replace(
      /^(AI Assistant|AIVAK):\s*/i,
      ""
    );

    // Ensure proper markdown formatting
    processedResponse = processedResponse.replace(/\*\*([^*]+)\*\*/g, "**$1**");

    // Clean up excessive line breaks
    processedResponse = processedResponse.replace(/\n{3,}/g, "\n\n");

    return processedResponse;
  }

  // Business-specific helper methods
  async getInvoiceAdvice(query: string): Promise<string> {
    const invoicePrompt = `As a business finance expert, provide detailed advice about: "${query}". 

    Include:
    - **Best practices** for the situation
    - **Step-by-step actions** to take
    - **Common mistakes** to avoid
    - **Tools or templates** that could help
    
    Keep the response detailed but actionable (200-250 words).`;

    return this.generateSpecificResponse(invoicePrompt);
  }

  private async generateSpecificResponse(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 512 },
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 20000,
        }
      );

      return (
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I can help you with that. What specific aspect would you like me to focus on?"
      );
    } catch (error) {
      return "I'm here to help with your business needs. Could you provide more details about what you'd like assistance with?";
    }
  }
}

export default new GeminiService();
