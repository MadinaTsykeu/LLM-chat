import { ref, computed } from 'vue';
import { createGlobalState } from '@vueuse/core';
import { sendToLLM } from '@/api/openRouterClient';
import { useAppErrorModal } from '@/components/AppErrorModal';
import { useChatStore } from '@/components/chats/stores/chatStore';
import { useRoute, useRouter } from 'vue-router';
import { AppRouteName } from '@/router';

export const useChatSession = createGlobalState(() => {
  const draft = ref('');
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const route = useRoute();
  const router = useRouter();

  const chatId = computed(() => route.params.id as string | undefined);

  const appError = useAppErrorModal();

  const chatStore = useChatStore();

  async function sendMessage() {
    if (isLoading.value) return;
    if (!draft.value.trim()) return;

    error.value = null;
    isLoading.value = true;

    const content = draft.value.trim();
    draft.value = '';

    let currentChatId = chatId.value;

    if (!currentChatId) {
      const chat = chatStore.createChat();
      currentChatId = chat.id;
      await router.push({ name: AppRouteName.Chat, params: { id: chat.id } });
    }

    chatStore.addUserMessage(currentChatId, content);

    try {
      const messagesForChat = chatStore.messagesByChatId[currentChatId] ?? [];
      const assistantResponse = await sendToLLM(messagesForChat);

      chatStore.addAssistantMessage(currentChatId, assistantResponse);
    } catch (err) {
      const msg = (err as Error).message;
      error.value = msg;
      appError.showError(msg);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    messages: computed(() => {
      const id = chatId.value;
      return id ? (chatStore.messagesByChatId[id] ?? []) : [];
    }),
    draft,
    isLoading,
    error,
    sendMessage,
  };
});
