import { backendClient } from './backendClient';

export async function getMe() {
  const response = await backendClient.get('/auth/me');
  return response.data;
}
