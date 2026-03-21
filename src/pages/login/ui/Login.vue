<template>
  <div class="login-page">
    <img :src="BackgroundMain" alt="BackgroundMain" class="content-accent" />
    <UiButton variant="primary" class="login-button" :disabled="isProcessing" @click="startLogin">
      Login
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import BackgroundMain from '@/shared/assets/icons/BackgroundMain.png';
import UiButton from '@/shared/ui/UiButton.vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AppRouteName } from '@/app/providers/router';
import { useAppErrorModal } from '@/shared/ui/modals/app-error-modal';
import {
  buildOpenRouterAuthUrl,
  exchangeCodeForUserKey,
  generateCodeChallenge,
  generateCodeVerifier,
  clearPkceFromSession,
  getPkceCodeVerifierFromSession,
  setPkceCodeVerifierInSession,
  assertPkceMethodFromSessionOrThrow,
} from '@/shared/auth/openRouterOauth';
import { getUserKey, setUserKey } from '@/shared/auth/authStorage';

const isProcessing = ref(false);

const route = useRoute();
const router = useRouter();
const appError = useAppErrorModal();

function cleanCodeFromUrl(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete('code');
  history.replaceState({}, '', url.toString());
}

async function handleCallbackIfCodeExists() {
  const codeParam = route.query.code;
  const code = Array.isArray(codeParam) ? codeParam[0] : codeParam;
  if (!code) return false;
  isProcessing.value = true;
  try {
    const codeVerifier = getPkceCodeVerifierFromSession();
    if (!codeVerifier) {
      appError.showError('Login session expired, please login again', 'Login expired');
      clearPkceFromSession();
      cleanCodeFromUrl();
      await router.replace({ path: '/login' });
      return true;
    }

    assertPkceMethodFromSessionOrThrow();

    const userKey = await exchangeCodeForUserKey({ code, codeVerifier });

    setUserKey(userKey);
    cleanCodeFromUrl();
    clearPkceFromSession();

    const target = { name: AppRouteName.ChatHome };
    await router.replace(target);
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);

    appError.showError(msg || 'Login again', 'Login failed');
    cleanCodeFromUrl();
    clearPkceFromSession();

    return true;
  } finally {
    isProcessing.value = false;
  }
}

async function startLogin() {
  isProcessing.value = true;
  try {
    const callbackUrl = `${window.location.origin}/login`;

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    setPkceCodeVerifierInSession(codeVerifier);
    const authUrl = buildOpenRouterAuthUrl({
      callbackUrl,
      codeChallenge,
    });

    window.location.href = authUrl;
  } finally {
    isProcessing.value = false;
  }
}

onMounted(async () => {
  if (getUserKey()) {
    await router.replace({ name: AppRouteName.ChatHome });
    return;
  }

  await handleCallbackIfCodeExists();
});
</script>

<style scoped>
.login-page {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-accent {
  position: absolute;
  left: 50%;
  bottom: 0px;
  transform: translateX(-50%);
  width: 100%;
  pointer-events: none;
  z-index: 0;
}

.login-button {
  transition:
    transform 0.12s ease,
    filter 0.12s ease;
  z-index: 1;
  width: 100%;
  max-width: 443px;
}

@media (max-width: 480px) {
  .login-button {
    max-width: 90%;
  }
}
</style>
