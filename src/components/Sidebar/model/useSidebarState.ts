import { ref } from 'vue';

const isOpen = ref(true);

export function useSidebarState() {
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
}
