import React from 'react';
import { MessageCircle, Sparkles, GraduationCap, Zap, Palette, Heart } from 'lucide-react';

interface HeroProps {
  onStartChat: () => void;
  onViewFeatures: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartChat, onViewFeatures }) => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-4 relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-center z-10 animate-fade-in-up">
        
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-gray-300 tracking-wide uppercase">AI Powered • R2021 Ready</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
          Your Personal <br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">Tutor, Artist & Friend</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 font-medium mb-8 max-w-3xl mx-auto">
          Meet <span className="text-orange-400 font-bold">Murukku AI 🍘</span>. I help Anna University students ace exams, generate detailed diagrams, and stay motivated.
        </p>
        
        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm font-semibold text-gray-400">
            <div className="flex items-center gap-2 bg-bgCard border border-white/10 px-4 py-2 rounded-lg">
                <GraduationCap className="w-4 h-4 text-accent" /> Education Bot
            </div>
            <div className="flex items-center gap-2 bg-bgCard border border-white/10 px-4 py-2 rounded-lg">
                <Palette className="w-4 h-4 text-pink-500" /> Image Generator
            </div>
            <div className="flex items-center gap-2 bg-bgCard border border-white/10 px-4 py-2 rounded-lg">
                <Heart className="w-4 h-4 text-red-500" /> Friendly Chat
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button 
            onClick={onStartChat}
            className="group flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-bgDark hover:from-orange-600 hover:to-yellow-600 px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-orange-500/20 transition-all transform hover:-translate-y-1"
          >
            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Chat with Murukku 🍘
          </button>
          <button 
            onClick={onViewFeatures}
            className="flex items-center gap-2 bg-transparent border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            <Sparkles className="w-5 h-5 text-yellow-400" />
            Explore Features
          </button>
        </div>
      </div>
      
      {/* Decorative gradient blobs */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px] -z-10 animate-pulse-slow delay-1000"></div>
    </section>
  );
};

export default Hero;
