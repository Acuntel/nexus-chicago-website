# Nexus Chicago Realty Group — Website

Modern rebuild (2026-07) of nexuschicago.com for Nexus Chicago Realty Group LLC
(John S. Osga, Managing Broker; Vincent A. Incopero, Broker — same Vince as
REAL Law Group / distressed tracker). Replaces a legacy ASP.NET site hosted on
infoquesthost.com.

## Stack

- Next.js 14.2 (App Router) + TypeScript + Tailwind 3.4 + framer-motion + lucide-react
- Fonts: Playfair Display (display) + Inter (sans) via next/font
- Brand colors (from the old site's CSS, modernized): navy `#0f3557`,
  blue `#1b568e`, steel `#3f7898`, sky `#5ca1dc`, periwinkle `#97abe6`,
  mist `#e5ecef` — defined in tailwind.config.ts under `nexus.*`

## Trilingual AI chatbot (EN/ES/PL)

Ported from RealLaw (`~/Desktop/Client Websites/RealLaw website/reallawgroup-next`):

- `components/chat/` — widget (lead form → streaming chat), language toggle in header
- `app/api/chat/route.ts` — Claude Haiku 4.5, streaming, prompt-cached system
  prompt, realtor persona with FAIR HOUSING guardrails
- `app/api/chat/lead/route.ts` — lead + transcript email via Resend
- `app/api/chat/session/route.ts` + `lib/{turnstile,session-token,usage-limit}.ts`
  — optional Turnstile/Upstash anti-abuse (graceful no-op until keys are set)
- Master switch: `CHAT_ENABLED=true` env var; off = 503
- Hero "Ask Us Anything" button opens the widget via the `nexus:open-chat`
  CustomEvent

## Content

All copy in `lib/content.ts`, extracted from the live legacy site + Wayback
Machine (about, agents, testimonials, buyer/seller tips are the client's real
copy, lightly modernized). Images are Unsplash (Chicago) in `public/images/`.

## Deploy

- Vercel; deploy with `npx vercel --prod --yes` (sandbox DISABLED — it blocks
  network). Env vars live in Vercel project settings (see `ENV_REFERENCE.md` —
  a write-hook blocks `.env*` files, so the template lives there).
- The legacy site's IDX/MLS property search (`/nf-search/*.aspx`, "Dream
  Seekers") was NOT ported — it needs an IDX feed subscription. Listings CTAs
  point to /contact instead until the client picks an IDX provider (e.g.
  IDX Broker / iHomefinder embed).

## Gotchas

- Old site's email links were broken (`href="info@real-e-soft.com"` without
  mailto:) — do not copy old markup.
- nexuschicago.com DNS currently points at the legacy host; cutover happens at
  the registrar after client approval.
