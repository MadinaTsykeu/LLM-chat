import type { TAttachment } from '@/features/chat/model/types';
import FileIcon from '@/shared/assets/icons/File.svg';
import ImageIcon from '@/shared/assets/icons/Image.svg';
import AudioIcon from '@/shared/assets/icons/Audio.svg';
import VideoIcon from '@/shared/assets/icons/Video.svg';

export function getAttachmentIcon(kind: TAttachment['kind']) {
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
