import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { AppRouteName } from '@/app/providers/router';
import { useAppErrorModal } from '@/shared/ui/modals/app-error-modal';

import {
  buildOpenRouterAuthUrl,
  generateCodeChallenge,
  generateCodeVerifier,
  setPkceCodeVerifierInSession,
} from '@/pages/login/lib/openRouterOauth';

export function useLogin() {
  const router = useRouter();
  const appError = useAppErrorModal();

  const isProcessing = ref(false);

  async function startLogin() {
    isProcessing.value = true;

    try {
      const callbackUrl = new URL(
        router.resolve({ name: AppRouteName.AuthCallback }).href,
        window.location.origin
      ).toString();

      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      setPkceCodeVerifierInSession(codeVerifier);

      const authUrl = buildOpenRouterAuthUrl({
        callbackUrl,
        codeChallenge,
      });

      window.location.href = authUrl;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      appError.showError(msg || 'Login failed', 'Login failed');
    } finally {
      isProcessing.value = false;
    }
  }

  return {
    isProcessing,
    startLogin,
  };
}
