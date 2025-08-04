import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { OllamaService } from '../llm/ollama.service';
import type { ChatState } from './agent/agent.state';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly ollamaService: OllamaService,
  ) {}

  @Post()
  async handleChat(@Body('message') message: string): Promise<ChatState> {
    const ready = await this.ollamaService.isModelReady();
    if (!ready) {
      throw new HttpException(
        'LLM is still loading. Please try again in a few minutes.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    return this.chatService.processMessage(message);
  }
}
