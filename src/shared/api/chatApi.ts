import { backendClient } from '@/shared/api/backendClient';
import type { TAttachment } from '@/features/chat';

export type TBackendChat = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type TBackendMessageStatus = 'ok' | 'pending' | 'failed';

export type TBackendAttachment = {
  type: 'image' | 'file';
  mimeType: string;
  data?: string;
  url?: string;
  fileName?: string;
  size?: number;
};

export type TBackendMessage = {
  id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  status?: TBackendMessageStatus;
  createdAt: string;
  attachments?: TBackendAttachment[];
};

export type TPaginatedResponse<T> = {
  data: T[];
  nextCursor: string | null;
};

export type TCreateChatResponse = {
  data: TBackendChat;
};

export type TSendMessageResponse = {
  data: {
    userMessage: TBackendMessage;
    assistantMessage: TBackendMessage;
  };
};

export async function getChats(params?: {
  limit?: number;
  cursor?: string | null;
}): Promise<TPaginatedResponse<TBackendChat>> {
  const response = await backendClient.get<TPaginatedResponse<TBackendChat>>('/chats', {
    params: {
      limit: params?.limit ?? 20,
      cursor: params?.cursor ?? undefined,
    },
  });

  return response.data;
}

export async function createChat(payload?: {
  title?: string | null;
}): Promise<TCreateChatResponse> {
  const response = await backendClient.post<TCreateChatResponse>('/chats/create', {
    title: payload?.title ?? null,
  });

  return response.data;
}

export async function getChatMessages(params: {
  chatId: string;
  limit?: number;
  cursor?: string | null;
  order?: 'asc' | 'desc';
}): Promise<TPaginatedResponse<TBackendMessage>> {
  const response = await backendClient.get<TPaginatedResponse<TBackendMessage>>(
    `/chats/${params.chatId}/messages`,
    {
      params: {
        limit: params.limit ?? 50,
        cursor: params.cursor ?? undefined,
        order: params.order ?? 'asc',
      },
    }
  );

  return response.data;
}

function getBase64WithoutPrefix(value: string): string {
  const [, base64] = value.split(',');

  return base64 ?? value;
}

function mapAttachmentToBackendAttachment(attachment: TAttachment): TBackendAttachment {
  return {
    type: attachment.kind === 'image' ? 'image' : 'file',
    mimeType: attachment.mimeType,
    fileName: attachment.fileName,
    size: attachment.size,
    ...(attachment.source.type === 'url'
      ? { url: attachment.source.value }
      : { data: getBase64WithoutPrefix(attachment.source.value) }),
  };
}
export async function sendChatMessage(payload: {
  chatId: string;
  content: string;
  model: string;
  clientMessageId: string;
  attachments?: TAttachment[];
}): Promise<TSendMessageResponse> {
  const response = await backendClient.post<TSendMessageResponse>(
    `/chats/${payload.chatId}/sendMessage`,
    {
      content: payload.content,
      model: payload.model,
      clientMessageId: payload.clientMessageId,
      attachments: payload.attachments?.map(mapAttachmentToBackendAttachment),
    }
  );

  return response.data;
}
