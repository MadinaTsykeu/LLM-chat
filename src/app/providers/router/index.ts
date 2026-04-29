import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

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
    component: () => import('@/pages/login'),
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
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
