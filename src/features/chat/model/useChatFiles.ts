import { ref, nextTick } from 'vue';
import type { TAttachment } from '@/features/chat/model/types';
import { getAttachmentIcon } from '@/shared/utils/getAttachmentIcon';

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
const MAX_ATTACHMENTS = 5;

export function useChatFiles() {
  const attachments = ref<TAttachment[]>([]);
  const fileInputRef = ref<HTMLInputElement | null>(null);
  const isAttachMenuOpen = ref(false);
  const currentAccept = ref('.pdf,audio/*,video/*,image/*');
  const attachmentOptions = [
    { label: 'File', accept: '.pdf' },
    { label: 'Audio', accept: 'audio/*' },
    { label: 'Video', accept: 'video/*' },
    { label: 'Image', accept: 'image/*' },
  ];

  function getAttachmentKind(mimeType: string): TAttachment['kind'] {
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('image/')) return 'image';

    return 'file';
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

  async function selectAttachmentType(accept: string) {
    currentAccept.value = accept;
    isAttachMenuOpen.value = false;

    if (fileInputRef.value) {
      fileInputRef.value.accept = accept;
      fileInputRef.value.value = '';
    }

    await nextTick();
    fileInputRef.value?.click();
  }

  function openFilePicker(isSending: boolean) {
    if (isSending) return;
    isAttachMenuOpen.value = !isAttachMenuOpen.value;
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

    if (attachments.value.length + newAttachments.length > MAX_ATTACHMENTS) {
      throw new Error(`You can attach up to ${MAX_ATTACHMENTS} files`);
    }

    attachments.value = [...attachments.value, ...newAttachments];

    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  }

  return {
    attachments,
    fileInputRef,
    isAttachMenuOpen,
    currentAccept,
    attachmentOptions,
    getAttachmentIcon,
    removeAttachment,
    clearAttachments,
    openFilePicker,
    selectAttachmentType,
    addFiles,
  };
}
