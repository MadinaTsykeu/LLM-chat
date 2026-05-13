export const chatQueryKeys = {
  all: ['chats'] as const,

  lists: () => [...chatQueryKeys.all, 'list'] as const,

  messages: (chatId: string) => [...chatQueryKeys.all, 'messages', chatId] as const,
};