/**
 * Chat Service - FastAPI Backend Integration
 * Connects to Python FastAPI server for AI model calls
 */

import { Message, UserContext } from '../types';
import { apiClient, getChatResponse, ChatResponse } from './apiClient';

// ============================================================================
// CONFIGURATION
// ============================================================================

// Set to true to use FastAPI backend, false for direct OpenRouter calls
const USE_FASTAPI = true;

// Fallback to direct OpenRouter if FastAPI is unavailable
let fastApiAvailable: boolean | null = null;

async function checkFastApiAvailability(): Promise<boolean> {
    if (fastApiAvailable !== null) return fastApiAvailable;
    
    try {
        const health = await apiClient.healthCheck();
        fastApiAvailable = health.status === 'ok';
        console.log('FastAPI backend:', fastApiAvailable ? '✅ Connected' : '❌ Not available');
    } catch {
        fastApiAvailable = false;
        console.log('FastAPI backend: ❌ Not available, using direct API calls');
    }
    return fastApiAvailable;
}

// ============================================================================
// IMAGE GENERATION (Using Pollinations.ai - FREE)
// ============================================================================

// Available Image Generation Models via Pollinations.ai
const IMAGE_MODELS = {
    flux: 'flux',           // High-quality general purpose
    sdxl: 'sdxl',           // Stable Diffusion XL
    realistic: 'realistic-vision-v5',  // Realistic Vision
    juggernaut: 'juggernaut-xl',       // Juggernaut XL
    dreamshaper: 'dreamshaper-8',      // DreamShaper
} as const;

type ImageModel = typeof IMAGE_MODELS[keyof typeof IMAGE_MODELS];

interface ImageGenResult {
    url: string;
    model: string;
    modelName: string;
}

const handleImageGeneration = (message: string): ImageGenResult => {
    const msgLower = message.toLowerCase();
    let selectedStyle = "";
    let model: ImageModel = IMAGE_MODELS.flux;
    let modelName = "FLUX";
    
    // Model selection based on keywords
    if (msgLower.match(/sdxl|stable diffusion/)) {
        model = IMAGE_MODELS.sdxl;
        modelName = "Stable Diffusion XL";
    } else if (msgLower.match(/realistic|photo|portrait|person|face|human/)) {
        model = IMAGE_MODELS.realistic;
        modelName = "Realistic Vision";
    } else if (msgLower.match(/juggernaut|detailed|hyper/)) {
        model = IMAGE_MODELS.juggernaut;
        modelName = "Juggernaut XL";
    } else if (msgLower.match(/dream|fantasy|surreal|artistic|abstract|creative/)) {
        model = IMAGE_MODELS.dreamshaper;
        modelName = "DreamShaper";
    } else if (msgLower.match(/anime|manga|ghibli|waifu|cartoon/)) {
        model = IMAGE_MODELS.flux; // FLUX is good for anime
        modelName = "FLUX";
    }
    
    // Style logic for specialized visuals
    if (msgLower.match(/circuit|schematic|wiring|pcb|logic|gate/)) {
        selectedStyle = "professional electrical engineering schematic, clean black lines on white background, IEEE standard symbols, high resolution, labeled components, crisp vector style";
        model = IMAGE_MODELS.flux;
        modelName = "FLUX";
    } else if (msgLower.match(/flowchart|uml|process|algorithm|architecture/)) {
        selectedStyle = "clean professional software architecture diagram, white background, flat design, crisp text, logical flow, vector illustration style";
        model = IMAGE_MODELS.flux;
        modelName = "FLUX";
    } else if (msgLower.match(/anime|manga|ghibli|waifu/)) {
        selectedStyle = "high quality anime illustration, studio ghibli style, vibrant colors, detailed scenery, 4k, masterpiece";
    } else if (msgLower.match(/realistic|photo|portrait|landscape/)) {
        selectedStyle = "hyper-realistic photography, 8k, professional DSLR, perfect lighting, award winning, photorealistic";
    } else if (msgLower.match(/dream|fantasy|surreal|artistic/)) {
        selectedStyle = "dreamlike surreal digital art, vibrant colors, imaginative, artistic masterpiece, ethereal";
    } else {
        selectedStyle = "hyper-realistic digital art, 8k, cinematic lighting, masterpiece, trending on artstation, unreal engine 5 render, highly detailed";
    }

    const removeWords = [
        'generate', 'create', 'draw', 'make', 'show', 'visualize', 'image', 'picture', 'photo', 'diagram', 
        'of', 'a', 'an', 'the', 'in', 'style', 'padam', 'varai', 'kattu', 'pic', 'show me',
        'sdxl', 'stable diffusion', 'realistic', 'juggernaut', 'dreamshaper', 'flux'
    ];
    const regex = new RegExp(`\\b(${removeWords.join('|')})\\b`, 'gi');
    let topic = message.replace(regex, '').replace(/\s+/g, ' ').trim();
    
    if (!topic || topic.length < 2) topic = "advanced future technology";
    
    const basePrompt = `${topic}, ${selectedStyle}`;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(basePrompt)}?width=1024&height=1024&model=${model}&nologo=true`;
    
    return { url, model, modelName };
};

// ============================================================================
// GAME SUGGESTIONS (Stress Relief & Addictive Games)
// ============================================================================

interface GameSuggestion {
    game: string;
    name: string;
    description: string;
    category: 'stress-relief' | 'addictive' | 'fun';
}

const GAME_SUGGESTIONS: GameSuggestion[] = [
    // Stress Relief Games
    { game: 'breath', name: '🧘 Breathing Exercise', description: 'Guided breathing to calm your mind', category: 'stress-relief' },
    { game: 'bubble', name: '🫧 Bubble Pop', description: 'Pop bubbles - oddly satisfying!', category: 'stress-relief' },
    { game: 'zen-draw', name: '🎨 Zen Draw', description: 'Draw freely to express yourself', category: 'stress-relief' },
    { game: 'particles', name: '✨ Particle Play', description: 'Create beautiful particle effects', category: 'stress-relief' },
    { game: 'fidget', name: '🌀 Fidget Spinner', description: 'Virtual fidget spinner', category: 'stress-relief' },
    { game: 'balloon', name: '🎈 Balloon Inflate', description: 'Inflate virtual balloons', category: 'stress-relief' },
    { game: 'quote', name: '💬 Calm Quotes', description: 'Inspirational quotes for peace', category: 'stress-relief' },
    
    // Addictive Games
    { game: 'snake', name: '🐍 Snake', description: 'Classic snake game - grow your tail!', category: 'addictive' },
    { game: 'tetris', name: '🧱 Tetris', description: 'Stack blocks, clear lines!', category: 'addictive' },
    { game: 'tile-merge', name: '🔢 2048', description: 'Merge tiles to reach 2048!', category: 'addictive' },
    { game: 'clicker', name: '🖱️ Clicker', description: 'Click to earn, upgrade to earn more!', category: 'addictive' },
    
    // Fun & Quick Games
    { game: 'memory', name: '🧠 Memory Match', description: 'Test your memory!', category: 'fun' },
    { game: 'whack', name: '🔨 Whack-a-Mole', description: 'Quick reflexes needed!', category: 'fun' },
    { game: 'color-spot', name: '🎯 Color Spot', description: 'Find the different color', category: 'fun' },
    { game: 'reaction', name: '⚡ Reaction Test', description: 'Test your reaction speed', category: 'fun' },
];

const detectGameRequest = (message: string): { isGameRequest: boolean; response?: GameSuggestion | GameSuggestion[] } => {
    const msgLower = message.toLowerCase();
    
    // Direct game requests
    const gameMatches: { [key: string]: string } = {
        'snake': 'snake',
        'tetris': 'tetris',
        '2048': 'tile-merge',
        'tile merge': 'tile-merge',
        'clicker': 'clicker',
        'breathing': 'breath',
        'breath': 'breath',
        'bubble': 'bubble',
        'zen draw': 'zen-draw',
        'draw': 'zen-draw',
        'particle': 'particles',
        'fidget': 'fidget',
        'spinner': 'fidget',
        'balloon': 'balloon',
        'quote': 'quote',
        'memory': 'memory',
        'whack': 'whack',
        'mole': 'whack',
        'color': 'color-spot',
        'reaction': 'reaction',
    };

    for (const [keyword, gameId] of Object.entries(gameMatches)) {
        if (msgLower.includes(keyword) && (msgLower.includes('play') || msgLower.includes('game') || msgLower.includes('open'))) {
            const game = GAME_SUGGESTIONS.find(g => g.game === gameId);
            if (game) return { isGameRequest: true, response: game };
        }
    }
    
    // Stress detection - suggest calming games
    if (msgLower.match(/stress|anxious|anxiety|worried|tension|nervous|overwhelm|panic|pressure|deadline|exam stress|freaking out|can't sleep/)) {
        const stressGames = GAME_SUGGESTIONS.filter(g => g.category === 'stress-relief');
        return { isGameRequest: true, response: stressGames };
    }
    
    // Boredom detection - suggest addictive games
    if (msgLower.match(/bored|boring|nothing to do|waste time|kill time|pass time|entertainment|fun game|addictive/)) {
        const funGames = GAME_SUGGESTIONS.filter(g => g.category === 'addictive' || g.category === 'fun');
        return { isGameRequest: true, response: funGames };
    }
    
    // Quick break request
    if (msgLower.match(/break|relax|chill|need a minute|cool down|take a breather|de-stress|unwind/)) {
        return { isGameRequest: true, response: GAME_SUGGESTIONS.slice(0, 6) };
    }
    
    // General game request
    if (msgLower.match(/play.*game|game.*play|show.*game|want.*game|let's play|wanna play|play something/)) {
        return { isGameRequest: true, response: GAME_SUGGESTIONS };
    }
    
    return { isGameRequest: false };
};

const formatGameResponse = (games: GameSuggestion | GameSuggestion[]): { text: string; meta: any } => {
    if (Array.isArray(games)) {
        const gameList = games.map(g => `• **${g.name}** - ${g.description}`).join('\n');
        return {
            text: `🎮 **Hey! Here are some games to help you relax:**\n\n${gameList}\n\n💡 Click on **Games** in the sidebar to play, or ask me to open a specific game!`,
            meta: { suggestedGames: games.map(g => g.game) }
        };
    }
    return {
        text: `🎮 **Let's play ${games.name}!**\n\n${games.description}\n\n👉 Opening the game for you... Click on **Games** in the sidebar and select **${games.name}**!`,
        meta: { suggestedGame: games.game, autoOpen: true }
    };
};

// ============================================================================
// MAIN CHAT FUNCTION
// ============================================================================

export const getBotResponse = async (
    message: string, 
    context: UserContext,
    attachedImage?: string // Base64 image for vision queries
): Promise<{ 
    message: Partial<Message>, 
    updatedContext?: Partial<UserContext>,
    modelUsed?: string,
    modelName?: string 
}> => {
    try {
        // Check for game requests FIRST (before API calls)
        const gameDetection = detectGameRequest(message);
        if (gameDetection.isGameRequest && gameDetection.response) {
            const response = formatGameResponse(gameDetection.response);
            return {
                message: {
                    text: response.text,
                    type: 'game_suggestion' as any,
                    meta: response.meta,
                    modelUsed: 'local',
                    modelName: 'Game Suggester'
                },
                modelUsed: 'local',
                modelName: 'Game Suggester'
            };
        }
        
        // Check if FastAPI is available
        if (USE_FASTAPI) {
            const isAvailable = await checkFastApiAvailability();
            
            if (isAvailable) {
                // Use FastAPI backend
                const response: ChatResponse = await getChatResponse(
                    message,
                    context,
                    attachedImage
                );
                
                return {
                    message: {
                        text: response.text,
                        type: response.type as any,
                        meta: response.meta,
                        modelUsed: response.modelUsed,
                        modelName: response.modelName
                    },
                    modelUsed: response.modelUsed,
                    modelName: response.modelName
                };
            }
        }
        
        // Fallback: Direct OpenRouter call (if FastAPI unavailable)
        return await directOpenRouterCall(message, context, attachedImage);
        
    } catch (error: any) {
        console.error("Chat Service Error:", error);
        
        // Provide helpful error message
        let errorMsg = "Machi, my brain is slightly overloaded. Can you try re-asking?";
        
        if (error.message?.includes('API key')) {
            errorMsg = "🔑 API key issue detected! Please check your configuration.";
        } else if (error.message?.includes('rate limit')) {
            errorMsg = "⏳ Rate limit reached. Please wait a moment and try again.";
        } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
            errorMsg = "🔌 Cannot connect to the server. Make sure the FastAPI backend is running on port 8000.";
        }
        
        return {
            message: { text: errorMsg }
        };
    }
};

// ============================================================================
// DIRECT OPENROUTER FALLBACK
// ============================================================================

async function directOpenRouterCall(
    message: string,
    context: UserContext,
    attachedImage?: string
): Promise<{ 
    message: Partial<Message>, 
    updatedContext?: Partial<UserContext>,
    modelUsed?: string,
    modelName?: string 
}> {
    // Import these only if needed (lazy loading)
    const { callOpenRouter } = await import('./openRouterClient');
    const { detectModelFromMessage, MODEL_CATALOG } = await import('./modelConfig');
    const { departmentCatalog } = await import('./knowledgeBase');
    
    const detection = detectModelFromMessage(message, !!attachedImage);
    console.log(`🤖 Direct API - Model: ${detection.modelName}`);
    
    // Handle image generation with auto-model selection
    if (detection.isImageGeneration) {
        const imgResult = handleImageGeneration(message);
        return {
            message: {
                text: `🎨 Drawing it for you using **${imgResult.modelName}**!\n\nGenerating your high-quality image...`,
                type: 'image',
                meta: { 
                    imageUrl: imgResult.url, 
                    imagePrompt: message,
                    imageModel: imgResult.modelName
                },
                modelUsed: `pollinations/${imgResult.model}`,
                modelName: `${imgResult.modelName} Image Generator`
            },
            modelUsed: `pollinations/${imgResult.model}`,
            modelName: `${imgResult.modelName} Image Generator`
        };
    }
    
    // Build system prompt
    let deptInfo = "";
    if (context.semester && context.department && departmentCatalog[context.department]) {
        const semData = departmentCatalog[context.department][context.semester];
        if (semData) {
            deptInfo = `\nDEPT: ${context.department}, Sem: ${context.semester}`;
        }
    }
    
    // Analyze prompt complexity for adaptive response length
    const wordCount = message.split(/\s+/).length;
    const isSimpleGreeting = /^(hi|hello|hey|vanakkam|thanks|ok|bye|nandri|super|good|nice)\b/i.test(message.trim());
    const needsDetailedResponse = /explain|describe|how|why|what is|elaborate|detail|difference|compare|steps|process|algorithm/i.test(message);
    const isCodeRequest = /code|program|implement|write|function|script|syntax/i.test(message);
    
    let responseGuidance = '';
    if (isSimpleGreeting || wordCount < 5) {
        responseGuidance = 'RESPONSE LENGTH: Keep it SHORT (1-3 sentences). Be friendly and concise with Tamil flavor.';
    } else if (needsDetailedResponse || isCodeRequest) {
        responseGuidance = 'RESPONSE LENGTH: Be DETAILED. Use bullet points, examples, and structured format.';
    } else {
        responseGuidance = 'RESPONSE LENGTH: MODERATE (5-8 sentences). Clear and helpful.';
    }
    
    const systemPrompt = `You are Murukku AI (முருக்கு AI) 🍘, an elite AI Academic Companion for Anna University students.

PERSONALITY & LANGUAGE:
- You're a friendly "அண்ணா" (Anna/Big Brother) who naturally mixes Tamil script (தமிழ்) with Tanglish
- Start with Tamil: வணக்கம் (Vanakkam), என்ன மாச்சி (Enna Machi), சூப்பர் (Super)
- Use encouragements: கலக்கல் (Kalakkal), செம்ம (Semma), அருமை (Arumai)
- End academic answers with: புரியுதா? (Puriyutha? - Understood?)

USER PROFILE:
- Name: ${context.name || 'Machi'}
- Style: ${context.learningStyle || 'Visual'}
- Goal: ${context.careerGoal || 'Placement'}${deptInfo}

${responseGuidance}

ACADEMIC STYLE:
- **Bold** key terminology and definitions
- Use bullet points for clarity
- Add "📝 Exam Tip:" for important points
- Reference standard textbooks when relevant

TAMIL PHRASES TO USE:
- வணக்கம் (Vanakkam) - Hello | நன்றி (Nandri) - Thanks
- சூப்பர் (Super) - Great | கலக்கல் (Kalakkal) - Awesome  
- செம்ம (Semma) - Fantastic | புரியுதா (Puriyutha) - Understood?
- சந்தேகம் கேளு (Sandhegam Kelu) - Ask doubts
- படிச்சா ஜெயி! (Padichaa Jeyi) - Study and win!`;
    
    const messages: any[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
    ];
    
    // Adaptive max_tokens based on query complexity
    const maxTokens = isSimpleGreeting ? 256 : (needsDetailedResponse || isCodeRequest) ? 4096 : 2048;
    
    const response = await callOpenRouter(detection.model, messages, {
        temperature: detection.model.includes('coder') ? 0.3 : 0.7,
        max_tokens: maxTokens
    });
    
    const text = response.choices[0]?.message?.content || '';
    let type: 'text' | 'notes' | 'code' = 'text';
    
    if (text.includes('```') && detection.model.includes('coder')) {
        type = 'code';
    } else if (text.length > 1200) {
        type = 'notes';
    }
    
    return {
        message: {
            text,
            type,
            modelUsed: detection.model,
            modelName: detection.modelName
        },
        modelUsed: detection.model,
        modelName: detection.modelName
    };
}

// ============================================================================
// ADDITIONAL HELPER FUNCTIONS
// ============================================================================

/**
 * Get a simple greeting response (doesn't use API)
 */
export const getGreeting = (context: UserContext): string => {
    const greetings = [
        `வணக்கம் ${context.name || 'மாச்சி'}! 🙏 (Vanakkam!) Ready to learn something சூப்பர் today?`,
        `என்ன ${context.name || 'Buddy'}! எப்படி உதவ வேணும்? (How can I help?) 📚`,
        `Yo ${context.name || 'Friend'}! Murukku AI 🍘 ready-uh! சொல்லுங்க!`,
        `Hey ${context.name || 'Machi'}! வா படிக்கலாம்! (Let's study!) 🎓`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
};

/**
 * Check if API is configured and working
 */
export const checkApiStatus = async (): Promise<{ ok: boolean; message: string; backend: string }> => {
    try {
        // First check FastAPI
        const health = await apiClient.healthCheck();
        if (health.status === 'ok') {
            return { ok: true, message: 'FastAPI backend connected!', backend: 'fastapi' };
        }
    } catch {
        // FastAPI not available
    }
    
    // Check direct OpenRouter
    try {
        const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
        if (apiKey) {
            return { ok: true, message: 'Using direct OpenRouter API', backend: 'openrouter' };
        }
    } catch {
        // No API key
    }
    
    return { ok: false, message: 'No API backend available', backend: 'none' };
};

/**
 * Get available models
 */
export const getAvailableModels = async () => {
    try {
        const models = await apiClient.getModels();
        return models.models;
    } catch {
        // Return default models if API unavailable
        const { MODEL_CATALOG } = await import('./modelConfig');
        return {
            language: MODEL_CATALOG.language,
            coding: MODEL_CATALOG.coding,
            vision: MODEL_CATALOG.vision,
            reasoning: MODEL_CATALOG.reasoning
        };
    }
};
