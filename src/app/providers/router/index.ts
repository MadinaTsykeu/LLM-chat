import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useChatStore } from '@/features/chat';
import { useAuthStore } from '@/shared/stores/auth';
import { pinia } from '@/app/providers/store';

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

const authStore = useAuthStore(pinia);

router.beforeEach((to) => {
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: AppRouteName.Login };
  }

  const hasOAuthCode =
    typeof to.query.code === 'string' || (Array.isArray(to.query.code) && to.query.code.length > 0);

  const isLoginLikeRoute = to.name === AppRouteName.Login || to.name === AppRouteName.AuthCallback;

  if (isLoginLikeRoute && isAuthenticated && !hasOAuthCode) {
    return { name: AppRouteName.ChatHome };
  }

  return true;
});

export default router;
