import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AgentFactoryService } from './agent/agent-factory.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { LlmModule } from '../llm/llm.module';

@Module({
  imports: [SupabaseModule, LlmModule],
  controllers: [ChatController],
  providers: [ChatService, AgentFactoryService],
})
export class ChatModule {}
