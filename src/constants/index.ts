export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'text/plain',
  'text/csv',
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.txt'];

export const LLM_TOOLS = {
  DESIGN_INTENT_EXTRACTOR: {
    name: 'Design Intent Extractor',
    description: 'Extract design intent from user queries',
  },
  
};
