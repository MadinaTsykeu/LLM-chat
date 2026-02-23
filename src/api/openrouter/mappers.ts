import type { chatMessage } from '@/components/chats/types';
import type { OpenRouterChatMessage, OpenRouterChatCompletionResponse } from './types';

export function mapChatMessagesToOpenRouter(messages: chatMessage[]): OpenRouterChatMessage[] {
  return messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));
}

export function mapOpenRouterResponseToText(data: OpenRouterChatCompletionResponse): string {
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Invalid OpenRouter response format');
  }
  return content;
}
