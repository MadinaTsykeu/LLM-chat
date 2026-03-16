import axios from 'axios';

const BASE_URL = import.meta.env.VITE_OPENROUTER_BASE_URL;

export const openRouterHttp = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
});
