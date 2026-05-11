<template>
  <div class="container" ref="feedContainerRef">
    <div v-if="isLoading" class="feed-state d-2">Loading messages...</div>

    <div v-else-if="isError" class="feed-state d-2">
      {{ error instanceof Error ? error.message : 'Failed to load messages' }}
    </div>

    <div v-else-if="!messages.length" class="feed-state d-2">No messages</div>

    <template v-else v-for="(message, index) in messages" :key="message.id">
      <div v-if="shouldShowDivider(index)" class="divider d-1">
        {{ formatDividerText(message.createdAt) }}
      </div>
      <ChatMessageItem :message="message" />
    </template>
  </div>
  <ChatComposer variant="full" />
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ChatComposer from './ChatComposer.vue';
import ChatMessageItem from './ChatMessageItem.vue';
import { dayKey, formatDividerText } from '@/shared/utils/date';
import { useChatMessagesQuery } from '@/features/chat/model/queries/useChatMessagesQuery';

const route = useRoute();

const chatId = computed(() => {
  const id = route.params.id;

  return typeof id === 'string' ? id : '';
});

const feedContainerRef = ref<HTMLElement | null>(null);

const { data: queryMessages, isLoading, isError, error } = useChatMessagesQuery(chatId);

const messages = computed(() => queryMessages.value ?? []);

watch(
  () => messages.value.length,
  async () => {
    if (!messages.value.length) return;

    await nextTick();

    const container = feedContainerRef.value;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }
);

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

.feed-state {
  padding: 24px 0;
  text-align: center;
  color: var(--neutral-500);
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
