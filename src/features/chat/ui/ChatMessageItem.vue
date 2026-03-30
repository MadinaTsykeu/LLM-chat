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
            v-if="message.attachments && message.attachments.length > 0"
            class="message-attachments"
          >
            <div v-for="att in message.attachments" :key="att.id">
              <div v-if="att.kind === 'file'" class="message-card">
                <component :is="getAttachmentIcon(att.kind)" />

                <span class="message-file-name">
                  {{ att.fileName }}
                </span>

                <span class="message-file-size d-2">
                  {{ formatFileSize(att.size) }}
                </span>
              </div>

              <div v-else-if="att.kind === 'image'" class="message-image-card">
                <img
                  v-if="att.source.value"
                  :src="att.source.value"
                  :alt="att.fileName"
                  class="message-image-preview"
                />

                <div v-else class="message-card">
                  <component :is="getAttachmentIcon(att.kind)" />

                  <span class="message-media-name">
                    {{ att.fileName }}
                  </span>

                  <span class="message-media-size d-2">
                    {{ formatFileSize(att.size) }}
                  </span>
                </div>
              </div>

              <div v-else-if="att.kind === 'audio' || att.kind === 'video'" class="message-card">
                <component :is="getAttachmentIcon(att.kind)" />

                <span class="message-media-name">
                  {{ att.fileName }}
                </span>

                <span class="message-media-size d-2">
                  {{ formatFileSize(att.size) }}
                </span>
              </div>

              <div v-else class="message-card">
                <component :is="getAttachmentIcon(att.kind)" />

                <span class="message-attachment-name">
                  {{ att.fileName }}
                </span>

                <span class="message-attachment-size d-2">
                  {{ formatFileSize(att.size) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TChatMessage, TAttachment } from '@/features/chat';
import Avatar from '@/shared/assets/image/Avatar.jpg';
import Element from '@/shared/assets/image/Element.jpg';
import FileIcon from '@/shared/assets/icons/File.svg';
import ImageIcon from '@/shared/assets/icons/Image.svg';
import AudioIcon from '@/shared/assets/icons/Audio.svg';
import VideoIcon from '@/shared/assets/icons/Video.svg';
import { formatTime } from '@/shared/utils/date';

defineProps<{ message: TChatMessage }>();

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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

.message-card {
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

.message-file-name {
  flex: 1;
  min-width: 0;
  font-weight: 500;
  color: var(--neutral-600);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-image-card {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.message-image-preview {
  display: block;
  width: 100%;
  height: auto;
}

.message-media-name {
  flex: 1;
  min-width: 0;
  font-weight: 500;
  color: var(--neutral-600);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-attachment-name {
  flex: 1;
  min-width: 0;
  font-weight: 500;
  color: var(--neutral-600);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-file-size,
.message-media-size,
.message-attachment-size {
  font-weight: 500;
  color: var(--neutral-500);
}
</style>
