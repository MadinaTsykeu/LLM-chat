<template>
  <header class="main-header">
    <UiButton v-if="!md" variant="icon" size="sm" @click="open">
      <template #left>
        <LeftIcon />
      </template>
    </UiButton>

    <h3 v-if="md" class="main-header-button d-2">
      <span v-if="isLoading">Loading...</span>
      <span v-else-if="isError">
        {{ error instanceof Error ? error.message : 'Failed to load chats' }}
      </span>
      <span v-else>{{ currentChatTitle }}</span>
    </h3>

    <UiButton variant="primary" size="sm" :only-icon="!md" @click="startNewChat">
      <template #left>
        <ElementIcon />
      </template>

      <span v-if="md" class="btn-text">New Chat</span>
    </UiButton>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ElementIcon from '@/shared/assets/icons/Element.svg';
import LeftIcon from '@/shared/assets/icons/Left.svg';
import UiButton from '@/shared/ui/UiButton.vue';
import { useAppBreakpoints } from '@/shared/composable/useAppBreakpoints';
import { useSidebarState } from '@/features/sidebar';
import { useNewChat } from '@/pages/chat/model/useNewChat';
import { useChatsQuery } from '@/features/chat/model/queries/useChatsQuery';

const route = useRoute();
const { data: chats, isLoading, isError, error } = useChatsQuery();

const currentChatTitle = computed(() => {
  const id = route.params.id as string | undefined;
  if (!id) return 'Chats';

  const chat = chats.value?.find((c) => c.id === id);
  return chat?.title ?? 'Chats';
});

const { startNewChat } = useNewChat();
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
