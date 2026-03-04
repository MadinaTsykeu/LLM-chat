import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

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
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
