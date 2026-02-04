<template>
  <div class="app-container">
    <div
      v-if="isSidebarOpen"
      class="overlay"
      @click="closeSidebar"
      aria-hidden="true"
    />
    <Sidebar :isSidebarOpen="isSidebarOpen"
      @close="closeSidebar" />
    <ChatsView @openSidebar="openSidebar"/>
  </div>
</template>

<script setup>
import ChatsView from './components/ChatsView.vue';
import Sidebar from './components/Sidebar/Sidebar.vue';
import { ref } from 'vue';

const isSidebarOpen = ref(false);

function openSidebar() {
  isSidebarOpen.value = true;
}

function closeSidebar() {
  isSidebarOpen.value = false;
}

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value; 
}
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
