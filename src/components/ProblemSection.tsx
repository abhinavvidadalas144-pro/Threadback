import React, { useState } from 'react';
import { Database, GitCommit, Sparkles, ArrowRight, Check, AlertCircle } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<'fragmented' | 'connected'>('connected');

  const fragments = [
    {
      id: 'f1',
      rawText: '"Kamla... or Kamala"',
      field: 'NAME VARIATION',
      dbError: '0 records found for exact name "Kamla"',
      aiSynthesized: 'Phonetic cluster [k-m-l-a] accommodating dialectic vowel shift',
      category: 'Identity fragment',
    },
    {
      id: 'f2',
      rawText: '"Village near a river"',
      field: 'GEOGRAPHIC DESCRIPTOR',
      dbError: 'Postal code or municipality required',
      aiSynthesized: 'Topographical marker mapped to regional fluvial settlements',
      category: 'Spatial memory',
    },
    {
      id: 'f3',
      rawText: '"Maybe 1988"',
      field: 'TEMPORAL RANGE',
      dbError: 'Valid birth date (YYYY-MM-DD) required',
      aiSynthesized: 'Probabilistic cohort band: 1987–1989 (± 18 months)',
      category: 'Chronological anchor',
    },
    {
      id: 'f4',
      rawText: '"Temple near our home"',
      field: 'RELATIONAL LANDMARK',
      dbError: 'Non-standard relational query rejected',
      aiSynthesized: 'Co-location constraint: residence proximate to temple site',
      category: 'Sensory landmark',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#F5F2EC]/60 border-y border-[#E7E5E4] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-bold tracking-widest text-[#B45309] uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block mb-3">
            The Fundamental Challenge
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight mb-4">
            Memory doesn't work like a database.
          </h2>
          <p className="text-base text-[#57534E] leading-relaxed">
            Traditional search often depends on exact information. Human memory rarely is.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-xl bg-[#EBE7DF] border border-[#DDD8CE]">
            <button
              onClick={() => setViewMode('fragmented')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'fragmented'
                  ? 'bg-white text-[#1C1917] shadow-xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Rigid Database Schema (Fails)</span>
            </button>
            <button
              onClick={() => setViewMode('connected')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'connected'
                  ? 'bg-[#1C1917] text-white shadow-xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>ThreadBack Semantic Weave</span>
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Cards Display */}
        <div className="relative">
          {viewMode === 'connected' && (
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-1/2 z-0 pointer-events-none">
              <svg className="w-full h-12" viewBox="0 0 1000 48" fill="none">
                <path
                  d="M 120 24 C 300 24, 400 24, 500 24 C 600 24, 700 24, 880 24"
                  stroke="#B45309"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  className="animate-thread-flow"
                  opacity="0.6"
                />
              </svg>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {fragments.map((frag, idx) => (
              <div
                key={frag.id}
                className={`p-5 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                  viewMode === 'connected'
                    ? 'bg-white border-[#B45309]/40 shadow-sm ring-1 ring-[#B45309]/10'
                    : 'bg-[#FAF8F5] border-[#E7E5E4] opacity-90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono-code font-bold tracking-wider text-[#78716C]">
                      FRAGMENT 0{idx + 1}
                    </span>
                    <span className="text-[10px] bg-[#F5F2EC] px-2 py-0.5 rounded text-[#57534E]">
                      {frag.category}
                    </span>
                  </div>

                  <div className="font-serif-display text-xl text-[#1C1917] font-semibold my-2 italic">
                    {frag.rawText}
                  </div>

                  <p className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wide mb-3">
                    {frag.field}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F5F2EC]">
                  {viewMode === 'fragmented' ? (
                    <div className="flex items-start gap-1.5 text-[11px] text-[#DC2626] bg-red-50 p-2 rounded-lg border border-red-100">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{frag.dbError}</span>
                    </div>
                  ) : (
                    <div className="flex items-start gap-1.5 text-[11px] text-[#1C1917] bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/80">
                      <Check className="w-3.5 h-3.5 text-[#B45309] shrink-0 mt-0.5" />
                      <span className="text-[#44403C] leading-snug">
                        {frag.aiSynthesized}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explanatory takeaway banner */}
        <div className="mt-8 bg-white rounded-xl p-4 sm:p-5 border border-[#E7E5E4] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#E7E5E4] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#B45309]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1C1917]">
                ThreadBack translates fuzzy human narratives into interconnected semantic coordinates.
              </p>
              <p className="text-[11px] text-[#78716C]">
                Allowing caseworkers to find compatible matches without requiring formal census or parish paperwork.
              </p>
            </div>
          </div>

          <div className="text-[11px] font-mono-code text-[#B45309] font-medium shrink-0 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
            Semantic Vector Distance: 0.87
          </div>
        </div>
      </div>
    </section>
  );
};
