import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { AppRouteName } from '@/app/providers/router';
import { useAppErrorModal } from '@/shared/ui/modals/app-error-modal';

const OPENROUTER_AUTH_BASE_URL = 'https://openrouter.ai/auth';
const SESSION_STORAGE_VERIFIER_KEY = 'openrouter:pkce:code_verifier';
const PKCE_METHOD = 'S256';

function base64UrlEncode(bytes: ArrayBuffer | Uint8Array): string {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);

  let binary = '';
  for (let i = 0; i < u8.length; i++) {
    binary += String.fromCharCode(u8[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function toUtf8Bytes(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}

function cryptoRandomBytes(length: number): Uint8Array {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return arr;
}

function generateCodeVerifier(): string {
  const bytes = cryptoRandomBytes(64);
  return base64UrlEncode(bytes);
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const data = toUtf8Bytes(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data as BufferSource);
  return base64UrlEncode(digest);
}

function buildOpenRouterAuthUrl(params: { callbackUrl: string; codeChallenge: string }): string {
  const { callbackUrl, codeChallenge } = params;

  const url = new URL(OPENROUTER_AUTH_BASE_URL);
  url.searchParams.set('callback_url', callbackUrl);
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', PKCE_METHOD);

  return url.toString();
}

function setPkceCodeVerifierInSession(codeVerifier: string): void {
  sessionStorage.setItem(SESSION_STORAGE_VERIFIER_KEY, codeVerifier);
}

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
