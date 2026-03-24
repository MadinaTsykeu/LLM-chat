import { computed } from 'vue';
import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const userKey = useStorage<string | null>('llm_chat_app:user_key', null);

  const isAuthenticated = computed(() => !!userKey.value);

  function setUserKey(key: string) {
    userKey.value = key;
  }

  function clearAuth() {
    userKey.value = null;
  }

  return {
    userKey,
    isAuthenticated,
    setUserKey,
    clearAuth,
  };
});
