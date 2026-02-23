export type TChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  id: string;
  createdAt: number;
};
