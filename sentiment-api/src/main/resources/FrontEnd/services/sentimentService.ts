export interface SentimentLog {
  id: number;
  text: string;
  prevision: string;
  probabilidad: number;
  fecha: string;
}

export const getSentimentHistory = async (): Promise<SentimentLog[]> => {
  const response = await fetch(`${API_BASE_URL}/history`);
  return handleResponse<SentimentLog[]>(response);
};
import { SentimentResult, SentimentStats } from '../types';

const API_BASE_URL = '/api/sentiment';

// Helper to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} $Failed to edit, 0 occurrences found for old_string (import { SentimentResult, SentimentType } from '../types';

const POSITIVE_WORDS = [
  'good', 'bueno', 'great', 'genial', 'excelent', 'excelente' ,'happy', 'feliz', 'love', 'amo' , 'awesome', 'impresionante', 'fantastic', 'fantastico' ,
   'nice', 'agradable', 'amazing', 'increible', 'positive', 'positivo', 'like', 'gustar', 'wonderful', 'extraordinario', 'best', 'mejor'
];

const NEGATIVE_WORDS = [
  'bad', 'malo', 'terrible', 'lamentable', 'awful', 'espantoso', 'hate', 'odio', 'sad', 'triste', 'angry', 'enojado', 'horrible', 'worst', 'peor', 
  'negative', 'negativo', 'dislike', 'disguto', 'bug', 'error', 'problem', 'problema'
];

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function findSentenceWith(words: string[], text: string) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  for (const s of sentences) {
    const t = s.toLowerCase();
    if (words.some(w => t.includes(w))) return s.trim();
  }
  return null;
}

export const analyzeSentiment = async (text: string): Promise<SentimentResult> => {
  const input = (text || '').trim();

  // Very small heuristic-based analyzer for local/dev usage
  const tokens = input.toLowerCase().split(/\W+/).filter(Boolean);
  let positive = 0;
  let negative = 0;
  for (const t of tokens) {
    if (POSITIVE_WORDS.includes(t)) positive += 1;
    if (NEGATIVE_WORDS.includes(t)) negative += 1;
  }

  const neutral = Math.max(0, tokens.length - positive - negative) || 1;
  const total = positive + neutral + negative;

  // Score centered at 50; shift up/down by relative difference
  const raw = 50 + ((positive - negative) / total) * 50;
  const score = clamp(Math.round(raw), 0, 100);

  let sentiment = SentimentType.NEUTRAL;
  if (positive > negative && positive >= 1) sentiment = SentimentType.POSITIVE;
  if (negative > positive && negative >= 1) sentiment = SentimentType.NEGATIVE;

  const bestSnippet = findSentenceWith(POSITIVE_WORDS, input) || input.slice(0, 120) || 'No content';
  const worstSnippet = findSentenceWith(NEGATIVE_WORDS, input) || input.slice(0, 120) || 'No content';
  const neutralSentence = (() => {
    const s = input.split(/(?<=[.!?])\s+/).find(sn => {
      const t = sn.toLowerCase();
      return !POSITIVE_WORDS.some(w => t.includes(w)) && !NEGATIVE_WORDS.some(w => t.includes(w));
    });
    return s?.trim() || (input.slice(0, 120) || 'No neutral excerpt');
  })();

  return {
    sentiment,
    score,
    bestSnippet,
    worstSnippet,
    randomNeutral: neutralSentence,
    breakdown: {
      positive,
      neutral,
      negative,
    }
  };
};
). Original old_string was (import { SentimentResult, SentimentType } from '../types';

const POSITIVE_WORDS = [
  'good', 'bueno', 'great', 'genial', 'excelent', 'excelente' ,'happy', 'feliz', 'love', 'amo' , 'awesome', 'impresionante', 'fantastic', 'fantastico' ,
   'nice', 'agradable', 'amazing', 'increible', 'positive', 'positivo', 'like', 'gustar', 'wonderful', 'extraordinario', 'best', 'mejor'
];

const NEGATIVE_WORDS = [
  'bad', 'malo', 'terrible', 'lamentable', 'awful', 'espantoso', 'hate', 'odio', 'sad', 'triste', 'angry', 'enojado', 'horrible', 'worst', 'peor', 
  'negative', 'negativo', 'dislike', 'disguto', 'bug', 'error', 'problem', 'problema'
];

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function findSentenceWith(words: string[], text: string) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  for (const s of sentences) {
    const t = s.toLowerCase();
    if (words.some(w => t.includes(w))) return s.trim();
  }
  return null;
}

export const analyzeSentiment = async (text: string): Promise<SentimentResult> => {
  const input = (text || '').trim();

  // Very small heuristic-based analyzer for local/dev usage
  const tokens = input.toLowerCase().split(/\W+/).filter(Boolean);
  let positive = 0;
  let negative = 0;
  for (const t of tokens) {
    if (POSITIVE_WORDS.includes(t)) positive += 1;
    if (NEGATIVE_WORDS.includes(t)) negative += 1;
  }

  const neutral = Math.max(0, tokens.length - positive - negative) || 1;
  const total = positive + neutral + negative;

  // Score centered at 50; shift up/down by relative difference
  const raw = 50 + ((positive - negative) / total) * 50;
  const score = clamp(Math.round(raw), 0, 100);

  let sentiment = SentimentType.NEUTRAL;
  if (positive > negative && positive >= 1) sentiment = SentimentType.POSITIVE;
  if (negative > positive && negative >= 1) sentiment = SentimentType.NEGATIVE;

  const bestSnippet = findSentenceWith(POSITIVE_WORDS, input) || input.slice(0, 120) || 'No content';
  const worstSnippet = findSentenceWith(NEGATIVE_WORDS, input) || input.slice(0, 120) || 'No content';
  const neutralSentence = (() => {
    const s = input.split(/(?<=[.!?])\s+/).find(sn => {
      const t = sn.toLowerCase();
      return !POSITIVE_WORDS.some(w => t.includes(w)) && !NEGATIVE_WORDS.some(w => t.includes(w));
    });
    return s?.trim() || (input.slice(0, 120) || 'No neutral excerpt');
  })();

  return {
    sentiment,
    score,
    bestSnippet,
    worstSnippet,
    randomNeutral: neutralSentence,
    breakdown: {
      positive,
      neutral,
      negative,
    }
  };
};
) in /home/mati/Documents/Hackaton Demo BackEnd/sentiment-api (2)/sentiment-api/src/main/resources/FrontEnd/services/sentimentService.ts. No edits made. The exact text in old_string was not found. Ensure you're not escaping content incorrectly and check whitespace, indentation, and context. Use read_file tool to verify.`);
  }
  return response.json();
}

/**
 * Analyzes the sentiment of a single text string.
 * @param text The text to analyze.
 * @returns A promise that resolves to the sentiment result.
 */
export const analyzeSentiment = async (text: string): Promise<SentimentResult> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  return handleResponse<SentimentResult>(response);
};

/**
 * Fetches the latest sentiment analysis statistics.
 * @returns A promise that resolves to the sentiment statistics.
 */
export const getSentimentStats = async (): Promise<SentimentStats> => {
  const response = await fetch(`${API_BASE_URL}/stats`);
  return handleResponse<SentimentStats>(response);
};

/**
 * Analyzes a batch of texts from a file (CSV or XLSX).
 * @param file The file to upload and analyze.
 * @returns A promise that resolves to an array of sentiment results.
 */
export const analyzeBatch = async (file: File): Promise<SentimentResult[]> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/batch`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse<SentimentResult[]>(response);
};

