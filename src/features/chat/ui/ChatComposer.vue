<template>
  <div class="composer" :class="[`composer-${variant}`, { 'is-sending': chatStore.isSending }]">
    <input
      v-if="variant === 'compact'"
      class="composer-input p-small"
      type="text"
      placeholder="How can I help you?"
      v-model.trim="draft"
      ref="composerFieldRef"
      @keydown.enter.prevent="trySend"
    />
    <textarea
      v-else
      class="composer-textarea p-small"
      placeholder="How can I help you?"
      v-model.trim="draft"
      ref="composerFieldRef"
      @keydown.enter="onTextareaEnter"
    />
    <div v-if="attachments.length > 0" class="composer-attachments">
      <ChatAttachmentItem
        v-for="attachment in attachments"
        :key="attachment.id"
        :attachment="attachment"
        :removable="true"
        variant="composer"
        @remove="removeAttachment"
      />
    </div>
    <hr v-if="variant === 'full'" />
    <UiButton
      v-if="variant === 'full'"
      variant="secondary"
      size="df"
      class="composer-attach-btn"
      :only-icon="true"
      :disabled="chatStore.isSending"
      @click="openFilePicker"
    >
      <template #left>
        <Paperclip />
      </template>
    </UiButton>
    <ChatAttachmentOptions
      v-if="variant === 'full'"
      v-model="isAttachMenuOpen"
      @select="handleAttachmentSelect"
    />
    <UiButton
      variant="primary"
      size="df"
      class="composer-send-btn"
      @click="trySend"
      :disabled="chatStore.isSending || !canSend"
      :only-icon="variant === 'compact'"
    >
      <template #left>
        <SendIcon :width="20" :height="20" fill="currentColor" />
      </template>
      <h3 class="d-2 btn-text" v-if="variant === 'full'">Send message</h3>
    </UiButton>
    <input
      @change="handleFileChange"
      ref="fileInputRef"
      type="file"
      multiple
      class="composer-file-input"
      :accept="currentAccept"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SendIcon from '@/shared/assets/icons/Send.svg';
import UiButton from '@/shared/ui/UiButton.vue';
import { useChatStore } from '@/features/chat';
import { useAppErrorModal } from '@/shared/ui/modals/app-error-modal';
import { AppRouteName } from '@/app/providers/router';
import Paperclip from '@/shared/assets/icons/Paperclip.svg';
import { useChatFiles } from '@/features/chat/model/useChatFiles';
import ChatAttachmentItem from '@/features/chat/ui/ChatAttachmentItem.vue';
import ChatAttachmentOptions from '@/features/chat/ui/attachments/ChatAttachmentOptions.vue';
import { ATTACHMENT_ACCEPT } from '@/features/chat/ui/attachments/constants';
import { getReadableUploadErrorMessage } from '@/features/chat/model/getReadableUploadErrorMessage';

const currentType = ref<string | null>(null);

const currentAccept = computed(() => {
  return currentType.value ?? ATTACHMENT_ACCEPT.ALL;
});

const props = withDefaults(
  defineProps<{
    variant?: 'compact' | 'full';
  }>(),
  {
    variant: 'full',
  }
);

const draft = ref('');
const composerFieldRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
const chatStore = useChatStore();
const route = useRoute();
const router = useRouter();
const appError = useAppErrorModal();

const { attachments, fileInputRef, removeAttachment, clearAttachments, addFiles } = useChatFiles();

const isAttachMenuOpen = ref(false);

function openFilePicker() {
  if (chatStore.isSending) return;
  isAttachMenuOpen.value = !isAttachMenuOpen.value;
}

async function handleAttachmentSelect(accept: string) {
  currentType.value = accept;

  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }

  await nextTick();
  fileInputRef.value?.click();
}

const canSend = computed(() => {
  return draft.value || attachments.value.length;
});

function onTextareaEnter(e: KeyboardEvent) {
  if (e.shiftKey) return;
  e.preventDefault();
  void trySend();
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;

  try {
    await addFiles(input.files);
    await nextTick();
    composerFieldRef.value?.focus();
  } catch (err) {
    appError.showError(getReadableUploadErrorMessage(err));
  }
}

async function trySend() {
  const content = draft.value;
  const messageAttachments = [...attachments.value];
  if (!canSend.value) return;
  if (chatStore.isSending) return;

  try {
    const result = await chatStore.sendMessage({
      chatId: route.params.id as string | undefined,
      content,
      attachments: messageAttachments,
    });

    if (result.isNewChat) {
      await router.push({
        name: AppRouteName.Chat,
        params: { id: result.chatId },
      });
    }

    draft.value = '';
    clearAttachments();
    await nextTick();
    composerFieldRef.value?.focus();
  } catch (err) {
    appError.showError(getReadableUploadErrorMessage(err));
  }
}
</script>

<style scoped>
.composer {
  transition:
    transform 0.12s ease,
    filter 0.12s ease,
    opacity 0.12s ease;
  display: flex;
  align-items: center;
  border: 1px solid var(--neutral-400);
  border-radius: 12px;
  background: var(--neutral-100);
  box-sizing: border-box;
  position: relative;
}

.composer.is-sending {
  opacity: 0.6;
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

.composer-file-input {
  display: none;
}

.composer-attach-btn {
  position: absolute;
  left: 20px;
  bottom: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--neutral-600);
}

.composer-attach-menu {
  position: absolute;
  left: 20px;
  bottom: 56px;
  display: flex;
  flex-direction: column;
  min-width: 140px;
  padding: 8px;
  border: 1px solid var(--neutral-400);
  border-radius: 12px;
  background: var(--neutral-100);
  z-index: 10;
}

.composer-attach-menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  text-align: left;
  color: var(--neutral-700);
}

.composer-attach-menu-item:hover {
  background: var(--neutral-200);
}

.composer-attachments {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
</style>
