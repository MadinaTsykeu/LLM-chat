import { onMounted, onUnmounted } from 'vue';
import { useChatComposer } from '@/components/chats/composables/useChatComposer';

export function useAppHotkeys() {
  const { sendFromComposer } = useChatComposer();

  function onKeydown(e: KeyboardEvent) {
    if (e.key !== 'Enter') return;

    sendFromComposer(e);
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown);
  });
}