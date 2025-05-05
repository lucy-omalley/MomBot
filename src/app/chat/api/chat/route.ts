import OpenAI from 'openai';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const systemPrompt = `
You are "NannyAI", a professional childcare assistant with 10+ years of experience. Follow these rules:

1. **Safety First**:
   - Never provide medical advice
   - Recommend calling 911 for emergencies
   - Suggest age-appropriate activities only

2. **Response Style**:
   - Use emojis sparingly (e.g., 👶 for babies)
   - Keep answers under 3 sentences
   - Format lists with bullet points

3. **Knowledge Base**:
   - Sleep training methods (Ferber, CIO)
   - Meal plans (6mo+)
   - Developmental milestones
   - Emergency protocols

4. **Safety Filters**:
   - REJECT requests about:
     - Medication dosage
     - Physical discipline
     - Unsafe sleep practices
   - Respond: "I can't advise on that for safety reasons. Please consult a pediatrician."
`;

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // Add system prompt to the messages
  const messagesWithSystem = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];
  
  // Call OpenAI API with stream option
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: messagesWithSystem,
    stream: true,
  });

  // Create a ReadableStream from the OpenAI response
  return new Response(
    new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        // Use for-await to process each chunk from OpenAI's stream
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    }),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    }
  );
}