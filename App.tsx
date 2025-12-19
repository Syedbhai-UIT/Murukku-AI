import React, { useState, useRef, useEffect } from 'react';
import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import SyllabusBrowser from './components/SyllabusBrowser';
import InterviewPrep from './components/InterviewPrep';
import ChatInterface from './components/ChatInterface';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [chatInitialMessage, setChatInitialMessage] = useState('');
  
  const featuresRef = useRef<HTMLDivElement>(null);
  const syllabusRef = useRef<HTMLDivElement>(null);
  const interviewRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  // Handle scrolling when activeSection changes
  useEffect(() => {
    const opts: ScrollIntoViewOptions = { behavior: 'smooth' };
    
    if (activeSection === 'home') homeRef.current?.scrollIntoView(opts);
    if (activeSection === 'features') featuresRef.current?.scrollIntoView(opts);
    if (activeSection === 'syllabus') syllabusRef.current?.scrollIntoView(opts);
    if (activeSection === 'chat') chatRef.current?.scrollIntoView(opts);
    
    if (activeSection === 'interview') {
        // Timeout ensures the element is rendered before scrolling
        setTimeout(() => {
            interviewRef.current?.scrollIntoView(opts);
        }, 100);
    }
  }, [activeSection]);

  const handleAskAiFromSyllabus = (message: string) => {
    setChatInitialMessage(message);
    handleNavigate('chat');
  };

  const handleStartMockInterview = (topic: string) => {
      setChatInitialMessage(`Start a mock interview for a Fresh Graduate role focusing on ${topic}. Act as a strict interviewer.`);
      handleNavigate('chat');
  };

  return (
    <div className="relative min-h-screen text-white">
      <ParticleBackground />
      <Navbar onNavigate={handleNavigate} activeSection={activeSection} />
      
      <main className="relative z-10">
        <div ref={homeRef}>
          <Hero 
            onStartChat={() => handleNavigate('chat')} 
            onViewFeatures={() => handleNavigate('features')} 
          />
        </div>
        
        <div ref={featuresRef}>
          <Features />
        </div>

        <div ref={chatRef} className="border-t border-white/5">
          <ChatInterface initialMessage={chatInitialMessage} />
        </div>

        <div ref={syllabusRef} className="bg-bgDark/50 border-t border-white/5">
           <SyllabusBrowser onAskAi={handleAskAiFromSyllabus} />
        </div>
        
        {/* Conditional Rendering: Only show Interview Prep when 'Placement' is active */}
        {activeSection === 'interview' && (
            <div ref={interviewRef} className="bg-bgDark border-t border-white/5 min-h-[50vh]">
                <InterviewPrep onStartMockInterview={handleStartMockInterview} />
            </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;