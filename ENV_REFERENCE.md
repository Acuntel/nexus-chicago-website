# Environment Variables (set in Vercel project settings)

```bash
# Anthropic Claude AI Chatbot (REQUIRED for chat to work)
ANTHROPIC_API_KEY=
# Optional backup key used if the primary errors mid-stream
ANTHROPIC_API_KEY_BACKUP=
# Optional model override (defaults to claude-haiku-4-5-20251001)
# ANTHROPIC_MODEL=

# Master switch for the chat endpoints. Fail-safe: unset/false = chat returns 503.
CHAT_ENABLED=true

# Resend (chat lead notifications + contact form emails). Optional: without it,
# leads/messages are logged to Vercel function logs instead of emailed.
RESEND_API_KEY=
# Where lead emails go / come from (LEAD_FROM_EMAIL needs a Resend-verified domain)
LEAD_TO_EMAIL=info@nexuschicago.com
# LEAD_FROM_EMAIL=Nexus Chicago Website <noreply@nexuschicago.com>

# OPTIONAL hard anti-abuse gate. When all three are set, every chat message
# requires a Cloudflare Turnstile-backed signed session token. Without them the
# chat runs in graceful mode (origin check + rate limits + payload caps).
# NEXT_PUBLIC_TURNSTILE_SITE_KEY=
# TURNSTILE_SECRET_KEY=
# CHAT_SESSION_SECRET=

# OPTIONAL shared daily usage counters (per-session / per-IP / global ceilings).
# Without them, per-instance rate limits + Anthropic spend cap still bound cost.
# KV_REST_API_URL=
# KV_REST_API_TOKEN=
```
