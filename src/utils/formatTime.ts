export function formatTime(createdAt: number): string {
  const date = new Date(createdAt);

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}