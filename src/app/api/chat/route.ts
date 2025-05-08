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

// Generate a random ID when crypto.randomUUID is not available
function generateId() {
  try {
    return crypto.randomUUID();
  } catch (e) {
    return Math.random().toString(36).substring(2, 10) + 
           Math.random().toString(36).substring(2, 10);
  }
}

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Log that we received a request
    console.log('Received API request');
    
    // Extract the messages from the request body
    const { messages } = await req.json();
    
    // Log the messages
    console.log('Request messages:', messages);
    
    // Add system prompt to the messages
    const messagesWithSystem = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];
    
    // Call OpenAI API without streaming for compatibility
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messagesWithSystem,
      temperature: 0.7,
      max_tokens: 500,
    });

    // Get the response content
    const responseContent = completion.choices[0].message.content;
    
    // Log the response
    console.log('OpenAI response:', responseContent);
    
    // Create the response object
    const responseObj = {
      id: generateId(),
      role: "assistant",
      content: responseContent,
      createdAt: new Date(),
    };
    
    // Log the final response object
    console.log('Sending response:', responseObj);
    
    // Return the response
    return Response.json(responseObj);
  } catch (error) {
    // Log any errors
    console.error('API error:', error);
    
    return Response.json(
      { 
        error: 'An error occurred while processing your request',
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
} 