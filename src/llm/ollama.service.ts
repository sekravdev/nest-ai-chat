import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface OllamaTag {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: Record<string, any>;
}

interface TagsResponse {
  models: OllamaTag[];
}

@Injectable()
export class OllamaService {
  private readonly baseUrl = 'http://ollama:11434';

  async generateChatResponse(prompt: string): Promise<string> {
    const res = await axios.post<{ response: string }>(
      `${this.baseUrl}/api/generate`,
      { model: 'llama3', prompt, stream: false },
    );
    return res.data.response;
  }

  async listModels(): Promise<OllamaTag[]> {
    const res = await axios.get<TagsResponse>(`${this.baseUrl}/api/tags`);
    return res.data.models ?? [];
  }

  async isModelReady(): Promise<boolean> {
    const models = await this.listModels();
    return models.length > 0;
  }
}
