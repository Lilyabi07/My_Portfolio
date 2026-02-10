// Bad words filter utility
// Detects inappropriate language in user submissions

const BAD_WORDS = [
  // Add your list of prohibited words here (case-insensitive)
  'hate',
  'abuse',
  'racist',
  'sexist',
  'vulgar',
  'offensive',
  'slur',
  'profanity',
  'fuck',
   'f*uck',
    'shit',
    'shitty',
    'negro',
    'bitch',
    'b*tch',
    'b*tchy',
    'bitchy',
  'asshole',

  // Add more as needed
];

// Alternative: Use a more comprehensive list approach
const BAD_WORDS_REGEX = new RegExp(
  `\\b(${BAD_WORDS.join('|')})\\b`,
  'gi'
);

export const containsBadWords = (text: string): boolean => {
  if (!text) return false;
  return BAD_WORDS_REGEX.test(text);
};

export const getBadWordsFound = (text: string): string[] => {
  if (!text) return [];
  const matches = text.match(BAD_WORDS_REGEX);
  return matches ? [...new Set(matches.map(m => m.toLowerCase()))] : [];
};

export const hasProfanity = (text: string): { hasProfanity: boolean; words: string[] } => {
  const words = getBadWordsFound(text);
  return {
    hasProfanity: words.length > 0,
    words: words
  };
};
