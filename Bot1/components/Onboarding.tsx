
import React, { useState, useEffect } from 'react';
import { UserContext } from '../types';
import { Save, UserCircle, Target, BookOpen } from 'lucide-react';

interface OnboardingProps {
  context: UserContext;
  onUpdate: (ctx: UserContext) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ context, onUpdate }) => {
  const [formData, setFormData] = useState<UserContext>(context);
  const [isExpanded, setIsExpanded] = useState(!context.name);

  useEffect(() => {
    setFormData(context);
  }, [context]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onUpdate(formData);
    setIsExpanded(false);
  };

  const isComplete = !!(formData.name && formData.semester && formData.department);
  const displayLearningStyle = (formData.learningStyle || 'visual').replace('_', ' ');

  if (!isExpanded && isComplete) {
      return (
          <div className="mb-4 p-4 bg-bgInput/30 border border-white/10 rounded-xl flex justify-between items-center cursor-pointer hover:bg-bgInput/50 transition-colors" onClick={() => setIsExpanded(true)}>
              <div className="flex items-center gap-3">
                  <div className="bg-accent/20 p-2 rounded-full text-accent">
                      <UserCircle className="w-5 h-5" />
                  </div>
                  <div>
                      <h3 className="font-bold text-white text-sm">Profile: {formData.name}</h3>
                      <p className="text-xs text-gray-400">{formData.department} • Sem {formData.semester} • {displayLearningStyle}</p>
                  </div>
              </div>
              <button className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded text-gray-300">Edit Profile</button>
          </div>
      )
  }

  return (
    <div className={`mb-6 p-6 rounded-2xl border transition-all duration-300 bg-gradient-to-br from-bgInput to-bgCard border-accent/50 shadow-lg shadow-accent/10`}>
      <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            {isComplete ? 'Update Your Profile' : 'Setup Your AI Mentor'}
          </h3>
          <p className="text-sm text-gray-400">
            Customize SanjayBot based on your department and career goals.
          </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
                <label className="text-xs text-gray-500 uppercase font-bold">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full bg-bgDark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                />
            </div>
            <div className="space-y-1">
                <label className="text-xs text-gray-500 uppercase font-bold">Department</label>
                <select
                    name="department"
                    value={formData.department || ''}
                    onChange={handleChange}
                    className="w-full bg-bgDark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                >
                    <option value="">Select Dept</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="AIDS">AI & DS</option>
                    <option value="MECH">Mechanical</option>
                    <option value="CIVIL">Civil</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs text-gray-500 uppercase font-bold">Semester</label>
                <select
                    name="semester"
                    value={formData.semester || ''}
                    onChange={handleChange}
                    className="w-full bg-bgDark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                >
                    <option value="">Semester</option>
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-xs text-gray-500 uppercase font-bold flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Learning Style
                </label>
                <select
                    name="learningStyle"
                    value={formData.learningStyle || 'visual'}
                    onChange={handleChange}
                    className="w-full bg-bgDark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                >
                    <option value="visual">Visual (Diagrams & Flowcharts)</option>
                    <option value="theory">Conceptual (Deep Explanations)</option>
                    <option value="practical">Practical (Code & Real-world)</option>
                    <option value="exam_cram">Exam Cram (Important Qs Only)</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs text-gray-500 uppercase font-bold flex items-center gap-1">
                    <Target className="w-3 h-3" /> Career Goal
                </label>
                <select
                    name="careerGoal"
                    value={formData.careerGoal || 'placement'}
                    onChange={handleChange}
                    className="w-full bg-bgDark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                >
                    <option value="placement">IT Placement (High Salary)</option>
                    <option value="higher_studies">Higher Studies (GATE/GRE)</option>
                    <option value="govt_job">Govt Job / Core Engineering</option>
                    <option value="entrepreneur">Startup / Business</option>
                    <option value="just_pass">Just Pass / Degree</option>
                </select>
            </div>
        </div>

        <button
            onClick={handleSubmit}
            className="w-full bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-accent/20"
        >
            <Save className="w-4 h-4" />
            Save Profile & Optimize AI
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
