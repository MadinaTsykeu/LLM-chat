const OPENROUTER_AUTH_BASE_URL = 'https://openrouter.ai/auth';
const OPENROUTER_OAUTH_EXCHANGE_URL = 'https://openrouter.ai/api/v1/auth/keys';
const SESSION_STORAGE_VERIFIER_KEY = 'openrouter:pkce:code_verifier';
const SESSION_STORAGE_METHOD_KEY = 'openrouter:pkce:code_challenge_method';
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

export function generateCodeVerifier(): string {
  const bytes = cryptoRandomBytes(64);
  return base64UrlEncode(bytes);
}

export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const data = toUtf8Bytes(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data as BufferSource);
  return base64UrlEncode(digest);
}

export function buildOpenRouterAuthUrl(params: {
  callbackUrl: string;
  codeChallenge: string;
}): string {
  const { callbackUrl, codeChallenge } = params;

  const url = new URL(OPENROUTER_AUTH_BASE_URL);
  url.searchParams.set('callback_url', callbackUrl);
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', PKCE_METHOD);

  return url.toString();
}

export function getPkceCodeVerifierFromSession(): string | null {
  return sessionStorage.getItem(SESSION_STORAGE_VERIFIER_KEY);
}

export function setPkceCodeVerifierInSession(codeVerifier: string): void {
  sessionStorage.setItem(SESSION_STORAGE_VERIFIER_KEY, codeVerifier);
  sessionStorage.setItem(SESSION_STORAGE_METHOD_KEY, PKCE_METHOD);
}

export function clearPkceFromSession(): void {
  sessionStorage.removeItem(SESSION_STORAGE_VERIFIER_KEY);
  sessionStorage.removeItem(SESSION_STORAGE_METHOD_KEY);
}

export function assertPkceMethodFromSessionOrThrow(): void {
  const storedMethod = sessionStorage.getItem(SESSION_STORAGE_METHOD_KEY);
  if (storedMethod !== PKCE_METHOD) {
    throw new Error('Invalid PKCE session. Please login again.');
  }
}

export async function exchangeCodeForUserKey(params: {
  code: string;
  codeVerifier: string;
}): Promise<string> {
  const res = await fetch(OPENROUTER_OAUTH_EXCHANGE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: params.code,
      code_verifier: params.codeVerifier,
      code_challenge_method: PKCE_METHOD,
    }),
  });

  if (!res.ok) {
    let msg = `Login failed (${res.status}).`;
    try {
      const data = (await res.json()) as unknown;
      if (data && typeof data === 'object' && 'error' in data) {
        msg = String((data as any).error);
      } else {
        msg = JSON.stringify(data);
      }
    } catch {}
    throw new Error(msg);
  }

  const data = (await res.json()) as { key?: string };
  if (!data?.key) {
    throw new Error('OpenRouter did not return a key.');
  }
  return data.key;
}
