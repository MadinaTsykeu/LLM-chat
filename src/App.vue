<template>
  <div class="app-container">
    <Sidebar />
    <ChatsView />
    <AppErrorModal />
  </div>
</template>

<script setup>
import ChatsView from './components/ChatsView.vue';
import { Sidebar } from '@/components/Sidebar';
import AppErrorModal from '@/components/AppErrorModal/AppErrorModal.vue';
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
