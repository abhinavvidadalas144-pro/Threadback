export type MemoryType = 'searching' | 'information';

export type MemoryStatus = 
  | 'New' 
  | 'Analyzing' 
  | 'Potential Connection' 
  | 'Under Review' 
  | 'Reviewed';

export interface StructuredMemory {
  names: string[];
  locations: string[];
  timePeriod: string;
  approximateAge: string;
  distinguishingMemories: string[];
  relationship: string;
}

export interface ModeratorNote {
  id: string;
  author: string;
  timestamp: string;
  text: string;
  tag: 'note' | 'flagged' | 'dismissed' | 'verified_step';
}

export interface MemoryProfile {
  id: string;
  type: MemoryType;
  whoDescribing: string;
  relationship: string;
  rawMemoryText: string;
  structuredData: StructuredMemory;
  submittedDate: string;
  status: MemoryStatus;
  candidateMatchId?: string;
  moderatorNotes?: ModeratorNote[];
  isSyntheticDemo?: boolean;
}

export interface ConceptConnection {
  id: string;
  concept: string;
  labelA: string;
  labelB: string;
  strength: 'high' | 'moderate' | 'compatible';
  explanation: string;
  sourceFragmentA: string;
  sourceFragmentB: string;
}

export interface PotentialMatch {
  id: string;
  profileA: MemoryProfile;
  profileB: MemoryProfile;
  similarityScore: number;
  status: 'Awaiting Review' | 'Flagged for Follow-up' | 'Dismissed' | 'Reviewed';
  surfacedReasons: {
    strong: string[];
    uncertain: string[];
  };
  threadConnections: ConceptConnection[];
  lastUpdated: string;
  moderatorNotes: ModeratorNote[];
}

export type ActiveView = 
  | 'landing' 
  | 'submit' 
  | 'summary' 
  | 'dashboard' 
  | 'match' 
  | 'about';
