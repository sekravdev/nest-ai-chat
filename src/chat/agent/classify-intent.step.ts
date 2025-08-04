import { ChatState } from './agent.state';
import { OllamaService } from '../../llm/ollama.service';

export function createClassifyIntent(ollama: OllamaService) {
  return async function classifyIntent(state: ChatState): Promise<ChatState> {
    const input = state.input;
    let intent = 'unknown';

    try {
      const prompt = `
You are an intent classification model. Your task is to classify the user's intent based on their message.

Possible intents:
- "greeting": The user says Hello, Hi, etc to you.
- "question": The user is asking a factual, rhetorical, or clarifying question.
- "unknown": The user is neutral, says opinion, reacting to something or message doesn't clearly fit the other categories or ambiguous.

Classify the following user message into one of the intents above.

Only reply with one word: greeting, question, or unknown. No explanation.

User message:
"${input}"

Intent:
`.trim();

      const raw = await ollama.generateChatResponse(prompt);
      const cleaned = raw.trim().toLowerCase();

      if (['greeting', 'question', 'unknown'].includes(cleaned)) {
        intent = cleaned;
      }
    } catch (err) {
      console.error('Ollama intent classification failed:', err);
    }

    return {
      ...state,
      intent,
      steps: [{ step: 'ClassifyIntent', result: intent }],
    };
  };
}
