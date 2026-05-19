import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { TAttachment, TChat, TChatMessage } from '@/features/chat';
import { createChat as createBackendChat, sendChatMessage } from '@/shared/api/chatApi';
import {
  mapBackendChatToChat,
  mapBackendMessageToChatMessage,
} from '@/features/chat/model/chatMappers';
import { buildChatTitleFromMessage } from '../chatDomain';
import { chatQueryKeys } from './chatQueryKeys';
import {
  DEFAULT_MODEL,
  createClientMessageId,
  upsertChatInList,
  patchChatInList,
  appendChatMessages,
} from '../chatMutationsHelpers';

type TSendMessageMutationPayload = {
  chatId?: string;
  content: string;
  attachments?: TAttachment[];
};

type TSendMessageMutationResult = {
  chatId: string;
  isNewChat: boolean;
  chat?: TChat;
  userMessage: TChatMessage;
  assistantMessage: TChatMessage;
};

function shouldReplaceChatTitle(title?: string | null): boolean {
  const normalized = title?.trim();

  return !normalized || /^new chat$/i.test(normalized);
}

export function useSendMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: TSendMessageMutationPayload
    ): Promise<TSendMessageMutationResult> => {
      const content = payload.content.trim();
      const attachments = payload.attachments ?? [];

      if (!content) {
        throw new Error('Empty message');
      }

      const isNewChat = !payload.chatId;

      let currentChatId = payload.chatId;
      let createdChat: TChat | undefined;

      if (!currentChatId) {
        const createChatResponse = await createBackendChat({
          title: null,
        });

        createdChat = mapBackendChatToChat(createChatResponse.data);
        currentChatId = createdChat.id;
      }

      const response = await sendChatMessage({
        chatId: currentChatId,
        content,
        model: DEFAULT_MODEL,
        clientMessageId: createClientMessageId(),
        attachments,
      });

      return {
        chatId: currentChatId,
        isNewChat,
        chat: createdChat,
        userMessage: mapBackendMessageToChatMessage(response.data.userMessage),
        assistantMessage: mapBackendMessageToChatMessage(response.data.assistantMessage),
      };
    },

    onSuccess: (result, payload) => {
      const generatedTitle = buildChatTitleFromMessage(payload.content);
      const now = Date.now();

      if (result.chat) {
        upsertChatInList(queryClient, {
          ...result.chat,
          title: shouldReplaceChatTitle(result.chat.title) ? generatedTitle : result.chat.title,
          updatedAt: now,
        });
      } else {
        patchChatInList(queryClient, result.chatId, {
          title: generatedTitle,
          updatedAt: now,
        });
      }

      appendChatMessages(queryClient, result.chatId, [result.userMessage, result.assistantMessage]);

      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.lists(),
      });
    },
  });
}
