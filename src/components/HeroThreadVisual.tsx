import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Brain, 
  GitMerge, 
  ShieldCheck, 
  ArrowRight, 
  Play, 
  RotateCcw,
  CheckCircle2,
  Compass,
  Heart
} from 'lucide-react';

export const HeroThreadVisual: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2);
  const [isWeaving, setIsWeaving] = useState<boolean>(true);
  const [selectedFragment, setSelectedFragment] = useState<number | null>(null);

  const steps = [
    {
      id: 0,
      title: 'FRAGMENT',
      phase: '01',
      subtitle: 'Incomplete Human Memories',
      icon: Sparkles,
      color: '#B45309',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      desc: 'Free-form, hazy recollections: nicknames, a riverbank, old songs, or sensory markers without legal paperwork.',
      badge: 'Uncertain Spans',
    },
    {
      id: 1,
      title: 'UNDERSTANDING',
      phase: '02',
      subtitle: 'Semantic Structuring',
      icon: Brain,
      color: '#C25E3E',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      desc: 'AI extracts spatial coordinates, phonetic clusters, and historical cohorts into structured candidate anchors.',
      badge: 'Meaning Extraction',
    },
    {
      id: 2,
      title: 'CONNECTION',
      phase: '03',
      subtitle: 'Semantic Thread Weave',
      icon: GitMerge,
      color: '#B45309',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300',
      desc: 'Surfaces conceptual overlaps across years of separation despite divergent dialect spellings (e.g. Kamla ↔ Kamala).',
      badge: '87% Congruence',
    },
    {
      id: 3,
      title: 'HUMAN REVIEW',
      phase: '04',
      subtitle: 'Caseworker Oversight',
      icon: ShieldCheck,
      color: '#15803D',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      desc: 'Accredited NGO moderators verify civil archives and safety protocols before any outreach or contact is facilitated.',
      badge: 'Strict Safeguard',
    },
  ];

  const floatingFragments = [
    { id: 1, text: '"Kamla...?"', label: 'Identity fragment', x: '8%', y: '16%' },
    { id: 2, text: '"River bank"', label: 'Spatial anchor', x: '12%', y: '68%' },
    { id: 3, text: '"Old stone temple"', label: 'Sensory landmark', x: '32%', y: '20%' },
    { id: 4, text: '"Age ~6"', label: 'Temporal cohort', x: '28%', y: '72%' },
    { id: 5, text: '"Sister Kamala"', label: 'Matched candidate', x: '82%', y: '25%' },
    { id: 6, text: '"Near the temple"', label: 'Corroborating record', x: '80%', y: '70%' },
  ];

  // Auto-advance loop when user is not manually interacting
  useEffect(() => {
    if (!isWeaving) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(interval);
  }, [isWeaving]);

  return (
    <div className="relative w-full max-w-4xl mx-auto my-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-[#E7E5E4] p-5 sm:p-7 shadow-xs">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-[#F5F2EC]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#B45309] animate-ping" />
          <span className="text-[11px] font-semibold text-[#1C1917] tracking-tight">
            Interactive Journey: From Fragment to Verified Reunion
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsWeaving(!isWeaving)}
            className="text-[10px] font-medium text-[#78716C] hover:text-[#1C1917] px-2.5 py-1 rounded-md border border-[#E7E5E4] bg-white transition-colors flex items-center gap-1.5"
            title={isWeaving ? 'Pause auto progression' : 'Resume auto progression'}
          >
            {isWeaving ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Auto-playing</span>
              </>
            ) : (
              <>
                <Play className="w-2.5 h-2.5 text-[#B45309]" />
                <span>Play sequence</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Canvas: Interactive Memory Threads */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#FAF8F5] to-[#F5F2EC] border border-[#EBE7DF] flex items-center justify-center select-none">
        {/* Subtle grid backdrop */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(#D6D3D1 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }} 
        />

        {/* Floating memory fragment tokens */}
        {floatingFragments.map((frag) => {
          const isSelected = selectedFragment === frag.id;
          return (
            <motion.div
              key={frag.id}
              className={`absolute cursor-pointer hidden sm:flex flex-col items-center z-20 ${
                isSelected ? 'scale-110' : ''
              }`}
              style={{ left: frag.x, top: frag.y }}
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                duration: 3.5 + frag.id * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              onClick={() => setSelectedFragment(isSelected ? null : frag.id)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
            >
              <div className={`px-2.5 py-1 rounded-full text-[11px] font-serif-display italic border shadow-2xs transition-all ${
                isSelected 
                  ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-sm'
                  : 'bg-white/95 text-[#1C1917] border-[#E7E5E4] hover:border-[#B45309]'
              }`}>
                {frag.text}
              </div>
              <span className="text-[9px] font-sans-ui text-[#78716C] mt-0.5 tracking-tight">
                {frag.label}
              </span>
            </motion.div>
          );
        })}

        {/* Dynamic SVG Animated Thread System */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 840 220" 
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="livingThreadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.4" />
              <stop offset="28%" stopColor="#B45309" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#C25E3E" stopOpacity="0.95" />
              <stop offset="80%" stopColor="#B45309" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#15803D" stopOpacity="0.9" />
            </linearGradient>

            <filter id="threadGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Guide paths for weaving */}
          <path
            d="M 90 70 C 200 70, 240 110, 360 110"
            fill="none"
            stroke="#E2DCD2"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M 90 110 C 200 110, 240 110, 360 110"
            fill="none"
            stroke="#E2DCD2"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M 90 150 C 200 150, 240 110, 360 110"
            fill="none"
            stroke="#E2DCD2"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Right exit branches toward verified caseworker hub */}
          <path
            d="M 520 110 C 620 110, 680 110, 760 110"
            fill="none"
            stroke="#E2DCD2"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* PRIMARY FLOWING LIVING THREAD */}
          <path
            d="M 90 70 C 180 65, 230 110, 360 110 C 440 110, 480 110, 560 110 C 650 110, 700 110, 760 110"
            fill="none"
            stroke="url(#livingThreadGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            className="animate-thread-flow"
          />
          
          {/* Secondary counter-flowing harmonic thread */}
          <path
            d="M 90 150 C 190 155, 250 110, 360 110 C 440 110, 490 110, 560 110 C 650 110, 690 110, 760 110"
            fill="none"
            stroke="url(#livingThreadGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 5"
            className="animate-thread-flow"
            style={{ animationDirection: 'reverse', animationDuration: '7s' }}
          />

          {/* Junction Step 0: Memory Fragments Input */}
          <g 
            transform="translate(90, 110)" 
            className="cursor-pointer transition-transform hover:scale-105" 
            onClick={() => { setActiveStep(0); setIsWeaving(false); }}
          >
            <circle 
              r="22" 
              fill={activeStep === 0 ? '#FEF3C7' : '#FAF8F5'} 
              stroke="#B45309" 
              strokeWidth={activeStep === 0 ? '3' : '2'} 
            />
            <circle r="7" fill="#B45309" />
            <text x="-36" y="-30" fontSize="11" fill="#78716C" fontWeight="700" fontFamily="sans-serif">
              01. FRAGMENT
            </text>
            <text x="-32" y="38" fontSize="10" fill="#A8A29E" fontWeight="500">
              Uncertain memories
            </text>
          </g>

          {/* Junction Step 1: AI Semantic Structuring Locus */}
          <g 
            transform="translate(300, 110)" 
            className="cursor-pointer transition-transform hover:scale-105" 
            onClick={() => { setActiveStep(1); setIsWeaving(false); }}
          >
            <circle 
              r="26" 
              fill={activeStep === 1 ? '#FFEDD5' : '#FFFFFF'} 
              stroke="#C25E3E" 
              strokeWidth={activeStep === 1 ? '3' : '2'} 
              filter="url(#threadGlow)" 
            />
            <circle r="9" fill="#C25E3E" />
            <text x="-48" y="-34" fontSize="11" fill="#1C1917" fontWeight="700" fontFamily="sans-serif">
              02. UNDERSTANDING
            </text>
            <text x="-40" y="42" fontSize="10" fill="#78716C">
              Semantic anchors
            </text>
          </g>

          {/* Junction Step 2: Connection Intersect (Kamla ↔ Kamala) */}
          <g 
            transform="translate(530, 110)" 
            className="cursor-pointer transition-transform hover:scale-105" 
            onClick={() => { setActiveStep(2); setIsWeaving(false); }}
          >
            <circle 
              r="28" 
              fill={activeStep === 2 ? '#FEF3C7' : '#FAF8F5'} 
              stroke="#B45309" 
              strokeWidth={activeStep === 2 ? '3.5' : '2'} 
            />
            <circle r="10" fill="#F59E0B" className="animate-pulse" />
            <text x="-40" y="-36" fontSize="11" fill="#B45309" fontWeight="700" fontFamily="sans-serif">
              03. CONNECTION
            </text>
            <text x="-36" y="44" fontSize="10" fill="#B45309" fontWeight="600">
              87% Congruence
            </text>
          </g>

          {/* Junction Step 3: Human Verification Anchor Gate */}
          <g 
            transform="translate(750, 110)" 
            className="cursor-pointer transition-transform hover:scale-105" 
            onClick={() => { setActiveStep(3); setIsWeaving(false); }}
          >
            <circle 
              r="28" 
              fill={activeStep === 3 ? '#DCFCE7' : '#F0FDF4'} 
              stroke="#15803D" 
              strokeWidth={activeStep === 3 ? '3.5' : '2'} 
            />
            <circle r="9" fill="#15803D" />
            <text x="-48" y="-36" fontSize="11" fill="#15803D" fontWeight="700" fontFamily="sans-serif">
              04. HUMAN REVIEW
            </text>
            <text x="-38" y="44" fontSize="10" fill="#15803D" fontWeight="600">
              Caseworker gate
            </text>
          </g>
        </svg>

        {/* Bottom helper prompt */}
        <div className="absolute bottom-3 left-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full text-[11px] text-[#57534E] border border-[#E7E5E4] flex items-center gap-2 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#B45309]"></span>
          <span>Click any stage below to inspect how ThreadBack protects dignity</span>
        </div>
      </div>

      {/* 4-Phase Stepper Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {steps.map((step) => {
          const isSelected = activeStep === step.id;
          const IconComponent = step.icon;
          return (
            <button
              key={step.id}
              onClick={() => {
                setActiveStep(step.id);
                setIsWeaving(false);
              }}
              className={`text-left p-3.5 rounded-2xl border transition-all duration-200 relative ${
                isSelected
                  ? 'bg-white border-[#B45309] shadow-sm ring-2 ring-[#B45309]/20'
                  : 'bg-[#FAF8F5] border-[#E7E5E4] hover:bg-white hover:border-[#D6D3D1]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-lg ${step.bgColor} border ${step.borderColor} flex items-center justify-center`}>
                    <IconComponent className="w-3.5 h-3.5" style={{ color: step.color }} />
                  </div>
                  <span className="text-[11px] font-bold tracking-wider text-[#1C1917]">
                    {step.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono-code font-bold text-[#78716C]">
                  {step.phase}
                </span>
              </div>

              <p className="text-xs font-semibold text-[#292524] mb-1">
                {step.subtitle}
              </p>

              <p className="text-[11px] text-[#57534E] leading-relaxed">
                {step.desc}
              </p>

              <div className="mt-2.5 pt-2 border-t border-[#F5F2EC] flex items-center justify-between">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${step.bgColor} text-[#1C1917] border ${step.borderColor}`}>
                  {step.badge}
                </span>
                {isSelected && (
                  <span className="text-[10px] text-[#B45309] font-bold flex items-center gap-0.5">
                    Active stage
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
