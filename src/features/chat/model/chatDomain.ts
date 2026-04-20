import type { TAttachment, TAssistantMessage, TChat, TUserMessage } from '@/features/chat';

export function buildChat(initialTitle?: string): TChat {
  const now = Date.now();

  return {
    id: crypto.randomUUID(),
    title: initialTitle && initialTitle.trim() ? initialTitle : 'New chat',
    createdAt: now,
    updatedAt: now,
  };
}

export function buildUserMessage(payload: {
  chatId: string;
  content: string;
  attachments?: TAttachment[];
}): TUserMessage {
  return {
    id: crypto.randomUUID(),
    chatId: payload.chatId,
    role: 'user',
    content: payload.content,
    createdAt: Date.now(),
    status: 'sent',
    attachments: payload.attachments ?? [],
  };
}

export function buildAssistantMessage(payload: {
  chatId: string;
  content: string;
}): TAssistantMessage {
  return {
    id: crypto.randomUUID(),
    chatId: payload.chatId,
    role: 'assistant',
    content: payload.content,
    createdAt: Date.now(),
    status: 'sent',
  };
}

export function buildChatTitleFromMessage(content: string): string {
  const maxLength = 28;
  let title = content.trim();

  if (title.length > maxLength) {
    title = `${title.slice(0, maxLength).trim()}…`;
  }

  return title;
}
