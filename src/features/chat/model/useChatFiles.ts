import { ref, computed } from 'vue';
import type { TAttachment } from '@/features/chat/model/types';
import { getAttachmentKind } from '@/shared/utils/files/getAttachmentKind';
import { validateFileSize, validateAttachmentsLimit } from '@/features/chat/model/fileValidation';

export function useChatFiles() {
  const attachments = ref<TAttachment[]>([]);
  const fileInputRef = ref<HTMLInputElement | null>(null);
  const currentType = ref<string | null>(null);
  const currentAccept = computed(() => {
    return currentType.value ?? '.pdf,audio/*,video/*,image/*';
  });

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

  function removeAttachment(attachmentId: string) {
    attachments.value = attachments.value.filter((attachment) => attachment.id !== attachmentId);
  }

  function clearAttachments() {
    attachments.value = [];

    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  }

  async function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

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

    validateAttachmentsLimit(attachments.value, newAttachments.length);

    attachments.value = [...attachments.value, ...newAttachments];

    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  }

  return {
    attachments,
    fileInputRef,
    currentType,
    currentAccept,
    removeAttachment,
    clearAttachments,
    addFiles,
  };
}
