import { ref } from 'vue';
import { createGlobalState } from '@vueuse/core';
import { sendToLLM } from '@/api/openRouterClient';
import { useAppErrorModal } from '@/components/AppErrorModal';
import { useChatStore } from '@/components/chats/composables/useChatStore';

export const useChatSession = createGlobalState(() => {
  const draft = ref('');
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const appError = useAppErrorModal();

  const { activeMessages, addUserMessage, addAssistantMessage } = useChatStore();

  async function sendMessage() {
    if (isLoading.value) return;
    if (!draft.value.trim()) return;

    error.value = null;
    isLoading.value = true;

    const content = draft.value.trim();
    draft.value = '';

    addUserMessage(content);

    try {
      const assistantResponse = await sendToLLM(activeMessages.value);

      addAssistantMessage(assistantResponse);
    } catch (err) {
      const msg = (err as Error).message;
      error.value = msg;
      appError.showError(msg);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    messages: activeMessages,
    draft,
    isLoading,
    error,
    sendMessage,
  };
});
