import { SupabaseService } from '../../supabase/supabase.service';
import { ChatState } from './agent.state';

export function createLogConversation(supabase: SupabaseService) {
  return async function logConversation(state: ChatState): Promise<ChatState> {
    const { input, intent, response } = state;

    try {
      await supabase.logConversation(input, intent, response);
      return {
        ...state,
        steps: [{ step: 'LogConversation', result: 'saved' }],
      };
    } catch (err) {
      console.error('Failed to log conversation:', err);
      return {
        ...state,
        steps: [{ step: 'LogConversation', result: 'failed' }],
      };
    }
  };
}
