import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useChatStore } from '@/features/chat';
import { useAuthStore } from '@/shared/stores/auth';

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

router.beforeEach((to) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated.value;
  const hasOAuthCode =
    typeof to.query.code === 'string' ||
    (Array.isArray(to.query.code) && to.query.code.length > 0);
  const isChatRoute = to.name === AppRouteName.ChatHome || to.name === AppRouteName.Chat;

  if (isChatRoute && !isAuthenticated) {
    return { name: AppRouteName.Login };
  }

  const isLoginLikeRoute = to.name === AppRouteName.Login || to.name === AppRouteName.AuthCallback;

  if (isLoginLikeRoute && isAuthenticated && !hasOAuthCode) {
    return { name: AppRouteName.ChatHome };
  }

  return true;
});

export default router;
