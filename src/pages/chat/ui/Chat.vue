<template>
  <div class="main">
    <MainHeader />
    <ChatFeed />
  </div>
</template>

<script setup lang="ts">
import { MainHeader, ChatFeed } from '@/features/chat';
import { useAppHotkeys } from '@/shared/composable/useAppHotkeys';
import { useChatStore } from '@/features/chat';
import { useRoute } from 'vue-router';
import { computed, watch } from 'vue';

const route = useRoute();
const chatStore = useChatStore();

const chatId = computed(() => {
  const id = route.params.id;

  return typeof id === 'string' ? id : '';
});

watch(
  chatId,
  (id) => {
    if (!id) return;

    void chatStore.reloadMessages(id);
  },
  { immediate: true }
);

useAppHotkeys();
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
