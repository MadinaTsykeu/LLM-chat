import type { Router } from 'vue-router';
import { useAuthStore } from '@/shared/stores/auth';
import { AppRouteName } from './index';

export function initAuthGuard(router: Router) {
  router.beforeEach(async (to) => {
    const auth = useAuthStore();

    await auth.fetchMe();

    const isAuth = auth.isAuthenticated;

    const isPublicRoute = to.name === AppRouteName.Login;

    if (!isAuth && !isPublicRoute) {
      return { name: AppRouteName.Login };
    }

    if (isAuth && isPublicRoute) {
      return { name: AppRouteName.ChatHome };
    }

    return true;
  });
}
