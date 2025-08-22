import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import { env } from '@/config/env.config';

export const googleGenAIClient = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

const openAIClient = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const llmClient = {
  openAI: openAIClient,
  googleGenAI: googleGenAIClient,
};
