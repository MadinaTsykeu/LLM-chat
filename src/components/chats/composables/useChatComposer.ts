import { useChatSession } from './useChatSession';

export function useChatComposer(submit: () => void | Promise<void>) {
  function sendFromComposer(e: KeyboardEvent) {
    const el = e.currentTarget;

    if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
      return;
    }

    if (el instanceof HTMLInputElement) {
      e.preventDefault();
      void submit();
      return;
    }

    if (el instanceof HTMLTextAreaElement) {
      if (e.shiftKey) return;
      e.preventDefault();
      void submit();
    }
  }

  return { sendFromComposer };
}
