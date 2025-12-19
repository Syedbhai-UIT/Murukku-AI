/**
 * OpenRouter API Client
 * Unified client for making requests to OpenRouter's multi-model API
 */

import { MODEL_CATALOG } from './modelConfig';

// ============================================================================
// TYPES
// ============================================================================

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | OpenRouterContent[];
}

export interface OpenRouterContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string; // Base64 data URL or HTTP URL
  };
}

export interface OpenRouterOptions {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

export interface OpenRouterResponse {
  id: string;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenRouterError {
  error: {
    message: string;
    type: string;
    code: number;
  };
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Get API key from environment variables
 */
function getApiKey(): string {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_OPENROUTER_API_KEY is not set in environment variables');
  }
  return apiKey;
}

/**
 * Get site info for OpenRouter rankings
 */
function getSiteInfo() {
  return {
    url: import.meta.env.VITE_SITE_URL || window.location.origin,
    name: import.meta.env.VITE_SITE_NAME || 'Murukku AI',
  };
}

// ============================================================================
// MAIN API FUNCTION
// ============================================================================

/**
 * Call OpenRouter API with the specified model and messages
 * @param model - The model ID to use (e.g., 'meta-llama/llama-3.3-70b-instruct:free')
 * @param messages - Array of messages in OpenRouter format
 * @param options - Optional parameters like temperature, max_tokens
 * @returns The API response
 */
export async function callOpenRouter(
  model: string,
  messages: OpenRouterMessage[],
  options: OpenRouterOptions = {}
): Promise<OpenRouterResponse> {
  const apiKey = getApiKey();
  const siteInfo = getSiteInfo();

  const defaultOptions: OpenRouterOptions = {
    temperature: 0.7,
    max_tokens: 4096,
    top_p: 0.9,
    stream: false,
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': siteInfo.url,
        'X-Title': siteInfo.name,
      },
      body: JSON.stringify({
        model,
        messages,
        ...mergedOptions,
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as OpenRouterError;
      throw new Error(
        errorData.error?.message || `OpenRouter API error: ${response.status}`
      );
    }

    const data = (await response.json()) as OpenRouterResponse;
    return data;
  } catch (error) {
    console.error('OpenRouter API call failed:', error);
    throw error;
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Simple text completion with auto-selected model
 */
export async function getCompletion(
  prompt: string,
  systemPrompt?: string,
  model: string = MODEL_CATALOG.language.primary.id,
  options: OpenRouterOptions = {}
): Promise<string> {
  const messages: OpenRouterMessage[] = [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }

  messages.push({ role: 'user', content: prompt });

  const response = await callOpenRouter(model, messages, options);
  return response.choices[0]?.message?.content || '';
}

/**
 * Chat completion with conversation history
 */
export async function getChatCompletion(
  conversationHistory: OpenRouterMessage[],
  model: string = MODEL_CATALOG.language.primary.id,
  options: OpenRouterOptions = {}
): Promise<string> {
  const response = await callOpenRouter(model, conversationHistory, options);
  return response.choices[0]?.message?.content || '';
}

/**
 * Code-focused completion using coding model
 */
export async function getCodeCompletion(
  prompt: string,
  language?: string,
  options: OpenRouterOptions = {}
): Promise<string> {
  const systemPrompt = `You are an expert programmer and coding assistant. ${
    language ? `You specialize in ${language}.` : ''
  } Provide clean, well-commented, production-ready code. Explain your approach briefly.`;

  return getCompletion(
    prompt,
    systemPrompt,
    MODEL_CATALOG.coding.qwenCoder.id,
    { ...options, temperature: 0.3 } // Lower temperature for more deterministic code
  );
}

/**
 * Vision/Image understanding completion
 */
export async function getVisionCompletion(
  prompt: string,
  imageBase64: string,
  mimeType: string = 'image/jpeg',
  options: OpenRouterOptions = {}
): Promise<string> {
  const messages: OpenRouterMessage[] = [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: prompt,
        },
        {
          type: 'image_url',
          image_url: {
            url: `data:${mimeType};base64,${imageBase64}`,
          },
        },
      ],
    },
  ];

  const response = await callOpenRouter(
    MODEL_CATALOG.vision.llava.id,
    messages,
    options
  );
  return response.choices[0]?.message?.content || '';
}

/**
 * Math/Reasoning focused completion
 */
export async function getReasoningCompletion(
  prompt: string,
  options: OpenRouterOptions = {}
): Promise<string> {
  const systemPrompt = `You are a mathematical and logical reasoning expert. 
  Break down complex problems step by step.
  Show your work clearly.
  Double-check calculations before providing final answers.`;

  return getCompletion(
    prompt,
    systemPrompt,
    MODEL_CATALOG.reasoning.deepseekR1.id,
    { ...options, temperature: 0.2 } // Lower temperature for precise reasoning
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert a file to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix to get just the base64 string
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Check if API key is configured
 */
export function isApiKeyConfigured(): boolean {
  try {
    getApiKey();
    return true;
  } catch {
    return false;
  }
}

/**
 * Test API connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const response = await getCompletion(
      'Say "Hello!" in one word.',
      undefined,
      MODEL_CATALOG.language.primary.id,
      { max_tokens: 10 }
    );
    return response.length > 0;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
}
