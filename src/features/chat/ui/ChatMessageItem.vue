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
          <p v-if="message.content">{{ message.content }}</p>

          <div
            v-if="message.role === 'user' && message.attachments && message.attachments.length > 0"
            class="message-attachments"
          >
            <ChatAttachmentItem
              v-for="att in message.attachments"
              :key="att.id"
              :attachment="att"
              variant="message"
            />
          </div>
        </div>
        <div class="message-actions" v-if="showActions">
          <button
            type="button"
            class="copy-btn"
            :disabled="chatStore.isSending"
            @click="handleRetry"
          >
            <Reload />
          </button>
          <button
            type="button"
            @click="handleCopy"
            :class="['copy-btn', { 'copy-btn-active': isCopied }]"
            :disabled="chatStore.isSending"
          >
            <Copy></Copy>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TChatMessage } from '@/features/chat';
import Avatar from '@/shared/assets/image/Avatar.jpg';
import Element from '@/shared/assets/image/Element.jpg';
import Copy from '@/shared/assets/icons/Copy.svg';
import Reload from '@/shared/assets/icons/Reload.svg';
import { formatTime } from '@/shared/utils/date';
import ChatAttachmentItem from '@/features/chat/ui/ChatAttachmentItem.vue';
import { computed, ref } from 'vue';
import { copyText } from '@/shared/utils/copyText';
import { useChatStore } from '@/features/chat/model/chatStore';

const chatStore = useChatStore();

const { message } = defineProps<{ message: TChatMessage }>();

const showActions = computed(() => {
  return message.role === 'assistant' && message.content.trim();
});

const isCopied = ref(false);

async function handleCopy() {
  if (!showActions.value) return;

  try {
    await copyText(message.content);
    isCopied.value = true;

    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (error) {
    console.error('Failed to copy text:', error);
    return;
  }
}

async function handleRetry() {
  if (!showActions.value) return;

  try {
    await chatStore.retryAssistantMessage({
      chatId: message.chatId,
      assistantMessageId: message.id,
    });
  } catch (error) {
    console.error('Failed to retry message:', error);
  }
}
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

.message-attachments {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 4px;
  width: 100%;
}

.message-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.copy-btn {
  background: none;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  width: 30px;
  height: 30px;
}

.copy-btn:not(.copy-btn-active):not(:disabled):hover {
  background: var(--neutral-200);
  border-color: var(--neutral-400);
}

.copy-btn-active {
  border-color: var(--neutral-500);
  background: var(--neutral-400);
}

.copy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
