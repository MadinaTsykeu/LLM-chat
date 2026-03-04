import { defineStore } from 'pinia';
import type { TChatMessage, TChat, TStorageState } from '@/components/chats/types';

const STORAGE_KEY = 'llm-chat-app:v1';
const STORAGE_VERSION = 1 as const;

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
  const data: TStorageState = {
    version: STORAGE_VERSION,
    chats: payload.chats,
    messagesByChatId: payload.messagesByChatId,
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
      activeChatId: null as string | null,
    };
  },
  getters: {
    activeMessages(state): TChatMessage[] {
      if (!state.activeChatId) return [];
      return state.messagesByChatId[state.activeChatId] ?? [];
    },
  },
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

      this.chats = [...this.chats, chat];
      this.messagesByChatId = { ...this.messagesByChatId, [id]: [] };

      this.activeChatId = id;

      this.persist();
      return chat;
    },

    setActiveChat(id: string) {
      const exists = this.chats.some((c) => c.id === id);
      if (!exists) return;

      this.activeChatId = id;

      this.persist();
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

        const updated: TChat = { ...chat, title, updatedAt: Date.now() };

        this.chats = [
          ...this.chats.slice(0, chatIndex),
          updated,
          ...this.chats.slice(chatIndex + 1),
        ];
      } else {
        const updated: TChat = { ...chat, updatedAt: Date.now() };

        this.chats = [
          ...this.chats.slice(0, chatIndex),
          updated,
          ...this.chats.slice(chatIndex + 1),
        ];
      }
    },

    addUserMessage(content: string): TChatMessage {
      if (!this.activeChatId || !this.chats.some((c) => c.id === this.activeChatId)) {
        const chat = this.createChat();
        this.activeChatId = chat.id;
      }

      const chatId = this.activeChatId as string;
      const now = Date.now();

      const message: TChatMessage = {
        id: crypto.randomUUID(),
        chatId,
        role: 'user',
        content,
        createdAt: now,
        status: 'sent',
      };

      const prevMessages = this.messagesByChatId[chatId] ?? [];

      this.messagesByChatId = {
        ...this.messagesByChatId,
        [chatId]: [...prevMessages, message],
      };

      this.updateChatTitleIfNeeded(chatId, content);
      this.persist();

      return message;
    },

    addAssistantMessage(content: string): TChatMessage | null {
      if (!this.activeChatId) return null;

      const chatId = this.activeChatId;
      const now = Date.now();

      const message: TChatMessage = {
        id: crypto.randomUUID(),
        chatId,
        role: 'assistant',
        content,
        createdAt: now,
        status: 'sent',
      };

      const prevMessages = this.messagesByChatId[chatId] ?? [];

      this.messagesByChatId = {
        ...this.messagesByChatId,
        [chatId]: [...prevMessages, message],
      };

      this.persist();

      return message;
    },
  },
});
