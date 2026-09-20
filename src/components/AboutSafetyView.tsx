import React, { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Award, 
  Building2, 
  ArrowRight,
  Users,
  HeartHandshake
} from 'lucide-react';
import { HumanitarianPartnershipModal } from './HumanitarianPartnershipModal';
import { InteractiveText } from './InteractiveHeadline';
import handsSproutImg from '../assets/images/hands_holding_sprout.jpg';

interface AboutSafetyViewProps {
  onStartIntake?: () => void;
  onNavigateHome?: () => void;
}

export const AboutSafetyView: React.FC<AboutSafetyViewProps> = ({
  onStartIntake,
  onNavigateHome
}) => {
  const [showOrgModal, setShowOrgModal] = useState(false);

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1C1917] pb-20">
      {/* Responsive wide container matching header and footer alignment */}
      <div className="site-container pt-4 sm:pt-6 md:pt-8 space-y-10 sm:space-y-12 md:space-y-14">
        
        {/* ========================================================================= */}
        {/* HERO BANNER: "Our mission" with misty valley & hand holding seedling       */}
        {/* ========================================================================= */}
        <div className="relative rounded-2xl md:rounded-3xl border border-[#E6E0D6] overflow-hidden bg-[#FAF8F5] min-h-[420px] sm:min-h-[460px] md:min-h-[500px] lg:min-h-[520px] xl:min-h-[550px] flex items-center shadow-2xs">
          
          {/* Background photograph (Hands holding seedling in morning mist) */}
          <div className="absolute inset-0 z-0">
            <img
              src={handsSproutImg}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/hands_holding_sprout.jpg';
              }}
              alt="Hands gently holding a small green seedling against misty sunlight"
              className="w-full h-full object-cover object-right md:object-[center_35%] lg:object-center"
            />
            {/* Seamless, organic gradient transition so text is effortlessly readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/92 via-35% md:via-42% to-transparent w-full md:w-3/4 lg:w-[64%]" />
          </div>

          {/* Left Text Content */}
          <div className="relative z-10 p-6 sm:p-10 md:p-12 lg:p-16 xl:p-20 max-w-2xl xl:max-w-3xl space-y-4 sm:space-y-5">
            <span className="text-xs sm:text-[13px] font-semibold text-[#115E59] tracking-wider uppercase block">
              Our mission
            </span>

            <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[50px] font-normal text-[#1C1917] tracking-tight leading-[1.15]">
              <InteractiveText text="Real people. Real memories." /><br />
              <InteractiveText text="A second chance at connection." />
            </h1>

            <p className="text-sm sm:text-base md:text-[16px] text-[#44403C] leading-relaxed max-w-xl font-normal pt-1">
              ThreadBack exists to help people separated by displacement, adoption, or estrangement find possible connections — using the power of AI and human compassion.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FOUR FEATURE COLUMNS ROW (1fr 1fr 1fr 1fr across available desktop width) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-2">
          
          {/* Column 1: For NGOs & Moderators */}
          <div className="pr-4 lg:pr-8 xl:pr-10 pb-6 lg:pb-0 lg:border-r lg:border-[#E7E5E4] space-y-2.5">
            <div className="w-8 h-8 text-[#11322E] flex items-center">
              <Users className="w-5 h-5 stroke-[1.6]" />
            </div>
            <h3 className="font-semibold text-[#1C1917] text-sm sm:text-[15px] tracking-tight">
              For NGOs & Moderators
            </h3>
            <p className="text-xs sm:text-[13px] text-[#78716C] leading-relaxed">
              A tool to support your reunification work.
            </p>
          </div>

          {/* Column 2: Built on Trust */}
          <div className="sm:pl-4 lg:px-8 xl:px-10 pb-6 lg:pb-0 lg:border-r lg:border-[#E7E5E4] space-y-2.5">
            <div className="w-8 h-8 text-[#11322E] flex items-center">
              <ShieldCheck className="w-5 h-5 stroke-[1.6]" />
            </div>
            <h3 className="font-semibold text-[#1C1917] text-sm sm:text-[15px] tracking-tight">
              Built on Trust
            </h3>
            <p className="text-xs sm:text-[13px] text-[#78716C] leading-relaxed">
              Human-verified matches, no auto contact.
            </p>
          </div>

          {/* Column 3: Powered by AI */}
          <div className="pr-4 lg:px-8 xl:px-10 pb-6 lg:pb-0 lg:border-r lg:border-[#E7E5E4] space-y-2.5">
            <div className="w-8 h-8 text-[#11322E] flex items-center">
              <Sparkles className="w-5 h-5 stroke-[1.6]" />
            </div>
            <h3 className="font-semibold text-[#1C1917] text-sm sm:text-[15px] tracking-tight">
              Powered by AI
            </h3>
            <p className="text-xs sm:text-[13px] text-[#78716C] leading-relaxed">
              Finds meaning, not just exact words.
            </p>
          </div>

          {/* Column 4: For a Kinder World */}
          <div className="sm:pl-4 lg:pl-8 xl:pl-10 space-y-2.5">
            <div className="w-8 h-8 text-[#11322E] flex items-center">
              <HeartHandshake className="w-5 h-5 stroke-[1.6]" />
            </div>
            <h3 className="font-semibold text-[#1C1917] text-sm sm:text-[15px] tracking-tight">
              For a Kinder World
            </h3>
            <p className="text-xs sm:text-[13px] text-[#78716C] leading-relaxed">
              Because everyone deserves to be found.
            </p>
          </div>

        </div>

        {/* Subtle Section Divider */}
        <div className="border-t border-[#E7E5E4] pt-2" />

        {/* ========================================================================= */}
        {/* SAFETY & PRIVACY SECTION: Heading with blue dot + 4 Columns               */}
        {/* ========================================================================= */}
        <div id="safety-privacy" className="space-y-6 sm:space-y-8 pt-1 scroll-mt-20">
          <div className="flex items-center gap-2">
            <h2 className="font-serif-display text-2xl sm:text-3xl font-normal text-[#1C1917] tracking-tight">
              <InteractiveText text="Safety & Privacy" />
            </h2>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] shrink-0" />
          </div>

          {/* 4 Columns beneath Safety & Privacy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            
            {/* Item 1: Human-reviewed matches */}
            <div className="space-y-2.5">
              <div className="w-8 h-8 text-[#11322E] flex items-center">
                <Award className="w-5 h-5 stroke-[1.6]" />
              </div>
              <h4 className="font-semibold text-[#1C1917] text-sm sm:text-[15px] tracking-tight">
                Human-reviewed matches
              </h4>
              <p className="text-xs sm:text-[13px] text-[#78716C] leading-relaxed">
                Every connection is reviewed by a trained moderator.
              </p>
            </div>

            {/* Item 2: No automatic contact sharing */}
            <div className="space-y-2.5">
              <div className="w-8 h-8 text-[#11322E] flex items-center">
                <Lock className="w-5 h-5 stroke-[1.6]" />
              </div>
              <h4 className="font-semibold text-[#1C1917] text-sm sm:text-[15px] tracking-tight">
                No automatic contact sharing
              </h4>
              <p className="text-xs sm:text-[13px] text-[#78716C] leading-relaxed">
                Contact information is never shared automatically.
              </p>
            </div>

            {/* Item 3: Fictional data only */}
            <div className="space-y-2.5">
              <div className="w-8 h-8 text-[#11322E] flex items-center">
                <ShieldCheck className="w-5 h-5 stroke-[1.6]" />
              </div>
              <h4 className="font-semibold text-[#1C1917] text-sm sm:text-[15px] tracking-tight">
                Fictional data only
              </h4>
              <p className="text-xs sm:text-[13px] text-[#78716C] leading-relaxed">
                This is a prototype with synthetic data for the demo.
              </p>
            </div>

            {/* Item 4: Not an identity verification */}
            <div className="space-y-2.5">
              <div className="w-8 h-8 text-[#11322E] flex items-center">
                <Shield className="w-5 h-5 stroke-[1.6]" />
              </div>
              <h4 className="font-semibold text-[#1C1917] text-sm sm:text-[15px] tracking-tight">
                Not an identity verification
              </h4>
              <p className="text-xs sm:text-[13px] text-[#78716C] leading-relaxed">
                AI suggestions are not identity verification.
              </p>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* FOR ORGANIZATIONS CARD: Soft green container + Illustration + Button     */}
        {/* ========================================================================= */}
        <div 
          id="for-organizations" 
          className="bg-[#F0F6F2] border border-[#D5E5DC] rounded-2xl md:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xs scroll-mt-20"
        >
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#CDE1D7] flex items-center justify-center text-[#115E59] shrink-0 shadow-2xs">
              <Building2 className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base md:text-[17px] font-semibold text-[#11322E] tracking-tight">
                For Organizations
              </h3>
              <p className="text-xs sm:text-sm text-[#44403C] mt-1 max-w-3xl leading-relaxed">
                NGOs and support organizations can use ThreadBack as a tool to help with reunification efforts and support people in your communities.
              </p>
            </div>
          </div>

          <div className="shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setShowOrgModal(true)}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-[#11322E] hover:bg-[#0D2825] active:bg-[#081C1A] text-white text-xs sm:text-sm font-semibold border border-[#0D2825] flex items-center gap-2 cursor-pointer transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#115E59]"
            >
              <span>Learn more</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ORGANIZATIONS PARTNERSHIP INQUIRY MODAL                                   */}
      {/* ========================================================================= */}
      <HumanitarianPartnershipModal
        isOpen={showOrgModal}
        onClose={() => setShowOrgModal(false)}
      />

    </div>
  );
};
