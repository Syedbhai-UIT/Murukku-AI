
import React, { useState, useRef, useEffect, Suspense } from 'react';
import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import SyllabusBrowser from './components/SyllabusBrowser';
import InterviewPrep from './components/InterviewPrep';
import ChatInterface from './components/ChatInterface';
import Footer from './components/Footer';
import Onboarding from './components/Onboarding';
import { UserContext } from './types';
import { Key, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [chatInitialMessage, setChatInitialMessage] = useState('');
  const [isKeySelected, setIsKeySelected] = useState<boolean | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const [userContext, setUserContext] = useState<UserContext>(() => {
    try {
      const saved = localStorage.getItem('sanjaybot_context');
      return saved ? JSON.parse(saved) : {
        learningStyle: 'visual',
        careerGoal: 'placement'
      };
    } catch (e) {
      return { learningStyle: 'visual', careerGoal: 'placement' };
    }
  });
  
  const featuresRef = useRef<HTMLDivElement>(null);
  const syllabusRef = useRef<HTMLDivElement>(null);
  const interviewRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkKey = async () => {
      try {
        // @ts-ignore
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
          // @ts-ignore
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setIsKeySelected(hasKey);
        } else {
          // Fallback for environments where aistudio might not be present
          setIsKeySelected(true);
        }
      } catch (e) {
        console.warn("AI Studio key check failed, defaulting to enabled", e);
        setIsKeySelected(true);
      } finally {
        setIsInitializing(false);
      }
    };
    
    // Slight delay to ensure environment is ready
    const timer = setTimeout(checkKey, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenKeySelector = async () => {
    try {
      // @ts-ignore
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
      setIsKeySelected(true); 
    } catch (e) {
      console.error("Failed to open key selector", e);
      setIsKeySelected(true);
    }
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  const handleUpdateContext = (newCtx: UserContext) => {
    setUserContext(newCtx);
    localStorage.setItem('sanjaybot_context', JSON.stringify(newCtx));
  };

  useEffect(() => {
    if (isInitializing) return;
    
    const opts: ScrollIntoViewOptions = { behavior: 'smooth' };
    if (activeSection === 'home') homeRef.current?.scrollIntoView(opts);
    if (activeSection === 'features') featuresRef.current?.scrollIntoView(opts);
    if (activeSection === 'syllabus') syllabusRef.current?.scrollIntoView(opts);
    if (activeSection === 'chat') chatRef.current?.scrollIntoView(opts);
    
    if (activeSection === 'interview') {
        setTimeout(() => {
            interviewRef.current?.scrollIntoView(opts);
        }, 100);
    }
  }, [activeSection, isInitializing]);

  const handleAskAiFromSyllabus = (message: string) => {
    setChatInitialMessage(message);
    handleNavigate('chat');
  };

  const handleStartMockInterview = (topic: string) => {
      setChatInitialMessage(`Start a mock interview for a Fresh Graduate role focusing on ${topic}. Act as a strict interviewer.`);
      handleNavigate('chat');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-bgDark flex flex-col items-center justify-center text-white p-4">
        <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
        <p className="text-gray-400 font-medium animate-pulse">Initializing SanjayBot...</p>
      </div>
    );
  }

  if (isKeySelected === false) {
    return (
      <div className="min-h-screen bg-bgDark flex items-center justify-center p-4">
        <div className="bg-bgCard border border-white/10 p-8 rounded-2xl max-w-md w-full text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto text-accent">
            <Key className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-white">API Key Required</h1>
          <p className="text-gray-400">
            SanjayBot uses advanced Gemini models. Please select your paid API key to continue.
          </p>
          <div className="text-xs text-gray-500 bg-black/30 p-3 rounded-lg border border-white/5">
            Note: Your project must have billing enabled for the Gemini API.
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              className="text-accent hover:underline block mt-1 font-bold"
            >
              Learn about billing →
            </a>
          </div>
          <button 
            onClick={handleOpenKeySelector}
            className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-accent/20 active:scale-95"
          >
            Select API Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white bg-bgDark">
      <ParticleBackground />
      <Navbar onNavigate={handleNavigate} activeSection={activeSection} />
      
      <main className="relative z-10 pt-16">
        <section ref={homeRef}>
          <Hero 
            onStartChat={() => handleNavigate('chat')} 
            onViewFeatures={() => handleNavigate('features')} 
          />
        </section>
        
        <section ref={featuresRef}>
          <Features />
        </section>

        <section ref={chatRef} className="border-t border-white/5 bg-bgDark/30">
          <div className="max-w-6xl mx-auto px-4 pt-10">
             <Onboarding context={userContext} onUpdate={handleUpdateContext} />
          </div>
          <ChatInterface initialMessage={chatInitialMessage} externalContext={userContext} />
        </section>

        <section ref={syllabusRef} className="bg-bgDark/50 border-t border-white/5">
           <SyllabusBrowser onAskAi={handleAskAiFromSyllabus} />
        </section>
        
        {activeSection === 'interview' && (
            <section ref={interviewRef} className="bg-bgDark border-t border-white/5 min-h-[50vh]">
                <InterviewPrep onStartMockInterview={handleStartMockInterview} />
            </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
