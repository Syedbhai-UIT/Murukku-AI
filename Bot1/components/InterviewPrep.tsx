
import React, { useState } from 'react';
import { interviewModules } from '../services/knowledgeBase';
import { ChevronDown, ChevronUp, MessageCircle, Briefcase, Code, Database, Users, Box, Cpu } from 'lucide-react';

interface InterviewPrepProps {
  onStartMockInterview: (topic: string) => void;
}

const InterviewPrep: React.FC<InterviewPrepProps> = ({ onStartMockInterview }) => {
  const [activeTab, setActiveTab] = useState<keyof typeof interviewModules>('hr');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const icons: Record<string, React.ReactNode> = {
      Users: <Users className="w-5 h-5" />,
      Code: <Code className="w-5 h-5" />,
      Database: <Database className="w-5 h-5" />,
      Box: <Box className="w-5 h-5" />
  };

  const toggleAnswer = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="interview" className="py-20 px-4 max-w-6xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full mb-4">
            <Briefcase className="w-4 h-4 text-accent" />
            <span className="text-sm font-bold text-accent">Placement Ready</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black mb-4">Ace Your Interview 💼</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
            Curated questions, expert answers, and AI simulations to get you job-ready.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar / Tabs */}
        <div className="md:col-span-1 space-y-2">
            {Object.entries(interviewModules).map(([key, module]) => (
                <button
                    key={key}
                    onClick={() => { setActiveTab(key as any); setExpandedIndex(null); }}
                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all font-bold text-left ${
                        activeTab === key 
                        ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                        : 'bg-bgCard hover:bg-white/5 text-gray-400 hover:text-white border border-transparent hover:border-white/10'
                    }`}
                >
                    {icons[module.icon]}
                    {module.title}
                </button>
            ))}
            
            <div className="mt-8 p-4 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-xl">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-pink-400" /> AI Simulator
                </h4>
                <p className="text-xs text-gray-400 mb-4">
                    Practice with SanjayBot acting as a strict interviewer.
                </p>
                <button 
                    onClick={() => onStartMockInterview(interviewModules[activeTab].title)}
                    className="w-full py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                    <MessageCircle className="w-4 h-4" /> Start Mock Interview
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
            <div className="bg-bgCard border border-white/5 rounded-2xl p-6 min-h-[500px]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        {icons[interviewModules[activeTab].icon]}
                        {interviewModules[activeTab].title} Questions
                    </h3>
                    <span className="text-xs font-mono text-gray-500 bg-black/20 px-2 py-1 rounded">
                        {interviewModules[activeTab].items.length} Questions
                    </span>
                </div>

                <div className="space-y-4">
                    {interviewModules[activeTab].items.map((item, idx) => (
                        <div 
                            key={idx}
                            className={`border rounded-xl transition-all duration-300 overflow-hidden ${
                                expandedIndex === idx 
                                ? 'bg-bgInput border-accent/30' 
                                : 'bg-bgDark/50 border-white/5 hover:border-white/10'
                            }`}
                        >
                            <button
                                onClick={() => toggleAnswer(idx)}
                                className="w-full flex justify-between items-center p-5 text-left"
                            >
                                <span className={`font-semibold text-lg ${expandedIndex === idx ? 'text-accent' : 'text-gray-200'}`}>
                                    {item.q}
                                </span>
                                {expandedIndex === idx ? <ChevronUp className="text-accent" /> : <ChevronDown className="text-gray-500" />}
                            </button>
                            
                            {expandedIndex === idx && (
                                <div className="px-5 pb-5 pt-0 animate-fade-in">
                                    <div className="h-px w-full bg-white/5 mb-4"></div>
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                                        <div dangerouslySetInnerHTML={{ __html: item.a.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default InterviewPrep;
