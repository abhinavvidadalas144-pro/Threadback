import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Clock, 
  Building2, 
  CheckCircle2, 
  Flag, 
  Pencil,
  ArrowRight,
  Check,
  Bookmark, 
  Send,
  AlertTriangle,
  Info
} from 'lucide-react';
import { PotentialMatch } from '../types';

interface MatchComparisonViewProps {
  match: PotentialMatch;
  onBack: () => void;
  onUpdateMatchStatus: (
    matchId: string, 
    newStatus: 'Flagged for Follow-up' | 'Dismissed' | 'Reviewed' | 'Awaiting Review',
    noteText?: string
  ) => void;
  onAddMatchNote?: (matchId: string, noteText: string) => void;
}

export const MatchComparisonView: React.FC<MatchComparisonViewProps> = ({
  match,
  onBack,
  onUpdateMatchStatus,
  onAddMatchNote,
}) => {
  const [moderatorNote, setModeratorNote] = useState('');
  const [currentStatus, setCurrentStatus] = useState(match.status);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleAction = (status: 'Flagged for Follow-up' | 'Dismissed' | 'Reviewed') => {
    setCurrentStatus(status);
    const noteToSave = moderatorNote.trim() || undefined;
    onUpdateMatchStatus(match.id, status, noteToSave);
    if (noteToSave) {
      setModeratorNote('');
    }
    setFeedbackMessage(`Status updated to "${status}". Changes saved.`);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleAddNoteOnly = () => {
    if (!moderatorNote.trim()) return;
    if (onAddMatchNote) {
      onAddMatchNote(match.id, moderatorNote.trim());
    } else {
      onUpdateMatchStatus(match.id, currentStatus, moderatorNote.trim());
    }
    setModeratorNote('');
    setFeedbackMessage('Caseworker note recorded successfully.');
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Profile data from match object
  const profileA = match.profileA;
  const profileB = match.profileB;

  const score = match.similarityScore || 85;

  // Helper for concept icons in matched threads
  const getConceptIcon = (concept: string) => {
    const c = concept.toUpperCase();
    if (c.includes('NAME')) return <User className="w-3.5 h-3.5" />;
    if (c.includes('LOC') || c.includes('PLACE')) return <MapPin className="w-3.5 h-3.5" />;
    if (c.includes('LANDMARK') || c.includes('BUILDING')) return <Building2 className="w-3.5 h-3.5" />;
    if (c.includes('TIME') || c.includes('AGE')) return <Clock className="w-3.5 h-3.5" />;
    if (c.includes('ARTIFACT') || c.includes('SKILL') || c.includes('DETAIL') || c.includes('MARKER')) {
      return <Bookmark className="w-3.5 h-3.5" />;
    }
    return <Bookmark className="w-3.5 h-3.5" />;
  };

  const getStrengthBadge = (strength: 'high' | 'moderate' | 'compatible') => {
    if (strength === 'high') {
      return (
        <span className="text-xs text-[#15803D] flex items-center gap-1.5 font-normal">
          <Check className="w-3 h-3 text-[#15803D]" />
          <span>Strong correspondence</span>
        </span>
      );
    }
    if (strength === 'compatible') {
      return (
        <span className="text-xs text-[#0369A1] flex items-center gap-1.5 font-normal">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0369A1]" />
          <span>Compatible timeline</span>
        </span>
      );
    }
    return (
      <span className="text-xs text-[#92400E] flex items-center gap-1.5 font-normal">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]" />
        <span>Possible variation</span>
      </span>
    );
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans text-[#1C1917]">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* ========================================================================= */}
        {/* 1. BACK NAVIGATION & HEADER META                                          */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <button
            type="button"
            data-no-interactive="true"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer group focus:outline-none"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#78716C] group-hover:text-[#1C1917]" />
            <span className="group-hover:underline underline-offset-2">Back to dashboard</span>
          </button>

          <div className="space-y-2.5 pt-1">
            {/* 1. Potential Connection Heading with Letter-by-Letter Interactive Hover */}
            <h1 className="font-serif-display text-2xl sm:text-3xl lg:text-[32px] font-normal sm:font-medium text-[#1C1917] tracking-tight leading-tight select-none flex items-center gap-x-2 flex-wrap">
              {['Potential', 'Connection'].map((word, wordIdx) => (
                <span key={wordIdx} className="inline-flex">
                  {word.split('').map((char, charIdx) => (
                    <motion.span
                      key={charIdx}
                      className="inline-block transition-colors duration-200 hover:text-[#115E59] cursor-default"
                      whileHover={{ 
                        y: -4, 
                        scale: 1.03,
                        transition: { type: 'spring', stiffness: 500, damping: 18 } 
                      }}
                      animate={{ y: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>

            {/* 2. Case / Profile Context & 3. Understated Status Line */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-2 gap-x-4 text-xs text-[#78716C]">
              
              {/* Context Metadata */}
              <div className="flex items-center gap-2 flex-wrap">
                <span>Case {match.id}</span>
                <span className="text-[#D6D0C4]">•</span>
                <span className="text-[#57534E]">
                  <span className="hover:text-[#1C1917] transition-colors cursor-default">Profile {profileA.id}</span>
                  <span className="text-[#78716C] mx-1">&</span>
                  <span className="hover:text-[#1C1917] transition-colors cursor-default">Profile {profileB.id}</span>
                </span>
              </div>

              {/* Status & Review Notice */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1.5 font-normal">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      currentStatus === 'Reviewed'
                        ? 'bg-[#15803D]'
                        : currentStatus === 'Flagged for Follow-up'
                        ? 'bg-[#DC2626]'
                        : currentStatus === 'Dismissed'
                        ? 'bg-[#78716C]'
                        : 'bg-[#D97706]'
                    }`}
                  />
                  <span className="text-[#57534E]">
                    {currentStatus === 'Awaiting Review' ? 'Awaiting review' : currentStatus}
                  </span>
                </span>

                <span className="text-[#D6D0C4]">•</span>

                <span className="text-[#78716C] flex items-center gap-1.5 font-normal">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600/70" />
                  <span>Human review required</span>
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SIMILARITY CALLOUT & SEARCH OVERVIEW                                    */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-xl border border-[#E7E2D8] p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-5 border-b border-[#F0EBE1]">
            
            {/* Prominent Similarity Metric */}
            <div className="space-y-1.5">
              <div className="flex items-baseline gap-2.5">
                <span className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#115E59] tracking-tight">
                  {score}%
                </span>
                <span className="text-sm font-medium text-[#1C1917]">
                  Information similarity
                </span>
              </div>
              <p className="text-xs text-[#78716C] max-w-md leading-relaxed">
                Similarity reflects matching information across recorded memories and does not verify identity.
              </p>
            </div>

            {/* Summary Comparison Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:max-w-md w-full bg-[#FAF8F5] p-4 rounded-lg border border-[#EAE5DC]">
              <div className="space-y-1">
                <span className="text-[11px] text-[#78716C] font-mono-code block">
                  Profile {profileA.id}
                </span>
                <p className="text-sm font-medium text-[#1C1917] leading-snug">
                  {profileA.whoDescribing} {profileA.relationship ? `(${profileA.relationship})` : ''}
                </p>
                <span className="text-[11px] text-[#78716C] block">
                  {profileA.type === 'searching' ? 'Searching for person' : 'Has memory information'}
                </span>
              </div>

              <div className="space-y-1 sm:border-l sm:border-[#E7E2D8] sm:pl-4">
                <span className="text-[11px] text-[#78716C] font-mono-code block">
                  Profile {profileB.id}
                </span>
                <p className="text-sm font-medium text-[#1C1917] leading-snug">
                  {profileB.whoDescribing} {profileB.relationship ? `(${profileB.relationship})` : ''}
                </p>
                <span className="text-[11px] text-[#78716C] block">
                  {profileB.type === 'searching' ? 'Searching for person' : 'Has memory information'}
                </span>
              </div>
            </div>

          </div>

          {/* Quick Notice */}
          <div className="flex items-start gap-2 text-xs text-[#57534E] leading-relaxed">
            <Info className="w-3.5 h-3.5 text-[#115E59] shrink-0 mt-0.5" />
            <p>
              Review all corroborating details, location timelines, and caseworker notes below before taking verification actions or contacting parties.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. SIDE-BY-SIDE MEMORY PROFILES COMPARISON                                 */}
        {/* ========================================================================= */}
        <section className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">
              Memory Profiles Comparison
            </h2>
            <span className="text-xs text-[#78716C]">
              Cross-referencing 2 records
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* PROFILE A CARD */}
            <div className="bg-white rounded-xl border border-[#E7E2D8] p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* Header */}
                <div className="pb-3 border-b border-[#F0EBE1]">
                  <div className="flex items-center gap-2 text-xs text-[#78716C]">
                    <span className="font-mono-code">Profile {profileA.id}</span>
                    <span>•</span>
                    <span>{profileA.type === 'searching' ? 'Searching' : 'Has Information'}</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#1C1917] mt-0.5">
                    {profileA.whoDescribing} {profileA.relationship ? `(${profileA.relationship})` : ''}
                  </h3>
                </div>

                {/* Original Narrative */}
                <div className="space-y-1">
                  <span className="text-[11px] text-[#78716C] font-medium block">
                    Original memory narrative:
                  </span>
                  <p className="text-xs text-[#44403C] italic leading-relaxed pl-3 border-l-2 border-[#E7E2D8]">
                    "{profileA.rawMemoryText}"
                  </p>
                </div>

                {/* Structured Clues */}
                <div className="space-y-2.5 text-xs pt-1">
                  <div>
                    <span className="text-[11px] text-[#78716C] block">Names / Aliases</span>
                    <span className="text-[#1C1917] font-normal">
                      {profileA.structuredData.names?.length > 0 ? profileA.structuredData.names.join(' / ') : 'None recorded'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-[#78716C] block">Anchor Locations</span>
                    <span className="text-[#1C1917] font-normal">
                      {profileA.structuredData.locations?.length > 0 ? profileA.structuredData.locations.join(', ') : 'Unspecified'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-[#78716C] block">Time Period & Age</span>
                    <span className="text-[#1C1917] font-normal">
                      {profileA.structuredData.timePeriod || 'Unknown period'} 
                      {profileA.structuredData.approximateAge ? ` • Age ~${profileA.structuredData.approximateAge}` : ''}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-[#78716C] block">Distinguishing Details</span>
                    <span className="text-[#1C1917] font-normal">
                      {profileA.structuredData.distinguishingMemories?.length > 0 ? profileA.structuredData.distinguishingMemories.join('; ') : 'None recorded'}
                    </span>
                  </div>
                </div>

              </div>

              <div className="pt-3 border-t border-[#F0EBE1] text-[11px] text-[#78716C] flex items-center justify-between">
                <span>Submitted: {profileA.submittedDate}</span>
                <span className="text-[#15803D]">Verified intact</span>
              </div>
            </div>

            {/* PROFILE B CARD */}
            <div className="bg-white rounded-xl border border-[#E7E2D8] p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* Header */}
                <div className="pb-3 border-b border-[#F0EBE1]">
                  <div className="flex items-center gap-2 text-xs text-[#78716C]">
                    <span className="font-mono-code">Profile {profileB.id}</span>
                    <span>•</span>
                    <span>{profileB.type === 'searching' ? 'Searching' : 'Has Information'}</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#1C1917] mt-0.5">
                    {profileB.whoDescribing} {profileB.relationship ? `(${profileB.relationship})` : ''}
                  </h3>
                </div>

                {/* Original Narrative */}
                <div className="space-y-1">
                  <span className="text-[11px] text-[#78716C] font-medium block">
                    Original memory narrative:
                  </span>
                  <p className="text-xs text-[#44403C] italic leading-relaxed pl-3 border-l-2 border-[#E7E2D8]">
                    "{profileB.rawMemoryText}"
                  </p>
                </div>

                {/* Structured Clues */}
                <div className="space-y-2.5 text-xs pt-1">
                  <div>
                    <span className="text-[11px] text-[#78716C] block">Names / Aliases</span>
                    <span className="text-[#1C1917] font-normal">
                      {profileB.structuredData.names?.length > 0 ? profileB.structuredData.names.join(' / ') : 'None recorded'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-[#78716C] block">Anchor Locations</span>
                    <span className="text-[#1C1917] font-normal">
                      {profileB.structuredData.locations?.length > 0 ? profileB.structuredData.locations.join(', ') : 'Unspecified'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-[#78716C] block">Time Period & Age</span>
                    <span className="text-[#1C1917] font-normal">
                      {profileB.structuredData.timePeriod || 'Unknown period'} 
                      {profileB.structuredData.approximateAge ? ` • Age ~${profileB.structuredData.approximateAge}` : ''}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-[#78716C] block">Distinguishing Details</span>
                    <span className="text-[#1C1917] font-normal">
                      {profileB.structuredData.distinguishingMemories?.length > 0 ? profileB.structuredData.distinguishingMemories.join('; ') : 'None recorded'}
                    </span>
                  </div>
                </div>

              </div>

              <div className="pt-3 border-t border-[#F0EBE1] text-[11px] text-[#78716C] flex items-center justify-between">
                <span>Submitted: {profileB.submittedDate}</span>
                <span className="text-[#15803D]">Verified intact</span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. MATCHING SIGNALS & CORROBORATING THREADS                                */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-xl border border-[#E7E2D8] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-3 border-b border-[#F0EBE1]">
            <h2 className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">
              Matching Signals ({match.threadConnections.length} Corroborating Threads)
            </h2>
            <span className="text-xs text-[#78716C]">
              Semantic cross-reference between records
            </span>
          </div>

          <div className="divide-y divide-[#F0EBE1]">
            {match.threadConnections.map((thread) => (
              <div key={thread.id} className="py-4 first:pt-1 last:pb-1 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[#115E59]">
                      {getConceptIcon(thread.concept)}
                    </span>
                    <span className="text-xs font-medium text-[#1C1917]">
                      {thread.concept}
                    </span>
                  </div>
                  {getStrengthBadge(thread.strength)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#FAF8F5] p-2.5 rounded-md border border-[#EAE5DC]">
                    <span className="text-[10px] text-[#78716C] uppercase font-medium block mb-0.5">
                      Profile {profileA.id}:
                    </span>
                    <span className="text-[#1C1917] italic">
                      "{thread.labelA}"
                    </span>
                  </div>

                  <div className="bg-[#FAF8F5] p-2.5 rounded-md border border-[#EAE5DC]">
                    <span className="text-[10px] text-[#78716C] uppercase font-medium block mb-0.5">
                      Profile {profileB.id}:
                    </span>
                    <span className="text-[#1C1917] italic">
                      "{thread.labelB}"
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#57534E] leading-relaxed pt-0.5">
                  {thread.explanation}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. WHY THIS CONNECTION SURFACED (STRONG VS UNCERTAINTIES)                  */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-xl border border-[#E7E2D8] p-6 space-y-4">
          <h2 className="text-xs font-semibold text-[#78716C] uppercase tracking-wider pb-3 border-b border-[#F0EBE1]">
            Why this connection surfaced
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            
            {/* Strong Alignments */}
            <div className="space-y-2">
              <span className="font-medium text-[#15803D] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Strong alignments</span>
              </span>
              <ul className="space-y-1.5 text-[#57534E]">
                {match.surfacedReasons?.strong?.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#15803D] leading-none mt-1 select-none">•</span>
                    <span className="leading-relaxed">{reason}</span>
                  </li>
                )) || (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-[#15803D] leading-none mt-1 select-none">•</span>
                      <span className="leading-relaxed">Identical geographic region and distinctive landmark memory</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#15803D] leading-none mt-1 select-none">•</span>
                      <span className="leading-relaxed">Compatible timeline and matching childhood age cohort</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Observations for review / Uncertainties */}
            <div className="space-y-2">
              <span className="font-medium text-[#92400E] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#B45309]" />
                <span>Observations for review</span>
              </span>
              <ul className="space-y-1.5 text-[#57534E]">
                {match.surfacedReasons?.uncertain?.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#B45309] leading-none mt-1 select-none">•</span>
                    <span className="leading-relaxed">{reason}</span>
                  </li>
                )) || (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-[#B45309] leading-none mt-1 select-none">•</span>
                      <span className="leading-relaxed">Similarity indicates how closely the memories are described. It does not prove identity.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#B45309] leading-none mt-1 select-none">•</span>
                      <span className="leading-relaxed">Caseworker verification required before contacting parties.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. CASEWORKER NOTES & DECISION ACTIONS                                     */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-xl border border-[#E7E2D8] p-6 space-y-6">
          
          {/* Notes Log & Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">
                Caseworker Notes & Observations
              </h2>
              <span className="text-xs text-[#78716C]">
                {match.moderatorNotes?.length || 0} recorded notes
              </span>
            </div>

            {/* Previous Notes Log */}
            {match.moderatorNotes && match.moderatorNotes.length > 0 && (
              <div className="space-y-2 p-3.5 bg-[#FAF8F5] rounded-lg border border-[#EAE5DC] max-h-48 overflow-y-auto divide-y divide-[#E7E2D8]">
                {match.moderatorNotes.map((note) => (
                  <div key={note.id} className="pt-2.5 first:pt-0 space-y-0.5 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-[#78716C]">
                      <span className="font-medium text-[#1C1917]">{note.author}</span>
                      <span>{note.timestamp}</span>
                    </div>
                    <p className="text-[#44403C] leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Note Input */}
            <div className="space-y-2">
              <textarea
                rows={3}
                maxLength={500}
                value={moderatorNote}
                onChange={(e) => setModeratorNote(e.target.value)}
                placeholder="Add caseworker observation or verification step details..."
                className="w-full p-3.5 rounded-lg border border-[#DCD7CE] text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#115E59] bg-white resize-none"
              />
              <div className="flex items-center justify-between text-xs text-[#78716C]">
                <button
                  type="button"
                  onClick={handleAddNoteOnly}
                  disabled={!moderatorNote.trim()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FAF8F5] hover:bg-[#F0ECE1] border border-[#DCD7CE] disabled:opacity-40 text-[#1C1917] font-medium text-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3 h-3 text-[#115E59]" />
                  <span>Add note only</span>
                </button>
                <span className="font-mono-code text-[11px] text-[#A8A29E]">
                  {moderatorNote.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* Feedback Toast / Alert */}
          {feedbackMessage && (
            <div className="p-3 rounded-lg bg-[#EDF7ED] border border-[#C8E6C9] text-xs text-[#1E4620] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          {/* Action Decision Buttons */}
          <div className="pt-4 border-t border-[#F0EBE1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleAction('Flagged for Follow-up')}
                className={`px-3.5 py-2 rounded-md border text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  currentStatus === 'Flagged for Follow-up'
                    ? 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
                    : 'border-[#DCD7CE] text-[#57534E] bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                <Flag className="w-3.5 h-3.5 text-red-600" />
                <span>Flag for follow-up</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction('Dismissed')}
                className={`px-3.5 py-2 rounded-md border text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  currentStatus === 'Dismissed'
                    ? 'bg-[#F5F5F4] border-[#E7E5E4] text-[#1C1917]'
                    : 'border-[#DCD7CE] text-[#57534E] bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                <Pencil className="w-3.5 h-3.5 text-[#78716C]" />
                <span>Dismiss as not a match</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleAction('Reviewed')}
              className="px-5 py-2 rounded-md bg-[#11322E] hover:bg-[#0D2825] text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Save & Mark Reviewed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </section>

      </div>
    </div>
  );
};
