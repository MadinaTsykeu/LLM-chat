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

import { useLogin } from '../model/useLogin';

const { isProcessing, startLogin } = useLogin();
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
