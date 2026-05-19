import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { TChatMessage } from '@/features/chat';
import { sendChatMessage } from '@/shared/api/chatApi';
import { mapBackendMessageToChatMessage } from '@/features/chat/model/chatMappers';
import { chatQueryKeys } from './chatQueryKeys';
import {
  DEFAULT_MODEL,
  createClientMessageId,
  findOriginalUserMessage,
  replaceAssistantMessage,
} from '../chatMutationsHelpers';

type TRetryMessageMutationPayload = {
  chatId: string;
  assistantMessageId: string;
};

type TRetryMessageMutationResult = {
  assistantMessage: TChatMessage;
};

export function useRetryMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: TRetryMessageMutationPayload
    ): Promise<TRetryMessageMutationResult> => {
      const messages =
        queryClient.getQueryData<TChatMessage[]>(chatQueryKeys.messages(payload.chatId)) ?? [];

      const originalUserMessage = findOriginalUserMessage(messages, payload.assistantMessageId);

      if (!originalUserMessage || originalUserMessage.role !== 'user') {
        throw new Error('Original user message not found');
      }

      const response = await sendChatMessage({
        chatId: payload.chatId,
        content: originalUserMessage.content,
        model: DEFAULT_MODEL,
        clientMessageId: createClientMessageId(),
        attachments: originalUserMessage.attachments ?? [],
      });

      return {
        assistantMessage: mapBackendMessageToChatMessage(response.data.assistantMessage),
      };
    },

    onSuccess: (result, payload) => {
      replaceAssistantMessage(
        queryClient,
        payload.chatId,
        payload.assistantMessageId,
        result.assistantMessage
      );

      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.lists(),
      });
    },
  });
}
