import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useChatStore } from '@/features/chat';

export enum AppRouteName {
  BaseLayout = 'BaseLayout',
  ChatHome = 'ChatHome',
  Chat = 'Chat',
  Login = 'Login',
  AuthCallback = 'AuthCallback',
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: AppRouteName.Login,
    component: () => import('@/pages/login'),
  },
  {
    path: '/auth/callback',
    name: AppRouteName.AuthCallback,
    component: () => import('@/pages/auth-callback'),
  },
  {
    path: '/',
    name: AppRouteName.BaseLayout,
    component: () => import('@/pages/base-layout'),
    redirect: { name: AppRouteName.Login },
    children: [
      {
        path: 'chat',
        name: AppRouteName.ChatHome,
        meta: { requiresAuth: true },
        component: () => import('@/pages/chat').then((m) => m.HomeChatPage),
      },
      {
        path: 'chat/:id',
        name: AppRouteName.Chat,
        meta: { requiresAuth: true },
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
