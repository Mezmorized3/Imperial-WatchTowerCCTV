
/**
 * Simple sentiment analysis utilities
 */

/**
 * Analyze the sentiment of a text
 * @param text The text to analyze
 * @returns Object containing sentiment score and classification
 */
export const analyzeSentiment = (text: string): {
  score: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
} => {
  // This is a very simplified implementation
  // In a real-world scenario, you would use a proper NLP library
  
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'like', 'happy', 'best'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'worst', 'poor', 'horrible'];
  
  const words = text.toLowerCase().split(/\W+/);
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  
  const score = (positiveCount - negativeCount) / words.length;
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  
  if (score > 0.05) sentiment = 'positive';
  else if (score < -0.05) sentiment = 'negative';
  
  const confidence = Math.min(1, Math.abs(score) * 5);
  
  return {
    score,
    sentiment,
    confidence
  };
};

/**
 * Extract entities from text
 * @param text The text to analyze
 * @returns Array of extracted entities
 */
export const extractEntities = (text: string): {
  entity: string;
  type: 'person' | 'organization' | 'location' | 'date' | 'other';
  confidence: number;
}[] => {
  // Simplified implementation
  const entities = [];
  
  // Extract potential name patterns (capitalized words)
  const nameRegex = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
  const names = text.match(nameRegex) || [];
  
  names.forEach(name => {
    entities.push({
      entity: name,
      type: 'person',
      confidence: 0.7
    });
  });
  
  // Extract potential dates
  const dateRegex = /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b\d{1,2}\-\d{1,2}\-\d{2,4}\b/g;
  const dates = text.match(dateRegex) || [];
  
  dates.forEach(date => {
    entities.push({
      entity: date,
      type: 'date',
      confidence: 0.9
    });
  });
  
  return entities;
};
