import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  Users, 
  Link2, 
  ShieldCheck, 
  Settings as SettingsIcon, 
  Search, 
  ChevronDown, 
  ArrowRight, 
  X, 
  Clock, 
  Sparkles,
  MapPin,
  Calendar,
  Menu,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Flag,
  Pencil,
  Send,
  MessageSquare,
  Check,
  Eye,
  Filter,
  Layers,
  LayoutGrid,
  List
} from 'lucide-react';
import { MemoryProfile, PotentialMatch, MemoryStatus, ModeratorNote } from '../types';
import { findPotentialMatchesForProfile } from '../utils/matchingEngine';

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
  liftPx = -3,
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

interface ModeratorDashboardProps {
  profiles: MemoryProfile[];
  matches: PotentialMatch[];
  onSelectMatch: (matchId: string) => void;
  onOpenNewIntake: () => void;
  onSelectProfile: (profile: MemoryProfile) => void;
  onUpdateProfileStatus?: (profileId: string, newStatus: MemoryStatus) => void;
  onAddProfileNote?: (profileId: string, noteText: string) => void;
  onUpdateMatchStatus?: (matchId: string, newStatus: 'Flagged for Follow-up' | 'Dismissed' | 'Reviewed' | 'Awaiting Review', noteText?: string) => void;
  onAddMatchNote?: (matchId: string, noteText: string) => void;
  onBackToHome?: () => void;
}

export const ModeratorDashboard: React.FC<ModeratorDashboardProps> = ({
  profiles,
  matches,
  onSelectMatch,
  onOpenNewIntake,
  onSelectProfile,
  onUpdateProfileStatus,
  onAddProfileNote,
  onUpdateMatchStatus,
  onAddMatchNote,
  onBackToHome,
}) => {
  // Navigation tabs in sidebar
  const [activeTab, setActiveTab] = useState<'overview' | 'profiles' | 'matches' | 'reviewed' | 'settings'>('profiles');
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'searching' | 'information'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Moderator dropdown state
  const [moderatorMenuOpen, setModeratorMenuOpen] = useState(false);
  const moderatorDropdownRef = useRef<HTMLDivElement>(null);

  // Mobile sidebar drawer
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Selected profile for full inspection modal
  const [inspectingProfileId, setInspectingProfileId] = useState<string | null>(null);
  const [showRawMemory, setShowRawMemory] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);

  // Inline note input for modal
  const [profileNoteInput, setProfileNoteInput] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moderatorDropdownRef.current && !moderatorDropdownRef.current.contains(e.target as Node)) {
        setModeratorMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered profile records based on Search, Filters, and Sidebar Tab
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.id.toLowerCase().includes(q) ||
        p.whoDescribing.toLowerCase().includes(q) ||
        p.relationship.toLowerCase().includes(q) ||
        p.rawMemoryText.toLowerCase().includes(q) ||
        p.structuredData.names.some((n) => n.toLowerCase().includes(q)) ||
        p.structuredData.locations.some((l) => l.toLowerCase().includes(q)) ||
        p.structuredData.timePeriod.toLowerCase().includes(q) ||
        p.structuredData.distinguishingMemories.some((d) => d.toLowerCase().includes(q));

      const matchesType = typeFilter === 'all' || p.type === typeFilter;
      
      let matchesStatus = true;
      if (statusFilter !== 'all') {
        matchesStatus = p.status === statusFilter;
      }

      // Sidebar tab filtering
      let matchesTab = true;
      if (activeTab === 'reviewed') {
        matchesTab = p.status === 'Reviewed';
      }

      return matchesSearch && matchesType && matchesStatus && matchesTab;
    });
  }, [profiles, searchQuery, typeFilter, statusFilter, activeTab]);

  // Filtered matches for matches tab
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        m.id.toLowerCase().includes(q) ||
        m.profileA.id.toLowerCase().includes(q) ||
        m.profileB.id.toLowerCase().includes(q) ||
        m.profileA.whoDescribing.toLowerCase().includes(q) ||
        m.profileB.whoDescribing.toLowerCase().includes(q) ||
        m.profileA.rawMemoryText.toLowerCase().includes(q) ||
        m.profileB.rawMemoryText.toLowerCase().includes(q)
      );
    });
  }, [matches, searchQuery]);

  // Dynamic statistics numbers derived directly from active profiles and matches data
  const totalProfilesCount = profiles.length;
  const potentialConnectionsCount = matches.length;
  const awaitingReviewCount = matches.filter((m) => m.status === 'Awaiting Review').length;
  const reviewedCount = profiles.filter((p) => p.status === 'Reviewed').length;

  // Active filters indicator
  const isFiltered = searchQuery !== '' || typeFilter !== 'all' || statusFilter !== 'all';

  const resetFilters = () => {
    setTypeFilter('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  // Find currently inspected profile (live updated if status changes)
  const currentInspectingProfile = useMemo(() => {
    if (!inspectingProfileId) return null;
    return profiles.find((p) => p.id === inspectingProfileId) || null;
  }, [profiles, inspectingProfileId]);

  // View mode for profiles: 'cards' or 'table'
  const [profileViewMode, setProfileViewMode] = useState<'cards' | 'table'>('cards');

  // Helper: extract best match info for a given profile
  const getProfileMatchContext = (profile: MemoryProfile) => {
    const profileMatches = matches.filter(
      (m) => m.profileA.id === profile.id || m.profileB.id === profile.id
    );
    if (profileMatches.length > 0) {
      const topMatch = profileMatches.reduce((prev, curr) => 
        curr.similarityScore > prev.similarityScore ? curr : prev, 
        profileMatches[0]
      );
      const otherP = topMatch.profileA.id === profile.id ? topMatch.profileB : topMatch.profileA;
      return {
        count: profileMatches.length,
        topMatch,
        similarityScore: topMatch.similarityScore,
        otherProfile: otherP,
        status: topMatch.status
      };
    }
    const dynamicMatches = findPotentialMatchesForProfile(profile, profiles);
    if (dynamicMatches.length > 0) {
      const topMatch = dynamicMatches[0];
      const otherP = topMatch.profileA.id === profile.id ? topMatch.profileB : topMatch.profileA;
      return {
        count: dynamicMatches.length,
        topMatch,
        similarityScore: topMatch.similarityScore,
        otherProfile: otherP,
        status: topMatch.status
      };
    }
    return null;
  };

  const handleStatusChange = (profileId: string, newStatus: MemoryStatus) => {
    if (onUpdateProfileStatus) {
      onUpdateProfileStatus(profileId, newStatus);
      showFeedback(`Profile status updated to "${newStatus}".`);
    }
  };

  const handleAddModalNote = () => {
    if (!inspectingProfileId || !profileNoteInput.trim()) return;
    if (onAddProfileNote) {
      onAddProfileNote(inspectingProfileId, profileNoteInput.trim());
    }
    setProfileNoteInput('');
    showFeedback('Caseworker note saved.');
  };

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  return (
    <div className="w-full min-h-screen flex bg-[#FAF8F5] text-[#1C1917]">
      
      {/* ========================================================================= */}
      {/* PERSISTENT SIDEBAR: Dark ThreadBack Teal (bg-[#0E2824])                    */}
      {/* ========================================================================= */}
      
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0E2824] border-r border-[#163D37] text-white flex flex-col justify-between p-5 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 shrink-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          
          {/* Top Logo & Console Brand */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#163D37] border border-[#22574F] flex items-center justify-center text-[#E2ECE9] group-hover:bg-[#1D4F46] transition-colors">
                <Link2 className="w-4 h-4 text-[#85C2B9]" />
              </div>
              <div>
                <span className="font-serif-display text-base font-semibold tracking-tight text-white block">
                  ThreadBack
                </span>
                <span className="text-[10px] text-[#8EA39E] font-medium tracking-wide block">
                  Moderator Console
                </span>
              </div>
            </button>
            <button 
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-[#8EA39E] hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab('overview');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#163D37] text-white'
                  : 'text-[#A2B8B3] hover:text-white hover:bg-[#133530]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4 text-[#85C2B9]" />
                <span>Overview</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('profiles');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'profiles'
                  ? 'bg-[#163D37] text-white'
                  : 'text-[#A2B8B3] hover:text-white hover:bg-[#133530]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-[#85C2B9]" />
                <span>Memory Profiles</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-[#163D37] text-[#D1E2DE] border border-[#22574F]">
                {totalProfilesCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('matches');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'matches'
                  ? 'bg-[#163D37] text-white'
                  : 'text-[#A2B8B3] hover:text-white hover:bg-[#133530]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Link2 className="w-4 h-4 text-[#85C2B9]" />
                <span>Potential Matches</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-[#163D37] text-[#D1E2DE] border border-[#22574F]">
                {potentialConnectionsCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('reviewed');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'reviewed'
                  ? 'bg-[#163D37] text-white'
                  : 'text-[#A2B8B3] hover:text-white hover:bg-[#133530]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#85C2B9]" />
                <span>Reviewed & Verified</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-[#163D37] text-[#D1E2DE] border border-[#22574F]">
                {reviewedCount}
              </span>
            </button>
          </nav>

        </div>

        {/* Bottom User / Session Section */}
        <div className="pt-4 border-t border-[#163D37] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#163D37] border border-[#22574F] flex items-center justify-center text-xs font-semibold text-white">
              ER
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate">
                Elena Rostova
              </p>
              <p className="text-[10px] text-[#8EA39E] truncate">
                Lead NGO Caseworker
              </p>
            </div>
          </div>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* MAIN DASHBOARD CONTENT AREA                                               */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top App Bar with Search, Quick Action, and Profile Menu */}
        <header className="h-14 bg-white border-b border-[#E7E2D8] px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-md hover:bg-[#FAF8F5] text-[#57534E]"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Quick Search Bar */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, location, keyword, or ID..."
                className="w-full h-9 pl-9 pr-8 rounded-md border border-[#DCD7CE] bg-[#FAF8F5] text-xs text-[#1C1917] placeholder:text-[#8C857B] focus:outline-none focus:border-[#115E59] focus:bg-white focus:ring-1 focus:ring-[#115E59]/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917]"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* New Memory Intake Action */}
            <button
              type="button"
              onClick={onOpenNewIntake}
              className="h-8 px-3 rounded-md bg-[#115E59] hover:bg-[#0D4D49] text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>+ Record Memory</span>
            </button>

            {/* Caseworker Profile Menu */}
            <div className="relative" ref={moderatorDropdownRef}>
              <button
                type="button"
                onClick={() => setModeratorMenuOpen(!moderatorMenuOpen)}
                className="h-8 px-2.5 rounded-md border border-[#DCD7CE] bg-[#FAF8F5] hover:bg-[#F2ECE1] text-xs font-medium text-[#1C1917] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-[#115E59] text-white text-[10px] font-semibold flex items-center justify-center">
                  E
                </div>
                <span className="hidden sm:inline">Elena R.</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#78716C]" />
              </button>

              {moderatorMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-52 rounded-md bg-white border border-[#E7E2D8] shadow-md py-1 z-40 text-xs text-[#1C1917]">
                  <div className="px-3 py-2 border-b border-[#F2EFE9]">
                    <p className="font-semibold">Elena Rostova</p>
                    <p className="text-[11px] text-[#78716C]">ICRC Certified Caseworker</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setModeratorMenuOpen(false);
                      if (onBackToHome) onBackToHome();
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#FAF8F5] flex items-center gap-2"
                  >
                    <Home className="w-3.5 h-3.5 text-[#78716C]" />
                    <span>Public Home</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
          
          {actionFeedback && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionFeedback}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STATS TILES: Direct Mathematical Metrics from Live State                 */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-lg border border-[#E7E2D8] p-4 sm:p-5 shadow-[0_1px_3px_rgba(28,25,23,0.02)]">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#EFECE6] gap-y-3 sm:gap-y-0">
              
              {/* 1. Total Profiles */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('profiles');
                  setStatusFilter('all');
                }}
                className="flex items-center gap-3 lg:pr-4 text-left hover:bg-[#FAF8F5]/60 rounded-md transition-colors p-1"
              >
                <div className="w-7 h-7 rounded-md bg-[#F6F4EF] border border-[#EAE5DC] text-[#57534E] flex items-center justify-center shrink-0">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-serif-display text-2xl sm:text-[28px] font-normal text-[#1C1917] leading-tight">
                    {totalProfilesCount}
                  </div>
                  <div className="text-xs text-[#78716C] font-normal mt-0.5">
                    Memory Profiles
                  </div>
                </div>
              </button>

              {/* 2. Potential Connections */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('matches');
                  setStatusFilter('all');
                }}
                className="flex items-center gap-3 lg:px-4 pl-3 sm:pl-4 text-left hover:bg-[#FAF8F5]/60 rounded-md transition-colors p-1"
              >
                <div className="w-7 h-7 rounded-md bg-[#FAF0EF] border border-[#F2D2CF] text-[#9B2C2C] flex items-center justify-center shrink-0">
                  <Link2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-serif-display text-2xl sm:text-[28px] font-normal text-[#1C1917] leading-tight">
                    {potentialConnectionsCount}
                  </div>
                  <div className="text-xs text-[#78716C] font-normal mt-0.5">
                    Potential Connections
                  </div>
                </div>
              </button>

              {/* 3. Awaiting Review */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('matches');
                  onSelectMatch(matches[0]?.id || 'CONN-4091');
                }}
                className="flex items-center gap-3 lg:px-4 pt-3 sm:pt-0 text-left hover:bg-[#FAF8F5]/60 rounded-md transition-colors p-1"
              >
                <div className="w-7 h-7 rounded-md bg-[#F6F4EF] border border-[#EAE5DC] text-[#57534E] flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-serif-display text-2xl sm:text-[28px] font-normal text-[#1C1917] leading-tight">
                    {awaitingReviewCount}
                  </div>
                  <div className="text-xs text-[#78716C] font-normal mt-0.5">
                    Awaiting Review
                  </div>
                </div>
              </button>

              {/* 4. Reviewed */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('reviewed');
                  setStatusFilter('Reviewed');
                }}
                className="flex items-center gap-3 lg:px-4 last:pr-0 pt-3 sm:pt-0 pl-3 sm:pl-4 text-left hover:bg-[#FAF8F5]/60 rounded-md transition-colors p-1"
              >
                <div className="w-7 h-7 rounded-md bg-[#F6F4EF] border border-[#EAE5DC] text-[#57534E] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-serif-display text-2xl sm:text-[28px] font-normal text-[#1C1917] leading-tight">
                    {reviewedCount}
                  </div>
                  <div className="text-xs text-[#78716C] font-normal mt-0.5">
                    Reviewed
                  </div>
                </div>
              </button>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* VIEW TAB 1: OVERVIEW TAB                                                  */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Monitored Workflow Banner */}
              <div className="bg-white rounded-lg border border-[#E7E2D8] p-4 sm:p-5 shadow-[0_1px_3px_rgba(28,25,23,0.02)]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-medium text-[#78716C] tracking-wide block">
                      Humanitarian Case Management
                    </span>
                    <h2 className="font-serif-display text-lg sm:text-xl font-normal text-[#1C1917]">
                      <InteractiveHeadingText text="Monitored Case Review & Verification" liftPx={-3} />
                    </h2>
                    <p className="text-xs text-[#57534E] max-w-2xl leading-relaxed">
                      AI algorithms analyze memories and surface potential connections based on overlapping locations, dates, and names. Certified caseworkers verify every detail before initiating family contact.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveTab('matches')}
                      className="px-3 py-1.5 rounded-md bg-[#115E59] hover:bg-[#0D4D49] text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Review Connections ({potentialConnectionsCount})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('profiles')}
                      className="px-3 py-1.5 rounded-md border border-[#DCD7CE] bg-white hover:bg-[#FAF8F5] text-[#1C1917] text-xs font-medium transition-colors cursor-pointer"
                    >
                      View All Profiles
                    </button>
                  </div>
                </div>

                {/* Workflow steps visual */}
                <div className="mt-4 pt-4 border-t border-[#F2EFE9] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-md bg-[#FAF8F5] border border-[#EAE5DC]">
                    <span className="text-[10px] text-[#78716C] block font-medium">Step 1</span>
                    <span className="font-medium text-[#1C1917] block mt-0.5">Memory Intake</span>
                    <span className="text-[11px] text-[#78716C] block mt-0.5">Capture user recollections</span>
                  </div>
                  <div className="p-2.5 rounded-md bg-[#FAF8F5] border border-[#EAE5DC]">
                    <span className="text-[10px] text-[#78716C] block font-medium">Step 2</span>
                    <span className="font-medium text-[#1C1917] block mt-0.5">Anchor Extraction</span>
                    <span className="text-[11px] text-[#78716C] block mt-0.5">Locations, periods & names</span>
                  </div>
                  <div className="p-2.5 rounded-md bg-[#FAF8F5] border border-[#EAE5DC]">
                    <span className="text-[10px] text-[#78716C] block font-medium">Step 3</span>
                    <span className="font-medium text-[#1C1917] block mt-0.5">Similarity Surfacing</span>
                    <span className="text-[11px] text-[#78716C] block mt-0.5">Multi-signal overlap score</span>
                  </div>
                  <div className="p-2.5 rounded-md bg-[#FAF8F5] border border-[#EAE5DC]">
                    <span className="text-[10px] text-[#78716C] block font-medium">Step 4</span>
                    <span className="font-medium text-[#115E59] block mt-0.5">Caseworker Decision</span>
                    <span className="text-[11px] text-[#78716C] block mt-0.5">Human verification & contact</span>
                  </div>
                </div>
              </div>

              {/* Two Column Layout: Urgent Matches & Recent Profiles */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Column 1: Awaiting Review Connections */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-serif-display text-base font-normal text-[#1C1917]">
                        Awaiting Human Review
                      </h3>
                      <span className="text-xs text-[#78716C]">
                        ({awaitingReviewCount})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('matches')}
                      className="text-xs text-[#115E59] hover:underline font-medium"
                    >
                      View all matches →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {matches.slice(0, 3).map((m) => {
                      const strongSignals = m.surfacedReasons?.strong?.slice(0, 2) || [];
                      
                      return (
                        <div 
                          key={m.id}
                          className="p-4 rounded-lg bg-white border border-[#E7E2D8] hover:border-[#D0C9BD] transition-all shadow-[0_1px_3px_rgba(28,25,23,0.02)] space-y-3"
                        >
                          <div className="flex items-center justify-between text-xs pb-2 border-b border-[#F5F2EB]">
                            <span className="text-[#78716C]">
                              Match reference · {m.id}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FAF0EF] text-[#9B2C2C] border border-[#F2D2CF]">
                              {m.status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <div className="space-y-1 min-w-0">
                              <p className="text-xs font-semibold text-[#1C1917] truncate">
                                {m.profileA.whoDescribing} ↔ {m.profileB.whoDescribing}
                              </p>
                              <p className="text-[11px] text-[#78716C]">
                                Profile reference · {m.profileA.id} & {m.profileB.id}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-base font-semibold text-[#115E59] block">
                                {m.similarityScore}%
                              </span>
                              <span className="text-[10px] text-[#78716C] block">
                                Info similarity
                              </span>
                            </div>
                          </div>

                          {strongSignals.length > 0 && (
                            <div className="text-xs text-[#57534E] space-y-1 pt-1 bg-[#FAF8F5] p-2 rounded">
                              <span className="text-[10px] font-medium text-[#78716C] block">Key matching signals:</span>
                              {strongSignals.map((sig, sIdx) => (
                                <p key={sIdx} className="text-[11px] leading-tight flex items-start gap-1.5">
                                  <span className="text-[#8C827A]">•</span>
                                  <span>{sig}</span>
                                </p>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => onSelectMatch(m.id)}
                              className="px-3 py-1 rounded-md bg-[#115E59] hover:bg-[#0D4D49] text-white text-xs font-medium transition-colors cursor-pointer"
                            >
                              Review Connection
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Column 2: Recent Memory Profiles */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-serif-display text-base font-normal text-[#1C1917]">
                        Active Memory Profiles
                      </h3>
                      <span className="text-xs text-[#78716C]">
                        ({totalProfilesCount})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('profiles')}
                      className="text-xs text-[#115E59] hover:underline font-medium"
                    >
                      View all profiles →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {profiles.slice(0, 3).map((p) => {
                      const matchCtx = getProfileMatchContext(p);

                      return (
                        <div 
                          key={p.id}
                          className="p-4 rounded-lg bg-white border border-[#E7E2D8] hover:border-[#D0C9BD] transition-all shadow-[0_1px_3px_rgba(28,25,23,0.02)] space-y-3"
                        >
                          <div className="flex items-center justify-between text-xs pb-2 border-b border-[#F5F2EB]">
                            <span className="text-[#78716C]">
                              Profile reference · {p.id}
                            </span>
                            <span className="text-[11px] text-[#78716C]">
                              {p.submittedDate}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-baseline justify-between gap-2">
                              <h4 className="text-sm font-semibold text-[#1C1917]">
                                {p.whoDescribing} {p.relationship ? `(${p.relationship})` : ''}
                              </h4>
                              <span className="text-[11px] text-[#57534E]">
                                {p.type === 'searching' ? 'Searching' : 'Has Information'}
                              </span>
                            </div>
                            <p className="text-xs text-[#57534E] line-clamp-2 italic leading-relaxed">
                              "{p.rawMemoryText}"
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1 text-xs">
                            <div>
                              {matchCtx ? (
                                <span className="text-[11px] text-[#115E59] font-medium flex items-center gap-1">
                                  <Link2 className="w-3 h-3" />
                                  <span>{matchCtx.similarityScore}% info similarity</span>
                                </span>
                              ) : (
                                <span className="text-[11px] text-[#78716C]">
                                  No active connections
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => setInspectingProfileId(p.id)}
                              className="px-2.5 py-1 rounded-md border border-[#DCD7CE] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#1C1917] transition-colors cursor-pointer"
                            >
                              Inspect Dossier
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW TAB 2: POTENTIAL MATCHES TAB                                         */}
          {/* ========================================================================= */}
          {activeTab === 'matches' && (
            <div className="space-y-5">
              
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pt-1">
                <div>
                  <h2 className="font-serif-display text-xl font-normal text-[#1C1917]">
                    <InteractiveHeadingText text="Potential Connections & Matching Signals" liftPx={-3} />
                  </h2>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    Showing {filteredMatches.length} candidate connections. Similarity scores reflect multi-signal overlap across memory anchors and do not verify identity.
                  </p>
                </div>
                <span className="text-xs text-[#78716C] shrink-0 font-mono-code">
                  {filteredMatches.length} connections found
                </span>
              </div>

              {/* Potential Matches Case Cards List */}
              {filteredMatches.length === 0 ? (
                <div className="bg-white rounded-lg border border-[#E7E2D8] p-10 text-center text-[#78716C]">
                  <p className="text-sm font-medium text-[#1C1917]">No potential matches found.</p>
                  <p className="text-xs mt-1">Try searching for other names or keywords.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMatches.map((m) => {
                    const strongSignals = m.surfacedReasons?.strong || 
                      m.threadConnections?.map((tc) => `${tc.concept}: ${tc.labelB}`) || [];
                    const uncertainSignals = m.surfacedReasons?.uncertain || [];

                    return (
                      <div 
                        key={m.id}
                        className="bg-white rounded-lg border border-[#E7E2D8] hover:border-[#D0C9BD] p-5 transition-all shadow-[0_1px_3px_rgba(28,25,23,0.02)] space-y-4"
                      >
                        
                        {/* 1. Header: Reference ID & Status */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F2EFE9]">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-[#78716C] font-normal">
                              Match reference · {m.id}
                            </span>
                            <span className="text-[#D6D0C4]">•</span>
                            <span className="text-xs text-[#78716C]">
                              Updated {m.lastUpdated}
                            </span>
                          </div>

                          {/* Interactive Status Selector for Match */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#78716C]">Status:</span>
                            {onUpdateMatchStatus ? (
                              <div className="relative">
                                <select
                                  value={m.status}
                                  onChange={(e) => {
                                    onUpdateMatchStatus(m.id, e.target.value as any);
                                    showFeedback(`Match status updated to "${e.target.value}".`);
                                  }}
                                  aria-label="Update match status"
                                  className={`text-xs font-medium pl-2.5 pr-7 py-1 rounded-md border focus:outline-none appearance-none cursor-pointer transition-colors ${
                                    m.status === 'Reviewed'
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                      : m.status === 'Flagged for Follow-up'
                                      ? 'bg-red-50 text-red-800 border-red-200'
                                      : m.status === 'Dismissed'
                                      ? 'bg-stone-100 text-stone-700 border-stone-300'
                                      : 'bg-amber-50 text-amber-900 border-amber-200'
                                  }`}
                                >
                                  <option value="Awaiting Review">Awaiting Review</option>
                                  <option value="Flagged for Follow-up">Flagged for Follow-up</option>
                                  <option value="Reviewed">Reviewed</option>
                                  <option value="Dismissed">Dismissed</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-current opacity-70 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
                                {m.status}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 2. Primary Comparison: Profile A ↔ Profile B with Similarity Score */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          
                          {/* Profile A (Origin) */}
                          <div className="md:col-span-5 p-3.5 rounded-lg bg-[#FAF8F5] border border-[#EAE5DC] space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#78716C]">
                                Profile reference · {m.profileA.id}
                              </span>
                              <span className="text-[11px] font-medium text-[#57534E]">
                                {m.profileA.type === 'searching' ? 'Searching' : 'Has Information'}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-[#1C1917]">
                                {m.profileA.whoDescribing}
                                {m.profileA.relationship && (
                                  <span className="text-xs font-normal text-[#78716C] ml-1.5">
                                    ({m.profileA.relationship})
                                  </span>
                                )}
                              </h4>
                              <p className="text-xs text-[#57534E] line-clamp-2 italic mt-1 leading-relaxed">
                                "{m.profileA.rawMemoryText}"
                              </p>
                            </div>
                            <div className="pt-1 text-[11px] text-[#78716C] space-y-0.5">
                              {m.profileA.structuredData.locations?.length > 0 && (
                                <p>Location: {m.profileA.structuredData.locations.join(', ')}</p>
                              )}
                              {m.profileA.structuredData.timePeriod && (
                                <p>Period: {m.profileA.structuredData.timePeriod}</p>
                              )}
                            </div>
                          </div>

                          {/* Information Similarity Badge */}
                          <div className="md:col-span-2 text-center py-2">
                            <div className="inline-flex flex-col items-center">
                              <span className="text-2xl sm:text-3xl font-normal font-serif-display text-[#115E59]">
                                {m.similarityScore}%
                              </span>
                              <span className="text-[11px] font-medium text-[#1C1917] mt-0.5">
                                Information similarity
                              </span>
                              <span className="text-[10px] text-[#78716C] leading-tight">
                                (not identity proof)
                              </span>
                            </div>
                          </div>

                          {/* Profile B (Candidate) */}
                          <div className="md:col-span-5 p-3.5 rounded-lg bg-[#FAF8F5] border border-[#EAE5DC] space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#78716C]">
                                Profile reference · {m.profileB.id}
                              </span>
                              <span className="text-[11px] font-medium text-[#57534E]">
                                {m.profileB.type === 'searching' ? 'Searching' : 'Has Information'}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-[#1C1917]">
                                {m.profileB.whoDescribing}
                                {m.profileB.relationship && (
                                  <span className="text-xs font-normal text-[#78716C] ml-1.5">
                                    ({m.profileB.relationship})
                                  </span>
                                )}
                              </h4>
                              <p className="text-xs text-[#57534E] line-clamp-2 italic mt-1 leading-relaxed">
                                "{m.profileB.rawMemoryText}"
                              </p>
                            </div>
                            <div className="pt-1 text-[11px] text-[#78716C] space-y-0.5">
                              {m.profileB.structuredData.locations?.length > 0 && (
                                <p>Location: {m.profileB.structuredData.locations.join(', ')}</p>
                              )}
                              {m.profileB.structuredData.timePeriod && (
                                <p>Period: {m.profileB.structuredData.timePeriod}</p>
                              )}
                            </div>
                          </div>

                        </div>

                        {/* 3. Matching Signals & Actions */}
                        <div className="pt-3 border-t border-[#F2EFE9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          
                          {/* Signals preview */}
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <span className="text-[11px] font-medium text-[#78716C] block">
                              Why this connection was suggested:
                            </span>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#44403C]">
                              {strongSignals.slice(0, 3).map((sig, sIdx) => (
                                <span key={sIdx} className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#115E59] shrink-0" />
                                  <span>{sig}</span>
                                </span>
                              ))}
                              {uncertainSignals.length > 0 && (
                                <span className="flex items-center gap-1.5 text-[#92400E]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                  <span>Note: {uncertainSignals[0]}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Caseworker Action */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => onSelectMatch(m.id)}
                              className="px-4 py-2 rounded-md bg-[#115E59] hover:bg-[#0D4D49] text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                            >
                              <span>Review Connection</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW TAB 3: PROFILES TAB (Default / Reviewed)                             */}
          {/* ========================================================================= */}
          {(activeTab === 'profiles' || activeTab === 'reviewed') && (
            <div className="space-y-5">
              
              {/* Section Header with Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <h2 className="font-serif-display text-xl font-normal text-[#1C1917]">
                    <InteractiveHeadingText 
                      text={activeTab === 'reviewed' ? 'Reviewed Cases & Dossiers' : 'Memory Profiles & Narrative Intakes'} 
                      liftPx={-3} 
                    />
                  </h2>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    {activeTab === 'reviewed' 
                      ? 'Cases verified or resolved through caseworker review.' 
                      : 'All recorded memory submissions and their structured extraction anchors.'}
                  </p>
                </div>

                {/* Filter and View Mode Controls */}
                <div className="flex items-center gap-2 flex-wrap">
                  
                  {/* Type Filter */}
                  <div className="relative">
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as any)}
                      aria-label="Filter by intake type"
                      className="h-8 pl-2.5 pr-7 rounded-md border border-[#DCD7CE] bg-white text-xs text-[#1C1917] focus:outline-none focus:border-[#115E59] cursor-pointer appearance-none transition-colors"
                    >
                      <option value="all">All Types</option>
                      <option value="searching">Searching for someone</option>
                      <option value="information">Has information</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#78716C] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Status Filter */}
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      aria-label="Filter by status"
                      className="h-8 pl-2.5 pr-7 rounded-md border border-[#DCD7CE] bg-white text-xs text-[#1C1917] focus:outline-none focus:border-[#115E59] cursor-pointer appearance-none transition-colors"
                    >
                      <option value="all">All Statuses</option>
                      <option value="New">New</option>
                      <option value="Analyzing">Analyzing</option>
                      <option value="Potential Connection">Potential Connection</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Reviewed">Reviewed</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#78716C] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* View Mode Toggle: Cards vs Table */}
                  <div className="flex items-center border border-[#DCD7CE] rounded-md overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setProfileViewMode('cards')}
                      title="Card view with clear hierarchy"
                      className={`p-1.5 text-xs ${
                        profileViewMode === 'cards'
                          ? 'bg-[#F2ECE1] text-[#1C1917] font-medium'
                          : 'text-[#78716C] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileViewMode('table')}
                      title="Compact table view"
                      className={`p-1.5 text-xs ${
                        profileViewMode === 'table'
                          ? 'bg-[#F2ECE1] text-[#1C1917] font-medium'
                          : 'text-[#78716C] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Reset link if active */}
                  {isFiltered && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-xs text-[#115E59] hover:text-[#0E2824] hover:underline font-medium ml-1 transition-colors cursor-pointer"
                    >
                      Clear filters
                    </button>
                  )}

                </div>
              </div>

              {/* PROFILES LIST */}
              {filteredProfiles.length === 0 ? (
                <div className="bg-white rounded-lg border border-[#E7E2D8] p-10 text-center text-[#78716C]">
                  <p className="text-sm font-medium text-[#1C1917]">No profiles match your search criteria.</p>
                  <p className="text-xs mt-1">Try resetting the active filters or adjusting the query.</p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-3 px-3 py-1 rounded-md border border-[#DCD7CE] bg-white text-xs font-medium text-[#1C1917] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    Reset filters
                  </button>
                </div>
              ) : profileViewMode === 'cards' ? (
                /* ========================================================= */
                /* HIGH HIERARCHY CASE CARDS VIEW                            */
                /* ========================================================= */
                <div className="space-y-4">
                  {filteredProfiles.map((p) => {
                    const matchCtx = getProfileMatchContext(p);
                    const isSearching = p.type === 'searching';

                    return (
                      <div
                        key={p.id}
                        className="bg-white rounded-lg border border-[#E7E2D8] hover:border-[#D0C9BD] p-5 transition-all shadow-[0_1px_3px_rgba(28,25,23,0.02)] space-y-4"
                      >
                        {/* 1. Header Line: Reference & Submission */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F5F2EB] text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="text-[#78716C] font-normal">
                              Profile reference · {p.id}
                            </span>
                            <span className="text-[#D6D0C4]">•</span>
                            <span className="text-[#57534E]">
                              {isSearching ? 'Seeking missing family' : 'Providing information'}
                            </span>
                            <span className="text-[#D6D0C4]">•</span>
                            <span className="text-[#78716C]">
                              Submitted {p.submittedDate}
                            </span>
                          </div>

                          {/* Obvious Case Status Selector */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#78716C]">Status:</span>
                            <div className="relative">
                              <select
                                value={p.status}
                                onChange={(e) => handleStatusChange(p.id, e.target.value as MemoryStatus)}
                                aria-label="Change profile status"
                                className={`text-xs font-medium pl-2.5 pr-7 py-1 rounded-md border focus:outline-none appearance-none cursor-pointer transition-colors ${
                                  p.status === 'New'
                                    ? 'bg-[#F0F4F8] text-[#2C5282] border-[#D9E2EC]'
                                    : p.status === 'Analyzing'
                                    ? 'bg-[#FBF6EE] text-[#8C5E1E] border-[#EEDDC6]'
                                    : p.status === 'Potential Connection'
                                    ? 'bg-[#FAF0EF] text-[#9B2C2C] border-[#F2D2CF]'
                                    : p.status === 'Under Review'
                                    ? 'bg-[#F0F5F2] text-[#22543D] border-[#D1E2D8]'
                                    : 'bg-[#EFF5F5] text-[#234E52] border-[#CFDFE0]'
                                }`}
                              >
                                <option value="New">New</option>
                                <option value="Analyzing">Analyzing</option>
                                <option value="Potential Connection">Potential Connection</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Reviewed">Reviewed</option>
                              </select>
                              <ChevronDown className="w-3.5 h-3.5 text-current opacity-70 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        {/* 2. PRIMARY: Person Searched / Described & Memory Context */}
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                            <h3 className="font-serif-display text-lg font-normal text-[#1C1917]">
                              {p.whoDescribing}
                              {p.relationship && (
                                <span className="text-sm font-sans font-normal text-[#78716C] ml-2">
                                  ({p.relationship})
                                </span>
                              )}
                            </h3>
                          </div>

                          <p className="text-xs sm:text-[13px] text-[#44403C] leading-relaxed line-clamp-2 italic">
                            "{p.rawMemoryText}"
                          </p>
                        </div>

                        {/* 3. SECONDARY: Structured Memory Anchors */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-md bg-[#FAF8F5] border border-[#EAE5DC] text-xs text-[#57534E]">
                          <div>
                            <span className="text-[10px] text-[#78716C] block font-medium">Locations:</span>
                            <span className="font-medium text-[#1C1917] block truncate">
                              {p.structuredData.locations?.length > 0
                                ? p.structuredData.locations.join(', ')
                                : 'Not specified'}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] text-[#78716C] block font-medium">Time Period / Age:</span>
                            <span className="font-medium text-[#1C1917] block truncate">
                              {p.structuredData.timePeriod || 'Unknown period'}
                              {p.structuredData.approximateAge ? ` • ~${p.structuredData.approximateAge} yrs` : ''}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] text-[#78716C] block font-medium">Distinguishing Details:</span>
                            <span className="font-medium text-[#1C1917] block truncate">
                              {p.structuredData.distinguishingMemories?.length > 0
                                ? p.structuredData.distinguishingMemories.join(' • ')
                                : 'None recorded'}
                            </span>
                          </div>
                        </div>

                        {/* 4. PRIMARY & ACTIONS: Potential Connection Status & Action Buttons */}
                        <div className="pt-3 border-t border-[#F5F2EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          
                          {/* Connection Status */}
                          <div>
                            {matchCtx ? (
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                                  <Link2 className="w-3.5 h-3.5" />
                                  <span>{matchCtx.similarityScore}% information similarity</span>
                                </span>
                                <span className="text-xs text-[#57534E]">
                                  with {matchCtx.otherProfile.whoDescribing} (Profile reference · {matchCtx.otherProfile.id})
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-[#78716C]">
                                No potential connections surfaced at current threshold
                              </span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {matchCtx && (
                              <button
                                type="button"
                                onClick={() => onSelectMatch(matchCtx.topMatch.id)}
                                className="px-3 py-1.5 rounded-md bg-[#115E59] hover:bg-[#0D4D49] text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <span>Review Match</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setInspectingProfileId(p.id)}
                              className="px-3 py-1.5 rounded-md border border-[#DCD7CE] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#1C1917] transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#78716C]" />
                              <span>Inspect Dossier</span>
                            </button>
                          </div>

                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                /* ========================================================= */
                /* COMPACT REFINED TABLE VIEW                                */
                /* ========================================================= */
                <div className="bg-white rounded-lg border border-[#E7E2D8] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#E7E2D8] bg-[#FAF8F5] text-[11px] uppercase tracking-wider font-medium text-[#78716C]">
                          <th className="py-2.5 px-4 sm:px-5 w-32">Profile Reference</th>
                          <th className="py-2.5 px-3 sm:px-4 min-w-[180px]">Person / Relationship</th>
                          <th className="py-2.5 px-3 sm:px-4 min-w-[220px]">Memory Summary</th>
                          <th className="py-2.5 px-3 sm:px-4 w-36">Connections</th>
                          <th className="py-2.5 px-3 sm:px-4 w-40">Status</th>
                          <th className="py-2.5 px-4 sm:px-5 text-right w-28">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2EFE9]">
                        {filteredProfiles.map((p) => {
                          const matchCtx = getProfileMatchContext(p);

                          return (
                            <tr 
                              key={p.id}
                              className="hover:bg-[#F8F6F2] transition-colors cursor-pointer"
                              onClick={() => setInspectingProfileId(p.id)}
                            >
                              <td className="py-3 px-4 sm:px-5 text-xs text-[#78716C]">
                                Profile reference · {p.id}
                              </td>
                              <td className="py-3 px-3 sm:px-4">
                                <span className="font-medium text-xs text-[#1C1917] block">
                                  {p.whoDescribing}
                                </span>
                                <span className="text-[11px] text-[#78716C]">
                                  {p.relationship ? `Relationship: ${p.relationship}` : p.type}
                                </span>
                              </td>
                              <td className="py-3 px-3 sm:px-4 text-[#44403C]">
                                <span className="line-clamp-2 text-xs italic">
                                  "{p.rawMemoryText}"
                                </span>
                              </td>
                              <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                                {matchCtx ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#DCFCE7] text-[#15803D]">
                                    {matchCtx.similarityScore}% similarity
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-[#78716C]">None</span>
                                )}
                              </td>
                              <td 
                                className="py-3 px-3 sm:px-4 whitespace-nowrap"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="relative inline-block">
                                  <select
                                    value={p.status}
                                    onChange={(e) => handleStatusChange(p.id, e.target.value as MemoryStatus)}
                                    className="text-[11px] font-medium pl-2 pr-6 py-0.5 rounded border border-[#DCD7CE] bg-white text-[#1C1917] focus:outline-none appearance-none cursor-pointer"
                                  >
                                    <option value="New">New</option>
                                    <option value="Analyzing">Analyzing</option>
                                    <option value="Potential Connection">Potential Connection</option>
                                    <option value="Under Review">Under Review</option>
                                    <option value="Reviewed">Reviewed</option>
                                  </select>
                                  <ChevronDown className="w-3 h-3 text-[#78716C] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                              </td>
                              <td 
                                className="py-3 px-4 sm:px-5 text-right whitespace-nowrap"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  onClick={() => setInspectingProfileId(p.id)}
                                  className="px-2.5 py-1 rounded border border-[#DCD7CE] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#1C1917] transition-colors cursor-pointer"
                                >
                                  Inspect
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Bottom footer metadata */}
              <div className="p-3 bg-white rounded-lg border border-[#E7E2D8] flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716C] gap-2">
                <span>
                  Showing {filteredProfiles.length} of {profiles.length} total profiles
                </span>
                <span>
                  ThreadBack Humanitarian Case Console • ICRC Protocol Compliant
                </span>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* PROFILE INSPECTION MODAL: Human-Designed Case Review Interface            */}
      {/* ========================================================================= */}
      {currentInspectingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/45 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-[#E7E2D8] max-w-2xl w-full shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
            
            {/* 1. HEADER */}
            <div className="px-6 py-5 border-b border-[#E7E2D8] bg-[#FAF8F5] flex items-start justify-between gap-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs text-[#78716C]">
                    Profile reference · {currentInspectingProfile.id}
                  </span>
                  <span className="text-[#D6D0C4]">•</span>
                  <span className="text-xs text-[#57534E]">
                    {currentInspectingProfile.type === 'searching' ? 'Searching for someone' : 'Has information'}
                  </span>
                  <span className="text-[#D6D0C4]">•</span>
                  <span className={`text-xs font-medium ${
                    currentInspectingProfile.status === 'Reviewed'
                      ? 'text-emerald-700'
                      : currentInspectingProfile.status === 'Under Review'
                      ? 'text-amber-800'
                      : 'text-[#115E59]'
                  }`}>
                    {currentInspectingProfile.status}
                  </span>
                </div>
                <h2 className="font-serif-display text-xl sm:text-2xl font-normal text-[#1C1917] tracking-tight leading-snug">
                  {currentInspectingProfile.whoDescribing}
                  {currentInspectingProfile.relationship && (
                    <span className="text-base font-sans font-normal text-[#78716C] ml-2">
                      ({currentInspectingProfile.relationship})
                    </span>
                  )}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setInspectingProfileId(null);
                  setShowRawMemory(false);
                  setShowAddNote(false);
                }}
                className="w-8 h-8 rounded-md text-[#78716C] hover:text-[#1C1917] hover:bg-[#EAE5DC] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Close dossier"
                aria-label="Close dossier"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. SCROLLABLE BODY */}
            <div className="px-6 py-5 overflow-y-auto space-y-6 flex-1 text-[#1C1917]">
              
              {/* MEMORY SUMMARY */}
              <section>
                <h3 className="text-xs font-semibold text-[#78716C] uppercase tracking-wider mb-3">
                  Memory Summary
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 text-xs">
                  <div>
                    <span className="block text-[11px] text-[#78716C] mb-0.5">Person searched for</span>
                    <span className="text-[#1C1917] font-medium">{currentInspectingProfile.whoDescribing || 'Unspecified'}</span>
                  </div>

                  <div>
                    <span className="block text-[11px] text-[#78716C] mb-0.5">Relationship</span>
                    <span className="text-[#1C1917] font-medium">{currentInspectingProfile.relationship || 'Unspecified'}</span>
                  </div>

                  <div>
                    <span className="block text-[11px] text-[#78716C] mb-0.5">Possible names</span>
                    <span className="text-[#1C1917] font-medium">
                      {currentInspectingProfile.structuredData.names?.length > 0
                        ? currentInspectingProfile.structuredData.names.join(' / ')
                        : 'None recorded'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[11px] text-[#78716C] mb-0.5">Approximate period</span>
                    <span className="text-[#1C1917] font-medium">
                      {currentInspectingProfile.structuredData.timePeriod || 'Unknown period'}
                      {currentInspectingProfile.structuredData.approximateAge ? ` • Age ~${currentInspectingProfile.structuredData.approximateAge}` : ''}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[11px] text-[#78716C] mb-0.5">Location</span>
                    <span className="text-[#1C1917] font-medium">
                      {currentInspectingProfile.structuredData.locations?.length > 0
                        ? currentInspectingProfile.structuredData.locations.join(', ')
                        : 'Unspecified'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[11px] text-[#78716C] mb-0.5">Key detail</span>
                    <span className="text-[#1C1917] font-medium">
                      {currentInspectingProfile.structuredData.distinguishingMemories?.length > 0
                        ? currentInspectingProfile.structuredData.distinguishingMemories.join(' • ')
                        : 'None recorded'}
                    </span>
                  </div>
                </div>

                {/* Subtle Collapsible Original Memory */}
                {currentInspectingProfile.rawMemoryText && (
                  <div className="mt-4 pt-3 border-t border-[#F0EBE1]">
                    <button
                      type="button"
                      data-no-interactive="true"
                      onClick={() => setShowRawMemory(!showRawMemory)}
                      className="inline-flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1C1917] bg-transparent border-0 shadow-none hover:bg-transparent hover:shadow-none p-0 cursor-pointer transition-colors duration-150 group focus:outline-none"
                    >
                      <ChevronDown className={`w-3.5 h-3.5 text-[#8C827A] group-hover:text-[#1C1917] transition-transform duration-200 ${showRawMemory ? 'rotate-180' : ''}`} />
                      <span className="group-hover:underline underline-offset-2 decoration-[#D6D0C4]">
                        {showRawMemory ? 'Hide original memory text' : 'View original memory text'}
                      </span>
                    </button>

                    {showRawMemory && (
                      <div className="mt-3 pl-3.5 border-l-2 border-[#E7E2D8] text-xs text-[#57534E] leading-relaxed italic">
                        "{currentInspectingProfile.rawMemoryText}"
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* POTENTIAL CONNECTIONS */}
              {(() => {
                const modalMatches = findPotentialMatchesForProfile(currentInspectingProfile, profiles);
                
                return (
                  <section className="pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-4">
                      <h3 className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">
                        Potential Connections
                      </h3>
                      <p className="text-[11px] text-[#8C827A] leading-normal">
                        Similarity reflects matching information and does not verify identity.
                      </p>
                    </div>

                    {modalMatches.length === 0 ? (
                      <div className="py-4 px-3 text-center text-xs text-[#78716C] bg-[#FAF8F5] rounded-lg border border-[#E7E2D8]">
                        No potential connections found for this profile at current threshold.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {modalMatches.map((pm) => {
                          const otherP = pm.profileA.id === currentInspectingProfile.id ? pm.profileB : pm.profileA;
                          const strongSignals = pm.surfacedReasons?.strong?.slice(0, 3) || 
                            pm.threadConnections?.slice(0, 3).map((tc) => `${tc.concept}: ${tc.labelB}`) || [];
                          const conflictingSignal = pm.surfacedReasons?.uncertain?.[0] || null;

                          return (
                            <div
                              key={pm.id}
                              className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E7E2D8] flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                            >
                              <div className="space-y-3 flex-1 min-w-0">
                                {/* Profile Header Line */}
                                <div className="flex items-baseline gap-2.5 flex-wrap">
                                  <span className="text-xs text-[#78716C]">
                                    Profile reference · {otherP.id}
                                  </span>
                                  <span className="text-[#D6D0C4]">•</span>
                                  <span className="text-xs font-semibold text-[#1C1917]">
                                    {otherP.whoDescribing}{otherP.relationship ? ` (${otherP.relationship})` : ''}
                                  </span>
                                  <span className="text-[#D6D0C4]">•</span>
                                  <span className="text-xs font-medium text-[#115E59]">
                                    {pm.similarityScore}% info similarity
                                  </span>
                                </div>

                                {/* Matching Signals List */}
                                {strongSignals.length > 0 && (
                                  <div className="space-y-1">
                                    <span className="text-[11px] font-medium text-[#78716C] block">Matching signals:</span>
                                    <ul className="space-y-1 text-xs text-[#57534E]">
                                      {strongSignals.map((signal, sIdx) => (
                                        <li key={sIdx} className="flex items-start gap-2">
                                          <span className="text-[#8C827A] leading-none mt-1 select-none">•</span>
                                          <span className="leading-snug">{signal}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {conflictingSignal && (
                                  <div className="text-[11px] text-[#92400E] flex items-start gap-2 pt-0.5">
                                    <span className="text-amber-600 leading-none mt-0.5 select-none">•</span>
                                    <span className="leading-snug">{conflictingSignal}</span>
                                  </div>
                                )}
                              </div>

                              {/* Inspect Action */}
                              <div className="shrink-0 self-start sm:self-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onSelectMatch(pm.id);
                                    setInspectingProfileId(null);
                                    setShowRawMemory(false);
                                    setShowAddNote(false);
                                  }}
                                  className="px-3.5 py-1.5 rounded-md bg-[#11322E] hover:bg-[#0D2825] text-white text-xs font-medium transition-colors cursor-pointer whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-[#115E59]"
                                >
                                  Inspect
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })()}

              {/* CASEWORKER NOTES LOG */}
              {currentInspectingProfile.moderatorNotes && currentInspectingProfile.moderatorNotes.length > 0 && (
                <section className="pt-2">
                  <h3 className="text-xs font-semibold text-[#78716C] uppercase tracking-wider mb-2">
                    Caseworker Notes ({currentInspectingProfile.moderatorNotes.length})
                  </h3>
                  <div className="space-y-2 max-h-36 overflow-y-auto divide-y divide-[#F0EBE1] pr-1">
                    {currentInspectingProfile.moderatorNotes.map((note) => (
                      <div key={note.id} className="pt-2 first:pt-0 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-[#78716C] mb-0.5">
                          <span className="font-medium text-[#1C1917]">{note.author}</span>
                          <span>{note.timestamp}</span>
                        </div>
                        <p className="text-[#44403C]">{note.text}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* INLINE ADD NOTE INPUT (TOGGLED) */}
              {showAddNote && (
                <div className="p-3.5 bg-[#FAF8F5] border border-[#E7E2D8] rounded-lg space-y-2">
                  <label className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider block">
                    Add Caseworker Observation
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={profileNoteInput}
                      onChange={(e) => setProfileNoteInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddModalNote();
                          setShowAddNote(false);
                        }
                      }}
                      placeholder="Enter observation notes..."
                      className="flex-1 h-8 px-3 rounded-md border border-[#DCD7CE] bg-white text-xs text-[#1C1917] focus:outline-none focus:border-[#115E59]"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleAddModalNote();
                        setShowAddNote(false);
                      }}
                      disabled={!profileNoteInput.trim()}
                      className="h-8 px-3.5 rounded-md bg-[#115E59] hover:bg-[#0D4D49] disabled:opacity-40 text-white text-xs font-medium cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddNote(false)}
                      className="h-8 px-2.5 rounded-md text-xs text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* 3. MODERATOR ACTIONS FOOTER */}
            <div className="px-6 py-3.5 border-t border-[#E7E2D8] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    onSelectProfile(currentInspectingProfile);
                    setInspectingProfileId(null);
                    setShowRawMemory(false);
                    setShowAddNote(false);
                  }}
                  className="px-3.5 py-1.5 rounded-md bg-[#11322E] hover:bg-[#0D2825] text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Review
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddNote(!showAddNote)}
                  className="px-3 py-1.5 rounded-md border border-[#DCD7CE] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#1C1917] transition-colors cursor-pointer"
                >
                  Add Note
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(currentInspectingProfile.id, 'Under Review')}
                  className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                    currentInspectingProfile.status === 'Under Review'
                      ? 'bg-[#FEF3C7] text-[#92400E] border-[#FCD34D]'
                      : 'border-[#DCD7CE] bg-white hover:bg-[#FAF8F5] text-[#57534E]'
                  }`}
                >
                  Flag for Follow-up
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(currentInspectingProfile.id, 'Analyzing')}
                  className="px-3 py-1.5 rounded-md border border-[#DCD7CE] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#57534E] transition-colors cursor-pointer"
                >
                  Dismiss
                </button>

                {/* Direct status dropdown */}
                <div className="relative">
                  <select
                    value={currentInspectingProfile.status}
                    onChange={(e) => handleStatusChange(currentInspectingProfile.id, e.target.value as MemoryStatus)}
                    className="h-7 pl-2 pr-6 rounded border border-[#DCD7CE] bg-white text-xs font-medium text-[#1C1917] focus:outline-none focus:border-[#115E59] cursor-pointer appearance-none"
                    aria-label="Change status"
                  >
                    <option value="New">New</option>
                    <option value="Analyzing">Analyzing</option>
                    <option value="Potential Connection">Potential Connection</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Reviewed">Reviewed</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-[#78716C] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setInspectingProfileId(null);
                  setShowRawMemory(false);
                  setShowAddNote(false);
                }}
                className="text-xs text-[#78716C] hover:text-[#1C1917] px-2 py-1 cursor-pointer font-medium"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
