export function getOpenRouterApiKey(): string {
  const appKey = localStorage.getItem('appKey');
  const userKey = localStorage.getItem('userKey');

  const apiKey = appKey || userKey;

  if (!apiKey) {
    throw new Error('OpenRouter API key is missing. Please login again.');
  }

  return apiKey;
}
