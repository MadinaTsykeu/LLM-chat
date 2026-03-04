import { ref, computed } from 'vue';
import { createGlobalState } from '@vueuse/core';
import { sendToLLM } from '@/api/openRouterClient';
import { useAppErrorModal } from '@/components/AppErrorModal';
import { useChatStore } from '@/components/chats/stores/chatStore';

export const useChatSession = createGlobalState(() => {
  const draft = ref('');
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const appError = useAppErrorModal();

  const chatStore = useChatStore();

  async function sendMessage() {
    if (isLoading.value) return;
    if (!draft.value.trim()) return;

    error.value = null;
    isLoading.value = true;

    const content = draft.value.trim();
    draft.value = '';

    chatStore.addUserMessage(content);

    try {
      const assistantResponse = await sendToLLM(chatStore.activeMessages);

      chatStore.addAssistantMessage(assistantResponse);
    } catch (err) {
      const msg = (err as Error).message;
      error.value = msg;
      appError.showError(msg);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    messages: computed(() => chatStore.activeMessages),
    draft,
    isLoading,
    error,
    sendMessage,
  };
});
