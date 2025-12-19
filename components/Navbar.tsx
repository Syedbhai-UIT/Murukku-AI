import React, { useState } from 'react';
import { Bot, Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'chat', label: 'Chat' },
    { id: 'syllabus', label: 'Syllabus' },
    { id: 'interview', label: 'Placement' },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => handleNav('home')}
          >
            <Bot className="w-8 h-8 text-orange-500 animate-bounce" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">
              Murukku AI 🍘
            </span>
            <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              AU
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`text-sm font-medium transition-colors hover:text-accentLight ${
                  activeSection === item.id ? 'text-accent' : 'text-gray-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-bgDark border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  activeSection === item.id 
                    ? 'bg-accent/10 text-accent' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;