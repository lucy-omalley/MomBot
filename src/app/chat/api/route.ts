import { OpenAI } from 'openai';
import { OpenAIStream } from '@ai-sdk/openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY!,
});

export async function POST(req: Request) {
  // ... rest of your code
}