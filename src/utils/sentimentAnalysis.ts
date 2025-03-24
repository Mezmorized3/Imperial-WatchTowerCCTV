
/**
 * Simple sentiment analysis utility
 */

interface SentimentResult {
  score: number;  // Range from -1 (negative) to 1 (positive)
  comparative: number;
  positive: string[];
  negative: string[];
  tokens: string[];
}

// Simple positive and negative word lists
const positiveWords = [
  'good', 'great', 'excellent', 'amazing', 'awesome', 'fantastic', 'wonderful',
  'happy', 'pleased', 'satisfied', 'love', 'like', 'best', 'positive', 'recommended',
];

const negativeWords = [
  'bad', 'terrible', 'awful', 'horrible', 'poor', 'disappointing', 'worst',
  'hate', 'dislike', 'negative', 'avoid', 'failure', 'failed', 'broken', 'problem',
];

export function analyzeSentiment(text: string): SentimentResult {
  if (!text) {
    return {
      score: 0,
      comparative: 0,
      positive: [],
      negative: [],
      tokens: []
    };
  }

  // Convert to lowercase and tokenize
  const tokens = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1);

  // Identify positive and negative words
  const positive = tokens.filter(word => positiveWords.includes(word));
  const negative = tokens.filter(word => negativeWords.includes(word));

  // Calculate score
  const score = (positive.length - negative.length) / Math.max(1, tokens.length);
  
  // Calculate comparative score (normalized between -1 and 1)
  const comparative = tokens.length > 0 ? score : 0;

  return {
    score: Math.max(-1, Math.min(1, score * 5)),  // Scale and clamp between -1 and 1
    comparative,
    positive,
    negative,
    tokens
  };
}

export default {
  analyzeSentiment
};
