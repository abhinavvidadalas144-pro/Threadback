import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  User, 
  FileText, 
  Shield, 
  Users
} from 'lucide-react';
import { MemoryType, ActiveView } from '../types';
import { InteractiveText } from './InteractiveHeadline';
import heroLandscapeImg from '../assets/images/hero_misty_landscape.jpg';
import ancientTempleImg from '../assets/images/ancient_stone_temple.jpg';
import riverValleyImg from '../assets/images/river_misty_valley.jpg';
import youngGirlImg from '../assets/images/young_girl_sunlight.jpg';

interface LandingPageProps {
  onStartIntake: (type: MemoryType) => void;
  onNavigate: (view: ActiveView) => void;
  onLaunchDemoMatch: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartIntake,
  onNavigate,
  onLaunchDemoMatch,
}) => {
  return (
    <div className="bg-[#FAF8F5] text-[#1C1917] overflow-x-hidden selection:bg-[#115E59]/15">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden pt-6 sm:pt-8 md:pt-10 lg:pt-12 pb-16 sm:pb-20 md:pb-24">
        
        {/* Natural atmospheric landscape background spanning across the entire right half of hero */}
        <div className="absolute top-0 right-0 w-full lg:w-[62%] xl:w-[66%] 2xl:w-[70%] h-full pointer-events-none select-none overflow-hidden opacity-95">
          <img
            src={heroLandscapeImg}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/hero_misty_landscape.jpg';
            }}
            alt="Misty hills sunrise background"
            className="w-full h-full object-cover object-right-top filter brightness-[1.01] contrast-[0.98]"
            loading="eager"
          />
          {/* Subtle natural gradient dissolves ensuring readable text on left and seamless canvas blend */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/85 via-25% lg:via-[#FAF8F5]/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/40 via-10% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/30 via-transparent to-[#FAF8F5]" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
            
            {/* LEFT COLUMN: Editorial Typography & Intentional CTAs */}
            <div className="lg:col-span-6 xl:col-span-5 space-y-5 sm:space-y-6">

              {/* Headline matching editorial layout */}
              <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-normal text-[#1C1917] tracking-tight leading-[1.15]">
                <InteractiveText text="Some memories are" /><br />
                <InteractiveText text="enough to find your" /><br />
                <InteractiveText text="way home." />
              </h1>

              {/* Supporting explanatory paragraph */}
              <p className="text-xs sm:text-sm md:text-[15px] text-[#57534E] leading-relaxed max-w-lg">
                ThreadBack helps trained moderators explore possible connections between people separated by displacement, adoption, or family estrangement — using incomplete fragments of memory instead of exact records.
              </p>

              {/* Refined, intentional Call-to-Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onStartIntake('searching')}
                  className="px-5 py-2.5 rounded-lg bg-[#1C1917] hover:bg-[#292524] active:bg-[#0C0A09] border border-[#1C1917] text-white text-xs sm:text-sm font-medium tracking-tight transition-colors duration-150 flex items-center gap-2 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20"
                >
                  <span>I'm searching for someone</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onStartIntake('information')}
                  className="px-5 py-2.5 rounded-lg bg-white hover:bg-[#F5F2EB] active:bg-[#EAE4D8] border border-[#D6D0C4] text-[#1C1917] text-xs sm:text-sm font-medium tracking-tight transition-colors duration-150 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#115E59]/20"
                >
                  <span>I have information that might help</span>
                </button>
              </div>

              {/* Human-reviewed matching reassurance badge */}
              <div className="flex items-center gap-2 text-xs text-[#57534E] pt-1">
                <div className="w-4 h-4 rounded-full border border-[#57534E] flex items-center justify-center text-[#57534E]">
                  <Shield className="w-2.5 h-2.5" />
                </div>
                <span className="font-medium">Designed for human-reviewed matching</span>
              </div>

            </div>

            {/* RIGHT COLUMN: Photo composition with physical Polaroid cards & tactile thread */}
            <div className="lg:col-span-6 xl:col-span-7 relative flex items-center justify-center min-h-[380px] sm:min-h-[440px] lg:min-h-[500px] xl:min-h-[540px] w-full">
              <div className="relative w-full max-w-[540px] sm:max-w-[580px] lg:max-w-[620px] h-[390px] sm:h-[450px] lg:h-[500px] select-none">
                
                {/* Handwritten Script Caption: "Different words. Same memories." */}
                <div className="absolute top-1 sm:top-2 right-4 sm:right-8 lg:right-10 z-30 text-right pointer-events-none">
                  <p className="font-script text-xl sm:text-2xl text-[#3E3835] leading-none -rotate-2 font-medium">
                    Different words.
                  </p>
                  <p className="font-script text-xl sm:text-2xl text-[#3E3835] leading-none -rotate-2 font-medium mt-1">
                    Same memories.
                  </p>
                </div>

                {/* Connecting Threads SVG: Tactile, organic thread without neon glow */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible" 
                  viewBox="0 0 600 500" 
                  fill="none"
                >
                  {/* Primary Amber Linen Thread: clean, non-neon, tactile path */}
                  <path
                    d="M 20,350 C 70,330 110,270 155,255 C 195,240 230,170 320,150 C 370,140 400,105 430,125 C 460,145 470,210 475,270 C 480,330 435,395 375,395 C 320,395 305,340 345,315 C 385,290 480,320 540,350"
                    stroke="#C26A18"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  {/* Secondary quiet thread in muted slate-teal */}
                  <path
                    d="M 120,290 C 180,260 235,200 310,165 C 365,140 440,145 450,225 C 460,300 395,340 345,360 C 295,380 260,320 310,290 C 360,260 425,300 510,300"
                    stroke="#0284C7"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeDasharray="4 3"
                    opacity="0.7"
                  />

                  {/* Physical Thread Anchors */}
                  <circle cx="155" cy="255" r="3" fill="#C26A18" />
                  <circle cx="395" cy="120" r="3" fill="#C26A18" />
                  <circle cx="475" cy="270" r="3" fill="#0284C7" />
                  <circle cx="345" cy="315" r="3" fill="#C26A18" />
                </svg>

                {/* PHOTO CARD 1 (Top Center/Right): Ancient Pagoda / Temple on Hill */}
                <div className="absolute top-2 sm:top-4 right-20 sm:right-28 md:right-32 w-44 sm:w-52 md:w-56 lg:w-60 bg-white p-2.5 pb-3.5 sm:p-3 sm:pb-4 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-[#E7E2D8] rotate-[6deg] z-15 hover:rotate-[4deg] hover:scale-105 hover:shadow-[0_16px_36px_rgba(0,0,0,0.14)] hover:z-30 transition-all duration-200 cursor-pointer">
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-lg bg-[#FAF8F5]">
                    <img
                      src={ancientTempleImg}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/ancient_stone_temple.jpg';
                      }}
                      alt="Ancient stone temple near river"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* PHOTO CARD 2 (Middle Left): Winding River in Lush Valley */}
                <div className="absolute top-24 sm:top-28 left-2 sm:left-6 md:left-8 w-48 sm:w-56 md:w-60 lg:w-64 bg-white p-2.5 pb-3.5 sm:p-3 sm:pb-4 rounded-xl shadow-[0_10px_28px_rgba(0,0,0,0.10)] border border-[#E7E2D8] -rotate-[12deg] z-25 hover:-rotate-[9deg] hover:scale-105 hover:shadow-[0_18px_40px_rgba(0,0,0,0.15)] hover:z-30 transition-all duration-200 cursor-pointer">
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-lg bg-[#FAF8F5]">
                    <img
                      src={riverValleyImg}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/river_misty_valley.jpg';
                      }}
                      alt="River curving through misty hills"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* PHOTO CARD 3 (Right): Young Girl looking towards the sunlit horizon */}
                <div className="absolute top-44 sm:top-48 right-3 sm:right-6 md:right-8 w-44 sm:w-52 md:w-56 lg:w-60 bg-white p-2.5 pb-3.5 sm:p-3 sm:pb-4 rounded-xl shadow-[0_10px_28px_rgba(0,0,0,0.10)] border border-[#E7E2D8] rotate-[2deg] z-20 hover:rotate-[0deg] hover:scale-105 hover:shadow-[0_18px_40px_rgba(0,0,0,0.15)] hover:z-30 transition-all duration-200 cursor-pointer">
                  <div className="w-full aspect-[4/3] overflow-hidden rounded-lg bg-[#FAF8F5]">
                    <img
                      src={youngGirlImg}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/young_girl_sunlight.jpg';
                      }}
                      alt="Young girl looking towards horizon"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PROCESS TIMELINE SECTION (MATCHES REFERENCE DESIGN)                    */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-18 lg:py-24 border-t border-[#E7E2D8] bg-[#FAF8F5]">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          
          {/* DESKTOP / TABLET HORIZONTAL TIMELINE */}
          <div className="hidden md:grid md:grid-cols-4 gap-8 lg:gap-12 xl:gap-16 items-start">
            
            {/* 01 — MEMORIES */}
            <div className="group flex flex-col">
              {/* Top Marker Row */}
              <div className="flex items-center gap-3 w-full">
                <span className="px-3 py-0.5 rounded-full bg-[#EAE5DC] text-[#44403C] text-[12px] font-mono font-medium tracking-tight shrink-0 select-none group-hover:bg-[#E2DDD3] transition-colors">
                  01
                </span>
                <div className="text-[#292524] shrink-0">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="3" width="16" height="18" rx="2" />
                    <line x1="8" y1="8" x2="16" y2="8" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                    <line x1="8" y1="16" x2="12" y2="16" />
                  </svg>
                </div>
                {/* Connecting Line & Dot */}
                <div className="flex-1 flex items-center ml-2 mr-2">
                  <div className="h-px bg-[#D6D0C4] flex-1 group-hover:bg-[#C4BCAD] transition-colors" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C4BCAD] shrink-0" />
                </div>
              </div>

              {/* Text Block */}
              <div className="mt-4 sm:mt-5 space-y-1.5">
                <h3 className="font-sans text-[13.5px] sm:text-[14.5px] font-semibold text-[#1C1917] tracking-[0.14em] uppercase">
                  MEMORIES
                </h3>
                <p className="text-xs sm:text-[13.5px] text-[#78716C] leading-relaxed font-normal">
                  People leave behind<br />more than just photos.
                </p>
              </div>
            </div>

            {/* 02 — AI */}
            <div className="group flex flex-col">
              {/* Top Marker Row */}
              <div className="flex items-center gap-3 w-full">
                <span className="px-3 py-0.5 rounded-full bg-[#EAE5DC] text-[#44403C] text-[12px] font-mono font-medium tracking-tight shrink-0 select-none group-hover:bg-[#E2DDD3] transition-colors">
                  02
                </span>
                <div className="text-[#292524] shrink-0">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z" />
                  </svg>
                </div>
                {/* Connecting Line & Dot */}
                <div className="flex-1 flex items-center ml-2 mr-2">
                  <div className="h-px bg-[#D6D0C4] flex-1 group-hover:bg-[#C4BCAD] transition-colors" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C4BCAD] shrink-0" />
                </div>
              </div>

              {/* Text Block */}
              <div className="mt-4 sm:mt-5 space-y-1.5">
                <h3 className="font-sans text-[13.5px] sm:text-[14.5px] font-semibold text-[#1C1917] tracking-[0.14em] uppercase">
                  AI
                </h3>
                <p className="text-xs sm:text-[13.5px] text-[#78716C] leading-relaxed font-normal">
                  Find meaning<br />in the details.
                </p>
              </div>
            </div>

            {/* 03 — CONNECTION */}
            <div className="group flex flex-col">
              {/* Top Marker Row */}
              <div className="flex items-center gap-3 w-full">
                <span className="px-3 py-0.5 rounded-full bg-[#EAE5DC] text-[#44403C] text-[12px] font-mono font-medium tracking-tight shrink-0 select-none group-hover:bg-[#E2DDD3] transition-colors">
                  03
                </span>
                <div className="text-[#292524] shrink-0">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
                {/* Connecting Line & Dot */}
                <div className="flex-1 flex items-center ml-2 mr-2">
                  <div className="h-px bg-[#D6D0C4] flex-1 group-hover:bg-[#C4BCAD] transition-colors" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C4BCAD] shrink-0" />
                </div>
              </div>

              {/* Text Block */}
              <div className="mt-4 sm:mt-5 space-y-1.5">
                <h3 className="font-sans text-[13.5px] sm:text-[14.5px] font-semibold text-[#1C1917] tracking-[0.14em] uppercase">
                  CONNECTION
                </h3>
                <p className="text-xs sm:text-[13.5px] text-[#78716C] leading-relaxed font-normal">
                  Surface possible<br />matches.
                </p>
              </div>
            </div>

            {/* 04 — HUMAN REVIEW */}
            <div className="group flex flex-col">
              {/* Top Marker Row */}
              <div className="flex items-center gap-3 w-full">
                <span className="px-3 py-0.5 rounded-full bg-[#EAE5DC] text-[#44403C] text-[12px] font-mono font-medium tracking-tight shrink-0 select-none group-hover:bg-[#E2DDD3] transition-colors">
                  04
                </span>
                <div className="text-[#115E59] shrink-0">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>

              {/* Text Block */}
              <div className="mt-4 sm:mt-5 space-y-1.5">
                <h3 className="font-sans text-[13.5px] sm:text-[14.5px] font-semibold text-[#115E59] tracking-[0.14em] uppercase">
                  HUMAN REVIEW
                </h3>
                <p className="text-xs sm:text-[13.5px] text-[#78716C] leading-relaxed font-normal">
                  Verify carefully<br />before moving forward.
                </p>
              </div>
            </div>

          </div>

          {/* MOBILE VERTICAL PROGRESSION */}
          <div className="md:hidden space-y-7 relative pl-2">
            {/* Vertical Guideline */}
            <div className="absolute left-[24px] top-6 bottom-6 w-px bg-[#E2DDD3]" aria-hidden="true" />

            {/* 01 — MEMORIES */}
            <div className="relative flex items-start gap-4">
              <span className="relative z-10 px-2.5 py-0.5 rounded-full bg-[#EAE5DC] text-[#44403C] text-[11px] font-mono font-medium shrink-0">
                01
              </span>
              <div className="flex-1 pt-0.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <svg className="w-4 h-4 text-[#292524]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="3" width="16" height="18" rx="2" />
                    <line x1="8" y1="8" x2="16" y2="8" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                    <line x1="8" y1="16" x2="12" y2="16" />
                  </svg>
                  <h3 className="font-sans text-xs font-semibold text-[#1C1917] tracking-widest uppercase">
                    MEMORIES
                  </h3>
                </div>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  People leave behind more than just photos.
                </p>
              </div>
            </div>

            {/* 02 — AI */}
            <div className="relative flex items-start gap-4">
              <span className="relative z-10 px-2.5 py-0.5 rounded-full bg-[#EAE5DC] text-[#44403C] text-[11px] font-mono font-medium shrink-0">
                02
              </span>
              <div className="flex-1 pt-0.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <svg className="w-4 h-4 text-[#292524]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z" />
                  </svg>
                  <h3 className="font-sans text-xs font-semibold text-[#1C1917] tracking-widest uppercase">
                    AI
                  </h3>
                </div>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  Find meaning in the details.
                </p>
              </div>
            </div>

            {/* 03 — CONNECTION */}
            <div className="relative flex items-start gap-4">
              <span className="relative z-10 px-2.5 py-0.5 rounded-full bg-[#EAE5DC] text-[#44403C] text-[11px] font-mono font-medium shrink-0">
                03
              </span>
              <div className="flex-1 pt-0.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <svg className="w-4 h-4 text-[#292524]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <h3 className="font-sans text-xs font-semibold text-[#1C1917] tracking-widest uppercase">
                    CONNECTION
                  </h3>
                </div>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  Surface possible matches.
                </p>
              </div>
            </div>

            {/* 04 — HUMAN REVIEW */}
            <div className="relative flex items-start gap-4">
              <span className="relative z-10 px-2.5 py-0.5 rounded-full bg-[#EAE5DC] text-[#44403C] text-[11px] font-mono font-medium shrink-0">
                04
              </span>
              <div className="flex-1 pt-0.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <svg className="w-4 h-4 text-[#115E59]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <h3 className="font-sans text-xs font-semibold text-[#115E59] tracking-widest uppercase">
                    HUMAN REVIEW
                  </h3>
                </div>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  Verify carefully before moving forward.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PROBLEM SECTION: "Memory doesn't work like a database."                */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-20 border-t border-[#E7E2D8]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Thesis Statement */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#1C1917] tracking-tight leading-[1.16]">
                <InteractiveText text="Memory doesn't work" /><br />
                <InteractiveText text="like a database." />
              </h2>
              <p className="text-sm sm:text-base text-[#57534E] leading-relaxed max-w-sm pt-1">
                Traditional search often depends on exact information. Human memory rarely is.
              </p>
            </div>

            {/* Right Column: Grounded visual demonstration */}
            <div className="lg:col-span-7 relative">
              <div className="relative flex flex-col md:flex-row items-center md:items-stretch justify-between gap-6 md:gap-4 lg:gap-6">
                
                {/* LEFT ELEMENT: Fragmented memory Manila folder & paper tags */}
                <div className="w-full md:w-[46%] flex flex-col">
                  <span className="text-xs sm:text-sm font-semibold text-[#3E3835] mb-2.5 block">
                    Fragmented memory
                  </span>

                  <div className="relative bg-[#FAF6EE] border border-[#E6DFCE] rounded-xl p-4 sm:p-5 shadow-xs flex-1 flex flex-col justify-center space-y-2.5">
                    {/* Folder side tab notches on the right edge */}
                    <div className="absolute top-4 -right-1.5 w-2 h-5 bg-[#EDE5D3] border-t border-r border-b border-[#D8CEB8] rounded-r-xs" />
                    <div className="absolute top-12 -right-1.5 w-2 h-6 bg-[#EDE5D3] border-t border-r border-b border-[#D8CEB8] rounded-r-xs" />
                    <div className="absolute top-22 -right-1.5 w-2 h-5 bg-[#EDE5D3] border-t border-r border-b border-[#D8CEB8] rounded-r-xs" />
                    <div className="absolute top-32 -right-1.5 w-2 h-5 bg-[#EDE5D3] border-t border-r border-b border-[#D8CEB8] rounded-r-xs" />

                    {/* Paper Label Strips */}
                    <div className="bg-white border border-[#E8E4DC] px-4 py-2 rounded-lg text-xs sm:text-sm font-serif italic text-[#1C1917] shadow-xs rotate-[1.5deg] inline-block w-fit">
                      Kamla... or Kamala
                    </div>
                    <div className="bg-white border border-[#E8E4DC] px-4 py-2 rounded-lg text-xs sm:text-sm font-serif italic text-[#1C1917] shadow-xs -rotate-[1deg] block w-fit">
                      Village near a river
                    </div>
                    <div className="bg-white border border-[#E8E4DC] px-4 py-2 rounded-lg text-xs sm:text-sm font-serif italic text-[#1C1917] shadow-xs rotate-[0.8deg] inline-block w-fit">
                      Maybe 1988
                    </div>
                    <div className="bg-white border border-[#E8E4DC] px-4 py-2 rounded-lg text-xs sm:text-sm font-serif italic text-[#1C1917] shadow-xs -rotate-[0.5deg] block w-fit">
                      Temple near our home
                    </div>
                  </div>
                </div>

                {/* CONNECTING THREAD: Natural, non-neon thread linking the two sides */}
                <div className="hidden md:block absolute top-1/2 left-[44%] -translate-y-1/2 w-[16%] h-24 pointer-events-none z-20">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 80" fill="none">
                    {/* Primary Amber organic curve */}
                    <path
                      d="M 0,40 C 25,10 45,70 70,40 C 85,25 95,35 105,38"
                      stroke="#C26A18"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    {/* Faint secondary guide thread */}
                    <path
                      d="M 0,45 C 30,25 50,60 80,45 C 90,38 98,42 105,42"
                      stroke="#0284C7"
                      strokeWidth="1.2"
                      strokeDasharray="3 2"
                      opacity="0.5"
                    />
                  </svg>
                </div>

                {/* RIGHT ELEMENT: Meaningful connection card with circular vignette */}
                <div className="w-full md:w-[50%] flex flex-col">
                  <div className="bg-white border border-[#E5DFD5] rounded-xl p-5 sm:p-6 shadow-xs flex-1 flex flex-col justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-[#3E3835] mb-3 block">
                      Meaningful connection
                    </span>

                    <div className="flex items-center gap-4 sm:gap-5 pt-1">
                      {/* Circular Vignette */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full relative overflow-hidden shrink-0 shadow-xs border border-[#DFD8CA]">
                        <img
                          src={riverValleyImg}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/river_misty_valley.jpg';
                          }}
                          alt="Misty valley river landscape"
                          className="w-full h-full object-cover"
                        />
                        {/* Avatar overlay inside circle */}
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-white shadow-xs z-10">
                          <img
                            src={youngGirlImg}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/young_girl_sunlight.jpg';
                            }}
                            alt="Connected person"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Text beside the circular vignette */}
                      <div className="space-y-1">
                        <p className="font-sans text-xs sm:text-sm text-[#57534E] font-medium leading-snug">Same story.</p>
                        <p className="font-sans text-xs sm:text-sm text-[#57534E] font-medium leading-snug">Different words.</p>
                        <p className="font-sans text-xs sm:text-sm font-semibold text-[#15803D] leading-snug pt-0.5">Real connection.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HOW IT WORKS SECTION (REFINED, HIGH-CONTRAST EDITORIAL CARDS)           */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-18 md:py-22">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header with comfortable rhythm */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 md:mb-12">
            <div className="space-y-1.5">
              <h2 className="font-serif-display text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight">
                <InteractiveText text="How It Works" />
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C]">
                A simple process. A powerful difference.
              </p>
            </div>

            {/* Quick demo link */}
            <button
              type="button"
              onClick={onLaunchDemoMatch}
              className="text-xs font-semibold text-[#115E59] hover:text-[#0D4D49] transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-lg hover:bg-[#EEF5F1] w-fit"
            >
              <span>Explore how matches are reviewed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3 Clearly Defined Cards Container */}
          <div className="relative">
            
            {/* Subtle, understated thread connecting 01 → 02 → 03 on desktop */}
            <div className="hidden md:block absolute top-[36px] left-[15%] right-[15%] h-px bg-[#E2DDD3] pointer-events-none z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 relative z-10">
              
              {/* CARD 01 */}
              <div className="card-interactive bg-white border border-[#E5DFD5] rounded-xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_2px_8px_rgba(28,25,23,0.04)] min-h-[200px] cursor-default">
                <div>
                  {/* Top Row: Step Number & Refined Icon */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs sm:text-[13px] font-semibold tracking-wider text-[#78716C]">
                      01
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#ECE7DE] flex items-center justify-center text-[#57534E] group-hover:scale-105 transition-transform duration-200">
                      <User className="w-4 h-4 stroke-[1.75]" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif-display text-base sm:text-lg font-bold text-[#1C1917] tracking-tight mt-5 mb-2">
                    Share what you remember
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-[#57534E] leading-relaxed">
                    Describe the fragments in your own words.
                  </p>
                </div>
              </div>

              {/* CARD 02 */}
              <div className="card-interactive bg-white border border-[#E5DFD5] rounded-xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_2px_8px_rgba(28,25,23,0.04)] min-h-[200px] cursor-default">
                <div>
                  {/* Top Row: Step Number & Refined Icon */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs sm:text-[13px] font-semibold tracking-wider text-[#78716C]">
                      02
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#ECE7DE] flex items-center justify-center text-[#57534E] group-hover:scale-105 transition-transform duration-200">
                      <FileText className="w-4 h-4 stroke-[1.75]" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif-display text-base sm:text-lg font-bold text-[#1C1917] tracking-tight mt-5 mb-2">
                    Find meaningful connections
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-[#57534E] leading-relaxed">
                    AI organizes the information and compares meaning, not just exact words.
                  </p>
                </div>
              </div>

              {/* CARD 03 */}
              <div className="card-interactive bg-white border border-[#E5DFD5] rounded-xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_2px_8px_rgba(28,25,23,0.04)] min-h-[200px] cursor-default">
                <div>
                  {/* Top Row: Step Number & Refined Icon */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs sm:text-[13px] font-semibold tracking-wider text-[#78716C]">
                      03
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#ECE7DE] flex items-center justify-center text-[#57534E] group-hover:scale-105 transition-transform duration-200">
                      <ShieldCheck className="w-4 h-4 stroke-[1.75]" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif-display text-base sm:text-lg font-bold text-[#1C1917] tracking-tight mt-5 mb-2">
                    Human review
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-[#57534E] leading-relaxed">
                    A trained moderator reviews potential connections before any contact.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TRUST & SAFETY SECTION                                                 */}
      {/* ========================================================================= */}
      <section className="pb-16 sm:pb-20 md:pb-24">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#EEF5F1] border border-[#D8E6DE] rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
            
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#115E59] text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-serif-display text-base sm:text-lg font-bold text-[#1C1917]">
                  Trust & Safety
                </h4>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  No contact information is ever shared automatically.<br className="hidden sm:inline" />
                  Every match is reviewed by a human before either side is contacted.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-white border border-[#D1DDD6] text-xs font-semibold text-[#1C1917] shadow-xs">
              <div className="w-5 h-5 rounded-full bg-[#E6F4F1] flex items-center justify-center">
                <Users className="w-3 h-3 text-[#115E59]" />
              </div>
              <span>Built for verified moderators & NGOs</span>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
