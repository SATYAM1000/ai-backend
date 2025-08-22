import { GoogleGenAI } from '@google/genai';
import { env } from '@/config/env.config';

export const googleGenAI = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});
