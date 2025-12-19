import React, { useState } from 'react';
import { UserContext } from '../types';
import { Save } from 'lucide-react';

interface OnboardingProps {
  context: UserContext;
  onUpdate: (ctx: UserContext) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ context, onUpdate }) => {
  const [formData, setFormData] = useState<UserContext>(context);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onUpdate(formData);
  };

  const isComplete = formData.name && formData.semester;

  return (
    <div className={`mb-8 p-6 rounded-2xl border transition-all duration-300 ${isComplete ? 'bg-bgInput/50 border-white/10' : 'bg-gradient-to-br from-bgInput to-bgCard border-accent shadow-lg shadow-accent/20'}`}>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-white mb-1">
            {isComplete ? 'Your Details' : 'Set your details'}
          </h3>
          <p className="text-sm text-gray-400">
            {isComplete 
              ? `Hi ${formData.name}, tailored for Sem ${formData.semester}` 
              : 'Tell me your name and semester so I can give you better answers.'}
          </p>
        </div>
        
        <div className="flex-2 w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="bg-bgDark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
          />
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="bg-bgDark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
          >
            <option value="">Semester</option>
            {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <button
            onClick={handleSubmit}
            className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
