import { SentimentResult, SentimentStats, SentimentLog } from '../types';

const API_BASE_URL = '/api/sentiment';

// Helper to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status}`);
  }
  return response.json();
}

export const getSentimentHistory = async (): Promise<SentimentLog[]> => {
  const response = await fetch(`${API_BASE_URL}/history`);
  return handleResponse<SentimentLog[]>(response);
};

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
 * Analyzes the sentiment of a single text string from a URL.
 * @param url The url to analyze.
 * @returns A promise that resolves to the sentiment result.
 */
export const analyzeSentimentFromUrl = async (url: string): Promise<SentimentResult> => {
    const response = await fetch(`${API_BASE_URL}/url`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
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