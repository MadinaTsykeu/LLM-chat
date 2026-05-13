import type { TChat, TChatMessage, TMessageStatus, TAttachment } from '@/features/chat';
import type {
  TBackendAttachment,
  TBackendChat,
  TBackendMessage,
  TBackendMessageStatus,
} from '@/shared/api/chatApi';

function mapBackendDateToTimestamp(value: string): number {
  return new Date(value).getTime();
}

function mapBackendStatusToFrontendStatus(
  status?: TBackendMessageStatus
): TMessageStatus | undefined {
  if (!status) return undefined;

  if (status === 'ok') return 'sent';
  if (status === 'pending') return 'pending';

  return 'error';
}

function mapBackendAttachmentToAttachment(
  attachment: TBackendAttachment,
  index: number
): TAttachment {
  return {
    id: `${attachment.fileName ?? attachment.mimeType}-${index}`,
    kind: attachment.type === 'image' ? 'image' : 'file',
    mimeType: attachment.mimeType,
    fileName: attachment.fileName ?? 'attachment',
    size: attachment.size ?? 0,
    source: attachment.url
      ? {
          type: 'url',
          value: attachment.url,
        }
      : {
          type: 'base64',
          value: attachment.data ?? '',
        },
  };
}

export function mapBackendChatToChat(chat: TBackendChat): TChat {
  return {
    id: chat.id,
    title: chat.title,
    createdAt: mapBackendDateToTimestamp(chat.createdAt),
    updatedAt: mapBackendDateToTimestamp(chat.updatedAt),
  };
}

export function mapBackendMessageToChatMessage(message: TBackendMessage): TChatMessage {
  const base = {
    id: message.id,
    chatId: message.chatId,
    content: message.content,
    createdAt: mapBackendDateToTimestamp(message.createdAt),
    status: mapBackendStatusToFrontendStatus(message.status),
  };

  if (message.role === 'assistant') {
    return {
      ...base,
      role: 'assistant',
    };
  }

  return {
    ...base,
    role: 'user',
    attachments: message.attachments?.map(mapBackendAttachmentToAttachment),
  };
}
