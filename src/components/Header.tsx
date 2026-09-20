import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  GitBranch, 
  FileText, 
  Sparkles,
  Compass,
  ArrowRight
} from 'lucide-react';
import { ActiveView } from '../types';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  pendingReviewCount: number;
  onQuickDemoMatch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  pendingReviewCount,
  onQuickDemoMatch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moderatorMenuOpen, setModeratorMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModeratorMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    setModeratorMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#E7E5E4] transition-colors">
      <div className="site-container h-16 flex items-center justify-between">
        
        {/* LOGO: Infinity thread loop + Serif Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('landing')}
          data-no-interactive="true"
          className="site-logo flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer bg-transparent border-0 shadow-none hover:bg-transparent hover:shadow-none p-0"
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[#1C1917] transition-transform duration-150 group-hover:scale-105">
            <svg className="w-5 h-5" viewBox="0 0 28 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 10C7 6.686 9.686 4 13 4C14.7 4 16.2 4.7 17.3 5.8L21 10M21 10C21 13.314 18.314 16 15 16C13.3 16 11.8 15.3 10.7 14.2L7 10" />
            </svg>
          </div>
          <span className="font-serif-display text-xl font-bold tracking-tight text-[#1C1917] group-hover:text-[#115E59] transition-colors duration-150">
            ThreadBack
          </span>
        </button>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10 text-xs sm:text-[13px] font-medium text-[#57534E]">
          <button
            type="button"
            data-no-interactive="true"
            onClick={() => handleNavClick('landing')}
            className={`py-1.5 transition-colors duration-150 hover:text-[#1C1917] cursor-pointer relative group bg-transparent border-0 shadow-none hover:bg-transparent hover:shadow-none focus:outline-none ${
              activeView === 'landing' ? 'text-[#1C1917] font-semibold' : ''
            }`}
          >
            Home
            {activeView === 'landing' ? (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#115E59] rounded-full transition-all duration-200" />
            ) : (
              <span className="absolute -bottom-1 left-1/2 right-1/2 h-0.5 bg-[#D6D0C4] rounded-full opacity-0 group-hover:left-0 group-hover:right-0 group-hover:opacity-100 transition-all duration-200" />
            )}
          </button>

          <button
            type="button"
            data-no-interactive="true"
            onClick={() => handleNavClick('submit')}
            className={`py-1.5 transition-colors duration-150 hover:text-[#1C1917] cursor-pointer relative group bg-transparent border-0 shadow-none hover:bg-transparent hover:shadow-none focus:outline-none ${
              activeView === 'submit' ? 'text-[#1C1917] font-semibold' : ''
            }`}
          >
            Share Memory
            {activeView === 'submit' ? (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#115E59] rounded-full transition-all duration-200" />
            ) : (
              <span className="absolute -bottom-1 left-1/2 right-1/2 h-0.5 bg-[#D6D0C4] rounded-full opacity-0 group-hover:left-0 group-hover:right-0 group-hover:opacity-100 transition-all duration-200" />
            )}
          </button>

          <button
            type="button"
            data-no-interactive="true"
            onClick={() => handleNavClick('summary')}
            className={`py-1.5 transition-colors duration-150 hover:text-[#1C1917] cursor-pointer relative group bg-transparent border-0 shadow-none hover:bg-transparent hover:shadow-none focus:outline-none ${
              activeView === 'summary' ? 'text-[#1C1917] font-semibold' : ''
            }`}
          >
            AI Summary
            {activeView === 'summary' ? (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#115E59] rounded-full transition-all duration-200" />
            ) : (
              <span className="absolute -bottom-1 left-1/2 right-1/2 h-0.5 bg-[#D6D0C4] rounded-full opacity-0 group-hover:left-0 group-hover:right-0 group-hover:opacity-100 transition-all duration-200" />
            )}
          </button>

          <button
            type="button"
            data-no-interactive="true"
            onClick={() => handleNavClick('match')}
            className={`py-1.5 transition-colors duration-150 hover:text-[#1C1917] cursor-pointer relative group bg-transparent border-0 shadow-none hover:bg-transparent hover:shadow-none focus:outline-none ${
              activeView === 'match' ? 'text-[#1C1917] font-semibold' : ''
            }`}
          >
            Potential Connection
            {activeView === 'match' ? (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#115E59] rounded-full transition-all duration-200" />
            ) : (
              <span className="absolute -bottom-1 left-1/2 right-1/2 h-0.5 bg-[#D6D0C4] rounded-full opacity-0 group-hover:left-0 group-hover:right-0 group-hover:opacity-100 transition-all duration-200" />
            )}
          </button>

          <button
            type="button"
            data-no-interactive="true"
            onClick={() => handleNavClick('about')}
            className={`py-1.5 transition-colors duration-150 hover:text-[#1C1917] cursor-pointer relative group bg-transparent border-0 shadow-none hover:bg-transparent hover:shadow-none focus:outline-none ${
              activeView === 'about' ? 'text-[#1C1917] font-semibold' : ''
            }`}
          >
            Safety & About
            {activeView === 'about' ? (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#115E59] rounded-full transition-all duration-200" />
            ) : (
              <span className="absolute -bottom-1 left-1/2 right-1/2 h-0.5 bg-[#D6D0C4] rounded-full opacity-0 group-hover:left-0 group-hover:right-0 group-hover:opacity-100 transition-all duration-200" />
            )}
          </button>
        </nav>

        {/* Right Desktop: Get Started CTA + Moderator Menu */}
        <div className="hidden md:flex items-center gap-3 sm:gap-3.5 relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => handleNavClick('submit')}
            className="px-4 sm:px-5 py-2 rounded-lg bg-[#11322E] hover:bg-[#0D2825] active:bg-[#081C1A] text-white text-xs sm:text-[13px] font-semibold border border-[#0D2825] shadow-2xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#115E59]"
          >
            Get Started
          </button>

          <button
            type="button"
            onClick={() => setModeratorMenuOpen(!moderatorMenuOpen)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border bg-white hover:bg-[#F5F2EB] cursor-pointer text-left shadow-2xs ${
              activeView === 'dashboard'
                ? 'border-[#115E59] ring-1 ring-[#115E59]/30 bg-[#F5F9F7]'
                : 'border-[#E7E5E4]'
            }`}
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border border-[#D6D0C4] bg-[#E7E2D8] shrink-0">
              <img
                src="/src/assets/images/moderator_avatar_1789719366175.jpg"
                alt="Moderator avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium text-[#1C1917]">
              Moderator
            </span>
            {pendingReviewCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#B45309] text-white text-[10px] font-bold flex items-center justify-center font-mono-code leading-none">
                {pendingReviewCount}
              </span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 text-[#78716C] transition-transform duration-200 ${moderatorMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Moderator dropdown */}
          {moderatorMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl border border-[#E5DFD5] shadow-lg py-1.5 z-50 text-xs modal-animate-enter">
              <div className="px-3 py-2 border-b border-[#F5F2EC]">
                <p className="font-semibold text-[#1C1917]">Elena Rostova</p>
                <p className="text-[11px] text-[#78716C]">Red Cross Family Links</p>
              </div>
              <button
                type="button"
                onClick={() => handleNavClick('dashboard')}
                className="w-full text-left px-3 py-2 hover:bg-[#FAF8F5] text-[#1C1917] flex items-center justify-between cursor-pointer"
              >
                <span>Moderator Dashboard</span>
                {pendingReviewCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-semibold border border-amber-200">
                    {pendingReviewCount} pending
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  onQuickDemoMatch();
                  setModeratorMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#FAF8F5] text-[#115E59] font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Review CONN-4091</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-1.5 p-1 rounded-lg border border-[#E7E5E4] bg-white"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border border-[#D6D0C4]">
              <img
                src="/src/assets/images/moderator_avatar_1789719366175.jpg"
                alt="Moderator avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium text-[#1C1917]">Review</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#1C1917] hover:bg-[#F5F2EC] rounded-lg cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7E5E4] bg-[#FAF8F5] px-4 pt-3 pb-5 space-y-1">
          <button
            type="button"
            onClick={() => handleNavClick('landing')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
              activeView === 'landing' ? 'bg-[#115E59] text-white' : 'text-[#1C1917] hover:bg-[#F5F2EC]'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('submit')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
              activeView === 'submit' ? 'bg-[#115E59] text-white' : 'text-[#1C1917] hover:bg-[#F5F2EC]'
            }`}
          >
            Share what you remember
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('summary')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
              activeView === 'summary' ? 'bg-[#115E59] text-white' : 'text-[#1C1917] hover:bg-[#F5F2EC]'
            }`}
          >
            AI Summary
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('match')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
              activeView === 'match' ? 'bg-[#115E59] text-white' : 'text-[#1C1917] hover:bg-[#F5F2EC]'
            }`}
          >
            Potential Connection
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('about')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
              activeView === 'about' ? 'bg-[#115E59] text-white' : 'text-[#1C1917] hover:bg-[#F5F2EC]'
            }`}
          >
            Safety & About
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('dashboard')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${
              activeView === 'dashboard' ? 'bg-[#115E59] text-white' : 'text-[#1C1917] hover:bg-[#F5F2EC]'
            }`}
          >
            <span>Moderator Dashboard</span>
            {pendingReviewCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B45309] text-white font-mono-code">
                {pendingReviewCount}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
