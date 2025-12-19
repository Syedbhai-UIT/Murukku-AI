/**
 * FastAPI Client - Connects frontend to Python backend
 * All AI model calls go through the FastAPI server
 */

import { UserContext, Message } from '../types';

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ============================================================================
// TYPES
// ============================================================================

export interface ChatRequest {
  message: string;
  context?: Partial<UserContext>;
  model?: string;
  attachedImage?: string;
}

export interface ChatResponse {
  text: string;
  type: 'text' | 'code' | 'notes' | 'image';
  modelUsed: string;
  modelName: string;
  meta?: {
    imageUrl?: string;
    imagePrompt?: string;
    [key: string]: any;
  };
}

export interface VisionRequest {
  prompt: string;
  image: string;
  mimeType?: string;
}

export interface VisionResponse {
  description: string;
  modelUsed: string;
  modelName: string;
}

export interface ModelCatalog {
  models: {
    language: Record<string, string>;
    coding: Record<string, string>;
    vision: Record<string, string>;
    reasoning: Record<string, string>;
  };
}

// ============================================================================
// API CLIENT
// ============================================================================

class FastAPIClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make a request to the API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `API error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; service: string; version: string }> {
    return this.request('/');
  }

  /**
   * Get available models
   */
  async getModels(): Promise<ModelCatalog> {
    return this.request('/api/models');
  }

  /**
   * Main chat endpoint with auto-detection
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    return this.request('/api/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Analyze an image using vision model
   */
  async analyzeImage(request: VisionRequest): Promise<VisionResponse> {
    return this.request('/api/vision', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Generate code using coding specialist
   */
  async generateCode(message: string, context?: Partial<UserContext>): Promise<ChatResponse> {
    return this.request('/api/code', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }

  /**
   * Solve math/logic problems
   */
  async solveReasoning(message: string, context?: Partial<UserContext>): Promise<ChatResponse> {
    return this.request('/api/reasoning', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }

  /**
   * Generate image URL
   */
  async generateImage(prompt: string): Promise<{ url: string; prompt: string; model: string }> {
    const params = new URLSearchParams({ prompt });
    return this.request(`/api/generate-image?${params}`);
  }
}

// Export singleton instance
export const apiClient = new FastAPIClient();

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Check if API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const result = await apiClient.healthCheck();
    return result.status === 'ok';
  } catch {
    return false;
  }
}

/**
 * Get chat response with automatic model selection
 */
export async function getChatResponse(
  message: string,
  context?: Partial<UserContext>,
  attachedImage?: string
): Promise<ChatResponse> {
  return apiClient.chat({
    message,
    context,
    attachedImage,
  });
}

/**
 * Analyze an image
 */
export async function analyzeImage(
  prompt: string,
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<VisionResponse> {
  return apiClient.analyzeImage({
    prompt,
    image: imageBase64,
    mimeType,
  });
}

export default apiClient;
