import { ref } from 'vue';
import { createGlobalState } from '@vueuse/core';

export const useSidebarState = createGlobalState(() => {
  const isOpen = ref(true);

  const open = () => {
    isOpen.value = true;
  };
  const close = () => {
    isOpen.value = false;
  };
  const toggleOpen = () => {
    isOpen.value = !isOpen.value;
  };

  return {
    isOpen,
    open,
    close,
    toggleOpen,
  };
});
