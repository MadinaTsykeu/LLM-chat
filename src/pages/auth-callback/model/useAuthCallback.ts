import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AppRouteName } from '@/app/providers/router';
import { useAuthStore } from '@/shared/stores/auth';
import { useAppErrorModal } from '@/shared/ui/modals/app-error-modal';

import {
  assertPkceMethodFromSessionOrThrow,
  clearPkceFromSession,
  exchangeCodeForUserKey,
  getPkceCodeVerifierFromSession,
} from '@/pages/login/lib/openRouterOauth';

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
      await router.replace({ path: '/login' });
      return;
    }

    isProcessing.value = true;

    try {
      const codeVerifier = getPkceCodeVerifierFromSession();

      if (!codeVerifier) {
        appError.showError('Login session expired, please login again', 'Login expired');
        clearPkceFromSession();
        cleanCodeFromUrl();
        await router.replace({ path: '/login' });
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

      await router.replace({ path: '/login' });
    } finally {
      isProcessing.value = false;
    }
  }

  return {
    isProcessing,
    runAuthCallback,
  };
}
