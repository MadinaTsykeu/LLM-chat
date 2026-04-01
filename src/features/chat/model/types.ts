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

export type TBaseMessage = {
  id: string;
  chatId: string;
  content: string;
  createdAt: number;
  status?: TMessageStatus;
};

export type TUserMessage = TBaseMessage & {
  role: 'user';
  attachments?: TAttachment[];
};

export type TAssistantMessage = TBaseMessage & {
  role: 'assistant';
};

export type TChatMessage = TUserMessage | TAssistantMessage;

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
