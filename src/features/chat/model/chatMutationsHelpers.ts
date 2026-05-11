import type { QueryClient } from '@tanstack/vue-query';
import type { TChat, TChatMessage } from '@/features/chat';
import { chatQueryKeys } from './queries/chatQueryKeys';

export const DEFAULT_MODEL = import.meta.env.VITE_OPENROUTER_MODEL;

export function createClientMessageId(): string {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getSendingKey(chatId?: string): string {
  return chatId ?? '__new_chat__';
}

export function findOriginalUserMessage(
  messages: TChatMessage[],
  assistantMessageId: string
): TChatMessage | undefined {
  const assistantMessageIndex = messages.findIndex(
    (message) => message.id === assistantMessageId && message.role === 'assistant'
  );

  if (assistantMessageIndex === -1) {
    return undefined;
  }

  const previousMessages = messages.slice(0, assistantMessageIndex);

  return [...previousMessages].reverse().find((message) => message.role === 'user');
}

export function upsertChatInList(queryClient: QueryClient, chat: TChat): void {
  queryClient.setQueryData<TChat[]>(chatQueryKeys.lists(), (oldChats = []) => {
    const withoutSameChat = oldChats.filter((item) => item.id !== chat.id);
    return [chat, ...withoutSameChat];
  });
}

export function patchChatInList(
  queryClient: QueryClient,
  chatId: string,
  patch: Partial<Pick<TChat, 'title' | 'updatedAt'>>
): void {
  queryClient.setQueryData<TChat[]>(chatQueryKeys.lists(), (oldChats = []) => {
    const currentChat = oldChats.find((chat) => chat.id === chatId);

    if (!currentChat) {
      return oldChats;
    }

    const updatedChat: TChat = {
      ...currentChat,
      ...patch,
    };

    return [updatedChat, ...oldChats.filter((chat) => chat.id !== chatId)];
  });
}

export function setEmptyChatMessages(queryClient: QueryClient, chatId: string): void {
  queryClient.setQueryData<TChatMessage[]>(chatQueryKeys.messages(chatId), []);
}

export function appendChatMessages(
  queryClient: QueryClient,
  chatId: string,
  newMessages: TChatMessage[]
): void {
  queryClient.setQueryData<TChatMessage[]>(chatQueryKeys.messages(chatId), (oldMessages = []) => [
    ...oldMessages,
    ...newMessages,
  ]);
}

export function replaceAssistantMessage(
  queryClient: QueryClient,
  chatId: string,
  assistantMessageId: string,
  newAssistantMessage: TChatMessage
): void {
  queryClient.setQueryData<TChatMessage[]>(chatQueryKeys.messages(chatId), (oldMessages = []) => {
    const assistantIndex = oldMessages.findIndex(
      (message) => message.id === assistantMessageId && message.role === 'assistant'
    );

    if (assistantIndex === -1) {
      return [...oldMessages, newAssistantMessage];
    }

    const previousMessages = oldMessages.slice(0, assistantIndex);

    return [...previousMessages, newAssistantMessage];
  });
}
