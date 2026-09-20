import { MemoryType } from '../types';

export interface DemoScenario {
  id: string;
  name: string;
  category: 'strong' | 'medium' | 'weak' | 'none' | 'conflict';
  badge: string;
  expectedScore: string;
  summaryText: string;
  type: MemoryType;
  whoDescribing: string;
  approxNames: string;
  locationDetails: string;
  timePeriodAge: string;
  distinguishingDetail: string;
  relationship: string;
  rawMemoryText: string;
  testingNotes: string;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'demo-strong',
    name: 'Strong Potential Match',
    category: 'strong',
    badge: 'Strong Potential Connection (~91%)',
    expectedScore: '~91% Suggested Match',
    summaryText: 'Multi-signal alignment across specific scar landmark, engraved brass compass artifact, northern railway location, and autumn 1994 timeline.',
    type: 'searching',
    whoDescribing: 'Older brother (Tariq)',
    approxNames: 'Tariq, Tarique',
    locationDetails: 'Northern railway junction, evacuation transit siding',
    timePeriodAge: 'Autumn 1994, around 11 years old',
    distinguishingDetail: 'Crescent scar above left eyebrow, carried small brass pocket compass',
    relationship: 'Brother',
    rawMemoryText:
      'Searching for my older brother Tariq. We got separated at the northern railway junction during autumn 1994 while boarding the evacuation transit. He had a distinct crescent scar just above his left eyebrow from a childhood fall and carried a small brass pocket compass.',
    testingNotes: 'Direct counterpart Profile MB-004 in database shares identical scar, brass compass, autumn 1994 timeline, and railway clinic location.',
  },
  {
    id: 'demo-medium',
    name: 'Medium Potential Match',
    category: 'medium',
    badge: 'Medium Potential Connection (~78%)',
    expectedScore: '~78% Suggested Match',
    summaryText: 'Compatible rural highland brick kiln settlement and oral rain lullaby, with slight variations in workplace name and phonetic uncertainty.',
    type: 'searching',
    whoDescribing: 'Mother (Sita / Seeta Devi)',
    approxNames: 'Sita, Seeta Devi',
    locationDetails: 'High-chimney red brick kiln settlement, tea plantation hillside',
    timePeriodAge: 'Early 1982, mother in late twenties',
    distinguishingDetail: 'Sang lullaby about mountain rains every evening, red glass bangles',
    relationship: 'Mother',
    rawMemoryText:
      'Looking for my mother Sita (or Seeta). We lived in worker quarters adjacent to a high-chimney red brick kiln overlooking tea slopes. She used to sing a melody about mountain rains every evening and wore red glass bangles on her left wrist.',
    testingNotes: 'Matches Profile MB-006 on highland tea slopes, red brick kiln cooperative, and mountain rain ballads from 1982.',
  },
  {
    id: 'demo-weak',
    name: 'Weak Potential Match',
    category: 'weak',
    badge: 'Weak Potential Connection (~52%)',
    expectedScore: '~52% Suggested Match',
    summaryText: 'Broad geographical canal similarity and overlapping 1980s era, but lacks specific keepsake or family kinship corroboration.',
    type: 'searching',
    whoDescribing: 'Childhood acquaintance (Lin)',
    approxNames: 'Lin',
    locationDetails: 'Canal docklands near warehouses',
    timePeriodAge: 'Mid-1980s, young child',
    distinguishingDetail: 'Played near canal barges',
    relationship: 'Childhood Friend',
    rawMemoryText:
      'Remembering a childhood friend named Lin who lived along the canal docklands near the ceramic warehouses in the mid-1980s. We used to watch the cargo barges pass by.',
    testingNotes: 'Surfaces partial overlap with Profile MB-014 (ceramic warehouse canal in 1986), but lower confidence due to minimal unique artifacts.',
  },
  {
    id: 'demo-none',
    name: 'No Meaningful Match',
    category: 'none',
    badge: 'No Meaningful Match (0%)',
    expectedScore: 'No candidate matches surfaced',
    summaryText: 'Distinct historical profile with completely unique geography (Alpine clockmaker) that has zero corresponding counterparts in the database.',
    type: 'searching',
    whoDescribing: 'Uncle (Henrik)',
    approxNames: 'Henrik, Henrik Lindqvist',
    locationDetails: 'Alpine mountain pass, clock tower workshop',
    timePeriodAge: 'Spring 1965, uncle in his forties',
    distinguishingDetail: 'Master clockmaker who carried an engraved pocket watch with blue enamel',
    relationship: 'Extended Family',
    rawMemoryText:
      'Seeking information about my uncle Henrik Lindqvist. He was an alpine watchmaker in the high mountain pass during spring 1965 who repaired mechanical clock towers and carried an engraved pocket watch with blue enamel.',
    testingNotes: 'No matching counterparts exist in the database. ThreadBack displays the safe, honest empty state with ongoing monitoring registration.',
  },
  {
    id: 'demo-conflict',
    name: 'Conflicting Information Profile',
    category: 'conflict',
    badge: 'Contradictory / Conflict Detected (<30%)',
    expectedScore: 'Severe Chronological & Spatial Conflict',
    summaryText: 'Shares a nominal name match ("Tariq") but contains direct contradictions (1948 coastal coral island vs 1994 northern railway station).',
    type: 'searching',
    whoDescribing: 'Elderly fisherman (Tariq)',
    approxNames: 'Tariq',
    locationDetails: 'Tropical coastal coral islands and deep-sea salt marshes',
    timePeriodAge: '1948, elderly man around 80 years old',
    distinguishingDetail: 'Deep-sea net weaver with coral shell necklace',
    relationship: 'Grandfather',
    rawMemoryText:
      'Looking for my grandfather Tariq who worked as an elderly fisherman in the southern tropical coral islands and salt marshes in 1948. He wore a necklace carved from white coral shell.',
    testingNotes: 'Directly tests system conflict detection. Even though "Tariq" is in the system, the 46-year time gap (1948 vs 1994) and contradictory geography correctly prevent false positive matching.',
  },
];
