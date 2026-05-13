import './styles/theme.css';
import './styles/variables.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './providers/router';
import { initAuthGuard } from '@/app/providers/router/guards';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';

const queryClient = new QueryClient();

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin, { queryClient });
initAuthGuard(router);

app.mount('#app');
