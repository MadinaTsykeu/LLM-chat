<template>
  <div class="main">
    <MainHeader />
    <ChatFeed v-if="messages.length > 0" />
    <MainCard v-else />
  </div>
</template>

<script setup lang="ts">
import MainHeader from './chats/MainHeader.vue';
import MainCard from './chats/MainCard.vue';
import ChatFeed from './chats/ChatFeed.vue';
import { useChatSession } from '@/components/chats/composables/useChatSession';
import { useAppHotkeys } from '@/composables/useAppHotkeys';

useAppHotkeys();

const { messages } = useChatSession();
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
