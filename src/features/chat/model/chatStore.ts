import { defineStore } from 'pinia';
import type { TChatMessage, TChat, TAttachment } from '@/features/chat';
import {
  createChat as createBackendChat,
  getChatMessages,
  getChats,
  sendChatMessage,
} from '@/shared/api/chatApi';
import {
  mapBackendChatToChat,
  mapBackendMessageToChatMessage,
} from '@/features/chat/model/chatMappers';

const NEW_CHAT_SENDING_KEY = '__new_chat__';
const DEFAULT_MODEL = import.meta.env.VITE_OPENROUTER_MODEL;

function buildChatTitleFromContent(content: string): string {
  return content.trim().slice(0, 32) || 'New Chat';
}

function getSendingKey(chatId?: string): string {
  return chatId ?? NEW_CHAT_SENDING_KEY;
}

function createClientMessageId(): string {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useChatStore = defineStore('chat', {
  state: () => {
    return {
      chats: [] as TChat[],
      messagesByChatId: {} as Record<string, TChatMessage[]>,

      chatsNextCursor: null as string | null,
      messagesNextCursorByChatId: {} as Record<string, string | null>,

      hasLoadedChats: false,

      isChatsLoading: false,
      isMessagesLoadingByChatId: {} as Record<string, boolean>,

      sendingByChatId: {} as Record<string, boolean>,
    };
  },

  actions: {
    async loadChats() {
      if (this.isChatsLoading) return;
      if (this.hasLoadedChats && this.chatsNextCursor === null) return;

      this.isChatsLoading = true;

      try {
        const response = await getChats({
          cursor: this.chatsNextCursor,
        });

        const chats = response.data.map(mapBackendChatToChat);

        this.chats = [...this.chats, ...chats];
        this.chatsNextCursor = response.nextCursor;
        this.hasLoadedChats = true;
      } finally {
        this.isChatsLoading = false;
      }
    },

    async reloadChats() {
      this.chats = [];
      this.chatsNextCursor = null;
      this.hasLoadedChats = false;

      await this.loadChats();
    },

    async loadMessages(chatId: string) {
      if (this.isMessagesLoadingByChatId[chatId]) return;

      const currentCursor = this.messagesNextCursorByChatId[chatId];

      if (chatId in this.messagesNextCursorByChatId && currentCursor === null) {
        return;
      }

      this.isMessagesLoadingByChatId[chatId] = true;

      try {
        const response = await getChatMessages({
          chatId,
          cursor: currentCursor,
          order: 'asc',
        });

        const messages = response.data.map(mapBackendMessageToChatMessage);

        this.messagesByChatId[chatId] = [...(this.messagesByChatId[chatId] ?? []), ...messages];

        this.messagesNextCursorByChatId[chatId] = response.nextCursor;
      } finally {
        delete this.isMessagesLoadingByChatId[chatId];
      }
    },

    async reloadMessages(chatId: string) {
      this.messagesByChatId[chatId] = [];
      delete this.messagesNextCursorByChatId[chatId];

      await this.loadMessages(chatId);
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

    async createChat(initialTitle?: string): Promise<TChat> {
      const response = await createBackendChat({
        title: initialTitle ?? null,
      });

      const chat = mapBackendChatToChat(response.data);

      this.chats = [chat, ...this.chats];
      this.messagesByChatId[chat.id] = [];
      this.messagesNextCursorByChatId[chat.id] = null;

      return chat;
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

    async sendMessage(payload: {
      chatId?: string;
      content: string;
      attachments?: TAttachment[];
    }): Promise<{ chatId: string; isNewChat: boolean }> {
      const content = payload.content.trim();
      const attachments = payload.attachments ?? [];

      if (!content) {
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

        let currentChatId = payload.chatId;

        if (!currentChatId) {
          const chat = await this.createChat();
          currentChatId = chat.id;
        }

        const response = await sendChatMessage({
          chatId: currentChatId,
          content,
          model: DEFAULT_MODEL,
          clientMessageId: createClientMessageId(),
          attachments,
        });

        const userMessage = mapBackendMessageToChatMessage(response.data.userMessage);
        const assistantMessage = mapBackendMessageToChatMessage(response.data.assistantMessage);

        this.messagesByChatId[currentChatId] = [
          ...(this.messagesByChatId[currentChatId] ?? []),
          userMessage,
          assistantMessage,
        ];

        const chatIndex = this.chats.findIndex((chat) => chat.id === currentChatId);

        if (chatIndex !== -1) {
          const currentChat = this.chats[chatIndex];

          this.chats[chatIndex] = {
            ...currentChat,
            title:
              currentChat.title === 'New Chat'
                ? buildChatTitleFromContent(content)
                : currentChat.title,
            updatedAt: Date.now(),
          };

          this.chats = [
            this.chats[chatIndex],
            ...this.chats.filter((chat) => chat.id !== currentChatId),
          ];
        }

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

      const originalUserMessage = [...previousMessages]
        .reverse()
        .find((message) => message.role === 'user');

      if (!originalUserMessage || originalUserMessage.role !== 'user') {
        throw new Error('Original user message not found');
      }

      this.setChatSending(payload.chatId, true);

      try {
        const response = await sendChatMessage({
          chatId: payload.chatId,
          content: originalUserMessage.content,
          model: DEFAULT_MODEL,
          clientMessageId: createClientMessageId(),
          attachments: originalUserMessage.attachments ?? [],
        });

        const userMessage = mapBackendMessageToChatMessage(response.data.userMessage);
        const assistantMessage = mapBackendMessageToChatMessage(response.data.assistantMessage);

        this.messagesByChatId[payload.chatId] = [...messages, userMessage, assistantMessage];
      } finally {
        this.setChatSending(payload.chatId, false);
      }
    },

    clearState() {
      this.chats = [];
      this.messagesByChatId = {};
      this.chatsNextCursor = null;
      this.messagesNextCursorByChatId = {};
      this.hasLoadedChats = false;
      this.isChatsLoading = false;
      this.isMessagesLoadingByChatId = {};
      this.sendingByChatId = {};
    },
  },
});
