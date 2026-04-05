export function getAudioFormatFromMimeType(mimeType: string): string {
  if (mimeType === 'audio/mpeg' || mimeType === 'audio/mp3') return 'mp3';
  if (mimeType === 'audio/wav' || mimeType === 'audio/x-wav') return 'wav';
  if (mimeType === 'audio/m4a' || mimeType === 'audio/mp4') return 'm4a';

  return 'mp3';
}
