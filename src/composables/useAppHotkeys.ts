import { onMounted, onUnmounted } from 'vue';
import { useChatSession } from '@/components/chats/composables/useChatSession';

export function useAppHotkeys() {
  const { sendMessage, isLoading, draft } = useChatSession();

  function isComposerField(el: Element | null): el is HTMLInputElement | HTMLTextAreaElement {
    if (!el) return false;
    if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) return false;

    return el.dataset.chatComposer === 'true';
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key !== 'Enter') return;

    const el = document.activeElement;
    if (!isComposerField(el)) return;

    if (isLoading.value) return;
    if (!draft.value.trim()) return;

    if (el instanceof HTMLInputElement) {
      e.preventDefault();
      sendMessage();
      return;
    }

    if (el instanceof HTMLTextAreaElement) {
      if (e.shiftKey) return;
      e.preventDefault();
      sendMessage();
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown);
  });
}
