import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { TAttachment, TChat, TChatMessage } from '@/features/chat';
import {
  createChat as createBackendChat,
  sendChatMessage,
} from '@/shared/api/chatApi';
import {
  mapBackendChatToChat,
  mapBackendMessageToChatMessage,
} from '@/features/chat/model/chatMappers';
import { chatQueryKeys } from './chatQueryKeys';

const DEFAULT_MODEL = import.meta.env.VITE_OPENROUTER_MODEL;

function createClientMessageId(): string {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

type TSendMessageMutationPayload = {
  chatId?: string;
  content: string;
  attachments?: TAttachment[];
};

export function useSendMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TSendMessageMutationPayload) => {
      const content = payload.content.trim();
      const attachments = payload.attachments ?? [];

      if (!content) {
        throw new Error('Empty message');
      }

      const isNewChat = !payload.chatId;

      let currentChatId = payload.chatId;

      if (!currentChatId) {
        const createChatResponse = await createBackendChat({
          title: null,
        });

        const chat = mapBackendChatToChat(createChatResponse.data);

        currentChatId = chat.id;

        queryClient.setQueryData<TChat[]>(chatQueryKeys.lists(), (oldChats = []) => {
          return [chat, ...oldChats];
        });
      }

      const response = await sendChatMessage({
        chatId: currentChatId,
        content,
        model: DEFAULT_MODEL,
        clientMessageId: createClientMessageId(),
        attachments,
      });

      const userMessage = mapBackendMessageToChatMessage(response.data.userMessage);
      const assistantMessage = mapBackendMessageToChatMessage(
        response.data.assistantMessage
      );

      queryClient.setQueryData<TChatMessage[]>(
        chatQueryKeys.messages(currentChatId),
        (oldMessages = []) => {
          return [...oldMessages, userMessage, assistantMessage];
        }
      );

      await queryClient.invalidateQueries({
        queryKey: chatQueryKeys.lists(),
      });

      return {
        chatId: currentChatId,
        isNewChat,
      };
    },
  });
}
