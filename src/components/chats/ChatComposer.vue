<template>
  <div class="composer" :class="`composer-${variant}`">
    <input
      v-if="variant === 'compact'"
      class="composer-input p-small"
      type="text"
      placeholder="How can I help you?"
      v-model="draft"
      :disabled="isLoading"
      @keydown="handleKeydown"
    />
    <textarea
      v-else
      class="composer-textarea p-small"
      placeholder="How can I help you?"
      v-model="draft"
      :disabled="isLoading"
      @keydown="handleKeydown"
    />
    <hr v-if="variant === 'full'" />
    <UiButton
      variant="primary"
      size="df"
      class="composer-send-btn"
      @click="sendMessage"
      :disabled="isLoading || draft.trim() === ''"
      :only-icon="variant === 'compact'"
    >
      <template #left>
        <SendIcon :width="20" :height="20" fill="currentColor" />
      </template>
      <h3 class="d-2 btn-text" v-if="variant === 'full'">Send message</h3>
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import SendIcon from '@icons/Send.svg';
import { useChatSession } from '@/composables/useChatSession';
import UiButton from '../shared/UiButton.vue';

const { draft, sendMessage, isLoading } = useChatSession();

const props = defineProps<{
  variant?: 'compact' | 'full';
}>();

const variant = props.variant || 'full';

function handleKeydown(e: KeyboardEvent) {
  if (variant === 'compact') {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  }

  if (variant === 'full') {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }
}
</script>

<style scoped>
.composer {
  transition:
    transform 0.12s ease,
    filter 0.12s ease;
  display: flex;
  align-items: center;
  border: 1px solid var(--neutral-400);
  border-radius: 12px;
  background: var(--neutral-100);
  box-sizing: border-box;
}

.composer-compact {
  max-width: 400px;
  width: 100%;
  padding: 8px;
  gap: 8px;
}

.composer-full {
  width: calc(100% - 48px);
  max-width: 574px;
  min-height: 172px;
  display: flex;
  flex-direction: column;
  padding: 24px 24px 16px 24px;
  margin: 0 auto;
  margin-bottom: 23px;
  box-sizing: border-box;
}

.composer-input {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-600);
}

.composer-input:focus {
  outline: none;
}

.composer-send-btn {
  padding: 8px 16px;
  transition:
    transform 0.12s ease,
    filter 0.12s ease;
}

.composer-textarea {
  display: flex;
  align-self: flex-start;
  border: none;
  outline: none;
  resize: none;
  background: none;
  height: 100%;
  width: 100%;
}

hr {
  width: 100%;
  border: 1px solid var(--btn-secondary-border);
  margin: 24px 0;
}

.btn-text {
  font-weight: 400;
}

.composer-full .composer-send-btn {
  align-self: flex-end;
}
</style>
