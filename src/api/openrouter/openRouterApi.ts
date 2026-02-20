import { AxiosError } from 'axios';
import { openRouterHttp } from '@/api/http/openRouterHttp';
import type { OpenRouterChatCompletionRequest, OpenRouterChatCompletionResponse } from './types';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const MODEL = import.meta.env.VITE_OPENROUTER_MODEL;

function assertEnv() {
  const BASE_URL = import.meta.env.VITE_OPENROUTER_BASE_URL;
  if (!API_KEY || !MODEL || !BASE_URL) {
    throw new Error('OpenRouter env is not configured. Check .env file.');
  }
}

function extractAxiosErrorMessage(err: unknown): string {
  if (err instanceof AxiosError) {
    const data = err.response?.data;
    if (typeof data === 'string') return data;
    if (data && typeof data === 'object') return JSON.stringify(data);
    return err.message;
  }
  return err instanceof Error ? err.message : String(err);
}

export async function createChatCompletion(
  payload: Omit<OpenRouterChatCompletionRequest, 'model'>
): Promise<OpenRouterChatCompletionResponse> {
  assertEnv();

  try {
    const res = await openRouterHttp.post<OpenRouterChatCompletionResponse>(
      '/chat/completions',
      {
        model: MODEL,
        messages: payload.messages,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    throw new Error(extractAxiosErrorMessage(err));
  }
}
