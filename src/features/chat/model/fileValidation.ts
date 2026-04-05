import type { TAttachment } from '@/features/chat/model/types';

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
export const MAX_ATTACHMENTS = 5;

export function validateFileSize(file: File) {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File "${file.name}" is too large. Max size is 25 MB.`);
  }
}

export function validateAttachmentsLimit(
  currentAttachments: TAttachment[],
  newAttachmentsCount: number
) {
  if (currentAttachments.length + newAttachmentsCount > MAX_ATTACHMENTS) {
    throw new Error(`You can attach up to ${MAX_ATTACHMENTS} files`);
  }
}
