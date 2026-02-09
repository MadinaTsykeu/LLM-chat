<template>
  <div class="app-container">
    <div v-if="isOpen" class="overlay" @click="close" aria-hidden="true" />
    <Sidebar />
    <ChatsView />
  </div>
</template>

<script setup>
import ChatsView from './components/ChatsView.vue';
import { Sidebar } from '@/components/Sidebar'
import { useSidebarState } from '@/components/Sidebar'

const { isOpen, close } = useSidebarState();
</script>

<style>
.app-container {
  display: flex;
  height: 100%;
  width: 100%;
}

.overlay {
  display: none;
}

@media (max-width: 768px) {
  .overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 10;
  }

  .app-container {
    display: block;
  }
}
</style>
