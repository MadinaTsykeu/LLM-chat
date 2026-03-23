import { computed } from 'vue';
import { useStorage } from '@vueuse/core';

const LOCALSTORAGE_KEY = 'llm_chat_app:v2';

type AuthState = {
  isAuthenticated: boolean;
  userKey: string | null;
  createdAt?: number;
  updatedAt?: number;
};

type RootState = {
  auth: AuthState;
};

const storage = useStorage<RootState>(LOCALSTORAGE_KEY, {
  auth: {
    isAuthenticated: false,
    userKey: null,
  },
});

const auth = computed(() => storage.value.auth);

const userKey = computed(() => auth.value.userKey);

const isAuthenticated = computed(() => {
  return Boolean(auth.value.isAuthenticated && auth.value.userKey);
});

function setUserKey(nextUserKey: string): void {
  const now = Date.now();
  const prevAuth = storage.value.auth;

  storage.value = {
    ...storage.value,
    auth: {
      ...prevAuth,
      userKey: nextUserKey,
      isAuthenticated: true,
      createdAt: prevAuth.createdAt ?? now,
      updatedAt: now,
    },
  };
}

function clearAuth(): void {
  storage.value = {
    ...storage.value,
    auth: {
      isAuthenticated: false,
      userKey: null,
      updatedAt: Date.now(),
    },
  };
}

export function useAuthStore() {
  return {
    auth,
    userKey,
    isAuthenticated,
    setUserKey,
    clearAuth,
  };
}
