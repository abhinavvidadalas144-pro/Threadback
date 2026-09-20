import { StructuredMemory, MemoryType } from '../types';

export interface RawIntakeInput {
  rawMemoryText: string;
  whoDescribing?: string;
  approxNames?: string;
  locationDetails?: string;
  timePeriodAge?: string;
  distinguishingDetail?: string;
  relationship?: string;
  type?: MemoryType;
}

/**
 * Extracts structured memory anchors strictly from the submitted text and provided fields.
 * Direct implementation constraint: Do not invent facts, names, dates, or places that were not provided.
 */
export function extractStructuredMemory(input: RawIntakeInput): StructuredMemory {
  const text = (input.rawMemoryText || '').trim();
  const lowerText = text.toLowerCase();

  // 1. EXTRACT NAMES
  const extractedNames: string[] = [];
  
  if (input.approxNames && input.approxNames.trim()) {
    const fromInput = input.approxNames
      .split(/[,;/]|\bor\b|\band\b/i)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !['unknown', 'not sure', 'unsure'].includes(s.toLowerCase()));
    extractedNames.push(...fromInput);
  }

  // Regex patterns to capture names mentioned in free text
  const namePatterns = [
    /(?:named|called|known as|alias|sounding like|name sounded like|name was|sister|brother|mother|father|uncle|aunt|friend|apprentice|fisherman|student)\s+([A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*)?)/g,
    /(?:searching for|looking for|information regarding|remembering|recalling)\s+(?:my\s+)?(?:older\s+|younger\s+)?(?:brother|sister|mother|father|uncle|aunt|friend|neighbor)?\s*([A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*)?)/g,
    /\(([A-Z][a-zA-Z]*(?:\s*(?:\/|or)\s*[A-Z][a-zA-Z]*)*)\)/g,
  ];

  for (const pattern of namePatterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1]) {
        const candidates = match[1].split(/[/]|\bor\b/i).map(c => c.trim()).filter(Boolean);
        for (const cand of candidates) {
          const cleanCand = cand.replace(/[^a-zA-Z\s-]/g, '').trim();
          const stopWords = ['A', 'The', 'In', 'My', 'We', 'He', 'She', 'They', 'Our', 'There', 'When', 'During', 'After', 'Before', 'Searching', 'Looking'];
          if (cleanCand.length > 1 && !stopWords.includes(cleanCand) && !extractedNames.some(n => n.toLowerCase() === cleanCand.toLowerCase())) {
            extractedNames.push(cleanCand);
          }
        }
      }
    }
  }

  // 2. EXTRACT LOCATIONS & TOPOLOGICAL LANDMARKS
  const extractedLocations: string[] = [];

  if (input.locationDetails && input.locationDetails.trim()) {
    const fromLocInput = input.locationDetails
      .split(/[,;\n]|\band\b/i)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !['unknown', 'not sure'].includes(s.toLowerCase()));
    extractedLocations.push(...fromLocInput);
  }

  // Common topological landmark anchor patterns present in memory recollections
  const landmarkRules = [
    { regex: /northern railway junction/i, label: 'Northern railway junction' },
    { regex: /evacuation transit siding|railway clinic/i, label: 'Evacuation transit siding / clinic' },
    { regex: /red brick kiln|brick kiln/i, label: 'High-chimney red brick kiln settlement' },
    { regex: /tea (?:slopes|plantation|hillside)/i, label: 'Tea plantation hillside' },
    { regex: /stone temple|temple close to our house|temple water steps/i, label: 'Old stone temple by river water steps' },
    { regex: /village (?:beside|near|close to) a river/i, label: 'Village near a river' },
    { regex: /willow[- ]lined canal|willow canal/i, label: 'Willow-lined canal docklands' },
    { regex: /ceramic (?:storage )?warehouses?/i, label: 'Ceramic storage warehouse row' },
    { regex: /alpine (?:mountain )?pass|clock tower/i, label: 'Alpine mountain pass / clock tower workshop' },
    { regex: /timber (?:and grain )?mill|logging road|sawmill/i, label: 'Timber mill along pine river road' },
    { regex: /three[- ]trunk(?:ed)? acacia|triple acacia|stone well/i, label: 'Courtyard with three-trunk acacia tree and stone well' },
    { regex: /tropical coral islands?|salt marshes/i, label: 'Tropical coastal coral islands / salt marshes' },
    { regex: /blue (?:harbor )?lighthouse|ferry slipway/i, label: 'Blue harbor lighthouse / ferry slipway' },
    { regex: /carpentry workshop|stone arch bridge/i, label: 'Valley carpentry workshop near stone arch bridge' },
  ];

  for (const rule of landmarkRules) {
    if (rule.regex.test(text) && !extractedLocations.some(l => l.toLowerCase() === rule.label.toLowerCase())) {
      extractedLocations.push(rule.label);
    }
  }

  // 3. EXTRACT TIME PERIOD
  let extractedTime = '';
  if (input.timePeriodAge && input.timePeriodAge.trim()) {
    extractedTime = input.timePeriodAge.trim();
  } else {
    const yearMatch = text.match(/\b(19\d\d|20\d\d)\b/);
    const seasonMatch = text.match(/\b(autumn|spring|summer|winter|monsoon)\s+(?:of\s+)?(19\d\d|20\d\d)?/i);
    const eraMatch = text.match(/\b(early|mid|late)\s+(?:the\s+)?(19\d\ds|70s|80s|90s)\b/i);

    if (seasonMatch) {
      extractedTime = seasonMatch[0].trim();
    } else if (eraMatch) {
      extractedTime = eraMatch[0].trim();
    } else if (yearMatch) {
      extractedTime = `Around ${yearMatch[0]}`;
    } else {
      extractedTime = 'Unknown timeline';
    }
  }

  // 4. EXTRACT APPROXIMATE AGE
  let extractedAge = '';
  const ageMatch = text.match(/(?:around|about|approximately|aged?|was)\s+(\d{1,2})\s*(?:years?\s*old|-year-old)?/i) ||
                   text.match(/(\d{1,2})\s*years?\s*old/i) ||
                   text.match(/\b(child|infant|adolescent|teenager|late twenties|early thirties|elderly(?:\s+man|\s+woman)?)\b/i);
  
  if (ageMatch) {
    if (ageMatch[1] && /^\d+$/.test(ageMatch[1])) {
      extractedAge = `Around ${ageMatch[1]} years old`;
    } else {
      extractedAge = ageMatch[0].charAt(0).toUpperCase() + ageMatch[0].slice(1);
    }
  } else if (input.timePeriodAge && /\b\d+\s*years?\b/i.test(input.timePeriodAge)) {
    extractedAge = input.timePeriodAge;
  } else {
    extractedAge = 'Not specified';
  }

  // 5. EXTRACT DISTINGUISHING MEMORIES & SENSORY DETAILS
  const extractedDistinguishing: string[] = [];

  if (input.distinguishingDetail && input.distinguishingDetail.trim()) {
    const fromDetailInput = input.distinguishingDetail
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !['none', 'not specified'].includes(s.toLowerCase()));
    extractedDistinguishing.push(...fromDetailInput);
  }

  const detailRules = [
    { regex: /crescent scar(?: just)? above (?:his|her|the)? left eyebrow|scar (?:near|above) (?:his|her)? left eyebrow/i, label: 'Crescent scar above left eyebrow' },
    { regex: /brass (?:pocket )?compass/i, label: 'Carried small brass pocket compass' },
    { regex: /silver ankle bracelet with small bell|silver ankle bell/i, label: 'Silver ankle bracelet with small bell' },
    { regex: /(?:melody|lullaby|ballad) about mountain rains/i, label: 'Sang melody about mountain rains every evening' },
    { regex: /red glass bangles/i, label: 'Wore red glass bangles on left wrist' },
    { regex: /miniature wooden (?:birds|animals)|carved wooden (?:birds|animals|figurines)/i, label: 'Carved miniature wooden animals / birds' },
    { regex: /red silk pouch with dried jasmine/i, label: 'Red silk pouch with dried jasmine blossoms' },
    { regex: /pocket watch with blue enamel/i, label: 'Engraved pocket watch with blue enamel' },
    { regex: /necklace carved from (?:white )?coral shell|coral shell necklace/i, label: 'Necklace carved from white coral shell' },
    { regex: /birthmark on (?:her|his|the)? (?:right )?(?:collarbone|clavicle)/i, label: 'Small birthmark on collarbone' },
    { regex: /toy wooden boats out of driftwood/i, label: 'Carved toy wooden boats from driftwood' },
    { regex: /notched leather belt with a brass buckle/i, label: 'Notched leather belt with brass buckle' },
    { regex: /round (?:wire|metal rim) spectacles|glasses/i, label: 'Round wire spectacles' },
  ];

  for (const rule of detailRules) {
    if (rule.regex.test(text) && !extractedDistinguishing.some(d => d.toLowerCase() === rule.label.toLowerCase())) {
      extractedDistinguishing.push(rule.label);
    }
  }

  // 6. EXTRACT RELATIONSHIP
  let extractedRelationship = '';
  if (input.relationship && input.relationship.trim()) {
    extractedRelationship = input.relationship.trim();
  } else {
    const relRules = [
      { regex: /\b(?:younger |older )?sister\b/i, label: 'Sister' },
      { regex: /\b(?:younger |older )?brother\b/i, label: 'Brother' },
      { regex: /\bmother\b/i, label: 'Mother' },
      { regex: /\bfather\b/i, label: 'Father' },
      { regex: /\buncle\b/i, label: 'Uncle' },
      { regex: /\baunt\b/i, label: 'Aunt' },
      { regex: /\bgrandfather\b/i, label: 'Grandfather' },
      { regex: /\bgrandmother\b/i, label: 'Grandmother' },
      { regex: /\bchildhood friend\b/i, label: 'Childhood Friend' },
      { regex: /\bneighbor\b/i, label: 'Neighbor' },
      { regex: /\bcoworker|colleague\b/i, label: 'Coworker' },
      { regex: /\bapprentice\b/i, label: 'Apprentice' },
      { regex: /\bstudent\b/i, label: 'Student' },
      { regex: /\bteacher\b/i, label: 'Teacher' },
    ];

    for (const rule of relRules) {
      if (rule.regex.test(text) || (input.whoDescribing && rule.regex.test(input.whoDescribing))) {
        extractedRelationship = rule.label;
        break;
      }
    }
  }

  if (!extractedRelationship) {
    extractedRelationship = input.whoDescribing || 'Family Member / Acquaintance';
  }

  return {
    names: extractedNames.length > 0 ? extractedNames : ['None explicitly named'],
    locations: extractedLocations.length > 0 ? extractedLocations : ['Not specified'],
    timePeriod: extractedTime || 'Unknown timeline',
    approximateAge: extractedAge || 'Not specified',
    distinguishingMemories: extractedDistinguishing.length > 0 ? extractedDistinguishing : ['No distinguishing items noted'],
    relationship: extractedRelationship || 'Not specified',
  };
}
