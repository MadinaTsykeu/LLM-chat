<template>
  <template v-if="variant === 'message' && attachment.kind === 'image' && attachment.source.value">
    <div class="attachment-image-card">
      <img
        :src="attachment.source.value"
        :alt="attachment.fileName"
        class="attachment-image-full"
      />
    </div>
  </template>

  <div v-else class="attachment-item" :class="[`attachment-item-${variant}`]">
    <template v-if="attachment.kind === 'image' && attachment.source.value">
      <div class="attachment-image-thumb">
        <img
          :src="attachment.source.value"
          :alt="attachment.fileName"
          class="attachment-image-preview"
        />
      </div>
    </template>

    <template v-else>
      <component :is="getAttachmentIcon(attachment.kind)" class="attachment-icon" />
    </template>

    <span class="attachment-name" :class="{ 'p-small': variant === 'composer' }">
      {{ attachment.fileName }}
    </span>

    <span class="attachment-size" :class="variant === 'composer' ? 'd-1' : 'd-2'">
      {{ formatBytes(attachment.size) }}
    </span>

    <button
      v-if="removable"
      type="button"
      class="attachment-remove"
      @click="$emit('remove', attachment.id)"
    >
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
import type { TAttachment } from '@/features/chat/model/types';
import { getAttachmentIcon } from '@/shared/utils/files/getAttachmentIcon';
import { formatBytes } from '@/shared/utils/formatBytes';

withDefaults(
  defineProps<{
    attachment: TAttachment;
    removable?: boolean;
    variant?: 'composer' | 'message';
  }>(),
  {
    removable: false,
    variant: 'composer',
  }
);

defineEmits<{
  (e: 'remove', attachmentId: string): void;
}>();
</script>

<style scoped>
.attachment-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
  min-width: 0;
}

.attachment-icon {
  flex-shrink: 0;
  color: var(--neutral-600);
}

.attachment-name {
  min-width: 0;
  color: var(--neutral-600);
}

.attachment-size {
  flex-shrink: 0;
  color: var(--neutral-500);
}

.attachment-remove {
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

.attachment-image-thumb {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--neutral-100);
}

.attachment-image-preview {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.attachment-item-composer {
  padding: 6px 10px;
  border: 1px solid var(--neutral-400);
  background: var(--neutral-200);
  border-radius: 10px;
}

.attachment-item-composer .attachment-name {
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-item-composer .attachment-size {
  line-height: 1;
}

.attachment-item-message {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-width: 0;
  height: 60px;
  padding: 12px 14px;
  border: 1px solid var(--neutral-400);
  border-radius: 12px;
  background: var(--neutral-100);
  box-sizing: border-box;
}

.attachment-item-message .attachment-name {
  flex: 1;
  min-width: 0;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.attachment-item-message .attachment-size {
  font-weight: 500;
}

.attachment-image-card {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: var(--neutral-100);
}

.attachment-image-full {
  display: block;
  width: 100%;
  height: auto;
}
</style>
