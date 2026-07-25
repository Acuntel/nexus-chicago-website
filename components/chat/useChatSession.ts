"use client";

import { useEffect, useRef } from "react";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
// When no Turnstile key is configured, run in graceful mode: skip the session
// token and rely on the server's Origin gate + cost caps.
export const TURNSTILE_ENABLED = !!TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      execute: (id: string) => void;
      reset: (id: string) => void;
    };
  }
}

// Anti-abuse: a caller must solve Cloudflare Turnstile once, exchange it for a
// signed session token, and send that token with every message. Bots cannot
// cheaply solve Turnstile, so the server-side per-session/day cap holds.
export function useChatSession(active: boolean) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const resolver = useRef<((token: string | null) => void) | null>(null);
  const sessionTokenRef = useRef<string | null>(null);

  // Load the Turnstile script once, only after the widget is opened.
  useEffect(() => {
    if (!active || !TURNSTILE_SITE_KEY) return;
    if (document.getElementById("cf-turnstile-script")) return;
    const s = document.createElement("script");
    s.id = "cf-turnstile-script";
    s.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }, [active]);

  const runTurnstile = (): Promise<string | null> =>
    new Promise((resolve) => {
      const ts = window.turnstile;
      if (!ts || !TURNSTILE_SITE_KEY || !container.current) {
        resolve(null);
        return;
      }
      resolver.current = resolve;
      const done = (token: string | null) => {
        resolver.current?.(token);
        resolver.current = null;
      };
      if (widgetId.current === null) {
        widgetId.current = ts.render(container.current, {
          sitekey: TURNSTILE_SITE_KEY,
          size: "invisible",
          callback: (token: string) => done(token),
          "error-callback": () => done(null),
          "expired-callback": () => done(null),
        });
      } else {
        ts.reset(widgetId.current);
      }
      ts.execute(widgetId.current);
      // Safety net so a stuck challenge never hangs the send.
      setTimeout(() => {
        if (resolver.current) done(null);
      }, 15000);
    });

  // Returns a valid session token, minting one (Turnstile -> exchange) if needed.
  const getSessionToken = async (): Promise<string | null> => {
    if (sessionTokenRef.current) return sessionTokenRef.current;
    const turnstileToken = await runTurnstile();
    if (!turnstileToken) return null;
    try {
      const res = await fetch("/api/chat/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ turnstileToken }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      sessionTokenRef.current = data.token || null;
      return sessionTokenRef.current;
    } catch {
      return null;
    }
  };

  const clearSessionToken = () => {
    sessionTokenRef.current = null;
  };

  return { container, getSessionToken, clearSessionToken };
}
