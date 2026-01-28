<template>
  <div class="app-container">
    <Sidebar />
    <ChatsView />
  </div>
</template>

<script setup>
import ChatsView from './components/ChatsView.vue';
import Sidebar from './components/Sidebar.vue';
</script>

<style>
.app-container {
  display: flex;
  height: 100%;
  width: 100%;
}
</style>
