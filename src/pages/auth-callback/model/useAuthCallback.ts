import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AppRouteName } from '@/app/providers/router';
import { useAuthStore } from '@/shared/stores/auth';
import { useAppErrorModal } from '@/shared/ui/modals/app-error-modal';
import axios, { AxiosError } from 'axios';

const OPENROUTER_OAUTH_EXCHANGE_URL = 'https://openrouter.ai/api/v1/auth/keys';
const SESSION_STORAGE_VERIFIER_KEY = 'openrouter:pkce:code_verifier';
const SESSION_STORAGE_METHOD_KEY = 'openrouter:pkce:code_challenge_method';
const PKCE_METHOD = 'S256';

function getPkceCodeVerifierFromSession(): string | null {
  return sessionStorage.getItem(SESSION_STORAGE_VERIFIER_KEY);
}

function clearPkceFromSession(): void {
  sessionStorage.removeItem(SESSION_STORAGE_VERIFIER_KEY);
  sessionStorage.removeItem(SESSION_STORAGE_METHOD_KEY);
}

function assertPkceMethodFromSessionOrThrow(): void {
  const storedMethod = sessionStorage.getItem(SESSION_STORAGE_METHOD_KEY);

  if (storedMethod !== PKCE_METHOD) {
    throw new Error('Invalid PKCE session. Please login again.');
  }
}

async function exchangeCodeForUserKey(params: {
  code: string;
  codeVerifier: string;
}): Promise<string> {
  try {
    const { data } = await axios.post<{ key?: string }>(
      OPENROUTER_OAUTH_EXCHANGE_URL,
      {
        code: params.code,
        code_verifier: params.codeVerifier,
        code_challenge_method: PKCE_METHOD,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!data?.key) {
      throw new Error('OpenRouter did not return a key.');
    }

    return data.key;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.error || error.message || 'Login failed';
      throw new Error(String(message));
    }

    throw error;
  }
}

export function useAuthCallback() {
  const route = useRoute();
  const router = useRouter();
  const appError = useAppErrorModal();
  const authStore = useAuthStore();
  const isProcessing = ref(true);

  function cleanCodeFromUrl(): void {
    const url = new URL(window.location.href);
    url.searchParams.delete('code');
    history.replaceState({}, '', url.toString());
  }

  async function runAuthCallback() {
    const codeParam = route.query.code;
    const code = Array.isArray(codeParam) ? codeParam[0] : codeParam;

    if (!code) {
      appError.showError('Login session expired, please login again', 'Login expired');
      await router.replace({ name: AppRouteName.Login });
      return;
    }

    isProcessing.value = true;

    try {
      const codeVerifier = getPkceCodeVerifierFromSession();

      if (!codeVerifier) {
        appError.showError('Login session expired, please login again', 'Login expired');
        clearPkceFromSession();
        cleanCodeFromUrl();
        await router.replace({ name: AppRouteName.Login });
        return;
      }

      assertPkceMethodFromSessionOrThrow();

      const userKey = await exchangeCodeForUserKey({ code, codeVerifier });

      authStore.setUserKey(userKey);

      cleanCodeFromUrl();
      clearPkceFromSession();

      await router.replace({ name: AppRouteName.ChatHome });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);

      appError.showError(msg || 'Login again', 'Login failed');
      cleanCodeFromUrl();
      clearPkceFromSession();

      await router.replace({ name: AppRouteName.Login });
    } finally {
      isProcessing.value = false;
    }
  }

  return {
    isProcessing,
    runAuthCallback,
  };
}
