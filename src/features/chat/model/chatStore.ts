import { defineStore } from 'pinia';
import type {
  TChatMessage,
  TChat,
  TAttachment,
  TUserMessage,
  TAssistantMessage,
} from '@/features/chat';
import { sendToLLM } from '@/shared/api/openRouterClient';
import { loadFromStorage, saveToStorage } from '@/features/chat/model/chatStorage';
import {
  buildChat,
  buildUserMessage,
  buildAssistantMessage,
  buildChatTitleFromMessage,
} from '@/features/chat/model/chatDomain';
import { useAuthStore } from '@/shared/stores/auth';

const NEW_CHAT_SENDING_KEY = '__new_chat__';

function getSendingKey(chatId?: string): string {
  return chatId ?? NEW_CHAT_SENDING_KEY;
}

export const useChatStore = defineStore('chat', {
  state: () => {
    const raw = loadFromStorage();

    return {
      chats: raw.chats as TChat[],
      messagesByChatId: raw.messagesByChatId as Record<string, TChatMessage[]>,
      sendingByChatId: {} as Record<string, boolean>,
    };
  },

  actions: {
    persist() {
      saveToStorage({
        chats: this.chats,
        messagesByChatId: this.messagesByChatId,
      });
    },

    isChatSending(chatId: string): boolean {
      return Boolean(this.sendingByChatId[chatId]);
    },

    setChatSending(chatId: string, value: boolean) {
      if (value) {
        this.sendingByChatId[chatId] = true;
        return;
      }

      delete this.sendingByChatId[chatId];
    },

    createChat(initialTitle?: string): TChat {
      const chat = buildChat(initialTitle);

      this.chats.push(chat);
      this.messagesByChatId[chat.id] = [];

      return chat;
    },

    updateChatTitleIfNeeded(chatId: string, firstUserMessageContent: string) {
      const chatIndex = this.chats.findIndex((c) => c.id === chatId);
      if (chatIndex === -1) return;

      const chat = this.chats[chatIndex];
      const messages = this.messagesByChatId[chatId] ?? [];

      if (messages.filter((m) => m.role === 'user').length === 1) {
        const title = buildChatTitleFromMessage(firstUserMessageContent);

        this.chats[chatIndex] = { ...chat, title, updatedAt: Date.now() };
      } else {
        this.chats[chatIndex] = { ...chat, updatedAt: Date.now() };
      }
    },

    ensureChatMessages(chatId: string): TChatMessage[] {
      if (!this.messagesByChatId[chatId]) {
        this.messagesByChatId[chatId] = [];
      }

      return this.messagesByChatId[chatId];
    },

    appendMessage(chatId: string, message: TChatMessage) {
      const messages = this.ensureChatMessages(chatId);
      messages.push(message);
    },

    addUserMessage(payload: {
      chatId: string;
      content: string;
      attachments?: TAttachment[];
    }): TUserMessage {
      const message = buildUserMessage(payload);

      this.appendMessage(payload.chatId, message);
      this.updateChatTitleIfNeeded(payload.chatId, payload.content);

      return message;
    },

    addAssistantMessage(payload: { chatId: string; content: string }): TAssistantMessage {
      const message = buildAssistantMessage(payload);

      this.appendMessage(payload.chatId, message);

      return message;
    },

    async sendMessage(payload: {
      chatId?: string;
      content: string;
      attachments?: TAttachment[];
    }): Promise<{ chatId: string; isNewChat: boolean }> {
      const content = payload.content.trim();
      const attachments = payload.attachments ?? [];

      if (!content && attachments.length === 0) {
        throw new Error('Empty message');
      }

      const sendingKey = getSendingKey(payload.chatId);

      if (this.isChatSending(sendingKey)) {
        return {
          chatId: payload.chatId ?? '',
          isNewChat: false,
        };
      }

      this.setChatSending(sendingKey, true);

      try {
        const isNewChat = !payload.chatId;

        const userMessageForRequest = buildUserMessage({
          chatId: payload.chatId ?? '',
          content,
          attachments,
        });

        const messagesForRequest = payload.chatId
          ? [...(this.messagesByChatId[payload.chatId] ?? []), userMessageForRequest]
          : [userMessageForRequest];

        const authStore = useAuthStore();
        const apiKey = authStore.userKey;

        if (!apiKey) {
          throw new Error('User is not authenticated');
        }

        const assistantResponse = await sendToLLM(apiKey, messagesForRequest);

        let currentChatId = payload.chatId;

        if (!currentChatId) {
          const chat = this.createChat();
          currentChatId = chat.id;
        }

        this.addUserMessage({
          chatId: currentChatId,
          content,
          attachments,
        });

        this.addAssistantMessage({
          chatId: currentChatId,
          content: assistantResponse,
        });

        this.persist();

        return {
          chatId: currentChatId,
          isNewChat,
        };
      } finally {
        this.setChatSending(sendingKey, false);
      }
    },

    async retryAssistantMessage(payload: {
      chatId: string;
      assistantMessageId: string;
    }): Promise<void> {
      if (this.isChatSending(payload.chatId)) return;

      const messages = this.messagesByChatId[payload.chatId] ?? [];

      const assistantMessageIndex = messages.findIndex(
        (message) => message.id === payload.assistantMessageId && message.role === 'assistant'
      );

      if (assistantMessageIndex === -1) {
        throw new Error('Assistant message not found');
      }

      const previousMessages = messages.slice(0, assistantMessageIndex);

      let userMessageIndex = -1;

      for (let i = previousMessages.length - 1; i >= 0; i -= 1) {
        if (previousMessages[i].role === 'user') {
          userMessageIndex = i;
          break;
        }
      }

      if (userMessageIndex === -1) {
        throw new Error('Original user message not found');
      }

      const retryContext = messages.slice(0, userMessageIndex + 1);
      const nextMessages = messages.slice(0, assistantMessageIndex);

      this.setChatSending(payload.chatId, true);

      try {
        const authStore = useAuthStore();
        const apiKey = authStore.userKey;

        if (!apiKey) {
          throw new Error('User is not authenticated');
        }

        const assistantResponse = await sendToLLM(apiKey, retryContext);

        this.messagesByChatId[payload.chatId] = [
          ...nextMessages,
          buildAssistantMessage({
            chatId: payload.chatId,
            content: assistantResponse,
          }),
        ];

        this.persist();
      } finally {
        this.setChatSending(payload.chatId, false);
      }
    },
  },
});
