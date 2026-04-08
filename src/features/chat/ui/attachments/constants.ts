export const ATTACHMENT_ACCEPT = {
  ALL: '.pdf,audio/*,video/*,image/*',
  FILE: '.pdf',
  AUDIO: 'audio/*',
  VIDEO: 'video/*',
  IMAGE: 'image/*',
} as const;

export const ATTACHMENT_OPTIONS = [
  { label: 'File', accept: ATTACHMENT_ACCEPT.FILE },
  { label: 'Audio', accept: ATTACHMENT_ACCEPT.AUDIO },
  { label: 'Video', accept: ATTACHMENT_ACCEPT.VIDEO },
  { label: 'Image', accept: ATTACHMENT_ACCEPT.IMAGE },
] as const;
