# Nexus Chicago Realty Group Website

Modern rebuild (2026-07) of nexuschicago.com for Nexus Chicago Realty Group LLC
(John S. Osga, Managing Broker; Vincent A. Incopero, Broker, same Vince as
REAL Law Group / distressed tracker). Replaces a legacy ASP.NET site hosted on
infoquesthost.com.

## Stack

- Next.js 14.2 (App Router) + TypeScript + Tailwind 3.4 + framer-motion + lucide-react
- Fonts: Playfair Display (display) + Inter (sans) via next/font
- Brand colors (from the old site's CSS, modernized): navy `#0f3557`,
  blue `#1b568e`, steel `#3f7898`, sky `#5ca1dc`, periwinkle `#97abe6`,
  mist `#e5ecef`, defined in tailwind.config.ts under `nexus.*`

## Chatbot: REMOVED (2026-07-26)

The trilingual (EN/ES/PL) AI chatbot was built, deployed, verified, then
REMOVED at Brady's request. To restore it: `git revert` the removal commit
(look for "Remove chatbot"), `npm install`, and re-add `ANTHROPIC_API_KEY` +
`CHAT_ENABLED=true` in Vercel (key source: RealLaw's Vercel prod env, but
strip the literal trailing `\n` from the stored value; add with printf).
The implementation reference remains in RealLaw
(`~/Desktop/Client Websites/RealLaw website/reallawgroup-next`).

## Content

All copy in `lib/content.ts`, extracted from the live legacy site + Wayback
Machine (about, agents, testimonials, buyer/seller tips are the client's real
copy, lightly modernized). Images are Unsplash (Chicago) in `public/images/`.

## Deploy

- Vercel; deploy with `npx vercel --prod --yes` (sandbox DISABLED, it blocks
  network). Env vars live in Vercel project settings (see `ENV_REFERENCE.md` -
  a write-hook blocks `.env*` files, so the template lives there).
- The legacy site's IDX/MLS property search (`/nf-search/*.aspx`, "Dream
  Seekers") was NOT ported, it needs an IDX feed subscription. Listings CTAs
  point to /contact instead until the client picks an IDX provider (e.g.
  IDX Broker / iHomefinder embed).

## Gotchas

- Old site's email links were broken (`href="info@real-e-soft.com"` without
  mailto:), do not copy old markup.
- nexuschicago.com DNS currently points at the legacy host; cutover happens at
  the registrar after client approval.
