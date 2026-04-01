import { defineStore } from 'pinia';
import type {
  TChatMessage,
  TChat,
  TStorageState,
  TAttachment,
  TUserMessage,
  TAssistantMessage,
} from '@/features/chat';
import { sendToLLM } from '@/shared/api/openRouterClient';

const STORAGE_KEY = 'llm-chat-app:v2';
const STORAGE_VERSION = 2 as const;

function getDefaultState(): TStorageState {
  return {
    version: STORAGE_VERSION,
    chats: [],
    messagesByChatId: {},
  };
}

function isValidState(v: unknown): v is TStorageState {
  if (!v || typeof v !== 'object') return false;

  const obj = v as Record<string, unknown>;

  if (obj.version !== STORAGE_VERSION) return false;

  if (!Array.isArray(obj.chats)) return false;

  if (!obj.messagesByChatId || typeof obj.messagesByChatId !== 'object') return false;

  return true;
}

function loadFromStorage(): TStorageState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return getDefaultState();

    const parsed = JSON.parse(raw) as unknown;

    if (!isValidState(parsed)) return getDefaultState();

    return {
      version: STORAGE_VERSION,
      chats: parsed.chats,
      messagesByChatId: parsed.messagesByChatId,
    };
  } catch {
    return getDefaultState();
  }
}

function saveToStorage(payload: {
  chats: TChat[];
  messagesByChatId: Record<string, TChatMessage[]>;
}) {
  const serializedMessagesByChatId: Record<string, TChatMessage[]> = Object.fromEntries(
    Object.entries(payload.messagesByChatId).map(([chatId, messages]) => [
      chatId,
      messages.map((message) => {
        if (message.role !== 'user') {
          return message;
        }

        return {
          ...message,
          attachments: message.attachments?.map((attachment) => ({
            ...attachment,
            source: {
              ...attachment.source,
              value: '',
            },
          })),
        };
      }),
    ])
  );
  const data: TStorageState = {
    version: STORAGE_VERSION,
    chats: payload.chats,
    messagesByChatId: serializedMessagesByChatId,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save chat state to localStorage:', error);
  }
}

export const useChatStore = defineStore('chat', {
  state: () => {
    const raw = loadFromStorage();

    return {
      chats: raw.chats as TChat[],
      messagesByChatId: raw.messagesByChatId as Record<string, TChatMessage[]>,
      isSending: false,
    };
  },
  getters: {},
  actions: {
    persist() {
      saveToStorage({
        chats: this.chats,
        messagesByChatId: this.messagesByChatId,
      });
    },

    createChat(initialTitle?: string): TChat {
      const id = crypto.randomUUID();
      const now = Date.now();

      const chat: TChat = {
        id,
        title: initialTitle && initialTitle.trim() ? initialTitle : 'New chat',
        createdAt: now,
        updatedAt: now,
      };

      this.chats.push(chat);
      this.messagesByChatId[id] = [];

      this.persist();
      return chat;
    },

    updateChatTitleIfNeeded(chatId: string, firstUserMessageContent: string) {
      const chatIndex = this.chats.findIndex((c) => c.id === chatId);
      if (chatIndex === -1) return;

      const chat = this.chats[chatIndex];
      const messages = this.messagesByChatId[chatId] ?? [];

      if (messages.filter((m) => m.role === 'user').length === 1) {
        const maxLength = 28;
        let title = firstUserMessageContent.trim();

        if (title.length > maxLength) {
          title = `${title.slice(0, maxLength).trim()}…`;
        }

        this.chats[chatIndex] = { ...chat, title, updatedAt: Date.now() };
      } else {
        this.chats[chatIndex] = { ...chat, updatedAt: Date.now() };
      }
    },

    addUserMessage(payload: {
      chatId: string;
      content: string;
      attachments?: TAttachment[];
    }): TUserMessage {
      const now = Date.now();

      const message: TUserMessage = {
        id: crypto.randomUUID(),
        chatId: payload.chatId,
        role: 'user',
        content: payload.content,
        createdAt: now,
        status: 'sent',
        attachments: payload.attachments ?? [],
      };

      if (!this.messagesByChatId[payload.chatId]) {
        this.messagesByChatId[payload.chatId] = [];
      }

      this.messagesByChatId[payload.chatId].push(message);

      this.updateChatTitleIfNeeded(payload.chatId, payload.content);
      this.persist();

      return message;
    },

    addAssistantMessage(payload: { chatId: string; content: string }): TAssistantMessage {
      const now = Date.now();

      const message: TAssistantMessage = {
        id: crypto.randomUUID(),
        chatId: payload.chatId,
        role: 'assistant',
        content: payload.content,
        createdAt: now,
        status: 'sent',
      };

      if (!this.messagesByChatId[payload.chatId]) {
        this.messagesByChatId[payload.chatId] = [];
      }

      this.messagesByChatId[payload.chatId].push(message);

      this.persist();

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

      if (this.isSending) {
        return {
          chatId: payload.chatId ?? '',
          isNewChat: false,
        };
      }

      this.isSending = true;

      try {
        let currentChatId = payload.chatId;
        let isNewChat = false;

        if (!currentChatId) {
          const assistantResponse = await sendToLLM([
            {
              id: crypto.randomUUID(),
              chatId: '',
              role: 'user',
              content,
              createdAt: Date.now(),
              status: 'sent',
              attachments,
            },
          ]);

          const chat = this.createChat();
          currentChatId = chat.id;
          isNewChat = true;

          this.addUserMessage({
            chatId: currentChatId,
            content,
            attachments,
          });

          this.addAssistantMessage({
            chatId: currentChatId,
            content: assistantResponse,
          });
        } else {
          this.addUserMessage({
            chatId: currentChatId,
            content,
            attachments,
          });

          const messagesForChat = this.messagesByChatId[currentChatId] ?? [];
          const assistantResponse = await sendToLLM(messagesForChat);

          this.addAssistantMessage({
            chatId: currentChatId,
            content: assistantResponse,
          });
        }
        return {
          chatId: currentChatId,
          isNewChat,
        };
      } finally {
        this.isSending = false;
      }
    },
  },
});
