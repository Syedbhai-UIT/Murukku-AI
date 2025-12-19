/**
 * Model Configuration for OpenRouter API
 * Defines all available models and auto-detection patterns
 */

// ============================================================================
// MODEL CATALOG - All available models organized by category
// ============================================================================

export const MODEL_CATALOG = {
  // Language & Reasoning Models
  language: {
    // Primary: LLaMA 3.1/3.3 variants
    primary: {
      id: 'meta-llama/llama-3.3-70b-instruct:free',
      name: 'LLaMA 3.3 70B',
      description: 'Best free general-purpose model',
      free: true,
    },
    llama8b: {
      id: 'meta-llama/llama-3.1-8b-instruct',
      name: 'LLaMA 3.1 8B',
      description: 'Fast, efficient model',
      free: false,
    },
    llama70b: {
      id: 'meta-llama/llama-3.1-70b-instruct',
      name: 'LLaMA 3.1 70B',
      description: 'High quality reasoning',
      free: false,
    },

    // Secondary: Mistral variants
    mistral7b: {
      id: 'mistralai/mistral-nemo',
      name: 'Mistral Nemo 12B',
      description: 'Efficient Mistral model',
      free: false,
    },
    mixtral: {
      id: 'mistralai/mixtral-8x7b-instruct',
      name: 'Mixtral 8x7B',
      description: 'Mixture of Experts model',
      free: false,
    },

    // Lightweight Mode: Phi-3/4
    lightweight: {
      id: 'microsoft/phi-3-mini-128k-instruct',
      name: 'Phi-3 Mini',
      description: 'Ultra-fast lightweight model',
      free: false,
    },
    phi4: {
      id: 'microsoft/phi-4',
      name: 'Phi-4',
      description: 'Complex reasoning, math',
      free: false,
    },
  },

  // Coding Specialist Models
  coding: {
    qwenCoder: {
      id: 'qwen/qwen3-coder:free',
      name: 'Qwen3 Coder',
      description: 'Best free coding model (480B MoE)',
      free: true,
    },
    qwenCoder32b: {
      id: 'qwen/qwen-2.5-coder-32b-instruct',
      name: 'Qwen 2.5 Coder 32B',
      description: 'Strong code generation',
      free: false,
    },
    deepseekCoder: {
      id: 'deepseek/deepseek-chat-v3-0324',
      name: 'DeepSeek V3',
      description: 'GPT-5 class reasoning & coding',
      free: false,
    },
    devstral: {
      id: 'mistralai/devstral-2512:free',
      name: 'Devstral',
      description: 'Agentic coding (123B)',
      free: true,
    },
  },

  // Vision/Image Understanding Models
  vision: {
    llava: {
      id: 'meta-llama/llama-3.2-11b-vision-instruct',
      name: 'LLaMA 3.2 Vision 11B',
      description: 'Vision + text understanding',
      free: false,
    },
    llava90b: {
      id: 'meta-llama/llama-3.2-90b-vision-instruct',
      name: 'LLaMA 3.2 Vision 90B',
      description: 'High-end vision model',
      free: false,
    },
    qwenVL: {
      id: 'qwen/qwen3-vl-8b-instruct',
      name: 'Qwen3 VL 8B',
      description: 'Vision-language model',
      free: false,
    },
    phi4Vision: {
      id: 'microsoft/phi-4-multimodal-instruct',
      name: 'Phi-4 Multimodal',
      description: 'Vision + text (5.6B)',
      free: false,
    },
  },

  // Image Generation Models (using Pollinations.ai - FREE)
  imageGen: {
    flux: {
      id: 'flux',
      name: 'FLUX',
      description: 'High-quality image generation',
      provider: 'pollinations',
      free: true,
    },
    sdxl: {
      id: 'sdxl',
      name: 'Stable Diffusion XL',
      description: 'SDXL image generation',
      provider: 'pollinations',
      free: true,
    },
    realistic: {
      id: 'realistic-vision',
      name: 'Realistic Vision',
      description: 'Photorealistic images',
      provider: 'pollinations',
      free: true,
    },
    dreamshaper: {
      id: 'dreamshaper',
      name: 'DreamShaper',
      description: 'Creative artistic images',
      provider: 'pollinations',
      free: true,
    },
    juggernaut: {
      id: 'juggernaut-xl',
      name: 'Juggernaut XL',
      description: 'Hyper-detailed realistic images',
      provider: 'pollinations',
      free: true,
    },
  },

  // Reasoning/Math Models
  reasoning: {
    deepseekR1: {
      id: 'tngtech/deepseek-r1t2-chimera:free',
      name: 'DeepSeek R1 Chimera',
      description: 'Strong reasoning (FREE)',
      free: true,
    },
  },
} as const;

// ============================================================================
// AUTO-DETECTION PATTERNS - Regex patterns for intelligent model routing
// ============================================================================

export interface DetectionPattern {
  keywords: RegExp;
  model: string;
  modelName: string;
  priority: number;
}

export const AUTO_DETECT_PATTERNS: DetectionPattern[] = [
  // Code Detection → Route to Qwen Coder (FREE)
  {
    keywords: /\b(code|coding|function|class|debug|error|bug|fix|algorithm|compile|syntax|javascript|python|java|c\+\+|typescript|html|css|react|node|sql|api|loop|array|variable|method|import|export|const|let|var|async|await|promise|callback|component|hook|useState|useEffect|npm|yarn|git|github|programming|developer|script|snippet)\b/i,
    model: MODEL_CATALOG.coding.qwenCoder.id,
    modelName: MODEL_CATALOG.coding.qwenCoder.name,
    priority: 10,
  },

  // Math/Reasoning Detection → Route to Phi-4 or DeepSeek R1
  {
    keywords: /\b(calculate|solve|equation|formula|math|algebra|calculus|statistics|probability|derivative|integral|proof|theorem|number|percentage|fraction|decimal|geometry|trigonometry|logarithm|exponent|matrix|vector|graph|plot)\b/i,
    model: MODEL_CATALOG.reasoning.deepseekR1.id,
    modelName: MODEL_CATALOG.reasoning.deepseekR1.name,
    priority: 8,
  },

  // Image Generation Detection → Keep using Pollinations
  {
    keywords: /\b(draw|generate|create|show me|visualize|picture|image|photo|diagram|sketch|illustration|render|design|art|artwork|portrait|landscape|anime|cartoon|realistic|fantasy|sci-fi|generate an image|create an image|make an image|draw me)\b/i,
    model: 'IMAGE_GENERATION', // Special flag for image generation
    modelName: 'Image Generator',
    priority: 9,
  },

  // Vision/Image Analysis Detection (when image is attached)
  {
    keywords: /\b(analyze|describe|what is this|what's this|explain this|look at|identify|recognize|see|image shows|picture shows|in this image|in this photo|uploaded image|attached image)\b/i,
    model: MODEL_CATALOG.vision.llava.id,
    modelName: MODEL_CATALOG.vision.llava.name,
    priority: 7,
  },

  // Academic/Study Detection → Route to primary LLaMA
  {
    keywords: /\b(explain|syllabus|unit|exam|study|notes|concept|theory|definition|summary|chapter|lesson|course|subject|topic|learn|understand|meaning|what is|how does|why does|describe|elaborate|detail)\b/i,
    model: MODEL_CATALOG.language.primary.id,
    modelName: MODEL_CATALOG.language.primary.name,
    priority: 5,
  },
];

// ============================================================================
// MODEL DETECTION FUNCTION
// ============================================================================

export interface DetectionResult {
  model: string;
  modelName: string;
  isImageGeneration: boolean;
  isVision: boolean;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Detects the best model to use based on message content
 * @param message - The user's message
 * @param hasImage - Whether an image is attached
 * @returns Detection result with model ID and metadata
 */
export function detectModelFromMessage(
  message: string,
  hasImage: boolean = false
): DetectionResult {
  // If image is attached, prioritize vision models
  if (hasImage) {
    return {
      model: MODEL_CATALOG.vision.llava.id,
      modelName: MODEL_CATALOG.vision.llava.name,
      isImageGeneration: false,
      isVision: true,
      confidence: 'high',
    };
  }

  // Sort patterns by priority (higher first)
  const sortedPatterns = [...AUTO_DETECT_PATTERNS].sort(
    (a, b) => b.priority - a.priority
  );

  // Find matching pattern
  for (const pattern of sortedPatterns) {
    if (pattern.keywords.test(message)) {
      const isImageGen = pattern.model === 'IMAGE_GENERATION';
      return {
        model: isImageGen ? MODEL_CATALOG.language.primary.id : pattern.model,
        modelName: pattern.modelName,
        isImageGeneration: isImageGen,
        isVision: false,
        confidence: 'high',
      };
    }
  }

  // Default to primary model
  return {
    model: MODEL_CATALOG.language.primary.id,
    modelName: MODEL_CATALOG.language.primary.name,
    isImageGeneration: false,
    isVision: false,
    confidence: 'low',
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all free models
 */
export function getFreeModels() {
  const freeModels: { id: string; name: string; category: string }[] = [];

  Object.entries(MODEL_CATALOG).forEach(([category, models]) => {
    Object.entries(models).forEach(([key, model]) => {
      if ('free' in model && model.free) {
        freeModels.push({
          id: model.id,
          name: model.name,
          category,
        });
      }
    });
  });

  return freeModels;
}

/**
 * Get model by ID
 */
export function getModelById(modelId: string) {
  for (const category of Object.values(MODEL_CATALOG)) {
    for (const model of Object.values(category)) {
      if ('id' in model && model.id === modelId) {
        return model;
      }
    }
  }
  return null;
}
