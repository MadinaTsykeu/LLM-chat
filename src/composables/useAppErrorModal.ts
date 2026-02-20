import { ref } from 'vue';
import { createGlobalState } from '@vueuse/core';

export const useAppErrorModal = createGlobalState(() => {
  const isOpen = ref(false);
  const title = ref('Something went wrong');
  const message = ref<string>('');

  function showError(text: string, customTitle?: string) {
    title.value = customTitle ?? 'Something went wrong';
    message.value = text;
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
  }

  return {
    isOpen,
    title,
    message,
    showError,
    close,
  };
});
