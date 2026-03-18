import { useRouter } from 'vue-router';
import { AppRouteName } from '@/app/providers/router';

export function useNewChat() {
  const router = useRouter();

  function startNewChat() {
    router.push({ name: AppRouteName.ChatHome });
  }

  return {
    startNewChat,
  };
}
