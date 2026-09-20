import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { MemoryIntakeForm } from './components/MemoryIntakeForm';
import { AIMemorySummary } from './components/AIMemorySummary';
import { ModeratorDashboard } from './components/ModeratorDashboard';
import { MatchComparisonView } from './components/MatchComparisonView';
import { AboutSafetyView } from './components/AboutSafetyView';
import { 
  ActiveView, 
  MemoryProfile, 
  PotentialMatch, 
  MemoryType,
  MemoryStatus,
  ModeratorNote
} from './types';
import { 
  INITIAL_PROFILES, 
  OTHER_MATCHES, 
  SIGNATURE_MATCH 
} from './data/mockData';
import { buildAllPotentialMatches, compareProfiles } from './utils/matchingEngine';

const LOCAL_STORAGE_PROFILES_KEY = 'threadback_prototype_profiles_v1';
const LOCAL_STORAGE_MATCHES_KEY = 'threadback_prototype_matches_v1';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  
  // Persistent Profiles State
  const [profiles, setProfiles] = useState<MemoryProfile[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_PROFILES;
  });

  // Persistent Matches State
  const [matches, setMatches] = useState<PotentialMatch[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_MATCHES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }

    const computed = buildAllPotentialMatches(INITIAL_PROFILES);
    const map = new Map<string, PotentialMatch>();
    OTHER_MATCHES.forEach((m) => map.set(m.id, m));
    computed.forEach((m) => {
      if (!map.has(m.id)) {
        map.set(m.id, m);
      }
    });
    return Array.from(map.values());
  });

  const [selectedMatchId, setSelectedMatchId] = useState<string>('CONN-4091');
  const [activeSummaryProfile, setActiveSummaryProfile] = useState<MemoryProfile | null>(INITIAL_PROFILES[2]);
  const [intakeInitialType, setIntakeInitialType] = useState<MemoryType>('searching');

  // Sync state to local persistence
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(profiles));
    } catch {
      // ignore
    }
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_MATCHES_KEY, JSON.stringify(matches));
    } catch {
      // ignore
    }
  }, [matches]);

  // Handle starting memory submission from Landing Page
  const handleStartIntake = (type: MemoryType) => {
    setIntakeInitialType(type);
    setActiveView('submit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle memory submission completion (transitions to AI Summary view)
  const handleIntakeComplete = (newProfile: MemoryProfile) => {
    const updatedProfiles = [newProfile, ...profiles.filter((p) => p.id !== newProfile.id)];
    setProfiles(updatedProfiles);
    
    // Automatically recalculate matches with new profile
    const newMatches = buildAllPotentialMatches(updatedProfiles);
    setMatches((prev) => {
      const map = new Map<string, PotentialMatch>();
      prev.forEach((m) => map.set(m.id, m));
      newMatches.forEach((m) => {
        if (!map.has(m.id)) {
          map.set(m.id, m);
        }
      });
      return Array.from(map.values());
    });

    setActiveSummaryProfile(newProfile);
    setActiveView('summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle confirmation of structured memory
  const handleSummaryConfirmed = (updatedProfile: MemoryProfile) => {
    setProfiles((prev) => {
      const exists = prev.some((p) => p.id === updatedProfile.id);
      if (exists) {
        return prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p));
      }
      return [updatedProfile, ...prev];
    });
    setActiveSummaryProfile(updatedProfile);
  };

  // Launch the signature Kamla demo match
  const handleLaunchDemoMatch = () => {
    setSelectedMatchId('CONN-4091');
    setActiveView('match');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open specific match from Dashboard or summary
  const handleSelectMatch = (matchOrId: string | PotentialMatch) => {
    if (typeof matchOrId === 'string') {
      const existing = matches.find((m) => m.id === matchOrId);
      if (existing) {
        setSelectedMatchId(matchOrId);
      } else {
        // Search in all computed matches across current profiles
        const allComputed = buildAllPotentialMatches(profiles);
        const found = allComputed.find((m) => m.id === matchOrId);
        if (found) {
          setMatches((prev) => [found, ...prev.filter((m) => m.id !== found.id)]);
          setSelectedMatchId(found.id);
        } else {
          setSelectedMatchId(matchOrId);
        }
      }
    } else {
      setMatches((prev) => [matchOrId, ...prev.filter((m) => m.id !== matchOrId.id)]);
      setSelectedMatchId(matchOrId.id);
    }
    setActiveView('match');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Inspect specific profile in summary view
  const handleSelectProfile = (profile: MemoryProfile) => {
    setActiveSummaryProfile(profile);
    setActiveView('summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update match status from caseworker actions (Flag / Dismiss / Review / Notes)
  const handleUpdateMatchStatus = (
    matchId: string,
    newStatus: 'Flagged for Follow-up' | 'Dismissed' | 'Reviewed' | 'Awaiting Review',
    noteText?: string
  ) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== matchId) return m;
        const updatedNotes = [...(m.moderatorNotes || [])];
        if (noteText && noteText.trim()) {
          updatedNotes.push({
            id: `note-${Date.now()}`,
            author: 'Elena Rostova (Caseworker)',
            text: noteText.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
            tag: newStatus === 'Flagged for Follow-up' ? 'flagged' : newStatus === 'Dismissed' ? 'dismissed' : 'verified_step',
          });
        }
        return {
          ...m,
          status: newStatus,
          lastUpdated: 'Just now',
          moderatorNotes: updatedNotes,
        };
      })
    );
  };

  // Add a caseworker note to a match
  const handleAddMatchNote = (matchId: string, noteText: string) => {
    if (!noteText.trim()) return;
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== matchId) return m;
        const newNote: ModeratorNote = {
          id: `note-${Date.now()}`,
          author: 'Elena Rostova (Caseworker)',
          text: noteText.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
          tag: 'note',
        };
        return {
          ...m,
          moderatorNotes: [...(m.moderatorNotes || []), newNote],
          lastUpdated: 'Just now',
        };
      })
    );
  };

  // Update profile status from caseworker actions
  const handleUpdateProfileStatus = (
    profileId: string,
    newStatus: MemoryStatus
  ) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, status: newStatus } : p))
    );
  };

  // Add a caseworker note to a profile
  const handleAddProfileNote = (profileId: string, noteText: string) => {
    if (!noteText.trim()) return;
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== profileId) return p;
        const newNote: ModeratorNote = {
          id: `pnote-${Date.now()}`,
          author: 'Elena Rostova (Caseworker)',
          text: noteText.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
          tag: 'note',
        };
        return {
          ...p,
          moderatorNotes: [...(p.moderatorNotes || []), newNote],
        };
      })
    );
  };

  // Find currently active match
  const activeMatch = matches.find((m) => m.id === selectedMatchId) || SIGNATURE_MATCH;

  // Pending count for top badge
  const pendingCount = matches.filter((m) => m.status === 'Awaiting Review').length;

  const isModeratorView = activeView === 'dashboard';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917]">
      {/* Global Application Header (rendered on consumer screens) */}
      {!isModeratorView && (
        <Header
          activeView={activeView}
          setActiveView={(v) => {
            if (v === 'summary' && !activeSummaryProfile) {
              setActiveSummaryProfile(INITIAL_PROFILES[2]);
            }
            setActiveView(v);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          pendingReviewCount={pendingCount}
          onQuickDemoMatch={handleLaunchDemoMatch}
        />
      )}

      {/* Primary Dynamic Content Area with Smooth Page Transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeView === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <LandingPage
                onStartIntake={handleStartIntake}
                onNavigate={(v) => {
                  if (v === 'summary' && !activeSummaryProfile) {
                    setActiveSummaryProfile(INITIAL_PROFILES[2]);
                  }
                  setActiveView(v);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onLaunchDemoMatch={handleLaunchDemoMatch}
              />
            </motion.div>
          )}

          {activeView === 'submit' && (
            <motion.div
              key="submit"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <MemoryIntakeForm
                initialType={intakeInitialType}
                onComplete={handleIntakeComplete}
                onCancel={() => {
                  setActiveView('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {activeView === 'summary' && activeSummaryProfile && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <AIMemorySummary
                profile={activeSummaryProfile}
                allProfiles={profiles}
                onConfirm={handleSummaryConfirmed}
                onEditAgain={() => {
                  setActiveView('submit');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onExploreMatches={() => {
                  setActiveView('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectMatch={handleSelectMatch}
              />
            </motion.div>
          )}

          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <ModeratorDashboard
                profiles={profiles}
                matches={matches}
                onSelectMatch={handleSelectMatch}
                onOpenNewIntake={() => handleStartIntake('searching')}
                onSelectProfile={handleSelectProfile}
                onUpdateProfileStatus={handleUpdateProfileStatus}
                onAddProfileNote={handleAddProfileNote}
                onUpdateMatchStatus={handleUpdateMatchStatus}
                onAddMatchNote={handleAddMatchNote}
                onBackToHome={() => {
                  setActiveView('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}

          {activeView === 'match' && (
            <motion.div
              key="match"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <MatchComparisonView
                match={activeMatch}
                onBack={() => {
                  setActiveView('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onUpdateMatchStatus={handleUpdateMatchStatus}
                onAddMatchNote={handleAddMatchNote}
              />
            </motion.div>
          )}

          {activeView === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <AboutSafetyView
                onStartIntake={() => handleStartIntake('searching')}
                onNavigateHome={() => {
                  setActiveView('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Application Footer (for consumer screens) */}
      {!isModeratorView && (
        <Footer
          onNavigate={(v) => {
            if (v === 'summary' && !activeSummaryProfile) {
              setActiveSummaryProfile(INITIAL_PROFILES[2]);
            }
            setActiveView(v);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onQuickDemo={handleLaunchDemoMatch}
        />
      )}
    </div>
  );
}
