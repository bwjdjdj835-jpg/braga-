# Braga

Braga chatbot, built with Next.js.

Live site: https://braga-blond.vercel.app

## Vercel

Set these environment variables on Vercel:

- `LLM_API_KEY` — Groq API key
- `LLM_BASE_URL`=`https://api.groq.com/openai/v1`
- `LLM_MODEL`=`qwen/qwen3.8-27b`

Do not commit `.env`, `.env.local`, or API keys. Copy `.env.example` to `.env.local` for local development.
