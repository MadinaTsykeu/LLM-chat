export function getReadableUploadErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : 'Something went wrong';

  if (message.includes('No endpoints found that support input audio')) {
    return 'The selected model does not support audio attachments.';
  }

  if (
    message.toLowerCase().includes('video') &&
    (message.toLowerCase().includes('not support') || message.toLowerCase().includes('unsupported'))
  ) {
    return 'The selected model does not support video attachments.';
  }

  if (message.includes('At most 10 image(s)')) {
    return 'This file is too large or has too many pages for the selected model.';
  }

  if (message.toLowerCase().includes('timeout')) {
    return 'The request took too long. Try a smaller file or try again.';
  }

  if (message.includes('is too large')) {
    return message;
  }

  return message;
}
