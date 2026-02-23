import { useChatSession } from './useChatSession';

function isComposerField(el: Element | null): el is HTMLInputElement | HTMLTextAreaElement {
  if (!el) return false;
  if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) return false;

  return el.dataset.chatComposer === 'true';
}

export function useChatComposer() {
  const { sendMessage, isLoading, draft } = useChatSession();

  function sendFromComposer(e: KeyboardEvent) {
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

  return { sendFromComposer };
}