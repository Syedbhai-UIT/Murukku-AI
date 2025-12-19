"""
FastAPI Backend for Murukku AI
Handles OpenRouter API calls and model routing
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import httpx
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Murukku AI API",
    description="Multi-model AI backend for Anna University students",
    version="2.0.0"
)

# CORS Configuration - Production Ready
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://localhost:8001",
    # Production URLs - set FRONTEND_URL in Railway env vars
    os.getenv("FRONTEND_URL", ""),
]
# Filter out empty strings
ALLOWED_ORIGINS = [origin for origin in ALLOWED_ORIGINS if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# CONFIGURATION
# ============================================================================

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    raise ValueError(
        "❌ OPENROUTER_API_KEY not found!\n"
        "Please set it in your environment or .env file\n"
        "Get free API key from: https://openrouter.ai/keys"
    )

# Model Catalog
MODEL_CATALOG = {
    "language": {
        "primary": "meta-llama/llama-3.3-70b-instruct:free",
        "llama8b": "meta-llama/llama-3.1-8b-instruct",
        "llama70b": "meta-llama/llama-3.1-70b-instruct",
        "mistral": "mistralai/mistral-nemo",
        "mixtral": "mistralai/mixtral-8x7b-instruct",
        "phi3": "microsoft/phi-3-mini-128k-instruct",
        "phi4": "microsoft/phi-4",
    },
    "coding": {
        "qwen": "qwen/qwen3-coder:free",
        "qwen32b": "qwen/qwen-2.5-coder-32b-instruct",
        "deepseek": "deepseek/deepseek-chat-v3-0324",
        "devstral": "mistralai/devstral-2512:free",
    },
    "vision": {
        "llava": "meta-llama/llama-3.2-11b-vision-instruct",
        "llava90b": "meta-llama/llama-3.2-90b-vision-instruct",
        "qwen_vl": "qwen/qwen3-vl-8b-instruct",
        "phi4_vision": "microsoft/phi-4-multimodal-instruct",
    },
    "reasoning": {
        "deepseek_r1": "tngtech/deepseek-r1t2-chimera:free",
    }
}

# Auto-detection patterns
import re

CODE_PATTERN = re.compile(
    r'\b(code|coding|function|class|debug|error|bug|fix|algorithm|compile|syntax|'
    r'javascript|python|java|c\+\+|typescript|html|css|react|node|sql|api|loop|'
    r'array|variable|method|import|export|const|let|var|async|await|promise|'
    r'callback|component|hook|useState|useEffect|npm|yarn|git|github|programming|'
    r'developer|script|snippet)\b', re.IGNORECASE
)

MATH_PATTERN = re.compile(
    r'\b(calculate|solve|equation|formula|math|algebra|calculus|statistics|'
    r'probability|derivative|integral|proof|theorem|number|percentage|fraction|'
    r'decimal|geometry|trigonometry|logarithm|exponent|matrix|vector|graph|plot)\b', 
    re.IGNORECASE
)

IMAGE_PATTERN = re.compile(
    r'\b(draw|generate|create|show me|visualize|picture|image|photo|diagram|'
    r'sketch|illustration|render|design|art|artwork|portrait|landscape|anime|'
    r'cartoon|realistic|fantasy|sci-fi|generate an image|create an image|'
    r'make an image|draw me)\b', re.IGNORECASE
)

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class Message(BaseModel):
    role: str  # 'system', 'user', 'assistant'
    content: str | List[Dict[str, Any]]

class UserContext(BaseModel):
    name: Optional[str] = "Buddy"
    semester: Optional[str] = None
    department: Optional[str] = None
    learningStyle: Optional[str] = "Visual"
    careerGoal: Optional[str] = "Placement"

class ChatRequest(BaseModel):
    message: str
    context: Optional[UserContext] = None
    model: Optional[str] = None  # Override auto-detection
    attachedImage: Optional[str] = None  # Base64 image

class ChatResponse(BaseModel):
    text: str
    type: str = "text"
    modelUsed: str
    modelName: str
    meta: Optional[Dict[str, Any]] = None

class VisionRequest(BaseModel):
    prompt: str
    image: str  # Base64 image
    mimeType: Optional[str] = "image/jpeg"

class ModelListResponse(BaseModel):
    models: Dict[str, Dict[str, str]]

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def detect_model(message: str, has_image: bool = False) -> tuple[str, str]:
    """Auto-detect the best model based on message content"""
    
    if has_image:
        return MODEL_CATALOG["vision"]["llava"], "LLaMA 3.2 Vision 11B"
    
    if CODE_PATTERN.search(message):
        return MODEL_CATALOG["coding"]["qwen"], "Qwen3 Coder (FREE)"
    
    if MATH_PATTERN.search(message):
        return MODEL_CATALOG["reasoning"]["deepseek_r1"], "DeepSeek R1 (FREE)"
    
    if IMAGE_PATTERN.search(message):
        return "IMAGE_GENERATION", "FLUX Image Generator"
    
    # Default to primary language model
    return MODEL_CATALOG["language"]["primary"], "LLaMA 3.3 70B (FREE)"


def build_system_prompt(context: UserContext, model_id: str, message: str = "") -> str:
    """Build system prompt based on user context, model type, and message complexity"""
    
    # Analyze message complexity for adaptive response length
    word_count = len(message.split())
    is_simple = any(g in message.lower() for g in ['hi', 'hello', 'hey', 'vanakkam', 'thanks', 'ok', 'bye', 'nandri'])
    needs_detail = any(k in message.lower() for k in ['explain', 'describe', 'how', 'why', 'what is', 'elaborate', 'steps', 'process'])
    is_code_request = any(k in message.lower() for k in ['code', 'program', 'implement', 'write', 'function', 'script'])
    
    # Adaptive response guidance
    if is_simple or word_count < 5:
        response_guidance = "RESPONSE LENGTH: Keep it SHORT (1-3 sentences). Be friendly and warm with Tamil flavor."
    elif needs_detail or is_code_request:
        response_guidance = "RESPONSE LENGTH: Be DETAILED. Use bullet points, examples, code comments, and structured format."
    else:
        response_guidance = "RESPONSE LENGTH: MODERATE (5-10 sentences). Clear and helpful."
    
    base_prompt = f"""You are **Murukku AI** (முருக்கு AI) 🍘, an elite AI Academic Companion for Anna University students.

CORE PERSONALITY:
- You are a friendly "அண்ணா" (Anna/Big Brother) who naturally mixes Tamil script (தமிழ்) with Tanglish
- Be warm, encouraging, and supportive like a real senior helping juniors
- Use Tamil greetings: வணக்கம் (Vanakkam), என்ன மாச்சி (Enna Machi)
- Use encouragements: சூப்பர் (Super), கலக்கல் (Kalakkal), செம்ம (Semma), அருமை (Arumai)

USER PROFILE:
- Name: {context.name or 'Machi'}
- Learning Style: {context.learningStyle or 'Visual'}
- Career Goal: {context.careerGoal or 'Placement'}
- Department: {context.department or 'Engineering'}
- Semester: {context.semester or 'Not specified'}

{response_guidance}

RESPONSE STYLE:
- Start with a Tamil greeting or phrase
- Use **Bold** for key terminology and definitions
- Add "📝 Exam Tip:" or "💡 Pro Tip:" for important insights
- End academic answers with "புரியுதா? சந்தேகம் கேளு!" (Understood? Ask doubts!)

TAMIL PHRASES TO USE:
- வணக்கம் (Vanakkam) - Hello
- நன்றி (Nandri) - Thank you
- சூப்பர் (Super) - Great
- கலக்கல் (Kalakkal) - Awesome
- செம்ம (Semma) - Fantastic
- புரியுதா (Puriyutha) - Do you understand?
- சந்தேகம் கேளு (Sandhegam Kelu) - Ask your doubts
- படிச்சா ஜெயி! (Padichaa Jeyi!) - Study and win!
"""

    # Add model-specific instructions
    if "coder" in model_id.lower() or "deepseek" in model_id.lower():
        base_prompt += """
CODING MODE ACTIVATED:
- Provide clean, well-commented, production-ready code
- Use proper indentation and follow best practices
- Explain the logic step-by-step
- Include example usage where helpful
- Mention time/space complexity for algorithms
"""
    
    if "r1" in model_id.lower() or "reasoning" in model_id.lower():
        base_prompt += """
REASONING MODE ACTIVATED:
- Break down complex problems step by step
- Show your mathematical/logical work clearly
- Double-check calculations before final answers
- Use clear notation and formatting
"""

    return base_prompt


async def call_openrouter(
    model: str,
    messages: List[Dict],
    temperature: float = 0.7,
    max_tokens: int = 4096
) -> str:
    """Make API call to OpenRouter"""
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Murukku AI"
    }
    
    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(OPENROUTER_API_URL, json=payload, headers=headers)
        
        if response.status_code != 200:
            error_detail = response.json().get("error", {}).get("message", "Unknown error")
            raise HTTPException(status_code=response.status_code, detail=error_detail)
        
        data = response.json()
        return data["choices"][0]["message"]["content"]


# Available Image Generation Models via Pollinations.ai
IMAGE_MODELS = {
    "flux": "flux",                    # High-quality general purpose
    "sdxl": "sdxl",                    # Stable Diffusion XL
    "realistic": "realistic-vision-v5", # Realistic Vision
    "juggernaut": "juggernaut-xl",      # Juggernaut XL  
    "dreamshaper": "dreamshaper-8",     # DreamShaper
}

def detect_image_model(prompt: str) -> tuple[str, str]:
    """Detect the best image model based on prompt keywords"""
    prompt_lower = prompt.lower()
    
    # Check for explicit model requests
    if any(word in prompt_lower for word in ['sdxl', 'stable diffusion']):
        return IMAGE_MODELS["sdxl"], "Stable Diffusion XL"
    elif any(word in prompt_lower for word in ['realistic', 'photo', 'portrait', 'person', 'face', 'human']):
        return IMAGE_MODELS["realistic"], "Realistic Vision"
    elif any(word in prompt_lower for word in ['juggernaut', 'detailed', 'hyper']):
        return IMAGE_MODELS["juggernaut"], "Juggernaut XL"
    elif any(word in prompt_lower for word in ['dream', 'fantasy', 'surreal', 'artistic', 'abstract', 'creative']):
        return IMAGE_MODELS["dreamshaper"], "DreamShaper"
    elif any(word in prompt_lower for word in ['anime', 'manga', 'ghibli', 'cartoon']):
        return IMAGE_MODELS["flux"], "FLUX"
    
    # Default to FLUX for general requests
    return IMAGE_MODELS["flux"], "FLUX"


def generate_image_url(prompt: str, model: str = None) -> dict:
    """Generate image URL using Pollinations.ai with model selection"""
    
    prompt_lower = prompt.lower()
    
    # Auto-detect model if not specified
    if model is None:
        selected_model, model_name = detect_image_model(prompt)
    else:
        selected_model = model
        model_name = model.replace("-", " ").title()
    
    # Style detection based on content
    if any(word in prompt_lower for word in ['circuit', 'schematic', 'wiring', 'pcb']):
        style = "professional electrical engineering schematic, clean black lines on white background, IEEE standard symbols"
        selected_model = IMAGE_MODELS["flux"]  # FLUX is best for technical diagrams
        model_name = "FLUX"
    elif any(word in prompt_lower for word in ['flowchart', 'uml', 'process', 'algorithm']):
        style = "clean professional software architecture diagram, white background, flat design"
        selected_model = IMAGE_MODELS["flux"]
        model_name = "FLUX"
    elif any(word in prompt_lower for word in ['anime', 'manga', 'ghibli']):
        style = "high quality anime illustration, studio ghibli style, vibrant colors, 4k, masterpiece"
    elif any(word in prompt_lower for word in ['realistic', 'photo', 'portrait']):
        style = "hyper-realistic photography, 8k, professional DSLR, perfect lighting, award winning, photorealistic"
    elif any(word in prompt_lower for word in ['dream', 'fantasy', 'surreal']):
        style = "dreamlike surreal digital art, vibrant colors, imaginative, artistic masterpiece, ethereal"
    else:
        style = "hyper-realistic digital art, 8k, cinematic lighting, masterpiece, trending on artstation"
    
    # Clean prompt - remove command words and model names
    remove_words = ['generate', 'create', 'draw', 'make', 'show', 'visualize', 'image', 
                    'picture', 'photo', 'diagram', 'of', 'a', 'an', 'the',
                    'sdxl', 'stable diffusion', 'realistic', 'juggernaut', 'dreamshaper', 'flux']
    clean_prompt = prompt
    for word in remove_words:
        clean_prompt = re.sub(rf'\b{word}\b', '', clean_prompt, flags=re.IGNORECASE)
    clean_prompt = ' '.join(clean_prompt.split()).strip()
    
    if not clean_prompt or len(clean_prompt) < 2:
        clean_prompt = "advanced future technology"
    
    full_prompt = f"{clean_prompt}, {style}"
    url = f"https://image.pollinations.ai/prompt/{full_prompt}?width=1024&height=1024&model={selected_model}&nologo=true"
    
    return {
        "url": url,
        "model": selected_model,
        "modelName": model_name,
        "prompt": clean_prompt
    }


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "service": "Murukku AI API", "version": "2.0.0"}


@app.get("/api/models", response_model=ModelListResponse)
async def get_models():
    """Get available models"""
    return {"models": MODEL_CATALOG}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Main chat endpoint with auto-detection"""
    
    context = request.context or UserContext()
    has_image = bool(request.attachedImage)
    
    # Detect or use specified model
    if request.model:
        model_id = request.model
        model_name = request.model.split("/")[-1]
    else:
        model_id, model_name = detect_model(request.message, has_image)
    
    # Handle image generation with auto-model selection
    if model_id == "IMAGE_GENERATION":
        image_result = generate_image_url(request.message)
        return ChatResponse(
            text=f"🎨 Drawing it for you using **{image_result['modelName']}**!\n\nGenerating your high-quality image...",
            type="image",
            modelUsed=f"pollinations/{image_result['model']}",
            modelName=f"{image_result['modelName']} Image Generator",
            meta={"imageUrl": image_result['url'], "imagePrompt": image_result['prompt'], "imageModel": image_result['modelName']}
        )
    
    # Build messages with adaptive response length
    system_prompt = build_system_prompt(context, model_id, request.message)
    messages = [{"role": "system", "content": system_prompt}]
    
    # Handle vision request
    if has_image and request.attachedImage:
        messages.append({
            "role": "user",
            "content": [
                {"type": "text", "text": request.message},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{request.attachedImage}"}}
            ]
        })
    else:
        messages.append({"role": "user", "content": request.message})
    
    # Adjust temperature based on model
    temperature = 0.7
    if "coder" in model_id.lower():
        temperature = 0.3
    elif "r1" in model_id.lower():
        temperature = 0.2
    
    try:
        response_text = await call_openrouter(model_id, messages, temperature)
        
        # Determine response type
        response_type = "text"
        if "```" in response_text and "coder" in model_id.lower():
            response_type = "code"
        elif len(response_text) > 1200:
            response_type = "notes"
        
        return ChatResponse(
            text=response_text,
            type=response_type,
            modelUsed=model_id,
            modelName=model_name
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/vision")
async def analyze_image(request: VisionRequest):
    """Analyze an image using vision model"""
    
    model_id = MODEL_CATALOG["vision"]["llava"]
    
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": request.prompt},
                {"type": "image_url", "image_url": {"url": f"data:{request.mimeType};base64,{request.image}"}}
            ]
        }
    ]
    
    try:
        response_text = await call_openrouter(model_id, messages)
        return {
            "description": response_text,
            "modelUsed": model_id,
            "modelName": "LLaMA 3.2 Vision 11B"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/code")
async def generate_code(request: ChatRequest):
    """Generate code using coding specialist model"""
    
    model_id = MODEL_CATALOG["coding"]["qwen"]
    context = request.context or UserContext()
    
    system_prompt = """You are an expert programmer and coding assistant.
Provide clean, well-commented, production-ready code.
Explain your approach briefly.
Include example usage where helpful.
Mention time/space complexity for algorithms."""
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": request.message}
    ]
    
    try:
        response_text = await call_openrouter(model_id, messages, temperature=0.3)
        return ChatResponse(
            text=response_text,
            type="code",
            modelUsed=model_id,
            modelName="Qwen3 Coder (FREE)"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/reasoning")
async def solve_problem(request: ChatRequest):
    """Solve math/logic problems using reasoning model"""
    
    model_id = MODEL_CATALOG["reasoning"]["deepseek_r1"]
    
    system_prompt = """You are a mathematical and logical reasoning expert.
Break down complex problems step by step.
Show your work clearly.
Double-check calculations before providing final answers.
Use clear notation and formatting."""
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": request.message}
    ]
    
    try:
        response_text = await call_openrouter(model_id, messages, temperature=0.2)
        return ChatResponse(
            text=response_text,
            type="text",
            modelUsed=model_id,
            modelName="DeepSeek R1 (FREE)"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/generate-image")
async def generate_image(prompt: str, model: str = None):
    """Generate image URL from prompt with auto-model selection"""
    image_result = generate_image_url(prompt, model)
    return {
        "url": image_result['url'],
        "prompt": image_result['prompt'],
        "model": image_result['model'],
        "modelName": image_result['modelName']
    }


# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
