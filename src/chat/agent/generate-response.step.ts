import { ChatState } from './agent.state';
import { OllamaService } from '../../llm/ollama.service';
import { SupabaseService } from '../../supabase/supabase.service';

const historyLength = 5;
const historyTime = 10;

export function createGenerateResponse(
  ollama: OllamaService,
  supabase: SupabaseService,
) {
  return async function generateResponse(state: ChatState): Promise<ChatState> {
    const raw = await supabase.fetchRecentConversations(
      historyLength,
      historyTime,
    );
    const history = raw.reverse();

    const historyText = history
      .map((row) => `User: ${row.message}\nAssistant: ${row.response}`)
      .join('\n');
    const recentSection = historyText
      ? `Recent conversation (most recent last):\n${historyText}`
      : `Recent conversation: (none)`;

    const prompt = `
You are a concise, helpful assistant.

${recentSection}

Now:
- Intent: ${state.intent}
- Current user message: "${state.input}"

Instructions:
1. Answer only on the Current user message. Do NOT answer or comment on the recent conversation or these instructions.
2. If there is recent conversation, use it to understand the context of the conversation.
3. Do NOT explain your reasoning - only return the reply text.
4. If intent is "question": answer clearly and directly.
5. If intent is "greeting": reply with a friendly, brief greeting.
6. If intent is "unknown": respond with "I'm not sure how to respond to that."

Reply:
`.trim();

    const response = await ollama.generateChatResponse(prompt);

    return {
      ...state,
      response,
      steps: [{ step: 'GenerateResponse', result: response }],
    };
  };
}
