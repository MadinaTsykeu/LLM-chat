<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<script setup>
import { initAuthGuard } from '@/app/providers/router/guards';
initAuthGuard();
</script>

<style>
.app-container {
  display: flex;
  height: 100%;
  width: 100%;
}

@media (max-width: 768px) {
  .app-container {
    display: block;
  }
}
</style>
