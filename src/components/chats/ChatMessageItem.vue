<template>
  <div
    class="message-wrap"
    :class="message.role === 'user' ? 'message-wrap-user' : 'message-wrap-assistant'"
  >
    <div class="row">
      <div>
        <img :src="message.role === 'user' ? Avatar : Element" class="avatar-img" />
      </div>

      <div class="content">
        <div class="meta">
          <p v-if="message.role === 'user'" class="d-2 role">Mauro Sicard</p>
          <p v-else class="d-2 role">LanguageGUI</p>
          <span class="time d-1">
            {{ formatTime(message.createdAt) }}
          </span>
        </div>
        <div class="message d-2">
          <p>{{ message.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { chatMessage } from '@/components/chats/types';
import Avatar from '@/assets/image/Avatar.jpg';
import Element from '@/assets/image/Element.jpg';
import { formatTime } from '@/utils/formatTime';

defineProps<{ message: chatMessage }>();
</script>

<style scoped>
.message-wrap {
  width: 100%;
  max-width: 574px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  margin-top: 40px;
}

.message {
  display: flex;
  align-items: center;
  margin-top: 12px;
}

p {
  font-weight: 400;
  color: var(--neutral-600);
  margin: 0;
}

.message-wrap-assistant {
  max-width: 526px;
  width: auto;
  height: auto;
  border-radius: 16px;
  border-width: 1px;
  border: 1px solid var(--btn-secondary-border);
  box-shadow: var(--shadow-neutral-regular);
  padding: 24px;
}

.message-wrap-user {
  padding: 0px;
  width: 100%;
  max-width: 574px;
}

.avatar-img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.role {
  font-weight: 500;
  color: var(--neutral-800);
}

.time {
  font-weight: 500;
  color: var(--neutral-600);
  position: relative;
  padding-left: 12px;
}

.row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time::before {
  content: '|';
  position: absolute;
  left: 0;
  color: var(--btn-secondary-border);
}
</style>
