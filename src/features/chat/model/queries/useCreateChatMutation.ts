import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { TChat } from '@/features/chat';
import { createChat as createBackendChat } from '@/shared/api/chatApi';
import { mapBackendChatToChat } from '@/features/chat/model/chatMappers';
import { chatQueryKeys } from './chatQueryKeys';

type TCreateChatMutationPayload = {
  title?: string | null;
};

export function useCreateChatMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload?: TCreateChatMutationPayload) => {
      const response = await createBackendChat({
        title: payload?.title ?? null,
      });

      const chat = mapBackendChatToChat(response.data);

      queryClient.setQueryData<TChat[]>(chatQueryKeys.lists(), (oldChats = []) => {
        return [chat, ...oldChats];
      });

      return chat;
    },
  });
}