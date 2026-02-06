import { ref } from 'vue';

const isOpen = ref(false);
const isCollapsed = ref(false); 

const open = () => { isOpen.value = true }
const close = () => { isOpen.value = false }
const toggleOpen = () => { isOpen.value = !isOpen.value }

const toggleCollapse = () => { isCollapsed.value = !isCollapsed.value }

export function useSidebarState() {
  return {
    isOpen,
    isCollapsed,
    open,
    close,
    toggleOpen,
    toggleCollapse,
  };
}