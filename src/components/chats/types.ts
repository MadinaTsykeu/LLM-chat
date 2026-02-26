export type TMessageStatus = 'sent' | 'pending' | 'error';

export type TChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  id: string;
  createdAt: number;
  chatId: string;
  status?: TMessageStatus;
};

export type TChat = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
};

export type TStorageState = {
  version: 1;
  chats: TChat[];
  messagesByChatId: Record<string, TChatMessage[]>;
  lastActiveChatId?: string | null;
};
