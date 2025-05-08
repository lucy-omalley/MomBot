// src/app/(chat)/page.tsx
'use client';
import { useState, useEffect } from 'react';

// Define message type
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'user',
      content: 'My child is 2 years old. How do I handle tantrums?',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Debug log for messages
  useEffect(() => {
    console.log('Current messages:', messages);
  }, [messages]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Create a new user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };
    
    // Add user message to the chat
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input field
    setInput('');
    
    // Set loading state
    setIsLoading(true);
    setError(null);
    
    try {
      // Send request to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage),
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      // Parse the response
      const data = await response.json();
      console.log('API response:', data);
      
      // Add assistant message to the chat
      setMessages(prev => [...prev, {
        id: data.id || Date.now().toString() + '-assistant',
        role: 'assistant',
        content: data.content,
      }]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err : new Error('Failed to send message'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">NannyAI Chat</h1>
      
      {error && (
        <div className="p-4 bg-red-100 text-red-700 mb-4 rounded">
          Error: {error.message || 'Failed to load response'}
        </div>
      )}
      
      <div className="space-y-4 mb-20">
        {messages.map(m => (
          <div key={m.id} className={`p-4 rounded-lg ${m.role === 'user' ? 'bg-blue-50 ml-10' : 'bg-white border mr-10'}`}>
            <div className="font-medium mb-1">
              {m.role === 'user' ? '👤 You' : '🤖 NannyAI'}
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{m.content || '(Empty response)'}</div>
          </div>
        ))}

        {isLoading && (
          <div className="p-4 bg-gray-100 rounded-lg mr-10">
            <span>Loading response...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about bedtime routines..."
            className="flex-1 p-3 border rounded-lg shadow-sm"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading || !input.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}