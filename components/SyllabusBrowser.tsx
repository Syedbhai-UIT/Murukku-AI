import React, { useState, useEffect } from 'react';
import { departmentCatalog, subjectDatabase } from '../services/knowledgeBase';
import { Book, ChevronRight, GraduationCap, FileText, ExternalLink, MessageCircle, X, Zap, Shield, Cpu, Brain } from 'lucide-react';

interface SyllabusBrowserProps {
  onAskAi: (query: string) => void;
}

const SyllabusBrowser: React.FC<SyllabusBrowserProps> = ({ onAskAi }) => {
  const [activeSem, setActiveSem] = useState('3'); // Default to Sem 3 where dept differences start
  const [selectedDept, setSelectedDept] = useState('CSE');
  const [selectedSubject, setSelectedSubject] = useState<{ code: string; title: string } | null>(null);

  // Parse subject string "CODE - Title"
  const getSubjectDetails = (subjectStr: string) => {
    const parts = subjectStr.split(' - ');
    const code = parts[0]?.trim();
    const title = parts.slice(1).join(' - ').trim();
    return { code, title };
  };

  // Get rich details from database if available
  const getRichDetails = (code: string) => {
    // Try exact match or case-insensitive match
    const key = Object.keys(subjectDatabase).find(k => k.toLowerCase() === code.toLowerCase());
    return key ? subjectDatabase[key] : null;
  };

  const deptData = departmentCatalog[selectedDept];
  const currentSemData = deptData[activeSem] || deptData['1']; // Fallback

  const handleSubjectClick = (subjectStr: string) => {
    setSelectedSubject(getSubjectDetails(subjectStr));
  };

  const closeModal = () => setSelectedSubject(null);

  const richDetails = selectedSubject ? getRichDetails(selectedSubject.code) : null;

  // Helper to get icon for Dept
  const getDeptIcon = () => {
      switch(selectedDept) {
          case 'EEE': return <Zap className="w-5 h-5 text-yellow-400" />;
          case 'ECE': return <Cpu className="w-5 h-5 text-blue-400" />;
          case 'CYBER': return <Shield className="w-5 h-5 text-green-400" />;
          case 'AIDS': return <Brain className="w-5 h-5 text-pink-400" />;
          default: return <GraduationCap className="w-5 h-5 text-accent" />;
      }
  };

  return (
    <section id="syllabus" className="py-20 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Syllabus Explorer 🧭</h2>
        <p className="text-gray-400">Navigate your engineering journey, semester by semester.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
        {/* Department Selector */}
        <div className="relative group z-20">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-200"></div>
          <select 
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="relative bg-bgInput text-white text-lg font-medium py-3 px-6 pl-12 rounded-lg border border-white/10 outline-none focus:border-accent appearance-none cursor-pointer w-72"
          >
            <option value="CSE">CSE - Computer Science</option>
            <option value="ECE">ECE - Electronics & Comm</option>
            <option value="EEE">EEE - Electrical & Electronics</option>
            <option value="AIDS">AIDS - AI & Data Science</option>
            <option value="CYBER">Cyber Security</option>
          </select>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            {getDeptIcon()}
          </div>
        </div>

        {/* Semester Tabs */}
        <div className="flex flex-wrap justify-center gap-2 bg-bgInput p-2 rounded-xl border border-white/5">
          {Object.keys(deptData).map((sem) => (
            <button
              key={sem}
              onClick={() => setActiveSem(sem)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeSem === sem 
                  ? 'bg-accent text-white shadow-lg shadow-accent/25' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Sem {sem}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Semester Overview Card */}
        <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-bgCard to-bgInput p-8 rounded-2xl border border-white/10 sticky top-24 h-fit">
                <div className="text-accent font-bold text-lg mb-2">SEMESTER {currentSemData.year * 2 - (parseInt(activeSem) % 2 === 0 ? 0 : 1)}</div>
                <h3 className="text-3xl font-bold text-white mb-4">{currentSemData.title}</h3>
                <div className="space-y-4">
                    <div className="bg-white/5 p-4 rounded-xl">
                        <span className="text-gray-400 text-sm uppercase tracking-wider font-semibold">Focus Area</span>
                        <p className="text-white text-lg font-medium mt-1">{currentSemData.focus}</p>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                        <Book className="w-4 h-4" />
                        <span>{currentSemData.subjects.length} Subjects</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Subjects List */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentSemData.subjects.map((sub, idx) => {
                const { code, title } = getSubjectDetails(sub);
                return (
                    <div 
                        key={idx}
                        onClick={() => handleSubjectClick(sub)}
                        className="group bg-bgCard hover:bg-white/5 border border-white/5 hover:border-accent/50 p-6 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="w-5 h-5 text-accent" />
                        </div>
                        <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full mb-3">
                            {code}
                        </span>
                        <h4 className="text-lg font-bold text-white leading-tight group-hover:text-accentLight transition-colors">
                            {title}
                        </h4>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Subject Detail Modal */}
      {selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-bgCard w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-bgInput flex justify-between items-start">
                <div>
                    <span className="text-accent font-bold text-sm tracking-widest">{selectedSubject.code}</span>
                    <h3 className="text-2xl font-bold text-white mt-1">{selectedSubject.title}</h3>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-6 h-6 text-gray-400" />
                </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto">
                {richDetails ? (
                    <div className="space-y-6">
                        <div>
                            <h4 className="flex items-center gap-2 text-lg font-bold text-white mb-3">
                                <FileText className="w-5 h-5 text-green-400" /> Key Topics
                            </h4>
                            <ul className="space-y-2">
                                {richDetails.bullets.map((bullet, i) => (
                                    <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                                        <span className="text-accent mt-1">•</span>
                                        {bullet}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {richDetails.links.length > 0 && (
                             <div>
                                <h4 className="flex items-center gap-2 text-lg font-bold text-white mb-3">
                                    <ExternalLink className="w-5 h-5 text-blue-400" /> Resources
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {richDetails.links.map((link, i) => (
                                        <a 
                                            key={i} 
                                            href={link.url} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-accentLight hover:text-white transition-colors flex items-center gap-2"
                                        >
                                            {link.label} <ExternalLink className="w-3 h-3" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Book className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-gray-400">Detailed topics for this subject are being updated.</p>
                        <p className="text-sm text-gray-500 mt-2">You can still ask the AI for notes!</p>
                    </div>
                )}
            </div>

            {/* Footer / Actions */}
            <div className="p-6 border-t border-white/10 bg-bgInput flex flex-col sm:flex-row gap-4 justify-end">
                <button 
                    onClick={() => {
                        // Trigger image generation intent
                        onAskAi(`Generate a detailed diagram for ${selectedSubject.title} related to ${richDetails?.bullets[0] || 'engineering concepts'}`);
                        closeModal();
                    }}
                    className="flex items-center gap-2 bg-bgDark hover:bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl font-bold transition-all"
                >
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Visualize Concept
                </button>
                <button 
                    onClick={() => {
                        onAskAi(`Give me detailed notes and key points for ${selectedSubject.code} - ${selectedSubject.title}`);
                        closeModal();
                    }}
                    className="flex items-center gap-2 bg-accent hover:bg-accentLight text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-accent/20"
                >
                    <MessageCircle className="w-5 h-5" />
                    Ask AI Tutor
                </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SyllabusBrowser;
