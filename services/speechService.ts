/**
 * Speech Service - Browser-native STT and TTS
 * Uses Web Speech API for speech recognition and synthesis
 */

// ============================================================================
// SPEECH RECOGNITION (STT - Speech-to-Text)
// ============================================================================

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

let recognitionInstance: SpeechRecognition | null = null;

/**
 * Check if Speech Recognition is supported
 */
export function isSpeechRecognitionSupported(): boolean {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/**
 * Start speech recognition and return the transcript
 * @param options - Configuration options for recognition
 * @returns Promise that resolves with the transcript
 */
export function startSpeechRecognition(
  options: SpeechRecognitionOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isSpeechRecognitionSupported()) {
      reject(new Error('Speech recognition is not supported in this browser'));
      return;
    }

    // Stop any existing recognition
    if (recognitionInstance) {
      recognitionInstance.stop();
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionInstance = new SpeechRecognitionAPI();

    // Configure recognition
    recognitionInstance.lang = options.language || 'en-US';
    recognitionInstance.continuous = options.continuous || false;
    recognitionInstance.interimResults = options.interimResults || false;
    recognitionInstance.maxAlternatives = options.maxAlternatives || 1;

    let finalTranscript = '';

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }
    };

    recognitionInstance.onend = () => {
      resolve(finalTranscript.trim());
      recognitionInstance = null;
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      reject(new Error(`Speech recognition error: ${event.error}`));
      recognitionInstance = null;
    };

    recognitionInstance.start();
  });
}

/**
 * Start continuous speech recognition with callbacks
 * @param onResult - Callback for each result (interim and final)
 * @param onEnd - Callback when recognition ends
 * @param options - Configuration options
 * @returns Function to stop recognition
 */
export function startContinuousSpeechRecognition(
  onResult: (result: SpeechRecognitionResult) => void,
  onEnd: () => void,
  options: SpeechRecognitionOptions = {}
): () => void {
  if (!isSpeechRecognitionSupported()) {
    throw new Error('Speech recognition is not supported in this browser');
  }

  const SpeechRecognitionAPI =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionAPI();

  recognition.lang = options.language || 'en-US';
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = options.maxAlternatives || 1;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      onResult({
        transcript: result[0].transcript,
        confidence: result[0].confidence,
        isFinal: result.isFinal,
      });
    }
  };

  recognition.onend = () => {
    onEnd();
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error('Speech recognition error:', event.error);
    onEnd();
  };

  recognition.start();

  // Return stop function
  return () => {
    recognition.stop();
  };
}

/**
 * Stop current speech recognition
 */
export function stopSpeechRecognition(): void {
  if (recognitionInstance) {
    recognitionInstance.stop();
    recognitionInstance = null;
  }
}

// ============================================================================
// SPEECH SYNTHESIS (TTS - Text-to-Speech)
// ============================================================================

export interface SpeechSynthesisOptions {
  voice?: SpeechSynthesisVoice;
  voiceName?: string;
  language?: string;
  rate?: number; // 0.1 to 10, default 1
  pitch?: number; // 0 to 2, default 1
  volume?: number; // 0 to 1, default 1
}

let currentUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Check if Speech Synthesis is supported
 */
export function isSpeechSynthesisSupported(): boolean {
  return 'speechSynthesis' in window;
}

/**
 * Get available voices
 */
export function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // Voices may load asynchronously
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };

    // Fallback timeout
    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices());
    }, 1000);
  });
}

/**
 * Find a voice by name or language
 */
export async function findVoice(
  nameOrLang: string
): Promise<SpeechSynthesisVoice | undefined> {
  const voices = await getAvailableVoices();

  // Try to find by exact name
  let voice = voices.find(
    (v) => v.name.toLowerCase() === nameOrLang.toLowerCase()
  );

  // Try to find by language
  if (!voice) {
    voice = voices.find((v) => v.lang.startsWith(nameOrLang));
  }

  // Try to find by partial name match
  if (!voice) {
    voice = voices.find((v) =>
      v.name.toLowerCase().includes(nameOrLang.toLowerCase())
    );
  }

  return voice;
}

/**
 * Speak text using speech synthesis
 * @param text - The text to speak
 * @param options - Configuration options
 * @returns Promise that resolves when speech ends
 */
export function speakText(
  text: string,
  options: SpeechSynthesisOptions = {}
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    if (!isSpeechSynthesisSupported()) {
      reject(new Error('Speech synthesis is not supported in this browser'));
      return;
    }

    // Stop any ongoing speech
    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;

    // Set voice
    if (options.voice) {
      utterance.voice = options.voice;
    } else if (options.voiceName) {
      const voice = await findVoice(options.voiceName);
      if (voice) utterance.voice = voice;
    } else if (options.language) {
      const voice = await findVoice(options.language);
      if (voice) utterance.voice = voice;
    }

    // Set other options
    utterance.lang = options.language || 'en-US';
    utterance.rate = options.rate ?? 1;
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;

    utterance.onend = () => {
      currentUtterance = null;
      resolve();
    };

    utterance.onerror = (event) => {
      currentUtterance = null;
      reject(new Error(`Speech synthesis error: ${event.error}`));
    };

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Stop current speech
 */
export function stopSpeaking(): void {
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

/**
 * Pause speech
 */
export function pauseSpeaking(): void {
  window.speechSynthesis.pause();
}

/**
 * Resume speech
 */
export function resumeSpeaking(): void {
  window.speechSynthesis.resume();
}

/**
 * Check if currently speaking
 */
export function isSpeaking(): boolean {
  return window.speechSynthesis.speaking;
}

// ============================================================================
// COMBINED VOICE INTERFACE
// ============================================================================

export interface VoiceInterfaceState {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  error: string | null;
}

/**
 * Create a combined voice interface for easy use in React components
 */
export function createVoiceInterface() {
  let state: VoiceInterfaceState = {
    isListening: false,
    isSpeaking: false,
    transcript: '',
    error: null,
  };

  const listeners: Set<(state: VoiceInterfaceState) => void> = new Set();

  const notify = () => {
    listeners.forEach((listener) => listener({ ...state }));
  };

  return {
    subscribe(listener: (state: VoiceInterfaceState) => void) {
      listeners.add(listener);
      listener({ ...state });
      return () => listeners.delete(listener);
    },

    getState() {
      return { ...state };
    },

    async startListening(language = 'en-US') {
      if (state.isListening) return;

      state = { ...state, isListening: true, error: null, transcript: '' };
      notify();

      try {
        const transcript = await startSpeechRecognition({ language });
        state = { ...state, isListening: false, transcript };
        notify();
        return transcript;
      } catch (error) {
        state = {
          ...state,
          isListening: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
        notify();
        throw error;
      }
    },

    stopListening() {
      stopSpeechRecognition();
      state = { ...state, isListening: false };
      notify();
    },

    async speak(text: string, options?: SpeechSynthesisOptions) {
      if (state.isSpeaking) {
        stopSpeaking();
      }

      state = { ...state, isSpeaking: true, error: null };
      notify();

      try {
        await speakText(text, options);
        state = { ...state, isSpeaking: false };
        notify();
      } catch (error) {
        state = {
          ...state,
          isSpeaking: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
        notify();
        throw error;
      }
    },

    stopSpeaking() {
      stopSpeaking();
      state = { ...state, isSpeaking: false };
      notify();
    },

    isSupported() {
      return {
        recognition: isSpeechRecognitionSupported(),
        synthesis: isSpeechSynthesisSupported(),
      };
    },
  };
}

// Export singleton instance for convenience
export const voiceInterface = createVoiceInterface();
