import { Injectable } from '@nestjs/common';
import { buildAgentWorkflow } from './agent.workflow';
import { OllamaService } from '../../llm/ollama.service';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class AgentFactoryService {
  private readonly agent: ReturnType<typeof buildAgentWorkflow>;

  constructor(
    private readonly ollama: OllamaService,
    private readonly supabase: SupabaseService,
  ) {
    this.agent = buildAgentWorkflow(this.ollama, this.supabase);
  }

  getAgent() {
    return this.agent;
  }
}
