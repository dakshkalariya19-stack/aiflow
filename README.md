# AIFlow

AIFlow is a unified AI chat interface with provider-aware routing and authorized failover. It uses official provider SDKs only and does not bypass quotas, authentication, subscriptions, or provider restrictions.

## Run locally

```bash
cp .env.example .env.local
# Add at least one authorized provider key to .env.local
npm install
npm run dev
```

Open http://localhost:3000. Provider credentials are server-side only; never commit `.env.local`.

## Current foundation

- Next.js + TypeScript + Tailwind UI
- Official OpenAI, Google Gemini, and Anthropic adapters
- Automatic fallback across configured providers
- Conversation context forwarding (limited to recent messages)
- Provider/model attribution in the chat
- Safe unavailable-provider messaging

The production roadmap includes encrypted per-user credentials, persistent usage and routing logs, Redis-backed cooldown/circuit-breaker state, streaming, file capability classification, authentication, cost budgets, queueing, and admin controls.
