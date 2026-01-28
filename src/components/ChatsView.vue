<template>
  <div class="main">
    <MainHeader />
    <MainCard />
  </div>
</template>

<script setup>
import MainHeader from './chats/MainHeader.vue';
import MainCard from './chats/MainCard.vue';
</script>

<style scoped>
.main {
  position: relative;
  overflow: hidden;
  height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  padding-top: 16px;
  background-color: var(--neutral-100);
  border: 1px solid var(--neutral-300);
  box-shadow: var(--shadow-neutral-small);
  flex: 1;
}
</style>
