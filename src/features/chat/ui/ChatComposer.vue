<template>
  <div class="composer" :class="[`composer-${variant}`, { 'is-sending': chatStore.isSending }]">
    <input
      v-if="variant === 'compact'"
      class="composer-input p-small"
      type="text"
      placeholder="How can I help you?"
      v-model="draft"
      ref="composerFieldRef"
      @keydown.enter.prevent="trySend"
    />
    <textarea
      v-else
      class="composer-textarea p-small"
      placeholder="How can I help you?"
      v-model="draft"
      ref="composerFieldRef"
      @keydown.enter="onTextareaEnter"
    />
    <div v-if="attachments.length > 0" class="composer-attachments">
      <div v-for="attachment in attachments" :key="attachment.id" class="composer-attachment-item">
        <component :is="getAttachmentIcon(attachment.kind)" />
        <span class="p-small composer-attachment-name">
          {{ attachment.fileName }}
        </span>
        <span class="composer-attachment-size d-1">
          {{ formatFileSize(attachment.size) }}
        </span>

        <button
          type="button"
          class="composer-attachment-remove"
          @click="removeAttachment(attachment.id)"
        >
          ×
        </button>
      </div>
    </div>
    <hr v-if="variant === 'full'" />
    <button
      v-if="variant === 'full'"
      type="button"
      class="composer-attach-btn"
      :disabled="chatStore.isSending"
      @click="openFilePicker"
    >
      <Paperclip :width="20" :height="20" />
    </button>
    <div v-if="variant === 'full' && isAttachMenuOpen" class="composer-attach-menu">
      <button type="button" class="composer-attach-menu-item" @click="selectAttachmentType('.pdf')">
        File
      </button>

      <button
        type="button"
        class="composer-attach-menu-item"
        @click="selectAttachmentType('audio/*')"
      >
        Audio
      </button>

      <button
        type="button"
        class="composer-attach-menu-item"
        @click="selectAttachmentType('video/*')"
      >
        Video
      </button>

      <button
        type="button"
        class="composer-attach-menu-item"
        @click="selectAttachmentType('image/*')"
      >
        Image
      </button>
    </div>
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
import FileIcon from '@/shared/assets/icons/File.svg';
import ImageIcon from '@/shared/assets/icons/Image.svg';
import AudioIcon from '@/shared/assets/icons/Audio.svg';
import VideoIcon from '@/shared/assets/icons/Video.svg';
import { useChatStore } from '@/features/chat';
import { useAppErrorModal } from '@/shared/ui/modals/app-error-modal';
import { AppRouteName } from '@/app/providers/router';
import type { TAttachment } from '@/features/chat/model/types';
import Paperclip from '@/shared/assets/icons/Paperclip.svg';

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
const attachments = ref<TAttachment[]>([]);
const fileInputRef = ref<HTMLInputElement | null>(null);
const isAttachMenuOpen = ref(false);
const currentAccept = ref('.pdf,audio/*,video/*,image/*');
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
const MAX_ATTACHMENTS = 5;

const canSend = computed(() => {
  return draft.value.trim() !== '' || attachments.value.length > 0;
});

function onTextareaEnter(e: KeyboardEvent) {
  if (e.shiftKey) return;
  e.preventDefault();
  void trySend();
}

function openFilePicker() {
  if (chatStore.isSending) return;
  isAttachMenuOpen.value = !isAttachMenuOpen.value;
}

function selectAttachmentType(accept: string) {
  currentAccept.value = accept;
  isAttachMenuOpen.value = false;
  fileInputRef.value?.click();
}

function getAttachmentKind(mimeType: string): TAttachment['kind'] {
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('image/')) return 'image';

  return 'file';
}

function getAttachmentIcon(kind: TAttachment['kind']) {
  switch (kind) {
    case 'image':
      return ImageIcon;
    case 'audio':
      return AudioIcon;
    case 'video':
      return VideoIcon;
    case 'file':
    default:
      return FileIcon;
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Failed to read file as data URL'));
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

function validateFileSize(file: File) {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File "${file.name}" is too large. Max size is 25 MB.`);
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getReadableErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : 'Something went wrong';

  if (message.includes('No endpoints found that support input audio')) {
    return 'The selected model does not support audio attachments.';
  }

  if (
    message.toLowerCase().includes('video') &&
    (message.toLowerCase().includes('not support') || message.toLowerCase().includes('unsupported'))
  ) {
    return 'The selected model does not support video attachments.';
  }

  if (message.includes('At most 10 image(s)')) {
    return 'This file is too large or has too many pages for the selected model.';
  }

  if (message.toLowerCase().includes('timeout')) {
    return 'The request took too long. Try a smaller file or try again.';
  }

  if (message.includes('is too large')) {
    return message;
  }

  return message;
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = input.files;

  if (!files || files.length === 0) return;

  try {
    const newAttachments: TAttachment[] = await Promise.all(
      Array.from(files).map(async (file) => {
        validateFileSize(file);
        const dataUrl = await readFileAsDataUrl(file);

        return {
          id: crypto.randomUUID(),
          kind: getAttachmentKind(file.type),
          mimeType: file.type || 'application/octet-stream',
          fileName: file.name,
          size: file.size,
          source: {
            type: 'dataUrl',
            value: dataUrl,
          },
        };
      })
    );

    if (attachments.value.length + newAttachments.length > MAX_ATTACHMENTS) {
      throw new Error(`You can attach up to ${MAX_ATTACHMENTS} files`);
    }

    attachments.value = [...attachments.value, ...newAttachments];

    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }

    await nextTick();
    composerFieldRef.value?.focus();
  } catch (err) {
    appError.showError(getReadableErrorMessage(err));
  }
}

function removeAttachment(attachmentId: string) {
  attachments.value = attachments.value.filter((attachment) => attachment.id !== attachmentId);
}

function clearAttachments() {
  attachments.value = [];
  isAttachMenuOpen.value = false;

  if (fileInputRef.value) {
    fileInputRef.value.value = '';
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
    appError.showError(getReadableErrorMessage(err));
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

.composer-attachment-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
  padding: 6px 10px;
  border: 1px solid var(--neutral-400);
  background: var(--neutral-200);
  border-radius: 10px;
}

.composer-attachment-name {
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.composer-attachment-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  color: var(--neutral-600);
}

.composer-attachment-kind {
  line-height: 1;
  font-weight: 600;
  color: var(--neutral-600);
  letter-spacing: 0.04em;
}

.composer-attachment-size {
  line-height: 1;
  color: var(--neutral-500);
}
</style>
