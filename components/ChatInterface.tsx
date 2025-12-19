import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Bot, User, Download, ExternalLink, Sparkles, BookOpen, Coffee, Image as ImageIcon, Zap, History, Clock, PlusCircle, X, MessageSquare, BarChart2, Cpu, GitBranch, Gamepad2, Mic, MicOff, Volume2, VolumeX, Brain } from 'lucide-react';
import { Message, UserContext, ChatSession } from '../types';
import { getBotResponse } from '../services/chatService';
import { jsPDF } from "jspdf";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import RelaxationGames from './RelaxationGames';
import { 
    startSpeechRecognition, 
    stopSpeechRecognition, 
    speakText, 
    stopSpeaking, 
    isSpeechRecognitionSupported, 
    isSpeechSynthesisSupported,
    isSpeaking
} from '../services/speechService';

interface ChatInterfaceProps {
    initialMessage?: string;
}

type ChatMode = 'study' | 'image' | 'chill';

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "வணக்கம்! (Vanakkam!) 🙏\n\nI'm **Murukku AI** 🍘 - நான் உங்க நண்பன்! (I'm your friend!)\n\n🎓 **படிப்பு தோழன்** (Study Buddy)\n🎨 **கலைஞன்** (Artist) - Diagrams & Images\n🍿 **நண்பன்** (Friend) - சொல்லுங்க!\n\n*சொல்லுங்க, எப்படி உதவ வேணும்?* (Tell me, how can I help?)",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userContext, setUserContext] = useState<UserContext>({ name: '', year: '', semester: '' });
  const [activeMode, setActiveMode] = useState<ChatMode>('study');
  const [showGames, setShowGames] = useState(false);
  
  // History State
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>(Date.now().toString());

  // Speech State
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingState, setIsSpeakingState] = useState(false);
  const [speechSupported, setSpeechSupported] = useState({ recognition: false, synthesis: false });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check speech support on mount
  useEffect(() => {
    setSpeechSupported({
      recognition: isSpeechRecognitionSupported(),
      synthesis: isSpeechSynthesisSupported()
    });
  }, []);

  const quickActions = {
      study: [
          "📚 Notes for Python", 
          "📝 Important 16 Marks: DBMS", 
          "📅 Make a Study Plan", 
          "🧠 Explain Quantum Physics"
      ],
      image: [
          "🖼️ Draw a Circuit Diagram", 
          "🎨 Cyberpunk City Wallpaper", 
          "🏎️ Ferrari Concept Sketch", 
          "🏭 Steam Engine Cut-away"
      ],
      chill: [
          "😂 Tell me a Engineering Joke", 
          "🎮 I'm stressed, let's play",
          "🎬 Suggest a Sci-Fi Movie", 
          "🏏 CSK vs RCB Stats"
      ]
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

  // Load History & Context on Mount
  useEffect(() => {
      // History
      const savedHistory = localStorage.getItem('murukku_history');
      if (savedHistory) {
          try {
              setHistory(JSON.parse(savedHistory));
          } catch (e) { console.error("Failed to load history", e); }
      }
      
      // Context (Name, Sem)
      const savedContext = localStorage.getItem('murukku_context');
      if (savedContext) {
          try {
              setUserContext(JSON.parse(savedContext));
          } catch (e) { console.error("Failed to load context", e); }
      }
  }, []);

  // Save Session Logic
  useEffect(() => {
      if (messages.length <= 1) return; // Don't save the initial welcome message only
      
      const timeoutId = setTimeout(() => {
          setHistory(prev => {
              const existingIndex = prev.findIndex(s => s.id === currentSessionId);
              const userFirstMsg = messages.find(m => m.sender === 'user');
              const title = userFirstMsg ? (userFirstMsg.text.substring(0, 30) + (userFirstMsg.text.length > 30 ? '...' : '')) : 'New Conversation';
              
              const newSession: ChatSession = {
                  id: currentSessionId,
                  title: title,
                  timestamp: new Date().toISOString(),
                  messages: messages
              };

              let newHistory;
              if (existingIndex >= 0) {
                  newHistory = [...prev];
                  newHistory[existingIndex] = newSession;
              } else {
                  newHistory = [newSession, ...prev];
              }
              
              // Sort by date new to old
              newHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
              
              localStorage.setItem('murukku_history', JSON.stringify(newHistory));
              return newHistory;
          });
      }, 1000); // Debounce save

      return () => clearTimeout(timeoutId);
  }, [messages, currentSessionId]);

  // Save Context Logic
  useEffect(() => {
      if (userContext.name || userContext.semester) {
          localStorage.setItem('murukku_context', JSON.stringify(userContext));
      }
  }, [userContext]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Call Bot Service
    const { message: response, updatedContext, modelUsed, modelName } = await getBotResponse(userMsg.text, userContext);
    
    // Update Context if the bot extracted new info (Name/Sem)
    if (updatedContext && (updatedContext.name || updatedContext.semester)) {
        setUserContext(prev => ({ ...prev, ...updatedContext }));
    }

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text || "I'm having trouble thinking right now.",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: response.type,
      meta: response.meta,
      groundingMetadata: response.groundingMetadata,
      modelUsed: modelUsed || response.modelUsed,
      modelName: modelName || response.modelName
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botMsg]);
  };

  const handleClear = () => {
    setMessages([]);
    setIsTyping(false);
  };

  const handleNewChat = () => {
      const welcomeMsg: Message = {
        id: Date.now().toString(),
        text: `Vanakkam ${userContext.name ? userContext.name : ''}! 👋 Starting a fresh chat. How can I help you now?`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([welcomeMsg]);
      setCurrentSessionId(Date.now().toString());
      setShowHistory(false);
      setIsTyping(false);
  };

  const handleLoadSession = (session: ChatSession) => {
      setMessages(session.messages);
      setCurrentSessionId(session.id);
      setShowHistory(false);
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
      e.stopPropagation();
      const newHistory = history.filter(h => h.id !== sessionId);
      setHistory(newHistory);
      localStorage.setItem('murukku_history', JSON.stringify(newHistory));
      if (sessionId === currentSessionId) {
          handleNewChat();
      }
  };

  const handleQuickAction = (msg: string) => {
    // If image mode, prepend "Generate an image of " if not present to help the AI
    if (activeMode === 'image' && !msg.toLowerCase().includes('draw') && !msg.toLowerCase().includes('generate')) {
        setInput(`Generate an image of ${msg}`);
    } else {
        setInput(msg);
    }
    inputRef.current?.focus();
  };

  // Speech Recognition Handler
  const handleVoiceInput = async () => {
    if (!speechSupported.recognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      stopSpeechRecognition();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    try {
      const transcript = await startSpeechRecognition({ language: 'en-US' });
      if (transcript) {
        setInput(prev => prev ? `${prev} ${transcript}` : transcript);
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
    } finally {
      setIsListening(false);
    }
  };

  // Text-to-Speech Handler
  const handleSpeak = async (text: string) => {
    if (!speechSupported.synthesis) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeakingState) {
      stopSpeaking();
      setIsSpeakingState(false);
      return;
    }

    // Clean text for speech (remove markdown, code blocks, etc.)
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Code block omitted.')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[•\-]/g, ',')
      .trim();

    setIsSpeakingState(true);
    try {
      await speakText(cleanText, { rate: 1.0, pitch: 1.0 });
    } catch (error) {
      console.error('Speech synthesis error:', error);
    } finally {
      setIsSpeakingState(false);
    }
  };

  const handleDownloadPdf = (content: string, title: string = 'Murukku AI Notes') => {
    try {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.setTextColor(249, 115, 22);
        doc.text("Murukku AI Study Notes", 10, 20);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 30);
        doc.setFontSize(12);
        doc.setTextColor(0);
        const plainText = content
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/#/g, '')
            .replace(/```[\s\S]*?```/g, '[Code/Diagram Block Omitted]') // Strip code blocks for simple text PDF
            .replace(/\[(.*?)\]\(.*?\)/g, '$1');
        const splitText = doc.splitTextToSize(plainText, 180);
        doc.text(splitText, 10, 40);
        doc.save(`${title.replace(/\s+/g, '_')}_Notes.pdf`);
    } catch (e) {
        console.error("PDF Generation failed", e);
        alert("Could not generate PDF. Please try again.");
    }
  };
  
  const renderMessageText = (text: string) => {
      // Split by code blocks: ```lang ... ```
      const parts = text.split(/```(\w*)\n?([\s\S]*?)```/g);

      return (
          <div className="space-y-2">
              {parts.map((part, index) => {
                  // The split regex has 2 capturing groups.
                  // For "text ```lang code``` text":
                  // index 0: text
                  // index 1: lang
                  // index 2: code
                  // index 3: text
                  
                  if (index % 3 === 0) {
                      // Normal Text
                      if (!part) return null;
                      let formatted = part
                        .replace(/\n/g, '<br />')
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-accentLight">$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/•/g, '<span class="text-accent mr-2">•</span>')
                        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-accent hover:underline flex items-center gap-1 inline-flex"><ExternalLink class="w-3 h-3"/>$1</a>');
                      return <span key={index} dangerouslySetInnerHTML={{ __html: formatted }} />;
                  } else if (index % 3 === 1) {
                      // Language Tag (skip, used in next block)
                      return null;
                  } else {
                      // Code Block (index % 3 === 2)
                      const lang = parts[index - 1] || 'text';
                      
                      // ALGORITHM VISUALIZATION
                      if (lang.toLowerCase() === 'algorithm') {
                          return (
                              <div key={index} className="my-4 rounded-xl overflow-hidden border border-cyan-500/30 bg-cyan-950/20 shadow-lg">
                                  <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border-b border-cyan-500/20">
                                      <Cpu className="w-4 h-4 text-cyan-400" />
                                      <span className="font-bold text-cyan-400 text-sm uppercase tracking-wider">Algorithm</span>
                                  </div>
                                  <div className="p-4 font-mono text-sm text-cyan-100 whitespace-pre-wrap">
                                      {part.trim()}
                                  </div>
                              </div>
                          );
                      }

                      // WORKFLOW / MIND MAP VISUALIZATION
                      if (lang.toLowerCase() === 'workflow' || lang.toLowerCase() === 'mermaid') {
                           return (
                              <div key={index} className="my-4 rounded-xl overflow-hidden border border-purple-500/30 bg-purple-950/20 shadow-lg">
                                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border-b border-purple-500/20">
                                      <GitBranch className="w-4 h-4 text-purple-400" />
                                      <span className="font-bold text-purple-400 text-sm uppercase tracking-wider">Workflow / Mind Map</span>
                                  </div>
                                  <div className="p-4 font-mono text-sm text-purple-100 whitespace-pre-wrap">
                                      {part.trim()}
                                  </div>
                              </div>
                          );
                      }

                      // CHART VISUALIZATION HANDLING
                      if (lang.toLowerCase() === 'chart') {
                          try {
                              const chartConfig = JSON.parse(part.trim());
                              const { type, data, xAxisKey, series, title } = chartConfig;

                              return (
                                  <div key={index} className="my-4 rounded-xl overflow-hidden border border-white/10 bg-[#12121a] shadow-lg p-4">
                                      <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                                          <BarChart2 className="w-5 h-5 text-accent" />
                                          <span className="font-bold text-white text-sm">{title || 'Data Visualization'}</span>
                                      </div>
                                      <div className="h-64 w-full">
                                          <ResponsiveContainer width="100%" height="100%">
                                              {type === 'line' ? (
                                                  <LineChart data={data}>
                                                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                                      <XAxis dataKey={xAxisKey} stroke="#888" tick={{fontSize: 12}} />
                                                      <YAxis stroke="#888" tick={{fontSize: 12}} />
                                                      <Tooltip 
                                                        contentStyle={{ backgroundColor: '#1a1a25', border: '1px solid #333', borderRadius: '8px' }}
                                                        itemStyle={{ color: '#fff' }}
                                                      />
                                                      <Legend />
                                                      {series.map((s: any, i: number) => (
                                                          <Line key={i} type="monotone" dataKey={s.dataKey} stroke={s.color} name={s.name} strokeWidth={2} activeDot={{ r: 8 }} />
                                                      ))}
                                                  </LineChart>
                                              ) : (
                                                  <BarChart data={data}>
                                                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                                      <XAxis dataKey={xAxisKey} stroke="#888" tick={{fontSize: 12}} />
                                                      <YAxis stroke="#888" tick={{fontSize: 12}} />
                                                      <Tooltip 
                                                        contentStyle={{ backgroundColor: '#1a1a25', border: '1px solid #333', borderRadius: '8px' }}
                                                        itemStyle={{ color: '#fff' }}
                                                        cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                                                      />
                                                      <Legend />
                                                      {series.map((s: any, i: number) => (
                                                          <Bar key={i} dataKey={s.dataKey} fill={s.color} name={s.name} radius={[4, 4, 0, 0]} />
                                                      ))}
                                                  </BarChart>
                                              )}
                                          </ResponsiveContainer>
                                      </div>
                                  </div>
                              );
                          } catch (e) {
                              console.error("Failed to render chart", e);
                              return (
                                  <div key={index} className="p-2 border border-red-500/50 rounded text-red-400 text-xs">
                                      Error loading visualization. Raw data: {part}
                                  </div>
                              );
                          }
                      }

                      return (
                          <div key={index} className="my-4 rounded-lg overflow-hidden border border-white/10 bg-[#1e1e1e] shadow-lg">
                              <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                                  <span className="text-xs font-mono text-gray-400 uppercase">{lang || 'Code'}</span>
                                  <div className="flex gap-1.5">
                                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                                  </div>
                              </div>
                              <div className="p-4 overflow-x-auto custom-scrollbar">
                                <pre className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre">
                                    <code>{part.trim()}</code>
                                </pre>
                              </div>
                          </div>
                      );
                  }
              })}
          </div>
      );
  };

  return (
    <section id="chat" className="py-20 px-4 min-h-screen max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">
            Murukku AI 🍘
        </h2>
        <p className="text-gray-400 text-lg">நான் உங்க <span className="text-orange-400 font-bold">Tutor</span>, <span className="text-yellow-400 font-bold">Artist</span> & <span className="text-orange-300 font-bold">நண்பன்</span>.</p>
      </div>

      {/* Main Chat Container */}
      <div className="bg-bgCard/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 flex flex-col h-[750px] relative">
        
        {/* Game Overlay */}
        {showGames && <RelaxationGames onClose={() => setShowGames(false)} />}

        {/* Top Bar: Controls */}
        <div className="bg-bgInput/50 border-b border-white/5 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-20 relative">
            
            {/* Left: History & New Chat */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors"
                    title="History"
                >
                    {showHistory ? <X className="w-5 h-5" /> : <History className="w-5 h-5" />}
                </button>
                <button 
                    onClick={handleNewChat}
                    className="flex items-center gap-2 px-3 py-2 bg-accent/20 hover:bg-accent/30 text-accent hover:text-white rounded-lg text-sm font-bold transition-all border border-accent/20"
                >
                    <PlusCircle className="w-4 h-4" /> New Chat
                </button>
            </div>

            {/* Center: Mode Switcher */}
            <div className="flex bg-bgDark/50 p-1 rounded-xl border border-white/5">
                <button 
                    onClick={() => setActiveMode('study')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeMode === 'study' ? 'bg-accent text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <BookOpen className="w-4 h-4" /> Study
                </button>
                <button 
                    onClick={() => setActiveMode('image')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeMode === 'image' ? 'bg-pink-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <ImageIcon className="w-4 h-4" /> Create
                </button>
                <button 
                    onClick={() => setActiveMode('chill')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeMode === 'chill' ? 'bg-green-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <Coffee className="w-4 h-4" /> Chill
                </button>
            </div>
            
            <button onClick={handleClear} className="hidden sm:flex text-xs text-gray-500 hover:text-red-400 items-center gap-1 transition-colors px-3 py-1 rounded-full hover:bg-white/5">
                <Trash2 className="w-3 h-3" /> Clear
            </button>
        </div>

        {/* History Sidebar */}
        <div className={`absolute left-0 top-16 bottom-0 w-64 bg-bgDark/95 backdrop-blur-xl border-r border-white/10 z-30 transition-transform duration-300 ease-in-out transform ${showHistory ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-4 border-b border-white/10">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <History className="w-4 h-4 text-accent" /> Chat History
                </h3>
            </div>
            <div className="overflow-y-auto h-full p-2 space-y-1 pb-20">
                {history.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm mt-10 p-4">
                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        No history yet. Start chatting!
                    </div>
                ) : (
                    history.map(session => (
                        <div 
                            key={session.id}
                            onClick={() => handleLoadSession(session)}
                            className={`group p-3 rounded-xl cursor-pointer transition-all border border-transparent ${session.id === currentSessionId ? 'bg-accent/20 border-accent/20' : 'hover:bg-white/5 hover:border-white/5'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="text-sm font-medium text-gray-200 truncate w-40">
                                    {session.title}
                                </div>
                                <button 
                                    onClick={(e) => handleDeleteSession(e, session.id)}
                                    className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(session.timestamp).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Quick Actions Bar (Dynamic) */}
        <div className="bg-bgInput/30 py-3 px-4 flex gap-3 overflow-x-auto no-scrollbar border-b border-white/5">
            {quickActions[activeMode].map((label, idx) => (
                 <button
                    key={idx}
                    onClick={() => handleQuickAction(label)}
                    className="whitespace-nowrap flex-shrink-0 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-accent/50 px-4 py-1.5 rounded-full text-xs font-medium transition-all text-gray-300 hover:text-white hover:scale-105"
                >
                    {label}
                </button>
            ))}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''} animate-fade-in-up`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${msg.sender === 'bot' ? 'bg-gradient-to-br from-gray-800 to-black border border-white/10' : 'bg-gradient-to-br from-accent to-purple-600 text-white'}`}>
                {msg.sender === 'bot' ? <Bot className="w-6 h-6 text-accent" /> : <User className="w-6 h-6" />}
              </div>
              
              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                <div className={`p-4 sm:p-5 rounded-2xl shadow-xl backdrop-blur-sm text-sm md:text-base leading-relaxed ${
                  msg.sender === 'bot' 
                    ? 'bg-bgInput/80 border border-white/10 rounded-tl-none text-gray-100' 
                    : 'bg-gradient-to-r from-accent to-indigo-600 text-white rounded-tr-none font-medium'
                }`}>
                  {renderMessageText(msg.text)}
                  
                  {/* Game Suggestion Interaction */}
                  {msg.type === 'game_suggestion' && (
                    <div className="mt-4">
                        <button 
                            onClick={() => setShowGames(true)}
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-green-500/20 w-full justify-center"
                        >
                            <Gamepad2 className="w-5 h-5" /> Open Relaxation Zone
                        </button>
                    </div>
                  )}
                </div>

                {/* Rich Content: Images with Download */}
                {msg.type === 'image' && msg.meta && (
                    <div className="rounded-xl overflow-hidden border-2 border-white/10 mt-2 shadow-2xl group relative transition-all hover:border-accent/50">
                        <img 
                            src={msg.meta.imageUrl || msg.meta.url} 
                            alt={msg.meta.imagePrompt || msg.meta.alt} 
                            className="w-full h-auto object-cover max-h-80 transition-transform duration-500 ease-in-out group-hover:scale-105" 
                            loading="lazy" 
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-white/80 font-mono truncate max-w-[200px]">{msg.meta.imagePrompt || msg.meta.alt}</span>
                              {msg.meta.imageModel && (
                                <span className="text-[9px] text-accent/80 font-semibold">{msg.meta.imageModel}</span>
                              )}
                            </div>
                            <a 
                                href={msg.meta.imageUrl || msg.meta.url} 
                                download="murukku_ai_image.png"
                                target="_blank" 
                                className="flex items-center gap-2 bg-white/20 hover:bg-white/40 px-3 py-1.5 rounded-full text-white backdrop-blur-md transition-colors text-xs font-bold"
                            >
                                <Download className="w-3 h-3" /> Download
                            </a>
                        </div>
                    </div>
                )}
                
                {/* Rich Content: Notes with Conditional Download */}
                {/* Only show download PDF for explicit academic notes, NOT for friendly chats */}
                {msg.type === 'notes' && (
                    <div className="flex gap-2 mt-1">
                         <button 
                            onClick={() => handleDownloadPdf(msg.text)}
                            className="text-xs flex items-center gap-1 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-full transition-all font-bold"
                         >
                            <Download className="w-3 h-3" /> Download PDF Notes
                         </button>
                    </div>
                )}

                {/* Grounding Sources */}
                {msg.groundingMetadata?.web && msg.groundingMetadata.web.length > 0 && (
                  <div className="mt-2 text-xs bg-black/40 p-3 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3 h-3 text-yellow-400" />
                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Sources verified</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {msg.groundingMetadata.web.map((source, idx) => (
                        <a 
                          key={idx} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 bg-white/5 hover:bg-white/10 hover:text-white text-gray-400 px-2 py-1 rounded transition-colors border border-white/5 hover:border-white/20"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {source.title.length > 15 ? source.title.substring(0, 15) + '...' : source.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                <span className="text-[10px] text-gray-600 font-mono block pl-1 flex items-center gap-2">
                  {msg.timestamp}
                  {/* Model Badge for bot messages */}
                  {msg.sender === 'bot' && msg.modelName && (
                    <span className="inline-flex items-center gap-1 bg-accent/10 text-accent px-2 py-0.5 rounded-full text-[9px] font-semibold">
                      <Brain className="w-3 h-3" />
                      {msg.modelName}
                    </span>
                  )}
                  {/* TTS Button for bot messages */}
                  {msg.sender === 'bot' && speechSupported.synthesis && (
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      className="p-1 hover:bg-white/10 rounded-full transition-colors"
                      title={isSpeakingState ? "Stop speaking" : "Read aloud"}
                    >
                      {isSpeakingState ? (
                        <VolumeX className="w-3 h-3 text-red-400" />
                      ) : (
                        <Volume2 className="w-3 h-3 text-gray-500 hover:text-accent" />
                      )}
                    </button>
                  )}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-bgInput border border-white/10 flex items-center justify-center">
                <Bot className="w-6 h-6 text-accent" />
              </div>
              <div className="bg-bgInput/50 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center h-10">
                <span className="w-2 h-2 bg-accent rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-bgInput/80 backdrop-blur-md border-t border-white/5">
          <div className="relative flex gap-3 items-center max-w-4xl mx-auto">
            
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                {activeMode === 'image' ? <Sparkles className="w-5 h-5 text-pink-500 animate-pulse" /> : 
                 activeMode === 'chill' ? <Coffee className="w-5 h-5 text-green-500" /> : 
                 <Zap className="w-5 h-5 text-accent" />}
            </div>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={
                  isListening ? "🎤 Listening... Speak now!" :
                  activeMode === 'image' ? "Describe the image you want (e.g. 'Futuristic Chennai')..." :
                  activeMode === 'chill' ? "Say something fun..." :
                  "Ask about Syllabus, Notes, or Concepts..."
              }
              className={`flex-1 bg-bgDark/50 border rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:ring-1 transition-all placeholder-gray-500 shadow-inner ${
                isListening 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500 animate-pulse' 
                  : 'border-white/10 focus:border-accent focus:ring-accent'
              }`}
            />

            {/* Voice Input Button */}
            {speechSupported.recognition && (
              <button
                onClick={handleVoiceInput}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all transform hover:scale-105 shadow-lg ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/25' 
                    : 'bg-white/10 hover:bg-white/20 shadow-white/5'
                }`}
                title={isListening ? "Stop listening" : "Voice input"}
              >
                {isListening ? (
                  <MicOff className="w-6 h-6 text-white" />
                ) : (
                  <Mic className="w-6 h-6 text-gray-400" />
                )}
              </button>
            )}
            
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-gradient-to-r from-accent to-purple-600 hover:from-accentLight hover:to-purple-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/25"
            >
              <Send className="w-6 h-6 ml-0.5" />
            </button>
          </div>
          <div className="text-center mt-2">
             <p className="text-[10px] text-gray-600">
                Mode: <span className="uppercase font-bold text-gray-500">{activeMode}</span> • AI can make mistakes. Check important info.
             </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatInterface;