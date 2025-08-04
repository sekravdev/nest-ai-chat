import { StateGraph } from '@langchain/langgraph';
import { createClassifyIntent } from './classify-intent.step';
import { createGenerateResponse } from './generate-response.step';
import { createLogConversation } from './log-conversation.step';
import { OllamaService } from '../../llm/ollama.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { State } from './agent.state';

export function buildAgentWorkflow(
  ollama: OllamaService,
  supabase: SupabaseService,
) {
  const classifyIntent = createClassifyIntent(ollama);
  const generateResponse = createGenerateResponse(ollama, supabase);
  const logConversation = createLogConversation(supabase);

  const graph = new StateGraph(State)
    .addNode('ClassifyIntent', classifyIntent)
    .addNode('GenerateResponse', generateResponse)
    .addNode('LogConversation', logConversation)
    .addEdge('__start__', 'ClassifyIntent')
    .addEdge('ClassifyIntent', 'GenerateResponse')
    .addEdge('GenerateResponse', 'LogConversation')
    .addEdge('LogConversation', '__end__')
    .compile();

  return graph;
}
