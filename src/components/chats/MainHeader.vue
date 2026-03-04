<template>
  <header class="main-header">
    <UiButton v-if="!md" variant="icon" size="sm" @click="open">
      <template #left>
        <LeftIcon />
      </template>
    </UiButton>
    <h3 class="main-header-button d-2" v-if="md">Chats</h3>
    <UiButton variant="primary" size="sm" :only-icon="!md" @click="handleNewChat">
      <template #left>
        <ElementIcon />
      </template>

      <span v-if="md" class="btn-text"> New Chat </span>
    </UiButton>
  </header>
</template>

<script setup lang="ts">
import ElementIcon from '@icons/Element.svg';
import UiButton from '../shared/UiButton.vue';
import LeftIcon from '@icons/Left.svg';
import { useAppBreakpoints } from '@/composables';
import { useSidebarState } from '@/components/Sidebar';
import { useChatStore } from '@/components/chats/stores/chatStore';
import { useRouter } from 'vue-router';
import { AppRouteName } from '@/router';

const chatStore = useChatStore();
const router = useRouter();

function handleNewChat() {
  const chat = chatStore.createChat();
  router.push({ name: AppRouteName.Chat, params: { id: chat.id } });
}

const { open } = useSidebarState();
const { md } = useAppBreakpoints();
</script>

<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--neutral-400);
}

.main-header-button {
  font-weight: 500;
}
</style>
