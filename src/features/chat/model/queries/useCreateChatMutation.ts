import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { createChat as createBackendChat } from '@/shared/api/chatApi';
import { mapBackendChatToChat } from '@/features/chat/model/chatMappers';
import { upsertChatInList, setEmptyChatMessages } from '../chatMutationsHelpers';

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

      return mapBackendChatToChat(response.data);
    },

    onSuccess: (chat) => {
      upsertChatInList(queryClient, chat);
      setEmptyChatMessages(queryClient, chat.id);
    },
  });
}