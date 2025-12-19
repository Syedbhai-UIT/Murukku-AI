
import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Bot, User, Download, ExternalLink, Sparkles, BookOpen, Coffee, Image as ImageIcon, Zap, History, Clock, PlusCircle, X, Gamepad2, BarChart2, Copy, Check, BrainCircuit, Loader2 } from 'lucide-react';
import { Message, UserContext, ChatSession } from '../types';
import { getBotResponse } from '../services/chatService';
import { jsPDF } from "jspdf";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import mermaid from 'mermaid';
import RelaxationGames from './RelaxationGames';

interface ChatInterfaceProps {
    initialMessage?: string;
    externalContext?: UserContext;
}

type ChatMode = 'study' | 'image' | 'chill';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'sans-serif',
});

const MermaidBlock: React.FC<{ code: string; id: string }> = ({ code, id }) => {
    const [svg, setSvg] = useState('');

    useEffect(() => {
        const renderDiagram = async () => {
            try {
                const { svg } = await mermaid.render(`mermaid-${id}`, code);
                setSvg(svg);
            } catch (error) {
                setSvg('<div class="text-red-400 text-xs p-2">Complex diagram structure - use chat for details.</div>');
            }
        };
        renderDiagram();
    }, [code, id]);

    return (
        <div className="rounded-xl overflow-hidden border border-white/10 bg-[#12121a] shadow-lg p-4 w-full overflow-x-auto flex justify-center my-2">
             <div dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
    );
};

const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
    const [copied, setCopied] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-lg overflow-hidden border border-white/10 bg-[#1e1e1e] shadow-lg relative group w-full my-2">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                <span className="text-xs font-mono text-gray-400 uppercase">{language}</span>
                <button 
                    onClick={onCopy} 
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2 py-1 rounded"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
            </div>
            <div className="p-4 overflow-x-auto custom-scrollbar">
                <pre className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre"><code>{code}</code></pre>
            </div>
        </div>
    );
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialMessage, externalContext }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Vanakkam! 🙏\n\nI'm **SanjayBot PRO**. I've been optimized with advanced engineering knowledge and deep reasoning. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeMode, setActiveMode] = useState<ChatMode>('study');
  const [showGames, setShowGames] = useState(false);
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>(Date.now().toString());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions = {
      study: ["🎯 Topic Summary", "🧠 Deep Logic Map", "📝 Note-Taking Mode", "📊 Compare Concepts"],
      image: ["🖼️ Circuit Diagram", "🏗️ Civil Structure", "⚙️ Machine CAD", "🌌 Space Exploration"],
      chill: ["🎮 Mini Games", "🍿 Movie Suggest", "🏏 Cricket Live", "😂 Quick Joke"]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialMessage) {
        setInput(initialMessage);
        inputRef.current?.focus();
    }
  }, [initialMessage]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const { message: response } = await getBotResponse(textToSend, externalContext || {});
    
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text || "Machi, slight network issue. Try re-sending?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: response.type,
      meta: response.meta
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botMsg]);
  };

  const renderMessageText = (text: string, msgId: string) => {
      const parts = text.split(/```(\w*)\n?([\s\S]*?)```/g);
      return (
          <div className="space-y-3">
              {parts.map((part, index) => {
                  if (index % 3 === 0) {
                      if (!part) return null;
                      let formatted = part
                        .replace(/\n/g, '<br />')
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-accentLight">$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/•/g, '<span class="text-accent mr-2">•</span>');
                      return <div key={index} dangerouslySetInnerHTML={{ __html: formatted }} />;
                  } else if (index % 3 === 2) {
                      const lang = parts[index - 1] || 'text';
                      if (lang === 'mermaid') {
                          return <MermaidBlock key={index} code={part.trim()} id={`${msgId}-${index}`} />;
                      }
                      return <CodeBlock key={index} language={lang} code={part.trim()} />;
                  }
              })}
          </div>
      );
  };

  return (
    <section id="chat" className="py-10 px-4 min-h-screen max-w-6xl mx-auto flex flex-col">
      <div className="bg-bgCard/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/60 flex flex-col h-[750px] relative">
        {showGames && <RelaxationGames onClose={() => setShowGames(false)} />}
        
        {/* Pro Header */}
        <div className="bg-bgInput/80 border-b border-white/5 p-4 flex justify-between items-center z-20">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent/20 rounded-2xl border border-accent/20">
                    <BrainCircuit className="w-6 h-6 text-accent animate-pulse" />
                </div>
                <div>
                    <h3 className="font-black text-white text-lg flex items-center gap-2">
                        SanjayBot PRO <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-accent uppercase tracking-widest font-bold">Optimized</span>
                    </h3>
                    <p className="text-[10px] text-gray-500 font-mono">NEURAL REASONING ACTIVE</p>
                </div>
            </div>
            <div className="flex bg-bgDark/60 p-1 rounded-2xl border border-white/5">
                <button onClick={() => setActiveMode('study')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeMode === 'study' ? 'bg-accent text-white' : 'text-gray-500'}`}>STUDY</button>
                <button onClick={() => setActiveMode('image')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeMode === 'image' ? 'bg-pink-500 text-white' : 'text-gray-500'}`}>CREATE</button>
                <button onClick={() => setActiveMode('chill')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeMode === 'chill' ? 'bg-green-500 text-white' : 'text-gray-500'}`}>CHILL</button>
            </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-bgInput/20 py-3 px-4 flex gap-3 overflow-x-auto no-scrollbar border-b border-white/5">
            {quickActions[activeMode].map((label, idx) => (
                 <button 
                    key={idx} 
                    onClick={() => handleSend(label)} 
                    className="whitespace-nowrap flex-shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2 rounded-full text-xs font-bold text-gray-300 transition-all hover:scale-105 active:scale-95"
                >
                    {label}
                </button>
            ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${msg.sender === 'bot' ? 'bg-bgInput border border-white/10' : 'bg-gradient-to-br from-accent to-purple-600 text-white'}`}>
                {msg.sender === 'bot' ? <Bot className="w-7 h-7 text-accent" /> : <User className="w-7 h-7" />}
              </div>
              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                <div className={`p-5 rounded-3xl shadow-xl backdrop-blur-sm text-sm md:text-[15px] leading-relaxed ${msg.sender === 'bot' ? 'bg-bgInput/90 border border-white/10 rounded-tl-none text-gray-200' : 'bg-gradient-to-r from-accent to-indigo-700 text-white rounded-tr-none'}`}>
                  {renderMessageText(msg.text, msg.id)}
                  {msg.type === 'game_suggestion' && (
                    <div className="mt-5"><button onClick={() => setShowGames(true)} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg w-full justify-center group"><Gamepad2 className="w-5 h-5 group-hover:rotate-12 transition-transform" /> OPEN RELAXATION ZONE</button></div>
                  )}
                </div>
                {msg.type === 'image' && msg.meta && (
                    <div className="rounded-3xl overflow-hidden border-2 border-white/10 mt-3 shadow-2xl group relative w-full aspect-video">
                        <img src={msg.meta.url} alt={msg.meta.alt} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <a href={msg.meta.url} target="_blank" className="bg-white text-black px-6 py-2 rounded-full font-bold flex items-center gap-2">View HD <ExternalLink className="w-4 h-4" /></a>
                        </div>
                    </div>
                )}
                <span className="text-[10px] text-gray-600 font-mono block pl-2">{msg.timestamp}</span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-bgInput border border-white/10 flex items-center justify-center">
                    <Loader2 className="w-7 h-7 text-accent animate-spin" />
                </div>
                <div className="bg-bgInput/50 border border-white/10 px-6 py-4 rounded-3xl rounded-tl-none flex flex-col gap-2">
                    <span className="text-xs text-gray-500 font-bold flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-yellow-400" /> THINKING...
                    </span>
                    <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 bg-accent rounded-full animate-bounce"></span>
                        <span className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce delay-100"></span>
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce delay-200"></span>
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 bg-bgInput/90 backdrop-blur-xl border-t border-white/5">
          <div className="relative flex gap-4 items-center max-w-4xl mx-auto">
            <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-gray-500">
                    <Zap className="w-5 h-5 group-focus-within:text-accent transition-colors" />
                </div>
                <input 
                    ref={inputRef}
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
                    placeholder="Describe your engineering problem..." 
                    className="w-full bg-bgDark border border-white/10 rounded-[1.5rem] pl-14 pr-6 py-5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-inner" 
                />
            </div>
            <button 
                onClick={() => handleSend()} 
                disabled={!input.trim()} 
                className="bg-accent hover:bg-accentLight text-white w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all disabled:opacity-40 shadow-xl shadow-accent/20 active:scale-95"
            >
                <Send className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatInterface;
