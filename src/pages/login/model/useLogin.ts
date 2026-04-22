import { ref } from 'vue';

export function useLogin() {
  const isProcessing = ref(false);

  function startLogin() {
    isProcessing.value = true;
    window.location.href = 'http://localhost:3000/auth/start';
  }

  return {
    isProcessing,
    startLogin,
  };
}
