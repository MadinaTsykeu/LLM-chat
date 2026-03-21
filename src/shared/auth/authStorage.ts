const LOCALSTORAGE_KEY = 'llm_chat_app:v2';

type AuthState = {
  isAuthenticated: boolean;
  userKey: string | null;
  createdAt?: number;
  updatedAt?: number;
};

type RootState = {
  auth?: AuthState;
};

function readRoot(): RootState {
  try {
    const raw = localStorage.getItem(LOCALSTORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as RootState;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeRoot(next: RootState): void {
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(next));
}

export function getUserKey(): string | null {
  const root = readRoot();
  return root.auth?.userKey ?? null;
}

export function isAuthenticated(): boolean {
  const root = readRoot();
  return Boolean(root.auth?.isAuthenticated && root.auth?.userKey);
}

export function setUserKey(userKey: string): void {
  const root = readRoot();
  const now = Date.now();

  const prevAuth = root.auth ?? {
    isAuthenticated: false,
    userKey: null,
  };

  root.auth = {
    ...prevAuth,
    userKey,
    isAuthenticated: true,
    createdAt: prevAuth.createdAt ?? now,
    updatedAt: now,
  };

  writeRoot(root);
}

export function clearAuth(): void {
  const root = readRoot();
  root.auth = {
    isAuthenticated: false,
    userKey: null,
    updatedAt: Date.now(),
  };
  writeRoot(root);
}
