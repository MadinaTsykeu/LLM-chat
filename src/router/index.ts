import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useChatStore } from '@/components/chats/stores/chatStore';

export enum AppRouteName {
  BaseLayout = 'BaseLayout',
  ChatHome = 'ChatHome',
  Chat = 'Chat',
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: AppRouteName.BaseLayout,
    component: () => import('@/pages/base-layout/ui/BaseLayout.vue'),
    redirect: { name: AppRouteName.ChatHome },
    children: [
      {
        path: 'chat',
        name: AppRouteName.ChatHome,
        component: () => import('@/pages/chat/ui/HomeChat.vue'),
      },
      {
        path: 'chat/:id',
        name: AppRouteName.Chat,
        component: () => import('@/pages/chat/ui/Chat.vue'),
        beforeEnter(to) {
          const chatStore = useChatStore();

          const exists = chatStore.chats.some((c) => c.id === to.params.id);

          if (!exists) {
            return { name: AppRouteName.ChatHome };
          }
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
