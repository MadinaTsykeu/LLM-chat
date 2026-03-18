export type OpenRouterRole = 'system' | 'user' | 'assistant';

export interface OpenRouterChatMessage {
  role: OpenRouterRole;
  content: string;
}

export interface OpenRouterChatCompletionRequest {
  model: string;
  messages: OpenRouterChatMessage[];
}

export interface OpenRouterChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
      role?: OpenRouterRole;
    };
  }>;
}
