import React from 'react';
import { BookOpen, FileText, Image, Code2, Calendar, Smile, Briefcase, HeartHandshake } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    { icon: <BookOpen className="w-8 h-8 text-blue-400" />, title: "AU Expert", desc: "R2021/R2017 syllabus, exam patterns, CGPA calculator, all departments." },
    { icon: <FileText className="w-8 h-8 text-green-400" />, title: "Notes Generator", desc: "Instant detailed study notes on any topic with examples & diagrams." },
    { icon: <Image className="w-8 h-8 text-pink-400" />, title: "Flux Image Engine", desc: "Generate photorealistic diagrams, circuits, and visual study aids instantly." },
    { icon: <Code2 className="w-8 h-8 text-yellow-400" />, title: "Coding Help", desc: "DSA, Python, Java, C++ - placement prep & programming guidance." },
    { icon: <Calendar className="w-8 h-8 text-purple-400" />, title: "Study Planner", desc: "Custom study schedules based on your exam dates & subjects." },
    { icon: <Smile className="w-8 h-8 text-red-400" />, title: "Anime Buddy", desc: "Need a break? Let's discuss anime & get recommendations!" },
    { icon: <Briefcase className="w-8 h-8 text-orange-400" />, title: "Placement Prep", desc: "Interview tips, aptitude, resume help, company insights." },
    { icon: <HeartHandshake className="w-8 h-8 text-teal-400" />, title: "Mental Support", desc: "Stressed? I'm here to listen, motivate & help you relax." },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-bgCard/50 backdrop-blur-sm border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Superpowers Unlocked 🚀</h2>
          <p className="text-gray-400 text-lg">Everything an Anna University student needs to survive & thrive.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-bgDark p-6 rounded-2xl border border-white/5 hover:border-accent hover:-translate-y-2 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 group"
            >
              <div className="bg-white/5 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
