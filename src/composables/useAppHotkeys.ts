import { onMounted, onUnmounted } from 'vue';

export function useAppHotkeys() {
  function onKeydown(e: KeyboardEvent) {}

  onMounted(() => {
    window.addEventListener('keydown', onKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown);
  });
}
