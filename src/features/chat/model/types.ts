export type TMessageStatus = 'sent' | 'pending' | 'error';
export type TAttachmentSourceType = 'dataUrl' | 'base64' | 'url';
export type TAttachmentKind = 'file' | 'audio' | 'video' | 'image';

export type TAttachment = {
  id: string;
  kind: TAttachmentKind;
  mimeType: string;
  fileName: string;
  size: number;
  source: {
    type: TAttachmentSourceType;
    value: string;
  };
  previewUrl?: string;
  meta?: {
    durationMs?: number;
    format?: string;
  };
};

export type TChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  id: string;
  createdAt: number;
  chatId: string;
  status?: TMessageStatus;
  attachments?: TAttachment[];
};

export type TChat = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
};

export type TStorageState = {
  version: 2;
  chats: TChat[];
  messagesByChatId: Record<string, TChatMessage[]>;
};
