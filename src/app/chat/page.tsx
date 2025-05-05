// src/app/(chat)/page.tsx
'use client';
import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat/api',
    initialMessages: [
      {
        id: '1',
        role: 'user',
        content: 'My child is 2 years old. How do I handle tantrums?',
      },
    ]
  });

  return (
    <div className="mx-auto max-w-2xl py-12">
      {messages.map(m => (
        <div key={m.id} className={`p-4 ${m.role === 'user' ? 'bg-blue-50' : 'bg-white'}`}>
          {m.role === 'user' ? '👤' : '🤖'} {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 bg-white p-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about bedtime routines..."
          className="w-full p-3 border rounded-lg shadow-sm"
        />
      </form>
    </div>
  );
}