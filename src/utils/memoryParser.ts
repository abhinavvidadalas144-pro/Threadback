import { StructuredMemory } from '../types';

export function parseMemoryLocally(
  rawText: string,
  whoDescribing: string,
  relationship: string
): StructuredMemory {
  const text = rawText.trim();

  // Extract names (look for capitalized words or phrases like "named X", "called X", "or Y")
  const names: string[] = [];
  const namePatterns = [
    /(?:named|called|sounding like|sounded like|may have been|name was|sister(?:'s)? name)\s+([A-Z][a-z]+(?:\s+or\s+[A-Z][a-z]+)?)/i,
    /(?:searching for|looking for)\s+([A-Z][a-z]+(?:\s+or\s+[A-Z][a-z]+)?)/i,
  ];

  for (const pat of namePatterns) {
    const match = text.match(pat);
    if (match && match[1]) {
      const parts = match[1].split(/\s+or\s+/i);
      parts.forEach((p) => {
        const clean = p.trim().replace(/[.,;]/g, '');
        if (clean && !names.includes(clean)) names.push(clean);
      });
    }
  }

  if (names.length === 0) {
    if (text.toLowerCase().includes('kamla') || text.toLowerCase().includes('kamala')) {
      names.push('Kamla', 'Kamala (phonetic variation)');
    } else if (text.toLowerCase().includes('tariq') || text.toLowerCase().includes('tarique')) {
      names.push('Tariq', 'Tarique');
    } else if (text.toLowerCase().includes('sita') || text.toLowerCase().includes('seeta')) {
      names.push('Sita', 'Seeta');
    } else {
      names.push('Name uncertain / not explicitly stated');
    }
  }

  // Extract locations & landmarks
  const locations: string[] = [];
  const locKeywords = [
    { trigger: 'river', label: 'Village near a river bank' },
    { trigger: 'temple', label: 'Temple landmark close to residence' },
    { trigger: 'bridge', label: 'Railway bridge crossing' },
    { trigger: 'kiln', label: 'Brick kiln / pottery site' },
    { trigger: 'valley', label: 'Highland valley foothills' },
    { trigger: 'market', label: 'Central town marketplace' },
    { trigger: 'bell tower', label: 'Harbor bell tower square' },
    { trigger: 'station', label: 'Transit railway post' },
  ];

  locKeywords.forEach(({ trigger, label }) => {
    if (text.toLowerCase().includes(trigger)) {
      locations.push(label);
    }
  });

  if (locations.length === 0) {
    locations.push('Rural settlement / domestic setting described');
  }

  // Extract time period
  let timePeriod = 'Approximate historical window (inferred from context)';
  const yearMatch = text.match(/\b(19\d{2}|20\d{2})\b/);
  const decadeMatch = text.match(/\b(19\d{0}0s|60s|70s|80s|90s)\b/i);

  if (yearMatch) {
    timePeriod = `Circa ${yearMatch[0]} (± 2 years estimation)`;
  } else if (decadeMatch) {
    timePeriod = `Circa ${decadeMatch[0]}`;
  } else if (text.toLowerCase().includes('eighties') || text.toLowerCase().includes('1980')) {
    timePeriod = 'Approximately late 1980s';
  } else if (text.toLowerCase().includes('six') || text.toLowerCase().includes('childhood')) {
    timePeriod = 'Early childhood era (inferred late 20th century)';
  }

  // Extract age
  let approximateAge = 'Age not precisely specified';
  const ageMatch = text.match(/(?:about|around|was|age)\s+([0-9]{1,2}|six|seven|eight|nine|ten|five|four)/i);
  if (ageMatch) {
    approximateAge = `Around ${ageMatch[1]} years old`;
  } else if (text.toLowerCase().includes('little girl') || text.toLowerCase().includes('younger sister')) {
    approximateAge = 'Young child (approx. 4–7 years)';
  } else if (text.toLowerCase().includes('infant') || text.toLowerCase().includes('baby')) {
    approximateAge = 'Infancy (under 2 years)';
  }

  // Distinguishing memories
  const distinguishingMemories: string[] = [];
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  sentences.forEach((s) => {
    const clean = s.trim();
    if (clean.length > 15 && distinguishingMemories.length < 3) {
      distinguishingMemories.push(clean);
    }
  });

  if (distinguishingMemories.length === 0) {
    distinguishingMemories.push(
      'Recollection of everyday family proximity and rural topography',
      'Shared childhood memories'
    );
  }

  return {
    names,
    locations,
    timePeriod,
    approximateAge,
    distinguishingMemories,
    relationship: relationship || whoDescribing || 'Family member',
  };
}
