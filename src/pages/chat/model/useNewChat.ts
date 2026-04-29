import { useRouter } from 'vue-router';
import { AppRouteName } from '@/app/providers/router';
import { useCreateChatMutation } from '@/features/chat/model/queries/useCreateChatMutation';

export function useNewChat() {
  const router = useRouter();
  const createChatMutation = useCreateChatMutation();

  async function startNewChat() {
    const chat = await createChatMutation.mutateAsync({
      title: null,
    });

    await router.push({
      name: AppRouteName.Chat,
      params: { id: chat.id },
    });
  }

  return {
    startNewChat,
    isCreatingChat: createChatMutation.isPending,
  };
}