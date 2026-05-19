import { getChats, getChatMessages } from '@/shared/api/chatApi';
import type { TChat, TChatMessage } from '@/features/chat';
import {
  mapBackendChatToChat,
  mapBackendMessageToChatMessage,
} from '@/features/chat/model/chatMappers';

export async function fetchChatsList(): Promise<TChat[]> {
  const response = await getChats();

  const chats = response.data.map(mapBackendChatToChat);

  return [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function fetchChatMessagesList(chatId: string): Promise<TChatMessage[]> {
  const response = await getChatMessages({
    chatId,
    order: 'asc',
  });

  return response.data.map(mapBackendMessageToChatMessage);
}
