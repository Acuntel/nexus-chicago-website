import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit } from "@/lib/rate-limit";
import { ChatLocale, LANGUAGE_INSTRUCTION } from "@/lib/chat-translations";
import { verifySessionToken } from "@/lib/session-token";
import { checkAndCountDaily } from "@/lib/usage-limit";

// Origin/Referer is a cheap first filter, but it is client-spoofable, so it is
// NOT the real gate. The real gate is the signed session token below, which a
// caller can only obtain by solving Turnstile (see /api/chat/session).
const ALLOWED_HOSTS = ["nexuschicago.com", "www.nexuschicago.com", "localhost"];
function isAllowedOrigin(req: NextRequest): boolean {
  const src = req.headers.get("origin") || req.headers.get("referer") || "";
  if (!src) return false;
  try {
    const host = new URL(src).hostname;
    return ALLOWED_HOSTS.includes(host) || host.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

const SYSTEM_PROMPT = `You are the AI assistant for Nexus Chicago Realty Group LLC, a Chicago-area real estate brokerage. You are embedded on their website to help visitors with buying and selling questions and to guide them toward talking with a Nexus agent.

BROKERAGE IDENTITY:
- Name: Nexus Chicago Realty Group LLC
- Office: 325 Park Ave, River Forest, IL 60305
- Phone: 773.259.9676
- Email: info@nexuschicago.com
- Tagline: "From click to close, Nexus is the crossroads of Chicago real estate."
- Philosophy: Real estate is about location, location, location. Nexus Chicago is about consumer service, consumer service, consumer service.
- Mission: provide clients an excellent experience and outstanding service; build memorable relationships and strengthen commitment to community.
- Management staff has over 50 years of combined real estate experience.
- Every Nexus agent is a full-time, experienced professional who lives, works, and is part of the communities they represent.

THE TEAM:
- John S. Osga, Managing Broker. 773.259.9676, josga@nexuschicago.com. Member of the Chicago, Illinois and National Association of Realtors. Rehab and new-construction developer; owns rental units in Ukrainian Village, Wicker Park, Bucktown, East Village, Lakeview and Wrigleyville.
- Vincent A. Incopero, Broker. 630.542.6669, vincent@nexuschicago.com. Specialties: REO & short sales, first-time buyers, new construction.

SERVICE AREA:
Chicago and the North Shore, including Bucktown, Gold Coast, Hyde Park, Lincoln Park, The Loop, Wicker Park, Wrigleyville, Lakeview, Ukrainian Village, East Village, River Forest, and greater Chicagoland.

SERVICES:
- Buyer representation: first-time buyers, prequalification guidance, negotiations, attorney-review coordination, closings.
- Seller representation: comparative market analysis (CMA), pricing strategy, virtual tours, prominent marketing, staging/prep guidance.
- REO & short sales, foreclosure-related transactions.
- New construction and rehab/development expertise.
- Investment property guidance.

KEY BUYER KNOWLEDGE:
- Prequalifying for a loan determines what a buyer can afford and lets them move fast in competitive situations.
- Rate shopping matters: on a $100,000 mortgage, 8% vs 7.5% is ~$35/month, about $12,600 over 30 years.
- A buyer agent legally represents the buyer's interest and is generally compensated by the seller at closing.
- Some features hurt resale (pools in some areas, single/detached garages in attached-garage neighborhoods); a Nexus agent advises what helps and hurts.
- In Illinois there is typically a 5-business-day attorney review period after contract signing; a standard residential closing runs about 30-45 days.

KEY SELLER KNOWLEDGE:
- First impressions sell: manicured lawn, clean porch, fresh front door.
- Clean and declutter every room; buyers want to see storage space (attic, basement, closets).
- Fix small issues (dripping faucets, burned-out bulbs, sticking doors); they stick in a buyer's mind.
- Nexus provides a virtual tour, comprehensive CMA, and prominent marketing so the home is visible and priced right.

INFORMATION COLLECTION BEHAVIOR:
Your job is not just to answer questions; naturally gather information to qualify the lead over the conversation:
1. Are they buying, selling, or both? What property type?
2. Timeline (just browsing, next 3 months, ASAP?)
3. Neighborhood or general area of interest, and price range they're considering
4. If buying: are they prequalified for a mortgage yet?
5. If selling: property address/neighborhood and when they hope to list
6. How they heard about Nexus Chicago
Weave these in as natural follow-ups; never fire off all questions at once.

NEXT-STEP BEHAVIOR:
When the user is ready, make the next step easy: "Would you like a Nexus agent to reach out? Call us at 773.259.9676 or leave your details on the contact page and we'll follow up the same day." For REO/short-sale questions, mention Vincent A. Incopero specializes in these. For development or new-construction questions, mention John S. Osga's background.

CRITICAL RULES:
- FAIR HOUSING: Never characterize neighborhoods by demographics, ethnicity, religion, family status, or "safety"/"good schools" judgments, and never steer buyers toward or away from areas on those grounds. Stick to objective facts (housing stock, transit, parks, architecture) and suggest buyers visit areas and consult objective public data sources themselves.
- NEVER give legal, tax, or financial advice. For legal questions (contracts, attorney review, title), recommend they speak with a real estate attorney. For mortgage specifics, recommend a licensed lender.
- NEVER quote commissions, fees, or estimate a specific home's value. Say a Nexus agent can prepare a free comparative market analysis.
- NEVER promise outcomes ("your home will sell in X days", "you'll definitely get the house").
- Keep responses concise (2-4 sentences typically). Warm, professional, approachable.
- NEVER use em dashes in your replies; use commas, colons, or periods instead (house style).
- If asked about something outside real estate, politely redirect to what Nexus can help with.
- You are an AI assistant, not a licensed agent. Be transparent about being an AI if asked.
- If someone has an urgent transaction issue, urge them to call 773.259.9676 immediately.`;

export async function POST(req: NextRequest) {
  try {
    // Master switch. Fail-safe: off = 503 until CHAT_ENABLED=true is set.
    if (process.env.CHAT_ENABLED !== "true") {
      return NextResponse.json(
        { error: "Chat is temporarily unavailable. Please call 773.259.9676." },
        { status: 503 },
      );
    }
    // Cheap first filter (spoofable, so not the real gate - the session token is).
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkRateLimit(ip, 8)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 },
      );
    }

    const { messages, leadInfo, locale, sessionToken } = await req.json();
    const chatLocale: ChatLocale =
      locale === "es" || locale === "pl" ? locale : "en";

    // When Turnstile is configured, require the signed session token (the full
    // non-spoofable gate). When it is not, run in graceful mode: Origin + Haiku
    // + payload/token caps + the account's prepaid balance are the bound. The
    // gate auto-upgrades the moment Turnstile keys are added - no code change.
    const session = verifySessionToken(sessionToken);
    if (process.env.TURNSTILE_SECRET_KEY && !session) {
      return NextResponse.json(
        { error: "Session expired. Please refresh the chat." },
        { status: 401 },
      );
    }

    // Shared daily ceilings (per session/IP + global auto-shutoff). No-op unless
    // Upstash is configured; keyed by session when present, else by IP.
    const limit = await checkAndCountDaily(session?.id || ip, ip);
    if (!limit.ok) {
      const msg =
        limit.reason === "global"
          ? "Our assistant has hit today's usage limit. Please call 773.259.9676."
          : "You've reached today's message limit. Please call 773.259.9676 to continue.";
      return NextResponse.json({ error: msg }, { status: 429 });
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages are required." },
        { status: 400 },
      );
    }

    // Cap conversation size so a single request cannot balloon the token cost.
    if (messages.length > 40) {
      return NextResponse.json(
        { error: "Conversation too long." },
        { status: 400 },
      );
    }
    const totalChars = messages.reduce(
      (n: number, m: { content?: unknown }) =>
        n + (typeof m.content === "string" ? m.content.length : 0),
      0,
    );
    if (totalChars > 30000) {
      return NextResponse.json(
        { error: "Message payload too large." },
        { status: 400 },
      );
    }
    for (const msg of messages) {
      if (typeof msg.content === "string" && msg.content.length > 5000) {
        return NextResponse.json(
          {
            error: "Message content exceeds maximum length of 5000 characters.",
          },
          { status: 400 },
        );
      }
    }

    const primaryKey = process.env.ANTHROPIC_API_KEY;
    const backupKey = process.env.ANTHROPIC_API_KEY_BACKUP;
    if (!primaryKey) {
      return NextResponse.json(
        { error: "Chat service is not configured." },
        { status: 500 },
      );
    }

    // The big static SYSTEM_PROMPT is sent as a cached block (see streamParams);
    // only this small, per-request part (language + lead info) varies, so the
    // static instructions are billed at the 90%-off cache rate on repeat turns.
    let volatilePrompt = `LANGUAGE:\n${LANGUAGE_INSTRUCTION[chatLocale]}`;
    if (leadInfo) {
      volatilePrompt += `\n\nCURRENT USER INFO:\n- Name: ${leadInfo.name}\n- Email: ${leadInfo.email}`;
      if (leadInfo.phone) volatilePrompt += `\n- Phone: ${leadInfo.phone}`;
      if (leadInfo.service)
        volatilePrompt += `\n- Interested in: ${leadInfo.service}`;
      volatilePrompt += `\nAddress the user by their first name. Tailor your responses to their stated interest.`;
    }

    const anthropicMessages = messages
      .slice(-20)
      .map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

    const streamParams = {
      // Haiku 4.5 is plenty for a website FAQ/lead bot. Override via
      // ANTHROPIC_MODEL if needed.
      model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 500,
      // Cache the static instructions; append the small volatile block uncached.
      system: [
        {
          type: "text" as const,
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" as const },
        },
        { type: "text" as const, text: volatilePrompt },
      ],
      messages: anthropicMessages,
    };

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        let emittedAny = false;

        const runWithKey = async (
          apiKey: string,
          label: "primary" | "backup",
        ): Promise<boolean> => {
          try {
            const client = new Anthropic({ apiKey });
            const stream = await client.messages.stream(streamParams);
            for await (const event of stream) {
              if (
                event.type === "content_block_delta" &&
                event.delta.type === "text_delta"
              ) {
                controller.enqueue(encoder.encode(event.delta.text));
                emittedAny = true;
              }
            }
            return true;
          } catch (error) {
            console.error(`Stream error (${label} key):`, error);
            return false;
          }
        };

        try {
          const ok = await runWithKey(primaryKey, "primary");
          if (!ok && !emittedAny && backupKey) {
            await runWithKey(backupKey, "backup");
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
