import React from 'react';
import { ShieldCheck, UserCheck, Lock, EyeOff, FileCode, CheckCircle2 } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const pillars = [
    {
      icon: <UserCheck className="w-5 h-5 text-[#B45309]" />,
      title: 'Human-Reviewed Matches',
      description:
        'Every potential connection requires rigorous evaluation by an accredited NGO caseworker. AI never initiates reunification or concludes identity automatically.',
    },
    {
      icon: <EyeOff className="w-5 h-5 text-[#B45309]" />,
      title: 'No Automatic Contact Sharing',
      description:
        'Personal contact information, current locations, and phone numbers are never disclosed across parties through the algorithmic interface.',
    },
    {
      icon: <FileCode className="w-5 h-5 text-[#B45309]" />,
      title: 'Synthetic Data for Demonstration',
      description:
        'To preserve the privacy of vulnerable separated persons and displaced communities, this live prototype operates exclusively with synthetic narrative composites.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#B45309]" />,
      title: 'Suggestions ≠ Identity Verification',
      description:
        'Semantic similarity indicates descriptive narrative overlap, not biological or legal proof. Field caseworkers cross-verify with archives before outreach.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#E7E5E4]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] rounded-3xl border border-[#E7E5E4] p-8 sm:p-12 relative overflow-hidden">
          {/* Subtle background insignia */}
          <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
            <ShieldCheck className="w-64 h-64 text-[#1C1917]" />
          </div>

          <div className="max-w-2xl mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Ethical AI Safeguards
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight mb-3">
              Built on Trust, Restraint, and Human Dignity
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Family reunification is among the most sensitive human journeys. Technology must serve caseworkers with utmost caution, never overpromising or bypassing human judgment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 border border-[#E7E5E4] shadow-2xs hover:border-[#D6D3D1] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#E7E5E4] flex items-center justify-center shrink-0">
                    {pillar.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1C1917] mb-1">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#57534E] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Banner Callout */}
          <div className="mt-8 pt-6 border-t border-[#E7E5E4] flex flex-wrap items-center justify-between gap-4 text-xs text-[#78716C]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Compliant with Humanitarian Protection Information Standards</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono-code text-[11px]">Audit Protocol v2.4</span>
              <span>•</span>
              <span className="text-[#1C1917] font-medium">NGO Caseworker Governed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
