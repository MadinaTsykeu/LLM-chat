import { ref } from 'vue';
import type { chatMessage } from '@/entities/chat/types';
import { sendToLLM } from '@/api/openRouterClient';

const messages = ref<chatMessage[]>([]);
const draft = ref('');
const isLoading = ref(false);
const error = ref<string | null>(null);

export function useChatSession() {
  async function sendMessage() {
    if (isLoading.value) {
      return;
    }

    if (!draft.value.trim()) {
      return;
    }

    error.value = null;
    isLoading.value = true;

    const userMessage: chatMessage = {
      role: 'user',
      content: draft.value.trim(),
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    messages.value.push(userMessage);
    draft.value = '';

    try {
      const assistantResponse = await sendToLLM(messages.value);

      const assistantMessage: chatMessage = {
        role: 'assistant',
        content: assistantResponse,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };

      messages.value.push(assistantMessage);
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    messages,
    draft,
    isLoading,
    error,
    sendMessage,
  };
}
