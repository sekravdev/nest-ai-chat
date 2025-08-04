import { Injectable } from '@nestjs/common';
import { AgentFactoryService } from './agent/agent-factory.service';

@Injectable()
export class ChatService {
  constructor(private readonly agentFactory: AgentFactoryService) {}

  async processMessage(message: string) {
    const agent = this.agentFactory.getAgent();
    return await agent.invoke({ input: message });
  }
}
