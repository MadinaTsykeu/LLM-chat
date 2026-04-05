export type OpenRouterRole = 'system' | 'user' | 'assistant';

export type OpenRouterTextContentBlock = {
  type: 'text';
  text: string;
};

export type OpenRouterFileContentBlock = {
  type: 'file';
  file: {
    filename: string;
    file_data: string;
  };
};

export type OpenRouterAudioContentBlock = {
  type: 'input_audio';
  input_audio: {
    data: string;
    format: string;
  };
};

export type OpenRouterVideoContentBlock = {
  type: 'video_url';
  video_url: {
    url: string;
  };
};

export type OpenRouterImageContentBlock = {
  type: 'image_url';
  image_url: {
    url: string;
  };
};

export type OpenRouterContentBlock =
  | OpenRouterTextContentBlock
  | OpenRouterFileContentBlock
  | OpenRouterAudioContentBlock
  | OpenRouterVideoContentBlock
  | OpenRouterImageContentBlock;

export type OpenRouterAssistantResponseContentBlock = {
  type: 'text';
  text: string;
};
export interface OpenRouterChatMessage {
  role: OpenRouterRole;
  content: string | OpenRouterContentBlock[];
}

export interface OpenRouterChatCompletionRequest {
  model: string;
  messages: OpenRouterChatMessage[];
}

export interface OpenRouterChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string | OpenRouterAssistantResponseContentBlock[];
      role?: OpenRouterRole;
    };
  }>;
}
