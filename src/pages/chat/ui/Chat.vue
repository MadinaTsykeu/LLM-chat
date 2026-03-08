<template>
  <div class="main">
    <MainHeader />
    <ChatFeed />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainHeader from '@/components/chats/MainHeader.vue';
import ChatFeed from '@/components/chats/ChatFeed.vue';
import { useChatStore } from '@/components/chats/stores/chatStore';
import { AppRouteName } from '@/router';
import { useAppHotkeys } from '@/composables/useAppHotkeys';

const route = useRoute();
const router = useRouter();
const chatStore = useChatStore();

useAppHotkeys();

function validateChatRoute() {
  const id = route.params.id as string | undefined;

  if (!id) {
    router.replace({ name: AppRouteName.ChatHome });
    return;
  }

  const exists = chatStore.chats.some((c) => c.id === id);

  if (!exists) {
    router.replace({ name: AppRouteName.ChatHome });
  }
}

watch(
  () => route.params.id,
  () => {
    validateChatRoute();
  },
  { immediate: true }
);
</script>

<style scoped>
.main {
  position: relative;
  overflow: hidden;
  height: calc(100vh - 25px);
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background-color: var(--neutral-100);
  border: 1px solid var(--neutral-300);
  box-shadow: var(--shadow-neutral-small);
  flex: 1;
}
</style>
