<template>
  <div class="app-container">
    <Sidebar />
    <main class="app-main">
      <router-view />
    </main>
    <AppErrorModal />
  </div>
</template>

<script setup lang="ts">
import { Sidebar } from '@/components/Sidebar';
import { AppErrorModal } from '@/components/AppErrorModal';
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.app-main {
  flex: 1;
  padding: 10px;
  padding-left: 0;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .app-container {
    display: block;
  }

  .app-main {
    padding: 16px;
  }
}
</style>
