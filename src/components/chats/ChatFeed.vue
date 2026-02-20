<template>
  <div class="container">
    <template v-for="(message, index) in messages" :key="message.id">
      <div v-if="shouldShowDivider(index)" class="divider d-1">
        {{ formatDividerText(message.createdAt) }}
      </div>
      <ChatMessageItem :message="message" />
    </template>
  </div>
  <ChatComposer variant="full" />
</template>

<script setup lang="ts">
import { useChatSession } from '@/components/chats/composables/useChatSession';
import ChatComposer from './ChatComposer.vue';
import ChatMessageItem from './ChatMessageItem.vue';
import { dayKey, formatDividerText } from '@/utils/date';

const { messages } = useChatSession();

function shouldShowDivider(index: number): boolean {
  if (index === 0) return true;

  const current = messages.value[index];
  const previous = messages.value[index - 1];

  return dayKey(current.createdAt) !== dayKey(previous.createdAt);
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 16px;
  box-sizing: border-box;
  overflow-y: auto;
}

.divider {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  font-weight: 400;
  color: var(--neutral-600);
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--neutral-300);
  margin: auto 12px;
  max-width: 228px;
  width: 100%;
}
</style>
