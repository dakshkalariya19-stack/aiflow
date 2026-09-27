import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type Provider = { name: string; model: string; run: (messages: { role: 'user' | 'assistant'; content: string }[]) => ReturnType<typeof generateText> };

function configuredProviders(): Provider[] {
  const result: Provider[] = [];
  if (process.env.OPENAI_API_KEY) { const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY }); result.push({ name: 'OpenAI', model: 'gpt-4o-mini', run: (messages) => generateText({ model: openai('gpt-4o-mini'), messages }) }); }
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) { const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY }); result.push({ name: 'Google', model: 'gemini-1.5-flash', run: (messages) => generateText({ model: google('gemini-1.5-flash'), messages }) }); }
  if (process.env.ANTHROPIC_API_KEY) { const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY }); result.push({ name: 'Anthropic', model: 'claude-3-5-haiku-latest', run: (messages) => generateText({ model: anthropic('claude-3-5-haiku-latest'), messages }) }); }
  return result;
}

export async function POST(request: Request) {
  const body = await request.json();
  const messages = Array.isArray(body.messages) ? body.messages.filter((message: any) => ['user', 'assistant'].includes(message.role) && typeof message.content === 'string').slice(-20) : [];
  if (!messages.length) return NextResponse.json({ error: 'Please enter a message.' }, { status: 400 });
  const providers = configuredProviders();
  if (!providers.length) return NextResponse.json({ error: 'No compatible AI provider is currently available. Configure an authorized provider API key.' }, { status: 503 });
  const failures: string[] = [];
  for (const provider of providers.slice(0, Number(process.env.AI_FLOW_MAX_PROVIDER_ATTEMPTS || 3))) {
    try { const response = await provider.run(messages); return NextResponse.json({ text: response.text, provider: provider.name, model: provider.model }); }
    catch (error) { failures.push(`${provider.name}: ${error instanceof Error ? error.message : 'temporary failure'}`); }
  }
  return NextResponse.json({ error: 'All configured compatible providers are temporarily unavailable.', failures }, { status: 503 });
}
