<!-- src/pages/chat/ui/HomeChat.vue -->
<template>
  <div class="main">
    <MainHeader />
    <MainCard />
  </div>
</template>

<script setup lang="ts">
import MainHeader from '@/components/chats/MainHeader.vue';
import MainCard from '@/components/chats/MainCard.vue';
import { useAppHotkeys } from '@/composables/useAppHotkeys';
import { useChatStore } from '@/components/chats/stores/chatStore';
import { useRouter } from 'vue-router';
import { watch } from 'vue';
import { AppRouteName } from '@/router';

const chatStore = useChatStore();
const router = useRouter();

useAppHotkeys();

watch(
  () => chatStore.activeChatId,
  (id, oldId) => {
    if (!oldId && id) {
      router.push({ name: AppRouteName.Chat, params: { id } });
    }
  },
  { immediate: false }
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
