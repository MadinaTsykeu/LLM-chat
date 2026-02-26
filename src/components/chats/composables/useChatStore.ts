import { ref, computed } from 'vue';
import { createGlobalState } from '@vueuse/core';
import type { TChatMessage, TChat, TStorageState } from '@/components/chats/types';

const STORAGE_KEY = 'llm-chat-app:v1';
const STORAGE_VERSION = 1 as const;

function getDefaultState(): TStorageState {
  return {
    version: STORAGE_VERSION,
    chats: [],
    messagesByChatId: {},
    lastActiveChatId: null,
  };
}

function loadFromStorage(): TStorageState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return getDefaultState();

    const parsed = JSON.parse(raw) as Partial<TStorageState>;

    if (!parsed || typeof parsed !== 'object') return getDefaultState();

    if (parsed.version !== STORAGE_VERSION) return getDefaultState();

    if (!Array.isArray(parsed.chats)) return getDefaultState();

    if (!parsed.messagesByChatId || typeof parsed.messagesByChatId !== 'object')
      return getDefaultState();

    return {
      version: STORAGE_VERSION,
      chats: parsed.chats,
      messagesByChatId: parsed.messagesByChatId,
      lastActiveChatId: parsed.lastActiveChatId ?? null,
    };
  } catch {
    return getDefaultState();
  }
}

function saveToStorage(payload: {
  chats: TChat[];
  messagesByChatId: Record<string, TChatMessage[]>;
  lastActiveChatId?: string | null;
}) {
  const data: TStorageState = {
    version: STORAGE_VERSION,
    chats: payload.chats,
    messagesByChatId: payload.messagesByChatId,
    lastActiveChatId: payload.lastActiveChatId ?? null,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save chat state to localStorage:', error);
  }
}

export const useChatStore = createGlobalState(() => {
  const raw = loadFromStorage();
  const chats = ref<TChat[]>(raw.chats);
  const messagesByChatId = ref<Record<string, TChatMessage[]>>(raw.messagesByChatId);
  const activeChatId = ref<string | null>(raw.lastActiveChatId ?? null);

  const activeMessages = computed<TChatMessage[]>(() => {
    if (!activeChatId.value) return [];
    return messagesByChatId.value[activeChatId.value] ?? [];
  });

  function persist() {
    saveToStorage({
      chats: chats.value,
      messagesByChatId: messagesByChatId.value,
      lastActiveChatId: activeChatId.value,
    });
  }

  function createChat(initialTitle?: string): TChat {
    const id = crypto.randomUUID();
    const now = Date.now();

    const chat: TChat = {
      id,
      title: initialTitle && initialTitle.trim() ? initialTitle : 'New chat',
      createdAt: now,
      updatedAt: now,
    };

    chats.value = [...chats.value, chat];
    messagesByChatId.value = {
      ...messagesByChatId.value,
      [id]: [],
    };
    activeChatId.value = id;

    persist();

    return chat;
  }

  function setActiveChat(id: string) {
    const exits = chats.value.some((c) => c.id === id);
    if (!exits) return;
    activeChatId.value = id;
    persist();
  }

  function ensureActiveChat(): string {
    if (activeChatId.value && chats.value.some((c) => c.id === activeChatId.value)) {
      return activeChatId.value;
    }

    const chat = createChat();
    return chat.id;
  }

  function updateChatTitleIfNeeded(chatId: string, firstUserMessageContent: string) {
    const chatIndex = chats.value.findIndex((c) => c.id === chatId);
    if (chatIndex === -1) return;

    const chat = chats.value[chatIndex];
    const messages = messagesByChatId.value[chatId] ?? [];

    if (messages.filter((m) => m.role === 'user').length === 1) {
      const maxLength = 28;
      let title = firstUserMessageContent.trim();

      if (title.length > maxLength) {
        title = `${title.slice(0, maxLength).trim()}…`;
      }

      const updated: TChat = {
        ...chat,
        title,
        updatedAt: Date.now(),
      };

      chats.value = [
        ...chats.value.slice(0, chatIndex),
        updated,
        ...chats.value.slice(chatIndex + 1),
      ];
    } else {
      const updated: TChat = {
        ...chat,
        updatedAt: Date.now(),
      };

      chats.value = [
        ...chats.value.slice(0, chatIndex),
        updated,
        ...chats.value.slice(chatIndex + 1),
      ];
    }
  }

  function addUserMessage(content: string): TChatMessage {
    const chatId = ensureActiveChat();
    const now = Date.now();

    const message: TChatMessage = {
      id: crypto.randomUUID(),
      chatId,
      role: 'user',
      content,
      createdAt: now,
      status: 'sent',
    };

    const prevMessages = messagesByChatId.value[chatId] ?? [];

    messagesByChatId.value = {
      ...messagesByChatId.value,
      [chatId]: [...prevMessages, message],
    };

    updateChatTitleIfNeeded(chatId, content);
    persist();

    return message;
  }

  function addAssistantMessage(content: string): TChatMessage | null {
    if (!activeChatId.value) return null;

    const chatId = activeChatId.value;
    const now = Date.now();

    const message: TChatMessage = {
      id: crypto.randomUUID(),
      chatId,
      role: 'assistant',
      content,
      createdAt: now,
      status: 'sent',
    };

    const prevMessages = messagesByChatId.value[chatId] ?? [];
    messagesByChatId.value = {
      ...messagesByChatId.value,
      [chatId]: [...prevMessages, message],
    };

    persist();

    return message;
  }

  return {
    chats,
    messagesByChatId,
    activeChatId,
    activeMessages,
    createChat,
    setActiveChat,
    addUserMessage,
    addAssistantMessage,
  };
});
