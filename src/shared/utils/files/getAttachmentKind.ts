import type { TAttachmentKind } from '@/features/chat/model/types';

export function getAttachmentKind(mimeType: string): TAttachmentKind {
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('image/')) return 'image';

  return 'file';
}
