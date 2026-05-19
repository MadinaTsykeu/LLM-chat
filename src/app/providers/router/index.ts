import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { queryClient } from '@/app/queryClient';
import { chatQueryKeys } from '@/features/chat/model/queries/chatQueryKeys';
import { fetchChatsList } from '@/features/chat/model/queries/chatQueryFns';

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
        beforeEnter: async (to) => {
          const chatId = String(to.params.id);

          const chats = await queryClient.fetchQuery({
            queryKey: chatQueryKeys.lists(),
            queryFn: fetchChatsList,
          });

          const exists = chats.some((chat) => chat.id === chatId);

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
