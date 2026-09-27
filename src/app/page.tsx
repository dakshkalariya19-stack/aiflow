'use client';

import { FormEvent, useState } from 'react';

const providers = [
  { name: 'OpenAI', model: 'GPT-4o', status: 'Available', color: 'bg-emerald-400' },
  { name: 'Google', model: 'Gemini 1.5 Pro', status: 'Available', color: 'bg-emerald-400' },
  { name: 'Anthropic', model: 'Claude 3.5 Sonnet', status: 'Configured', color: 'bg-amber-400' },
];

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    if (!prompt.trim() || loading) return;
    const text = prompt.trim();
    setPrompt('');
    setMessages((current) => [...current, { role: 'You', text }]);
    setLoading(true);
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [...messages, { role: 'user', content: text }] }) });
      const data = await response.json();
      setMessages((current) => [...current, { role: data.provider ? `${data.provider} · ${data.model}` : 'AIFlow', text: data.text || data.error }]);
    } catch { setMessages((current) => [...current, { role: 'AIFlow', text: 'No compatible AI provider is currently available.' }]); }
    finally { setLoading(false); }
  }

  return <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,#20205a,transparent_38%),#080b14]">
    <div className="mx-auto flex min-h-screen max-w-7xl gap-6 p-4 md:p-8">
      <aside className="hidden w-64 shrink-0 rounded-3xl border border-white/10 bg-white/[.05] p-5 backdrop-blur md:block">
        <div className="mb-10 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-500 font-bold">✦</div><span className="text-xl font-semibold">AIFlow</span></div>
        <nav className="space-y-2 text-sm text-slate-400">{['Home','Chat','Models','Activity','Settings'].map((item, i) => <div className={`rounded-xl px-4 py-3 ${i === 1 ? 'bg-indigo-500/20 text-white' : ''}`} key={item}>{item}</div>)}</nav>
        <div className="mt-12 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm"><div className="mb-2 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" />Router healthy</div><p className="text-xs text-slate-400">Authorized providers are monitored continuously.</p></div>
      </aside>
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="mb-6 flex items-center justify-between"><div><p className="text-sm text-slate-400">Unified intelligence</p><h1 className="text-3xl font-semibold">Good evening, welcome back</h1></div><button className="rounded-xl border border-white/10 bg-white/[.06] px-4 py-2 text-sm">Auto ▾</button></header>
        <div className="grid gap-4 sm:grid-cols-3">{providers.map((provider) => <div className="rounded-2xl border border-white/10 bg-white/[.05] p-4" key={provider.name}><div className="flex items-center justify-between"><span className="font-medium">{provider.name}</span><span className={`h-2 w-2 rounded-full ${provider.color}`} /></div><p className="mt-3 text-sm text-slate-400">{provider.model}</p><p className="mt-1 text-xs text-slate-500">{provider.status}</p></div>)}</div>
        <div className="mt-6 flex flex-1 flex-col rounded-3xl border border-white/10 bg-black/10 p-4 md:p-6"><div className="flex-1 space-y-5 overflow-y-auto">{messages.length === 0 && <div className="flex h-full min-h-64 flex-col items-center justify-center text-center"><div className="mb-4 text-5xl">✦</div><h2 className="text-2xl font-semibold">What can AIFlow help with?</h2><p className="mt-2 max-w-md text-slate-400">Ask anything. AIFlow chooses a compatible authorized provider and can fail over safely when needed.</p></div>}{messages.map((message, i) => <div key={i} className={message.role === 'You' ? 'ml-auto max-w-2xl rounded-2xl bg-indigo-500/20 p-4' : 'max-w-3xl rounded-2xl border border-white/10 bg-white/[.04] p-4'}><p className="mb-2 text-xs font-medium text-indigo-300">{message.role}</p><p className="whitespace-pre-wrap text-slate-200">{message.text}</p></div>)}{loading && <div className="text-sm text-slate-400">AIFlow is checking available providers…</div>}</div><form onSubmit={sendMessage} className="mt-6 flex gap-3 rounded-2xl border border-white/10 bg-white/[.05] p-2"><input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask AI anything..." className="min-w-0 flex-1 bg-transparent px-3 py-3 outline-none placeholder:text-slate-500"/><button className="rounded-xl bg-indigo-500 px-5 py-3 font-medium transition hover:bg-indigo-400 disabled:opacity-50" disabled={loading}>Send</button></form></div>
      </section>
    </div>
  </main>;
}
