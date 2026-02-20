import type { chatMessage } from '@/components/chats/types';
import { createChatCompletion } from '@/api/openrouter/openRouterApi';
import { mapChatMessagesToOpenRouter, mapOpenRouterResponseToText } from '@/api/openrouter/mappers';

export async function sendToLLM(messages: chatMessage[]): Promise<string> {
  const data = await createChatCompletion({
    messages: mapChatMessagesToOpenRouter(messages),
  });

  return mapOpenRouterResponseToText(data);
}
