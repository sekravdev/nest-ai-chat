import { Injectable } from '@nestjs/common';
import fetch, { RequestInit } from 'node-fetch';
import { sign } from 'jsonwebtoken';

@Injectable()
export class SupabaseService {
  private readonly apiUrl: string;
  private readonly jwtToken: string;

  constructor() {
    this.apiUrl = process.env.SUPABASE_URL ?? 'http://localhost:8000';
    const jwtSecret = process.env.PGRST_JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('PGRST_JWT_SECRET is not defined');
    }

    this.jwtToken = sign({ role: 'anon' }, jwtSecret, {
      algorithm: 'HS256',
    });
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const url = path.startsWith('http')
      ? path
      : `${this.apiUrl}/${path.replace(/^\/+/, '')}`;

    const res = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.jwtToken}`,
        ...(init.headers ?? {}),
      },
    });

    if (!res.ok) {
      let errBody: unknown;
      try {
        errBody = await res.json();
      } catch {
        errBody = await res.text();
      }
      console.error(`Supabase ${init.method ?? 'GET'} error:`, {
        status: res.status,
        error: errBody,
      });
      throw new Error(`Supabase request failed: ${res.status}`);
    }

    const text = await res.text();
    if (!text) {
      return undefined as unknown as T;
    }
    return JSON.parse(text) as T;
  }

  async logConversation(
    message: string,
    intent: string,
    response: string,
  ): Promise<void> {
    await this.request<void>('conversation_logs', {
      method: 'POST',
      body: JSON.stringify({
        message,
        intent,
        response,
        created_at: new Date().toISOString(),
      }),
    });
  }

  async fetchRecentConversations(
    limit = 3,
    timeMinutes = 5,
  ): Promise<{ message: string; response: string }[]> {
    const cutoff = new Date(Date.now() - timeMinutes * 60_000).toISOString();
    const params = new URLSearchParams({
      select: 'message,response',
      order: 'created_at.desc',
      limit: String(limit),
    });
    params.append('created_at', `gt.${cutoff}`);
    return this.request<{ message: string; response: string }[]>(
      `conversation_logs?${params.toString()}`,
    );
  }
}
