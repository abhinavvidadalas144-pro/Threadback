import React from 'react';
import { Shield, GitBranch, Heart, ArrowUpRight } from 'lucide-react';
import { ActiveView } from '../types';

interface FooterProps {
  onNavigate: (view: ActiveView) => void;
  onQuickDemo: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#FAF8F5] text-[#1C1917] py-6 sm:py-8 border-t border-[#E7E5E4]">
      <div className="site-container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo with double loop icon */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-left group focus:outline-none"
          >
            <div className="w-6 h-6 flex items-center justify-center text-[#1C1917]">
              <svg className="w-5 h-5" viewBox="0 0 28 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10C7 6.686 9.686 4 13 4C14.7 4 16.2 4.7 17.3 5.8L21 10M21 10C21 13.314 18.314 16 15 16C13.3 16 11.8 15.3 10.7 14.2L7 10" />
              </svg>
            </div>
            <span className="font-serif-display text-base font-bold text-[#1C1917] tracking-tight">
              ThreadBack
            </span>
          </button>

          {/* Center navigation links */}
          <div className="flex items-center gap-5 sm:gap-6 text-xs text-[#57534E]">
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="hover:text-[#1C1917] transition-colors duration-150 cursor-pointer py-1 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 right-0 h-px bg-[#1C1917] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#1C1917] transition-colors duration-150 cursor-pointer py-1 relative group"
            >
              About
              <span className="absolute bottom-0 left-0 right-0 h-px bg-[#1C1917] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('about');
                setTimeout(() => {
                  document.getElementById('safety-privacy')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hover:text-[#1C1917] transition-colors duration-150 cursor-pointer py-1 relative group"
            >
              Safety
              <span className="absolute bottom-0 left-0 right-0 h-px bg-[#1C1917] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('about');
                setTimeout(() => {
                  document.getElementById('for-organizations')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hover:text-[#1C1917] transition-colors duration-150 cursor-pointer py-1 relative group"
            >
              For Organizations
              <span className="absolute bottom-0 left-0 right-0 h-px bg-[#1C1917] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
            </button>
          </div>

          {/* Right copyright info */}
          <div className="text-xs text-[#78716C]">
            <span>© 2025 ThreadBack. All rights reserved.</span>
          </div>

        </div>
      </div>
    </footer>
  );
};
