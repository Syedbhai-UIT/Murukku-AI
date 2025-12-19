// ============================================================================
// MESSAGE TYPES
// ============================================================================

export interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: string;
  type?: 'text' | 'image' | 'notes' | 'game_suggestion' | 'audio' | 'vision_response' | 'code';
  meta?: MessageMeta;
  groundingMetadata?: {
    web?: { uri: string; title: string }[];
  };
  // New fields for model tracking
  modelUsed?: string;
  modelName?: string;
}

export interface MessageMeta {
  // Image generation
  imageUrl?: string;
  imagePrompt?: string;
  imageModel?: string;
  // Audio
  audioUrl?: string;
  audioDuration?: number;
  // Vision
  attachedImage?: string; // Base64 image attached by user
  // Code
  language?: string;
  // Generic
  [key: string]: any;
}

// ============================================================================
// USER CONTEXT
// ============================================================================

export interface UserContext {
  name: string;
  year: string;
  semester: string;
  department?: string;
  learningStyle?: 'visual' | 'theory' | 'practical' | 'exam_cram';
  careerGoal?: 'placement' | 'higher_studies' | 'govt_job' | 'entrepreneur';
  preferredModel?: string; // User can override auto-detection
}

// ============================================================================
// STUDY CONTENT TYPES
// ============================================================================

export interface SubjectNote {
  title: string;
  bullets: string[];
  links: { label: string; url: string }[];
}

export interface SemesterInfo {
  year: number;
  title: string;
  focus: string;
  subjects: string[];
}

// ============================================================================
// CHAT SESSION
// ============================================================================

export interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
}

// ============================================================================
// MODEL & API TYPES
// ============================================================================

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  category: 'language' | 'coding' | 'vision' | 'imageGen' | 'reasoning';
  free: boolean;
}

export interface ApiResponse {
  success: boolean;
  message: Partial<Message>;
  updatedContext?: Partial<UserContext>;
  modelUsed?: string;
  modelName?: string;
  error?: string;
}

// ============================================================================
// SPEECH TYPES (for Web Speech API)
// ============================================================================

export interface SpeechState {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  error: string | null;
}

export interface VoiceOption {
  name: string;
  lang: string;
  default: boolean;
}

// ============================================================================
// IMAGE GENERATION TYPES
// ============================================================================

export interface ImageGenerationRequest {
  prompt: string;
  model?: 'flux' | 'sdxl' | 'realistic-vision' | 'dreamshaper';
  style?: 'anime' | 'realistic' | 'artistic' | 'circuit' | 'flowchart';
  width?: number;
  height?: number;
}

export interface ImageGenerationResponse {
  url: string;
  prompt: string;
  model: string;
}

// ============================================================================
// VISION ANALYSIS TYPES
// ============================================================================

export interface VisionRequest {
  image: string; // Base64 encoded image
  prompt: string;
  mimeType?: string;
}

export interface VisionResponse {
  description: string;
  modelUsed: string;
}