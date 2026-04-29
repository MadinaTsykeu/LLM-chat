import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { TChatMessage } from '@/features/chat';
import { sendChatMessage } from '@/shared/api/chatApi';
import { mapBackendMessageToChatMessage } from '@/features/chat/model/chatMappers';
import { chatQueryKeys } from './chatQueryKeys';

const DEFAULT_MODEL = import.meta.env.VITE_OPENROUTER_MODEL;

function createClientMessageId(): string {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

type TRetryMessageMutationPayload = {
  chatId: string;
  assistantMessageId: string;
};

export function useRetryMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TRetryMessageMutationPayload) => {
      const messages =
        queryClient.getQueryData<TChatMessage[]>(
          chatQueryKeys.messages(payload.chatId)
        ) ?? [];

      const assistantMessageIndex = messages.findIndex(
        (message) =>
          message.id === payload.assistantMessageId && message.role === 'assistant'
      );

      if (assistantMessageIndex === -1) {
        throw new Error('Assistant message not found');
      }

      const previousMessages = messages.slice(0, assistantMessageIndex);

      const originalUserMessage = [...previousMessages]
        .reverse()
        .find((message) => message.role === 'user');

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

      const userMessage = mapBackendMessageToChatMessage(response.data.userMessage);
      const assistantMessage = mapBackendMessageToChatMessage(
        response.data.assistantMessage
      );

      queryClient.setQueryData<TChatMessage[]>(
        chatQueryKeys.messages(payload.chatId),
        (oldMessages = []) => {
          return [...oldMessages, userMessage, assistantMessage];
        }
      );

      await queryClient.invalidateQueries({
        queryKey: chatQueryKeys.lists(),
      });
    },
  });
}
