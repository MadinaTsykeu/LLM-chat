import { useChatStore } from '@/components/chats/stores/chatStore';
import { useRouter } from 'vue-router';
import { AppRouteName } from '@/router';

export function useNewChat() {
  const chatStore = useChatStore();
  const router = useRouter();

  function startNewChat() {
    const chat = chatStore.createChat();
    router.push({ name: AppRouteName.Chat, params: { id: chat.id } });
  }

  return {
    startNewChat,
  };
}
