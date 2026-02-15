<template>
  <div class="container">
    <template v-for="(message, index) in messages" :key="message.id">
      <div v-if="shouldShowDivider(index)" class="divider d-1">
        {{ dividerText(message.createdAt) }}
      </div>
      <ChatMessageItem :message="message" />
    </template>
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
  </div>
  <ChatComposer variant="full" />
</template>

<script setup lang="ts">
import { useChatSession } from '@/composables/useChatSession';
import ChatComposer from './ChatComposer.vue';
import ChatMessageItem from './ChatMessageItem.vue';

const { messages, error } = useChatSession();

function dayKey(ts: number): string {
  const date = new Date(ts);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isToday(ts: number): boolean {
  const today = new Date();
  const date = new Date(ts);
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
}

function dividerText(ts: number): string {
  const date = new Date(ts);
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  if (isToday(ts)) {
    return `Today ${time}`;
  } else {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day} Feb ${time}`;
  }
}

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
