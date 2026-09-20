import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  MapPin, 
  Clock, 
  Calendar,
  Bookmark, 
  Users, 
  Pencil, 
  ArrowRight,
  Check,
  X,
  ShieldCheck,
  Sparkles,
  Link2,
  Building2,
  AlertCircle
} from 'lucide-react';
import { MemoryProfile, PotentialMatch } from '../types';
import { findPotentialMatchesForProfile } from '../utils/matchingEngine';
import { extractStructuredMemory } from '../utils/memoryExtractor';
import { DEMO_SCENARIOS, DemoScenario } from '../data/demoScenarios';

interface InteractiveHeadingTextProps {
  text: string;
  className?: string;
  hoverColorClass?: string;
  liftPx?: number;
}

const InteractiveHeadingText: React.FC<InteractiveHeadingTextProps> = ({
  text,
  className = '',
  hoverColorClass = 'hover:text-[#115E59]',
  liftPx = -4,
}) => {
  const words = text.split(' ');
  return (
    <span className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}>
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-flex">
          {word.split('').map((char, charIdx) => (
            <motion.span
              key={charIdx}
              className={`inline-block transition-colors duration-200 cursor-default select-none ${hoverColorClass}`}
              whileHover={{
                y: liftPx,
                scale: 1.03,
                transition: { type: 'spring', stiffness: 500, damping: 18 },
              }}
              animate={{ y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
};

interface AIMemorySummaryProps {
  profile: MemoryProfile;
  allProfiles?: MemoryProfile[];
  onConfirm: (updatedProfile: MemoryProfile) => void;
  onEditAgain: () => void;
  onExploreMatches: (profileId: string) => void;
  onSelectMatch?: (match: PotentialMatch) => void;
}

export const AIMemorySummary: React.FC<AIMemorySummaryProps> = ({
  profile,
  allProfiles = [],
  onConfirm,
  onEditAgain,
  onExploreMatches,
  onSelectMatch,
}) => {
  // Toggle between "Your original memory" and "AI interpretation"
  const [activeToggle, setActiveToggle] = useState<'raw' | 'interpretation'>('interpretation');
  
  // Inline editing state for memory and structured fields
  const [isEditingRaw, setIsEditingRaw] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Editable states
  const [rawText, setRawText] = useState(profile.rawMemoryText || '');
  const [names, setNames] = useState(
    profile.structuredData.names.length > 0
      ? profile.structuredData.names.join(' / ')
      : ''
  );
  const [locations, setLocations] = useState(
    profile.structuredData.locations.length > 0
      ? profile.structuredData.locations.join(', ')
      : ''
  );
  const [timePeriod, setTimePeriod] = useState(
    profile.structuredData.timePeriod || ''
  );
  const [approxAge, setApproxAge] = useState(
    profile.structuredData.approximateAge || ''
  );
  const [distinguishing, setDistinguishing] = useState(
    profile.structuredData.distinguishingMemories.length > 0
      ? profile.structuredData.distinguishingMemories.join('\n')
      : ''
  );
  const [relationship, setRelationship] = useState(
    profile.structuredData.relationship || ''
  );

  // Synchronize when profile changes
  React.useEffect(() => {
    setRawText(profile.rawMemoryText || '');
    setNames(
      profile.structuredData.names.length > 0
        ? profile.structuredData.names.join(' / ')
        : ''
    );
    setLocations(
      profile.structuredData.locations.length > 0
        ? profile.structuredData.locations.join(', ')
        : ''
    );
    setTimePeriod(profile.structuredData.timePeriod || '');
    setApproxAge(profile.structuredData.approximateAge || '');
    setDistinguishing(
      profile.structuredData.distinguishingMemories.length > 0
        ? profile.structuredData.distinguishingMemories.join('\n')
        : ''
    );
    setRelationship(profile.structuredData.relationship || '');
  }, [profile]);

  // Current live profile representation
  const currentProfile = useMemo<MemoryProfile>(() => {
    return {
      ...profile,
      rawMemoryText: rawText,
      structuredData: {
        names: names.split(/[/,]/).map((n) => n.trim()).filter(Boolean),
        locations: locations.split(/[\n,;]/).map((l) => l.trim()).filter(Boolean),
        timePeriod,
        approximateAge: approxAge,
        distinguishingMemories: distinguishing.split(/[\n,;]/).map((d) => d.trim()).filter(Boolean),
        relationship,
      },
    };
  }, [profile, rawText, names, locations, timePeriod, approxAge, distinguishing, relationship]);

  // Dynamic Prototype Matching: Compare this memory profile against the other fictional profiles
  const potentialMatches = useMemo(() => {
    return findPotentialMatchesForProfile(currentProfile, allProfiles);
  }, [currentProfile, allProfiles]);

  const showSaveSuccess = (message: string) => {
    setSaveToast(message);
    setTimeout(() => {
      setSaveToast(null);
    }, 3000);
  };

  const handleSaveProfileEdits = () => {
    onConfirm(currentProfile);
    setIsEditingProfile(false);
    showSaveSuccess('Structured profile changes saved successfully.');
  };

  const handleSaveRawEdits = () => {
    onConfirm(currentProfile);
    setIsEditingRaw(false);
    showSaveSuccess('Memory narrative updated and saved.');
  };

  const handleLooksRight = () => {
    if (isEditingProfile) {
      handleSaveProfileEdits();
    }
    if (isEditingRaw) {
      handleSaveRawEdits();
    }
    onConfirm(currentProfile);
    onExploreMatches(profile.id);
  };

  const handleSelectScenario = (sc: DemoScenario) => {
    const parsed = extractStructuredMemory({
      rawMemoryText: sc.rawMemoryText,
      whoDescribing: sc.whoDescribing,
      approxNames: sc.approxNames,
      locationDetails: sc.locationDetails,
      timePeriodAge: sc.timePeriodAge,
      distinguishingDetail: sc.distinguishingDetail,
      relationship: sc.relationship,
      type: sc.type,
    });

    const demoProfile: MemoryProfile = {
      id: profile.id,
      type: sc.type,
      whoDescribing: sc.whoDescribing,
      relationship: sc.relationship,
      rawMemoryText: sc.rawMemoryText,
      structuredData: parsed,
      submittedDate: 'Today',
      status: 'New',
      isSyntheticDemo: false,
    };

    setRawText(sc.rawMemoryText);
    setNames(parsed.names.join(' / '));
    setLocations(parsed.locations.join(', '));
    setTimePeriod(parsed.timePeriod);
    setApproxAge(parsed.approximateAge);
    setDistinguishing(parsed.distinguishingMemories.join('\n'));
    setRelationship(parsed.relationship);
    setIsEditingProfile(false);
    setIsEditingRaw(false);

    onConfirm(demoProfile);
    showSaveSuccess(`Loaded ${sc.name} (${sc.badge.split('(')[1]?.replace(')', '') || sc.category})`);
  };

  return (
    <div className="ai-summary-view relative bg-[#FAF8F5] min-h-screen pt-8 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* DECORATIVE VISUALS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg
          className="w-full h-full opacity-35"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M -100 240 C 200 180, 420 320, 720 220 C 1020 120, 1260 260, 1540 180"
            stroke="#DCD5C9"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <path
            d="M 50 620 C 350 560, 600 700, 950 580 C 1200 490, 1400 640, 1580 570"
            stroke="#E3DCD1"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-6 sm:space-y-8">
        
        {/* HEADER SECTION: Title + Subtitle */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#E6F4EA] border border-[#CEEAD6] text-[#137333] text-[11px] font-semibold tracking-wide uppercase">
              Memory Dossier • {profile.id}
            </span>
            <span className="text-xs text-[#78716C]">
              {profile.type === 'searching' ? 'Searching for Someone' : 'Has Information to Share'}
            </span>
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl lg:text-[32px] font-normal text-[#1C1917] tracking-tight">
            <InteractiveHeadingText text="Here's what we understood from your memory" />
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            Our prototype parser structured your recollections across key anchors: locations, time periods, names, relationships, and memory details without inventing facts.
          </p>
        </div>

        {/* FICTIONAL DEMO SCENARIOS TESTER */}
        <div className="bg-white border border-[#E7E2D8] rounded-xl p-3.5 sm:p-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#F5F2EC]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#115E59]" />
              <span className="text-xs font-semibold text-[#1C1917]">
                Test Prototype Matching with Fictional Demo Scenarios
              </span>
            </div>
            <span className="text-[11px] text-[#78716C]">
              Verify matching percentages & conflict detection across scenarios
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {DEMO_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleSelectScenario(sc)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#FAF8F5] border border-[#DCD5C8] text-[#1C1917] hover:text-[#115E59] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>{sc.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-white border border-[#E2DDD2] text-[#57534E] font-semibold">
                  {sc.badge.split('(')[1]?.replace(')', '') || sc.category}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* SAVE CONFIRMATION TOAST / BADGE */}
        {saveToast && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E6F4EA] border border-[#CEEAD6] text-[#137333] text-xs font-medium animate-fadeIn">
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* TOGGLE CONTROLS: Segmented pills for switching focus */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
          <div className="inline-flex p-1 rounded-lg bg-[#EFECE6] border border-[#E3DCD1]">
            <button
              type="button"
              onClick={() => setActiveToggle('raw')}
              className={`px-3.5 py-1.5 rounded-md text-xs transition-colors duration-150 cursor-pointer ${
                activeToggle === 'raw'
                  ? 'bg-white text-[#1C1917] font-semibold shadow-2xs'
                  : 'text-[#78716C] hover:text-[#1C1917] font-medium'
              }`}
            >
              Your original memory
            </button>
            <button
              type="button"
              onClick={() => setActiveToggle('interpretation')}
              className={`px-3.5 py-1.5 rounded-md text-xs transition-colors duration-150 cursor-pointer ${
                activeToggle === 'interpretation'
                  ? 'bg-white text-[#1C1917] font-semibold shadow-2xs'
                  : 'text-[#78716C] hover:text-[#1C1917] font-medium'
              }`}
            >
              Structured profile
            </button>
          </div>

          <span className="text-xs text-[#78716C] italic hidden sm:inline">
            Click any field to edit or refine details
          </span>
        </div>

        {/* SIDE-BY-SIDE SPLIT VIEW CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          
          {/* YOUR MEMORY PANEL (LEFT COLUMN) */}
          <div 
            className={`lg:col-span-5 bg-white rounded-2xl border transition-all duration-200 p-6 sm:p-7 shadow-[0_3px_18px_rgba(28,25,23,0.03)] flex flex-col justify-between ${
              activeToggle === 'raw' 
                ? 'border-[#115E59]/40 ring-1 ring-[#115E59]/20' 
                : 'border-[#E5DFD5]'
            }`}
          >
            <div>
              {/* Heading */}
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#F5F2EC]">
                <h2 className="text-xs sm:text-[13px] font-semibold text-[#1C1917] tracking-tight">
                  <InteractiveHeadingText text="Your memory (raw text)" liftPx={-3} />
                </h2>
                {isEditingRaw ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsEditingRaw(false)}
                      className="p-1 text-[#78716C] hover:text-[#1C1917] transition-colors rounded"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveRawEdits}
                      className="px-2 py-0.5 bg-[#115E59] text-white text-[11px] font-medium rounded-md hover:bg-[#0D4D49] transition-colors"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingRaw(true)}
                    className="p-1 text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
                    title="Edit raw text"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Raw Memory Content */}
              {isEditingRaw ? (
                <div className="mt-2">
                  <textarea
                    rows={7}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-[#D6D0C4] bg-[#FAF8F5] text-xs sm:text-sm font-serif-display leading-relaxed text-[#1C1917] focus:outline-none focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59]/20"
                    placeholder="Enter your memory..."
                  />
                  <p className="text-[11px] text-[#78716C] mt-1.5">
                    Changes will be saved to your profile narrative.
                  </p>
                </div>
              ) : (
                <div className="bg-[#FAF8F5] rounded-xl p-4 sm:p-5 border border-[#EDE8E0]">
                  <p className="font-serif-display text-sm sm:text-[15px] italic leading-relaxed text-[#292524] whitespace-pre-line">
                    "{rawText}"
                  </p>
                </div>
              )}
            </div>

            {/* EDIT MEMORY BUTTON */}
            <div className="pt-6 sm:pt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={onEditAgain}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#FAF8F5] border border-[#D6D0C4] text-xs font-medium text-[#44403C] hover:text-[#1C1917] transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 text-[#78716C]" />
                <span>Edit intake form</span>
              </button>

              <div className="flex items-center gap-1 text-[11px] text-[#78716C]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#115E59]" />
                <span>Private & Secure</span>
              </div>
            </div>
          </div>

          {/* STRUCTURED PROFILE PANEL (RIGHT COLUMN) */}
          <div 
            className={`lg:col-span-7 bg-white rounded-2xl border transition-all duration-200 p-6 sm:p-7 shadow-[0_3px_18px_rgba(28,25,23,0.03)] flex flex-col justify-between ${
              activeToggle === 'interpretation' 
                ? 'border-[#115E59]/40 ring-1 ring-[#115E59]/20' 
                : 'border-[#E5DFD5]'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#F5F2EC]">
                <div>
                  <h2 className="text-sm sm:text-base font-medium text-[#1C1917] tracking-tight">
                    <InteractiveHeadingText text="Structured profile" liftPx={-3} />
                  </h2>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    Key memory anchors extracted from your narrative
                  </p>
                </div>

                {isEditingProfile ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-2 py-1 text-xs text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProfileEdits}
                      className="px-3 py-1 bg-[#115E59] hover:bg-[#0D4D49] text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
                    >
                      Save changes
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer py-1 px-1.5"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Edit details</span>
                  </button>
                )}
              </div>

              {/* Structured Profile Fields */}
              <div className="space-y-4 text-xs">
                
                {/* 1. Name & Relationship Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#F5F2EC]">
                  <div className="space-y-1">
                    <span className="text-[11px] text-[#78716C] font-normal block">
                      Remembered name or aliases
                    </span>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={names}
                        onChange={(e) => setNames(e.target.value)}
                        placeholder="e.g. Tariq / Tarique"
                        className="w-full px-3 py-1.5 rounded-lg border border-[#D6D0C4] bg-[#FAF8F5] text-xs sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59]/20"
                      />
                    ) : (
                      <p className="text-sm font-medium text-[#1C1917]">
                        {names || 'None recorded'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-[#78716C] font-normal block">
                      Relationship
                    </span>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        placeholder="e.g. Older brother, Friend"
                        className="w-full px-3 py-1.5 rounded-lg border border-[#D6D0C4] bg-[#FAF8F5] text-xs sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59]/20"
                      />
                    ) : (
                      <p className="text-sm font-medium text-[#1C1917]">
                        {relationship || 'Not specified'}
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Timeline Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#F5F2EC]">
                  <div className="space-y-1">
                    <span className="text-[11px] text-[#78716C] font-normal block">
                      Approximate time period
                    </span>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(e.target.value)}
                        placeholder="e.g. Late 1990s, Circa 2004"
                        className="w-full px-3 py-1.5 rounded-lg border border-[#D6D0C4] bg-[#FAF8F5] text-xs sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59]/20"
                      />
                    ) : (
                      <p className="text-sm font-medium text-[#1C1917]">
                        {timePeriod || 'Unknown timeline'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-[#78716C] font-normal block">
                      Approximate age at the time
                    </span>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={approxAge}
                        onChange={(e) => setApproxAge(e.target.value)}
                        placeholder="e.g. 10-12 years old"
                        className="w-full px-3 py-1.5 rounded-lg border border-[#D6D0C4] bg-[#FAF8F5] text-xs sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59]/20"
                      />
                    ) : (
                      <p className="text-sm font-medium text-[#1C1917]">
                        {approxAge ? `~${approxAge} years old` : 'Not specified'}
                      </p>
                    )}
                  </div>
                </div>

                {/* 3. Location */}
                <div className="space-y-1 pb-4 border-b border-[#F5F2EC]">
                  <span className="text-[11px] text-[#78716C] font-normal block">
                    Possible locations mentioned
                  </span>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={locations}
                      onChange={(e) => setLocations(e.target.value)}
                      placeholder="e.g. Aleppo, Old City, near Clock Tower"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#D6D0C4] bg-[#FAF8F5] text-xs sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59]/20"
                    />
                  ) : (
                    <p className="text-sm font-medium text-[#1C1917]">
                      {locations || 'None specified'}
                    </p>
                  )}
                </div>

                {/* 4. Distinguishing Details */}
                <div className="space-y-1">
                  <span className="text-[11px] text-[#78716C] font-normal block">
                    Distinguishing memories & details
                  </span>
                  {isEditingProfile ? (
                    <textarea
                      rows={3}
                      value={distinguishing}
                      onChange={(e) => setDistinguishing(e.target.value)}
                      placeholder="e.g. Hand-carved wooden bird, scar on left eyebrow"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#D6D0C4] bg-[#FAF8F5] text-xs sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59]/20 resize-none"
                    />
                  ) : (
                    <p className="text-sm font-medium text-[#1C1917] leading-relaxed whitespace-pre-line">
                      {distinguishing || 'None noted'}
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* PRIMARY ACTION */}
            <div className="pt-6 sm:pt-7 flex items-center justify-end">
              <button
                type="button"
                onClick={handleLooksRight}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg bg-[#115E59] hover:bg-[#0D4D49] active:bg-[#0A3D3A] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors duration-150 cursor-pointer shadow-xs"
              >
                <span>Looks right / Confirm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* POTENTIAL MATCHES / SUGGESTED CONNECTIONS SECTION */}
        <div className="bg-white rounded-2xl border border-[#E5DFD5] p-6 sm:p-7 shadow-[0_3px_18px_rgba(28,25,23,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F5F2EC]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#EEF5F1] border border-[#D5E3DC] flex items-center justify-center text-[#115E59]">
                <Link2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif-display text-lg font-semibold text-[#1C1917]">
                  <InteractiveHeadingText text="Suggested Connections" liftPx={-3} />
                </h3>
                <span className="text-xs text-[#78716C]">
                  Cross-referenced against fictional prototype records
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-[11px] font-medium w-fit">
              Potential Match (Does not prove identity)
            </span>
          </div>

          <p className="text-xs text-[#57534E] leading-relaxed">
            When a memory profile is analyzed, the matching engine compares similar locations, time periods, names, relationships, and memory details.
          </p>

          {potentialMatches.length > 0 ? (
            <div className="space-y-3 pt-1">
              {potentialMatches.map((pm) => {
                const otherProfile = pm.profileA.id === currentProfile.id ? pm.profileB : pm.profileA;
                return (
                  <div 
                    key={pm.id}
                    className="p-4 rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] hover:border-[#115E59]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-[#1C1917]">
                          Profile {otherProfile.id}
                        </span>
                        <span className="text-xs text-[#78716C]">({otherProfile.whoDescribing})</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE]">
                          {otherProfile.type === 'searching' ? 'Searching' : 'Information Provider'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                          {pm.similarityScore}% Suggested Match
                        </span>
                      </div>

                      <p className="text-xs text-[#57534E] italic line-clamp-2">
                        "{otherProfile.rawMemoryText}"
                      </p>

                      {/* Connection Threads Preview */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {pm.threadConnections.map((tc) => (
                          <span
                            key={tc.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-[#E2DDD2] text-[10px] text-[#44403C]"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#115E59]" />
                            <strong className="font-semibold capitalize">{tc.concept.toLowerCase()}:</strong>
                            <span className="truncate max-w-[140px]">{tc.labelB}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectMatch) {
                            onSelectMatch(pm);
                          } else {
                            onExploreMatches(profile.id);
                          }
                        }}
                        className="w-full md:w-auto px-4 py-2 rounded-lg bg-[#115E59] hover:bg-[#0D4D49] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                      >
                        <span>Compare Suggested Connection</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-[#DCD6CA] bg-[#FAF8F5]/60 text-center py-6">
              <p className="text-xs font-medium text-[#57534E]">
                No potential matches meeting the multi-signal threshold were found yet.
              </p>
              <p className="text-[11px] text-[#78716C] mt-1">
                Your memory profile is securely registered and will be continuously cross-referenced as new recollections are submitted.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
