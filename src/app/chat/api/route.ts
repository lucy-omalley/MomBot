// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';  // Updated import
import { streamText } from 'ai';          // New import
import { StreamingTextResponse } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-3.5-turbo'),  // Updated model call
    messages,
  });

  return new StreamingTextResponse(result.toAIStream());
}