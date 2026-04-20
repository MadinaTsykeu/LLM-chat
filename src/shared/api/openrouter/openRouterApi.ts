import { AxiosError } from 'axios';
import { openRouterHttp } from '../http/openRouterHttp';
import type { OpenRouterChatCompletionRequest, OpenRouterChatCompletionResponse } from './types';

const MODEL = import.meta.env.VITE_OPENROUTER_MODEL;

function assertEnv() {
  const BASE_URL = import.meta.env.VITE_OPENROUTER_BASE_URL;

  if (!MODEL || !BASE_URL) {
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
  apiKey: string,
  payload: Omit<OpenRouterChatCompletionRequest, 'model'>
): Promise<OpenRouterChatCompletionResponse> {
  assertEnv();

  if (!apiKey) {
    throw new Error('OpenRouter API key is missing');
  }

  try {
    const res = await openRouterHttp.post<OpenRouterChatCompletionResponse>(
      '/chat/completions',
      {
        model: MODEL,
        messages: payload.messages,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    throw new Error(extractAxiosErrorMessage(err));
  }
}
