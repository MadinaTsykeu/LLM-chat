import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { getMe } from '@/shared/api/authApi';

type AuthStatus = 'unknown' | 'authenticated' | 'unauthenticated';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<unknown | null>(null);
  const status = ref<AuthStatus>('unknown');
  const isLoading = ref(false);

  const isAuthenticated = computed(() => status.value === 'authenticated');

  async function fetchMe() {
    if (isLoading.value) return;

    isLoading.value = true;

    try {
      const data = await getMe();

      user.value = data;
      status.value = 'authenticated';
    } catch (err: any) {
      if (err?.response?.status === 401) {
        user.value = null;
        status.value = 'unauthenticated';
      } else {
        throw err;
      }
    } finally {
      isLoading.value = false;
    }
  }

  function reset() {
    user.value = null;
    status.value = 'unauthenticated';
  }

  return {
    user,
    status,
    isLoading,
    isAuthenticated,
    fetchMe,
    reset,
  };
});
