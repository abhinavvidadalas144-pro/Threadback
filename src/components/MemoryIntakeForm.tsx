import React, { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  ArrowRight, 
  ArrowLeft, 
  FileText,
  ChevronDown,
  Check,
  Compass,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { MemoryType, MemoryProfile, StructuredMemory } from '../types';
import { extractStructuredMemory } from '../utils/memoryExtractor';
import { DEMO_SCENARIOS, DemoScenario } from '../data/demoScenarios';
import { InteractiveText } from './InteractiveHeadline';
import heroLandscapeImg from '../assets/images/hero_misty_landscape.jpg';

interface MemoryIntakeFormProps {
  initialType?: MemoryType;
  onComplete: (profile: MemoryProfile) => void;
  onCancel: () => void;
}

export const MemoryIntakeForm: React.FC<MemoryIntakeFormProps> = ({
  initialType = 'searching',
  onComplete,
  onCancel,
}) => {
  const [type, setType] = useState<MemoryType>(initialType);
  const [step, setStep] = useState<number>(1); // 1: Memory, 2: Details, 3: Review
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);

  // Sync type when initialType changes
  useEffect(() => {
    if (initialType) {
      setType(initialType);
    }
  }, [initialType]);

  // Form fields
  const [whoDescribing, setWhoDescribing] = useState('');
  const [approxNames, setApproxNames] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [timePeriodAge, setTimePeriodAge] = useState('');
  const [distinguishingDetail, setDistinguishingDetail] = useState('');
  const [relationship, setRelationship] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Step 2 details: Narrative free-form
  const [rawMemoryText, setRawMemoryText] = useState('');

  const loadScenario = (scenario: DemoScenario) => {
    setSelectedScenarioId(scenario.id);
    setType(scenario.type);
    setWhoDescribing(scenario.whoDescribing);
    setApproxNames(scenario.approxNames);
    setLocationDetails(scenario.locationDetails);
    setTimePeriodAge(scenario.timePeriodAge);
    setDistinguishingDetail(scenario.distinguishingDetail);
    setRelationship(scenario.relationship);
    setRawMemoryText(scenario.rawMemoryText);
    setErrors({});
  };

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};

    const hasAnyContent = 
      whoDescribing.trim().length > 0 ||
      approxNames.trim().length > 0 ||
      locationDetails.trim().length > 0 ||
      timePeriodAge.trim().length > 0 ||
      relationship.trim().length > 0 ||
      distinguishingDetail.trim().length > 0 ||
      rawMemoryText.trim().length > 0;

    if (!hasAnyContent) {
      newErrors.general = 'Please provide at least one memory fragment (such as an approximate name, location, time period, or description). Incomplete and uncertain recollections are welcome.';
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleContinue = () => {
    if (step === 1) {
      if (!validateStep1()) {
        return;
      }

      // If user hasn't filled narrative yet, provide a coherent narrative composed from entered details
      if (!rawMemoryText.trim()) {
        const who = whoDescribing.trim() || 'someone';
        const name = approxNames.trim() ? `named ${approxNames.trim()}` : '';
        const loc = locationDetails.trim() ? `around ${locationDetails.trim()}` : '';
        const time = timePeriodAge.trim() ? `during ${timePeriodAge.trim()}` : '';
        const extra = distinguishingDetail.trim() ? ` Distinguishing detail: ${distinguishingDetail.trim()}.` : '';
        
        const fragments = [who, name, loc, time].filter(Boolean).join(' ');
        const narrative = type === 'searching'
          ? `I am looking for ${fragments}.${extra}`
          : `I have information regarding ${fragments}.${extra}`;
        setRawMemoryText(narrative);
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2) {
      // Ensure there's some narrative text
      if (!rawMemoryText.trim()) {
        const who = whoDescribing.trim() || 'Person';
        const name = approxNames.trim() || 'Name unspecified';
        const loc = locationDetails.trim() || 'Location unspecified';
        const time = timePeriodAge.trim() || 'Timeline unspecified';
        setRawMemoryText(`${who} (${name}). Location: ${loc}. Time: ${time}.`);
      }
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSynthesize();
    }
  };

  const handleSynthesize = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Extract structured memory strictly from the submitted narrative and fields without inventing facts
      const parsedData = extractStructuredMemory({
        rawMemoryText: rawMemoryText.trim(),
        whoDescribing: whoDescribing.trim(),
        approxNames: approxNames.trim(),
        locationDetails: locationDetails.trim(),
        timePeriodAge: timePeriodAge.trim(),
        distinguishingDetail: distinguishingDetail.trim(),
        relationship: relationship.trim(),
        type,
      });

      const randomIdSuffix = Math.floor(100 + Math.random() * 900);
      const newProfile: MemoryProfile = {
        id: `MEM-${randomIdSuffix}`,
        type,
        whoDescribing: whoDescribing.trim() || parsedData.relationship,
        relationship: parsedData.relationship || relationship.trim() || 'Family Member',
        rawMemoryText: rawMemoryText.trim(),
        structuredData: parsedData,
        submittedDate: 'Today',
        status: 'New',
        isSyntheticDemo: false,
      };

      setIsProcessing(false);
      onComplete(newProfile);
    }, 600);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-20 sm:pb-28">
      {/* 4 & 5. HERO / TOP IMAGE BANNER WITH CENTERED CONTENT */}
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E5DFD5] shadow-xs">
          {/* Background image: reference misty landscape */}
          <div className="absolute inset-0">
            <img
              src={heroLandscapeImg}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/hero_misty_landscape.jpg';
              }}
              alt="Misty valley and mountain landscape"
              className="w-full h-full object-cover object-[center_35%]"
            />
            {/* Soft atmospheric gradient wash ensuring high text legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/50 to-white/70 backdrop-blur-[0.5px]" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 pt-11 sm:pt-14 pb-12 sm:pb-14 px-4 text-center">
            <h1 className="font-serif-display text-3xl sm:text-4xl md:text-[42px] font-normal text-[#1C1917] tracking-tight leading-tight">
              <InteractiveText text="Share what you remember" />
            </h1>
            <p className="text-xs sm:text-sm md:text-[15px] text-[#44403C] mt-2 sm:mt-2.5 font-normal max-w-xl mx-auto">
              Every detail, no matter how small, can make a difference.
            </p>

            {/* 6. SEARCH / INFORMATION TOGGLE */}
            <div className="mt-6 sm:mt-7 flex justify-center">
              <div className="inline-flex p-1 bg-white/90 backdrop-blur-md border border-white/80 rounded-full shadow-[0_4px_18px_rgba(28,25,23,0.06)]">
                <button
                  type="button"
                  onClick={() => {
                    setType('searching');
                    setErrors({});
                  }}
                  className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
                    type === 'searching'
                      ? 'bg-[#115E59] text-white shadow-2xs'
                      : 'text-[#44403C] hover:text-[#1C1917]'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 shrink-0" />
                  <span>I'm searching for someone</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setType('information');
                    setErrors({});
                  }}
                  className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
                    type === 'information'
                      ? 'bg-[#115E59] text-white shadow-2xs'
                      : 'text-[#44403C] hover:text-[#1C1917]'
                  }`}
                >
                  <span>I have information</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. PROGRESS INDICATOR (Immediately below the hero) */}
      <div className="flex items-center justify-center mt-9 sm:mt-11 mb-8 sm:mb-10 px-4">
        <div className="flex items-center">
          {/* 01 Memory */}
          <div className="flex items-center">
            <div
              className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold shrink-0 transition-colors ${
                step >= 1
                  ? 'bg-[#115E59] text-white'
                  : 'border border-[#D6D0C4] text-[#78716C]'
              }`}
            >
              {step > 1 ? <Check className="w-3.5 h-3.5" /> : '01'}
            </div>
            <span
              className={`text-xs sm:text-sm ml-2 shrink-0 ${
                step === 1 ? 'font-semibold text-[#1C1917]' : 'font-medium text-[#78716C]'
              }`}
            >
              Memory
            </span>
          </div>

          {/* Connector line */}
          <div className="w-14 sm:w-20 md:w-28 h-px bg-[#D6D0C4] mx-3 sm:mx-4" />

          {/* 02 Details */}
          <div className="flex items-center">
            <div
              className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold shrink-0 transition-colors ${
                step === 2
                  ? 'bg-[#115E59] text-white'
                  : step > 2
                  ? 'bg-[#115E59] text-white'
                  : 'border border-[#D6D0C4] text-[#78716C]'
              }`}
            >
              {step > 2 ? <Check className="w-3.5 h-3.5" /> : '02'}
            </div>
            <span
              className={`text-xs sm:text-sm ml-2 shrink-0 ${
                step === 2 ? 'font-semibold text-[#1C1917]' : 'font-medium text-[#78716C]'
              }`}
            >
              Details
            </span>
          </div>

          {/* Connector line */}
          <div className="w-14 sm:w-20 md:w-28 h-px bg-[#D6D0C4] mx-3 sm:mx-4" />

          {/* 03 Review */}
          <div className="flex items-center">
            <div
              className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold shrink-0 transition-colors ${
                step === 3
                  ? 'bg-[#115E59] text-white'
                  : 'border border-[#D6D0C4] text-[#78716C]'
              }`}
            >
              03
            </div>
            <span
              className={`text-xs sm:text-sm ml-2 shrink-0 ${
                step === 3 ? 'font-semibold text-[#1C1917]' : 'font-medium text-[#78716C]'
              }`}
            >
              Review
            </span>
          </div>
        </div>
      </div>

      {/* 8. MAIN MEMORY FORM CONTAINER */}
      <div className="w-full max-w-[940px] mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5DFD5] p-6 sm:p-10 md:p-12 shadow-[0_4px_24px_rgba(28,25,23,0.03)]">
          
          {step === 1 && (
            <div>
              {/* 9. "YOUR MEMORY" SECTION HEADER & DEMO SELECTOR */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-[#F5F2EC]">
                <div className="flex items-center gap-2.5">
                  <User className="w-5 h-5 text-[#115E59] stroke-[2.2]" />
                  <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-[#11322E] tracking-tight">
                    <InteractiveText text="Your Memory" />
                  </h2>
                </div>

                {/* Scenario helper pill */}
                <div className="flex items-center gap-1.5 text-xs text-[#78716C]">
                  <Sparkles className="w-3.5 h-3.5 text-[#115E59]" />
                  <span>Choose a demo test scenario or enter your own</span>
                </div>
              </div>

              {/* DEMO SCENARIOS BAR */}
              <div className="mb-7 bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl p-3 sm:p-3.5">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#57534E] mb-2">
                  Fictional Demo Test Scenarios:
                </span>
                <div className="flex flex-wrap gap-2">
                  {DEMO_SCENARIOS.map((sc) => {
                    const isSelected = selectedScenarioId === sc.id;
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => loadScenario(sc)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#115E59] text-white shadow-2xs font-semibold'
                            : 'bg-white hover:bg-[#F2ECE1] border border-[#DCD5C8] text-[#1C1917]'
                        }`}
                        title={sc.summaryText}
                      >
                        <span>{sc.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-sm ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-[#FAF8F5] text-[#57534E] border border-[#E2DDD2]'
                        }`}>
                          {sc.badge.split('(')[1]?.replace(')', '') || sc.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {selectedScenarioId && (
                  <p className="text-[11px] text-[#57534E] mt-2 pt-2 border-t border-[#E7E2D8]/60">
                    <strong>Loaded Scenario:</strong> {DEMO_SCENARIOS.find(s => s.id === selectedScenarioId)?.testingNotes}
                  </p>
                )}
              </div>

              {errors.general && (
                <div className="mb-6 p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center gap-2.5 text-xs text-[#B91C1C]">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
                  <span>{errors.general}</span>
                </div>
              )}

              {/* 9 & 10. TWO-COLUMN FORM LAYOUT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-10 gap-y-6 sm:gap-y-7">
                
                {/* Field 1 (Left Col): Who are you describing? */}
                <div>
                  <label className="block text-xs sm:text-[13px] font-semibold text-[#1C1917] mb-1.5">
                    {type === 'searching' ? 'Who are you searching for?' : 'Who do you have information about?'} <span className="text-[#DC2626] font-normal">*</span>
                  </label>
                  <input
                    type="text"
                    value={whoDescribing}
                    onChange={(e) => {
                      setWhoDescribing(e.target.value);
                      if (errors.whoDescribing) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.whoDescribing;
                          return next;
                        });
                      }
                    }}
                    placeholder={type === 'searching' ? 'e.g. My mother, my sister, a childhood friend...' : 'e.g. A neighbor, someone from my village...'}
                    className={`w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-lg border bg-white text-xs sm:text-sm text-[#1C1917] placeholder:text-[#9C948A] focus:outline-none transition-colors ${
                      errors.whoDescribing 
                        ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]/20' 
                        : 'border-[#D6D0C4] focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59]/20'
                    }`}
                  />
                  {errors.whoDescribing ? (
                    <span className="block text-[11px] text-[#DC2626] mt-1 font-medium">
                      {errors.whoDescribing}
                    </span>
                  ) : (
                    <span className="block text-[11px] sm:text-xs text-[#78716C] mt-1.5">
                      It's okay if you're unsure.
                    </span>
                  )}
                </div>

                {/* Field 2 (Right Col): Approximate name(s) */}
                <div>
                  <label className="block text-xs sm:text-[13px] font-semibold text-[#1C1917] mb-1.5">
                    Approximate name(s) <span className="text-[#DC2626] font-normal">*</span>
                  </label>
                  <input
                    type="text"
                    value={approxNames}
                    onChange={(e) => {
                      setApproxNames(e.target.value);
                      if (errors.approxNames) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.approxNames;
                          return next;
                        });
                      }
                    }}
                    placeholder="e.g. Kamla, Kamala, Kami..."
                    className={`w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-lg border bg-white text-xs sm:text-sm text-[#1C1917] placeholder:text-[#9C948A] focus:outline-none transition-colors ${
                      errors.approxNames 
                        ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]/20' 
                        : 'border-[#D6D0C4] focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59]/20'
                    }`}
                  />
                  {errors.approxNames ? (
                    <span className="block text-[11px] text-[#DC2626] mt-1 font-medium">
                      {errors.approxNames}
                    </span>
                  ) : (
                    <span className="block text-[11px] sm:text-xs text-[#78716C] mt-1.5">
                      Multiple guesses are okay.
                    </span>
                  )}
                </div>

                {/* Field 3 (Left Col): Place or location details */}
                <div>
                  <label className="block text-xs sm:text-[13px] font-semibold text-[#1C1917] mb-1.5">
                    Place or location details <span className="text-[#DC2626] font-normal">*</span>
                  </label>
                  <input
                    type="text"
                    value={locationDetails}
                    onChange={(e) => {
                      setLocationDetails(e.target.value);
                      if (errors.locationDetails) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.locationDetails;
                          return next;
                        });
                      }
                    }}
                    placeholder="e.g. A village near a river, a specific landmark..."
                    className={`w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-lg border bg-white text-xs sm:text-sm text-[#1C1917] placeholder:text-[#9C948A] focus:outline-none transition-colors ${
                      errors.locationDetails 
                        ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]/20' 
                        : 'border-[#D6D0C4] focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59]/20'
                    }`}
                  />
                  {errors.locationDetails ? (
                    <span className="block text-[11px] text-[#DC2626] mt-1 font-medium">
                      {errors.locationDetails}
                    </span>
                  ) : (
                    <span className="block text-[11px] sm:text-xs text-[#78716C] mt-1.5">
                      A village, a landmark, or a description of the area.
                    </span>
                  )}
                </div>

                {/* Field 4 (Right Col): Approximate time period / age */}
                <div>
                  <label className="block text-xs sm:text-[13px] font-semibold text-[#1C1917] mb-1.5">
                    Approximate time period / age <span className="text-[#DC2626] font-normal">*</span>
                  </label>
                  <input
                    type="text"
                    value={timePeriodAge}
                    onChange={(e) => {
                      setTimePeriodAge(e.target.value);
                      if (errors.timePeriodAge) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.timePeriodAge;
                          return next;
                        });
                      }
                    }}
                    placeholder="e.g. late 1960s, around 6 years old..."
                    className={`w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-lg border bg-white text-xs sm:text-sm text-[#1C1917] placeholder:text-[#9C948A] focus:outline-none transition-colors ${
                      errors.timePeriodAge 
                        ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]/20' 
                        : 'border-[#D6D0C4] focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59]/20'
                    }`}
                  />
                  {errors.timePeriodAge ? (
                    <span className="block text-[11px] text-[#DC2626] mt-1 font-medium">
                      {errors.timePeriodAge}
                    </span>
                  ) : (
                    <span className="block text-[11px] sm:text-xs text-[#78716C] mt-1.5">
                      A range is helpful.
                    </span>
                  )}
                </div>

                {/* Field 5 (Left Col): Any distinguishing detail */}
                <div>
                  <label className="block text-xs sm:text-[13px] font-semibold text-[#1C1917] mb-1.5">
                    Any distinguishing detail
                  </label>
                  <input
                    type="text"
                    value={distinguishingDetail}
                    onChange={(e) => setDistinguishingDetail(e.target.value)}
                    placeholder="e.g. a habit, a mark, a story, anything unique..."
                    className="w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-lg border border-[#D6D0C4] bg-white text-xs sm:text-sm text-[#1C1917] placeholder:text-[#9C948A] focus:outline-none focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59]/20 transition-colors"
                  />
                  <span className="block text-[11px] sm:text-xs text-[#78716C] mt-1.5">
                    Small details can be meaningful.
                  </span>
                </div>

                {/* Field 6 (Right Col): Your relationship to the person */}
                <div>
                  <label className="block text-xs sm:text-[13px] font-semibold text-[#1C1917] mb-1.5">
                    {type === 'searching' ? 'Your relationship to the person' : 'How you know of this person / connection'} <span className="text-[#DC2626] font-normal">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={relationship}
                      onChange={(e) => {
                        setRelationship(e.target.value);
                        if (errors.relationship) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.relationship;
                            return next;
                          });
                        }
                      }}
                      className={`w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-lg border bg-white text-xs sm:text-sm focus:outline-none appearance-none pr-10 cursor-pointer transition-colors ${
                        errors.relationship
                          ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]/20'
                          : 'border-[#D6D0C4] focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59]/20'
                      } ${relationship ? 'text-[#1C1917]' : 'text-[#9C948A]'}`}
                    >
                      <option value="" disabled>Select relationship</option>
                      <option value="Sister">Sister</option>
                      <option value="Brother">Brother</option>
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Child / Daughter / Son">Child / Daughter / Son</option>
                      <option value="Childhood Friend">Childhood Friend</option>
                      <option value="Extended Family">Extended Family</option>
                      <option value="Neighbor / Community Member">Neighbor / Community Member</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#78716C] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {errors.relationship ? (
                    <span className="block text-[11px] text-[#DC2626] mt-1 font-medium">
                      {errors.relationship}
                    </span>
                  ) : (
                    <span className="block text-[11px] sm:text-xs text-[#78716C] mt-1.5">
                      Select the closest description.
                    </span>
                  )}
                </div>

              </div>

              {/* 13. PRIVACY INFORMATION STRIP */}
              <div className="mt-8 sm:mt-9 mb-7 sm:mb-8 bg-[#EEF5F1] border border-[#D5E3DC] rounded-xl p-3.5 sm:p-4 flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#115E59] text-white flex items-center justify-center shrink-0">
                  <Shield className="w-3 h-3" />
                </div>
                <p className="text-xs sm:text-[13px] text-[#374151] leading-relaxed">
                  Your information stays private. A moderator will review potential matches before any contact is made.
                </p>
              </div>

              {/* 14. BOTTOM ACTIONS */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-5 sm:px-6 py-2.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F2ECE1] active:bg-[#E8DFD0] border border-[#D6D0C4] text-xs sm:text-sm font-medium text-[#1C1917] transition-colors duration-150 cursor-pointer"
                >
                  Save & Exit
                </button>

                <button
                  type="button"
                  onClick={handleContinue}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg bg-[#115E59] hover:bg-[#0D4D49] active:bg-[#0A3D3A] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors duration-150 cursor-pointer shadow-xs"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#F5F2EC]">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-[#115E59]" />
                  <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-[#11322E] tracking-tight">
                    In Your Own Words
                  </h2>
                </div>
                <span className="text-xs font-medium text-[#78716C] bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-[#E5DFD5]">
                  Step 02 of 03
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                Write your recollection freely. Tell the story of what you recall — landmarks, feelings, names, or the environment. Small narrative memories help moderators identify nuanced connections.
              </p>

              <div>
                <textarea
                  rows={6}
                  value={rawMemoryText}
                  onChange={(e) => setRawMemoryText(e.target.value)}
                  placeholder="Write your recollection freely..."
                  className="w-full p-4 rounded-xl border border-[#D6D0C4] text-xs sm:text-sm font-serif-display leading-relaxed text-[#1C1917] placeholder:text-[#9C948A] focus:outline-none focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59]/20 bg-[#FAF8F5]"
                />
              </div>

              <div className="bg-[#EEF5F1] border border-[#D5E3DC] rounded-xl p-3.5 sm:p-4 flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#115E59] text-white flex items-center justify-center shrink-0">
                  <Shield className="w-3 h-3" />
                </div>
                <p className="text-xs sm:text-[13px] text-[#374151] leading-relaxed">
                  Your narrative is strictly confidential. Only approved moderators will verify details before any contact occurs.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 sm:px-6 py-2.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F2ECE1] active:bg-[#E8DFD0] border border-[#D6D0C4] text-xs sm:text-sm font-medium text-[#1C1917] transition-colors duration-150 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleContinue}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg bg-[#115E59] hover:bg-[#0D4D49] active:bg-[#0A3D3A] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors duration-150 cursor-pointer shadow-xs"
                >
                  <span>Review Memory</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#F5F2EC]">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-[#115E59]" />
                  <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-[#11322E] tracking-tight">
                    Review Your Memory Profile
                  </h2>
                </div>
                <span className="text-xs font-medium text-[#78716C] bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-[#E5DFD5]">
                  Step 03 of 03
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl p-5">
                <div>
                  <span className="text-[#78716C] block text-xs">Describing:</span>
                  <span className="font-medium text-[#1C1917]">{whoDescribing || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-[#78716C] block text-xs">Approximate Name(s):</span>
                  <span className="font-medium text-[#1C1917]">{approxNames || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-[#78716C] block text-xs">Place / Location:</span>
                  <span className="font-medium text-[#1C1917]">{locationDetails || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-[#78716C] block text-xs">Time Period / Age:</span>
                  <span className="font-medium text-[#1C1917]">{timePeriodAge || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-[#78716C] block text-xs">Relationship:</span>
                  <span className="font-medium text-[#1C1917]">{relationship || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-[#78716C] block text-xs">Distinguishing Detail:</span>
                  <span className="font-medium text-[#1C1917]">{distinguishingDetail || 'None specified'}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E5E4] text-xs sm:text-sm font-serif-display italic text-[#1C1917] leading-relaxed">
                "{rawMemoryText}"
              </div>

              <div className="bg-[#EEF5F1] border border-[#D5E3DC] rounded-xl p-3.5 sm:p-4 flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#115E59] text-white flex items-center justify-center shrink-0">
                  <Shield className="w-3 h-3" />
                </div>
                <p className="text-xs sm:text-[13px] text-[#374151] leading-relaxed">
                  ThreadBack will carefully organize your recollection into a structured summary for trained moderator review.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 sm:px-6 py-2.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F2ECE1] active:bg-[#E8DFD0] border border-[#D6D0C4] text-xs sm:text-sm font-medium text-[#1C1917] transition-colors duration-150 cursor-pointer"
                >
                  Edit Narrative
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleSynthesize}
                  className="px-7 sm:px-9 py-2.5 sm:py-3 rounded-lg bg-[#115E59] hover:bg-[#0D4D49] active:bg-[#0A3D3A] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors duration-150 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Organizing Memory...</span>
                    </>
                  ) : (
                    <>
                      <span>Review Profile</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
