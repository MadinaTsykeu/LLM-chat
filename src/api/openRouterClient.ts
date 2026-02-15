import type { chatMessage } from '@/entities/chat/types';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const MODEL = import.meta.env.VITE_OPENROUTER_MODEL;
const BASE_URL = import.meta.env.VITE_OPENROUTER_BASE_URL;

if (!API_KEY || !MODEL || !BASE_URL) {
  throw new Error('env не настроены');
}

export async function sendToLLM(messages: chatMessage[]): Promise<string> {
  const formatedMessages = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: formatedMessages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const data = await response.json();

  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Неверный формат ответа OpenRouter');
  }

  return content;
}
