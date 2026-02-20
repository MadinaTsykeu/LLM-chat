import { ref } from 'vue';
import type { chatMessage } from '@/components/chats/types';
import { sendToLLM } from '@/api/openRouterClient';
import { createGlobalState } from '@vueuse/core';
import { useAppErrorModal } from '@/composables/useAppErrorModal';

export const useChatSession = createGlobalState(() => {
  const messages = ref<chatMessage[]>([]);
  const draft = ref('');
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const appError = useAppErrorModal();

  async function sendMessage() {
    if (isLoading.value) return;
    if (!draft.value.trim()) return;

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
      const msg = (err as Error).message;
      error.value = msg;
      appError.showError(msg);
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
});
