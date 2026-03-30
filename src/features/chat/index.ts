export { default as ChatComposer } from './ui/ChatComposer.vue';
export { default as ChatFeed } from './ui/ChatFeed.vue';
export { default as ChatMessageItem } from './ui/ChatMessageItem.vue';
export { default as MainCard } from './ui/MainCard.vue';
export { default as MainHeader } from './ui/MainHeader.vue';

export { useChatStore } from './model/chatStore';
export type {
  TChat,
  TChatMessage,
  TStorageState,
  TMessageStatus,
  TAttachment,
} from './model/types';
