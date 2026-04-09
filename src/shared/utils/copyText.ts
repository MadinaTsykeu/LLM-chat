export async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (err) {}
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  try {
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    let success = document.execCommand('copy');
    if (!success) {
      throw new Error('Failed to copy text');
    }
  } finally {
    textarea.remove();
  }
}
