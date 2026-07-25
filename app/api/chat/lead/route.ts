import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifySessionToken } from "@/lib/session-token";

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

export async function POST(req: NextRequest) {
  try {
    // This endpoint sends email (Resend). Gate it like the chat endpoint so it
    // cannot be hammered to spam the brokerage's inbox / sending reputation.
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkRateLimit(ip, 5)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 },
      );
    }

    const { name, email, phone, service, transcript, sessionToken } =
      await req.json();

    // When Turnstile is configured, require the verified session token; else the
    // Origin gate above is the bound (graceful mode, same as /api/chat).
    if (process.env.TURNSTILE_SECRET_KEY && !verifySessionToken(sessionToken)) {
      return NextResponse.json(
        { error: "Session expired. Please refresh." },
        { status: 401 },
      );
    }

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    const isFollowUp = !!transcript;

    const emailBody = [
      isFollowUp
        ? "🤖 AI Chatbot Lead — Conversation Complete"
        : "🤖 New AI Chatbot Lead",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      service ? `Interested In: ${service}` : null,
      "",
      ...(isFollowUp
        ? [
            "--- Conversation Transcript ---",
            "",
            ...transcript.map(
              (msg: { role: string; content: string }) =>
                `${msg.role === "user" ? name : "AI Assistant"}: ${msg.content}`,
            ),
          ]
        : [
            "(User just started chatting — transcript will follow when conversation ends.)",
          ]),
    ]
      .filter(Boolean)
      .join("\n");

    if (process.env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from:
            process.env.LEAD_FROM_EMAIL ||
            "Nexus Chicago Website <onboarding@resend.dev>",
          to: [process.env.LEAD_TO_EMAIL || "info@nexuschicago.com"],
          reply_to: email,
          subject: isFollowUp
            ? `AI Chat Complete: ${name} — ${service || "General"}`
            : `New AI Chat Lead: ${name} — ${service || "General"}`,
          text: emailBody,
        }),
      });

      if (!res.ok) {
        console.error("Resend error:", await res.json());
        return NextResponse.json(
          { error: "Failed to send lead notification." },
          { status: 500 },
        );
      }

      return NextResponse.json({ success: true });
    }

    // Fallback: log to server logs when Resend is not configured
    console.log("=== AI CHATBOT LEAD ===");
    console.log(emailBody);
    console.log("=======================");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead notification error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
