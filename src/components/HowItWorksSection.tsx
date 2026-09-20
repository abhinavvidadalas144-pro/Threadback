import React from 'react';
import { PenTool, Network, UserCheck } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Share what you remember',
      quote: 'Describe the fragments in your own words.',
      description:
        'There is no pressure to recall exact dates, legal spellings, or verified records. Incomplete memories, sensory details, and vague timeframes are fully welcomed.',
      icon: <PenTool className="w-5 h-5 text-[#B45309]" />,
      pill: 'Fragment Intake',
    },
    {
      num: '02',
      title: 'Find meaningful connections',
      quote: 'AI organizes the information and compares meaning, not just exact words.',
      description:
        'The system extracts spatial anchors, phonetic variations, and historical timebands to uncover semantic parallels across disconnected submissions.',
      icon: <Network className="w-5 h-5 text-[#B45309]" />,
      pill: 'Semantic Synthesis',
    },
    {
      num: '03',
      title: 'Human review',
      quote: 'A trained moderator reviews potential connections before any contact.',
      description:
        'No algorithmic reunions occur. An accredited NGO caseworker investigates the candidate pair, evaluates safety constraints, and guides ethical next steps.',
      icon: <UserCheck className="w-5 h-5 text-[#B45309]" />,
      pill: 'Caseworker Oversight',
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold tracking-widest text-[#B45309] uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block mb-3">
            Workflow Architecture
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight mb-4">
            How ThreadBack Works
          </h2>
          <p className="text-base text-[#57534E]">
            A deliberate, three-stage journey designed to bridge imperfect memories while protecting individual dignity.
          </p>
        </div>

        {/* 3 Step Cards with connecting thread */}
        <div className="relative">
          {/* Connecting SVG Thread for desktop */}
          <div className="hidden md:block absolute top-1/2 left-16 right-16 -translate-y-12 z-0 pointer-events-none">
            <svg className="w-full h-8" preserveAspectRatio="none" viewBox="0 0 800 24" fill="none">
              <path
                d="M 20 12 L 780 12"
                stroke="#D6D3D1"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              <path
                d="M 20 12 L 780 12"
                stroke="#B45309"
                strokeWidth="2.5"
                strokeDasharray="10 8"
                className="animate-thread-flow"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-white rounded-2xl border border-[#E7E5E4] p-7 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#E7E5E4] flex items-center justify-center group-hover:scale-105 transition-transform">
                      {step.icon}
                    </div>
                    <span className="font-serif-display text-2xl font-bold text-[#B45309]/80 font-mono-code">
                      {step.num}
                    </span>
                  </div>

                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#78716C] bg-[#F5F2EC] px-2.5 py-1 rounded-md inline-block mb-3">
                    {step.pill}
                  </span>

                  <h3 className="font-serif-display text-xl font-bold text-[#1C1917] mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs font-semibold text-[#B45309] italic mb-3">
                    "{step.quote}"
                  </p>

                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F5F2EC] flex items-center justify-between text-[11px] text-[#78716C]">
                  <span>Phase {step.num}</span>
                  <span className="flex items-center gap-1 font-medium text-[#1C1917]">
                    Safe by design
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
