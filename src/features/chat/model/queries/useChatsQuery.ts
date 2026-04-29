import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getChats } from '@/shared/api/chatApi';
import { mapBackendChatToChat } from '@/features/chat/model/chatMappers';
import { chatQueryKeys } from './chatQueryKeys';

export function useChatsQuery() {
  return useQuery({
    queryKey: chatQueryKeys.lists(),

    queryFn: async () => {
      const response = await getChats();

      return response.data.map(mapBackendChatToChat);
    },

    select: (chats) => {
      return [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
    },

    staleTime: 30_000,
  });
}