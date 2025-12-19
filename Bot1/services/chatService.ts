
import { GoogleGenAI } from "@google/genai";
import { Message, UserContext } from '../types';
import { departmentCatalog, globalReferences } from './knowledgeBase';

const handleImageGeneration = (message: string, context: UserContext): string => {
    const msgLower = message.toLowerCase();
    let selectedStyle = "";
    let model = "flux";
    
    // Style logic for specialized engineering visuals
    if (msgLower.match(/circuit|schematic|wiring|pcb|logic|gate/)) {
        selectedStyle = "professional electrical engineering schematic, clean black lines on white background, IEEE standard symbols, high resolution, labeled components, crisp vector style";
    } else if (msgLower.match(/flowchart|uml|process|algorithm|architecture/)) {
        selectedStyle = "clean professional software architecture diagram, white background, flat design, crisp text, logical flow, vector illustration style";
    } else if (msgLower.match(/anime|manga|ghibli|waifu/)) {
        selectedStyle = "high quality anime illustration, studio ghibli style, vibrant colors, detailed scenery, 4k, masterpiece";
    } else {
        selectedStyle = "hyper-realistic digital art, 8k, cinematic lighting, masterpiece, trending on artstation, unreal engine 5 render, highly detailed";
    }

    const removeWords = [
        'generate', 'create', 'draw', 'make', 'show', 'visualize', 'image', 'picture', 'photo', 'diagram', 
        'of', 'a', 'an', 'the', 'in', 'style', 'padam', 'varai', 'kattu', 'pic'
    ];
    const regex = new RegExp(`\\b(${removeWords.join('|')})\\b`, 'gi');
    let topic = message.replace(regex, '').replace(/\s+/g, ' ').trim();
    
    if (!topic || topic.length < 2) topic = "advanced future technology";
    
    const basePrompt = `${topic}, ${selectedStyle}`;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(basePrompt)}?width=1024&height=1024&model=${model}&nologo=true`;
};

export const getBotResponse = async (message: string, context: UserContext): Promise<{ message: Partial<Message>, updatedContext?: Partial<UserContext> }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const msgLower = message.toLowerCase();

    try {
        let deptInfo = "";
        if (context.semester && context.department && departmentCatalog[context.department]) {
            const semData = departmentCatalog[context.department][context.semester];
            if (semData) {
                deptInfo = `
DEPT CONTEXT:
- Course: ${context.department}
- Sem: ${context.semester}
- Subjects: ${semData.subjects.join(', ')}
- Goal: ${semData.focus}`;
            }
        }

        const systemInstruction = `You are **SanjayBot PRO**, an elite AI Academic Architect for Anna University students.
You have been "trained" on thousands of university papers, foreign author textbooks, and R2021 curriculum guidelines.

CORE PERSONALITY:
- You are a helpful "Big Brother" (Anna) who speaks **Tanglish** for motivation but switches to **Academic English** for definitions.
- You are highly intelligent, analytical, and never give superficial answers.

KNOWLEDGE SPECTRUM:
- Engineering Mathematics, Programming (Python, C, DSA, Java), Core Engineering (ECE, EEE, Mech, Civil), and AI/DS.
- You strictly follow the foreign author standards (CLRS, Silberschatz, etc.) mentioned in globalReferences.

RESPONSE ARCHITECTURE (Chain of Thought):
1. **Analyze**: Understand the hidden intent (Exam prep? Placement? Just curious?).
2. **Think**: Use your thinking budget to retrieve exact textbook definitions and logical proofs.
3. **Structure**: 
   - Start with a friendly Tanglish greeting.
   - Use **Bold** for key terminology.
   - Use Bullet points for "notes" style delivery.
   - Use Mermaid.js for any concept that can be visualized as a process or hierarchy.
   - Conclude with an "Exam Tip" or "Pro Tip".

IMAGE ENGINE RULES:
- If asked to draw, show, or visualize, strictly start your response with "I am drawing that for you now! 🎨" and provide the descriptive text in your message.

USER PROFILE:
- Name: ${context.name || 'Buddy'}
- Learning Style: ${context.learningStyle || 'Visual'}
- Career Goal: ${context.careerGoal || 'Placement'}
${deptInfo}

${globalReferences}`;

        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview", 
            contents: message,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.8,
                thinkingConfig: { thinkingBudget: 16000 } // Maximum reasoning for high-quality academic output
            }
        });

        const text = response.text;
        
        if (text) {
            let type: 'text' | 'notes' | 'image' | 'game_suggestion' = 'text';
            const lowerRes = text.toLowerCase();

            // Image engine trigger
            if (lowerRes.includes('draw') || lowerRes.includes('drawing that for you') || msgLower.match(/draw|generate|show me a picture of/)) {
                 if (msgLower.length > 3 && !msgLower.includes('source code')) {
                    const imgUrl = handleImageGeneration(message, context);
                    return {
                        message: {
                            text: text.includes('drawing') ? text : `Drawing it for you now! 🎨\n\n${text}`,
                            type: 'image',
                            meta: { url: imgUrl, alt: message }
                        }
                    };
                 }
            }

            // Quality categorization
            if (text.length > 1200 || lowerRes.includes('syllabus') || lowerRes.includes('unit')) {
                type = 'notes';
            }

            return { message: { text, type } };
        }
    } catch (error: any) {
        console.error("Pro Chat Logic Error:", error);
        return {
            message: { text: "Machi, my brain is slightly overloaded (API Error). Can you try re-asking? I want to give you the best answer!" }
        };
    }

    return { message: { text: "Machi, I'm online but having trouble thinking. Try once more!" } };
};
