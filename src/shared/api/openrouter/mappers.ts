import type { TChatMessage, TAttachment } from '@/features/chat';
import type {
  OpenRouterChatMessage,
  OpenRouterChatCompletionResponse,
  OpenRouterContentBlock,
} from './types';

export function mapChatMessagesToOpenRouter(messages: TChatMessage[]): OpenRouterChatMessage[] {
  return messages.map((m) => {
    if (m.attachments && m.attachments.length > 0) {
      const content: OpenRouterContentBlock[] = [];

      if (m.content.trim()) {
        content.push({
          type: 'text',
          text: m.content,
        });
      }

      m.attachments.forEach((att) => {
        content.push(mapAttachmentToOpenRouterContent(att));
      });

      return {
        role: m.role,
        content,
      };
    }

    return {
      role: m.role,
      content: m.content,
    };
  });
}

function getAudioFormatFromMimeType(mimeType: string): string {
  if (mimeType === 'audio/mpeg' || mimeType === 'audio/mp3') return 'mp3';
  if (mimeType === 'audio/wav' || mimeType === 'audio/x-wav') return 'wav';
  if (mimeType === 'audio/m4a' || mimeType === 'audio/mp4') return 'm4a';

  return 'mp3';
}

function mapAttachmentToOpenRouterContent(att: TAttachment): OpenRouterContentBlock {
  if (att.kind === 'audio') {
    const base64 = att.source.value.split(',')[1] ?? '';

    return {
      type: 'input_audio',
      input_audio: {
        data: base64,
        format: getAudioFormatFromMimeType(att.mimeType),
      },
    };
  }

  if (att.kind === 'video') {
    return {
      type: 'video_url',
      video_url: {
        url: att.source.value,
      },
    };
  }

  if (att.kind === 'image') {
    return {
      type: 'image_url',
      image_url: {
        url: att.source.value,
      },
    };
  }

  return {
    type: 'file',
    file: {
      filename: att.fileName,
      file_data: att.source.value,
    },
  };
}

export function mapOpenRouterResponseToText(data: OpenRouterChatCompletionResponse): string {
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    const text = content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();

    if (text) {
      return text;
    }
  }

  throw new Error('Invalid OpenRouter response format');
}
