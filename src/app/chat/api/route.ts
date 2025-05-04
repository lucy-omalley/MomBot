import OpenAI from 'openai';
import { OpenAIStream } from '@ai-sdk/openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo', // or 'gpt-4'
    stream: true,
    messages: [
      {
        role: 'system',
        content: systemPrompt, // Your custom prompt
      },
      ...messages, // User messages
    ],
    temperature: 0.7, // Controls creativity (0=strict, 1=creative)
  });

  const stream = OpenAIStream(response);
  return new Response(stream);
}