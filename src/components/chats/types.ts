export type chatMessage = {
  role: 'user' | 'assistant';
  content: string;
  id: string;
  createdAt: number;
};
