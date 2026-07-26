import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

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
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkRateLimit(ip, 5)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { name, email, phone, interest, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 },
      );
    }
    if (String(message).length > 5000) {
      return NextResponse.json({ error: "Message too long." }, { status: 400 });
    }

    const emailBody = [
      "📩 New Website Contact",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      interest ? `Interested In: ${interest}` : null,
      "",
      "--- Message ---",
      String(message),
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
          subject: `Website Contact: ${name} - ${interest || "General"}`,
          text: emailBody,
        }),
      });
      if (!res.ok) {
        console.error("Resend error:", await res.json());
        return NextResponse.json(
          { error: "Failed to send message." },
          { status: 500 },
        );
      }
      return NextResponse.json({ success: true });
    }

    // Fallback: log to server logs when Resend is not configured
    console.log("=== WEBSITE CONTACT ===");
    console.log(emailBody);
    console.log("=======================");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
