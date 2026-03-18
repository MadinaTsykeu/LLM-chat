import type { TChatMessage } from '@/features/chat';
import { createChatCompletion } from './openrouter/openRouterApi';
import { mapChatMessagesToOpenRouter, mapOpenRouterResponseToText } from './openrouter/mappers';

export async function sendToLLM(messages: TChatMessage[]): Promise<string> {
  const data = await createChatCompletion({
    messages: mapChatMessagesToOpenRouter(messages),
  });

  return mapOpenRouterResponseToText(data);
}
