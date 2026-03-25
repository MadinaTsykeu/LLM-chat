import { useRouter } from 'vue-router';
import { useAuthStore } from '@/shared/stores/auth';
import { AppRouteName } from './index';

export const initAuthGuard = () => {
  const router = useRouter();
  const authStore = useAuthStore();

  router.beforeEach((to) => {
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return { name: AppRouteName.Login };
    }

    const isLoginLikeRoute =
      to.name === AppRouteName.Login || to.name === AppRouteName.AuthCallback;

    if (isLoginLikeRoute && authStore.isAuthenticated) {
      return { name: AppRouteName.ChatHome };
    }
  });
};
