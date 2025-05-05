// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold text-blue-900 mb-6">
          AI Babysitter
        </h1>
        <Link href="/chat" className="px-8 py-3 bg-blue-600 text-white rounded-lg">
          Ask NannyAI
        </Link>
      </section>
    </main>
  );
}