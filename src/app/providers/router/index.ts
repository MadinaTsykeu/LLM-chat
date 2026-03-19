import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useChatStore } from '@/features/chat';

export enum AppRouteName {
  BaseLayout = 'BaseLayout',
  ChatHome = 'ChatHome',
  Chat = 'Chat',
  Login = 'Login',
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: AppRouteName.Login,
    component: () => import('@/pages/login').then((m) => m.LoginPage),
  },
  {
    path: '/',
    name: AppRouteName.BaseLayout,
    component: () => import('@/pages/base-layout').then((m) => m.BaseLayoutPage),
    redirect: { name: AppRouteName.Login },
    children: [
      {
        path: 'chat',
        name: AppRouteName.ChatHome,
        component: () => import('@/pages/chat').then((m) => m.HomeChatPage),
      },
      {
        path: 'chat/:id',
        name: AppRouteName.Chat,
        component: () => import('@/pages/chat').then((m) => m.ChatPage),
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
