import type { TAttachment, TChat, TChatMessage, TStorageState } from '@/features/chat';
import type { TAttachmentKind, TAttachmentSourceType } from '@/features/chat/model/types';

const STORAGE_KEY = 'llm-chat-app:v2';
const STORAGE_VERSION = 2 as const;

function getDefaultState(): TStorageState {
  return {
    version: STORAGE_VERSION,
    chats: [],
    messagesByChatId: {},
  };
}

function isValidAttachmentSourceType(value: unknown): value is TAttachmentSourceType {
  return value === 'dataUrl' || value === 'base64' || value === 'url';
}

function isValidAttachmentKind(value: unknown): value is TAttachmentKind {
  return value === 'file' || value === 'audio' || value === 'video' || value === 'image';
}

function isValidAttachmentSource(v: unknown): v is TAttachment['source'] {
  if (!v || typeof v !== 'object') return false;

  const obj = v as Record<string, unknown>;

  return isValidAttachmentSourceType(obj.type) && typeof obj.value === 'string';
}

function isValidAttachment(v: unknown): v is TAttachment {
  if (!v || typeof v !== 'object') return false;

  const obj = v as Record<string, unknown>;

  if (
    typeof obj.id !== 'string' ||
    !isValidAttachmentKind(obj.kind) ||
    typeof obj.mimeType !== 'string' ||
    typeof obj.fileName !== 'string' ||
    typeof obj.size !== 'number' ||
    !isValidAttachmentSource(obj.source)
  ) {
    return false;
  }

  if (obj.previewUrl !== undefined && typeof obj.previewUrl !== 'string') {
    return false;
  }

  if (obj.meta !== undefined) {
    if (!obj.meta || typeof obj.meta !== 'object') return false;

    const meta = obj.meta as Record<string, unknown>;

    if (meta.durationMs !== undefined && typeof meta.durationMs !== 'number') {
      return false;
    }

    if (meta.format !== undefined && typeof meta.format !== 'string') {
      return false;
    }
  }

  return true;
}

function isValidChat(v: unknown): v is TChat {
  if (!v || typeof v !== 'object') return false;

  const obj = v as Record<string, unknown>;

  return (
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.createdAt === 'number' &&
    typeof obj.updatedAt === 'number'
  );
}

function isValidMessage(v: unknown): v is TChatMessage {
  if (!v || typeof v !== 'object') return false;

  const obj = v as Record<string, unknown>;

  if (
    typeof obj.id !== 'string' ||
    typeof obj.chatId !== 'string' ||
    typeof obj.content !== 'string' ||
    typeof obj.createdAt !== 'number'
  ) {
    return false;
  }

  if (obj.status !== undefined) {
    if (obj.status !== 'sent' && obj.status !== 'pending' && obj.status !== 'error') {
      return false;
    }
  }

  if (obj.role === 'assistant') {
    return true;
  }

  if (obj.role === 'user') {
    if (obj.attachments !== undefined) {
      if (!Array.isArray(obj.attachments)) return false;
      if (!obj.attachments.every(isValidAttachment)) return false;
    }

    return true;
  }

  return false;
}

function isValidState(v: unknown): v is TStorageState {
  if (!v || typeof v !== 'object') return false;

  const obj = v as Record<string, unknown>;

  if (obj.version !== STORAGE_VERSION) return false;

  if (!Array.isArray(obj.chats)) return false;
  if (!obj.chats.every(isValidChat)) return false;

  if (!obj.messagesByChatId || typeof obj.messagesByChatId !== 'object') {
    return false;
  }

  const messagesByChatId = obj.messagesByChatId as Record<string, unknown>;

  for (const key in messagesByChatId) {
    const messages = messagesByChatId[key];

    if (!Array.isArray(messages)) return false;
    if (!messages.every(isValidMessage)) return false;
  }

  return true;
}

export function loadFromStorage(): TStorageState {
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

export function saveToStorage(payload: {
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
