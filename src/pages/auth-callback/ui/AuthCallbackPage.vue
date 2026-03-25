<template>
  <div class="callback-page">
    <img :src="BackgroundMain" alt="BackgroundMain" class="content-accent" />
    <div class="card">
      <h3 class="d-3 title">{{ isProcessing ? 'Authorizing...' : 'Done' }}</h3>
      <p class="d-2 text">Please wait.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthCallback } from '../model/useAuthCallback';
import BackgroundMain from '@/shared/assets/icons/BackgroundMain.png';

const { isProcessing, runAuthCallback } = useAuthCallback();

onMounted(() => {
  void runAuthCallback();
});
</script>

<style scoped>
.content-accent {
  position: absolute;
  left: 50%;
  bottom: 0px;
  transform: translateX(-50%);
  width: 100%;
  pointer-events: none;
  z-index: 0;
}

.callback-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  padding: 24px;
  width: 100%;
  max-width: 420px;
  background: var(--neutral-100);
  border: 1px solid var(--neutral-300);
  border-radius: 16px;
  box-shadow: var(--shadow-neutral-regular);
}

.title {
  margin: 0 0 8px 0;
  color: var(--neutral-700);
  font-weight: 600;
}

.text {
  margin: 0;
  color: var(--neutral-600);
}
</style>
