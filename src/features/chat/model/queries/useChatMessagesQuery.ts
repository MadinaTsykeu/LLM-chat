import { computed, type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getChatMessages } from '@/shared/api/chatApi';
import { mapBackendMessageToChatMessage } from '@/features/chat/model/chatMappers';
import { chatQueryKeys } from './chatQueryKeys';

export function useChatMessagesQuery(chatId: Ref<string>) {
  return useQuery({
    queryKey: computed(() => chatQueryKeys.messages(chatId.value)),

    queryFn: async () => {
      const response = await getChatMessages({
        chatId: chatId.value,
        order: 'asc',
      });

      return response.data.map(mapBackendMessageToChatMessage);
    },

    enabled: computed(() => Boolean(chatId.value)),

    staleTime: 10_000,
  });
}