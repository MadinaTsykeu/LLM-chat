import { ref } from 'vue';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useLogin() {
  const isProcessing = ref(false);

  function startLogin() {
    if (!API_BASE_URL) {
      throw new Error('VITE_API_BASE_URL is not configured');
    }

    isProcessing.value = true;
    window.location.href = `${API_BASE_URL}/auth/start`;
  }

  return {
    isProcessing,
    startLogin,
  };
}
