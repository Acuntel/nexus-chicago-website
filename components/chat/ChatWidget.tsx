"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MessageCircle, Phone, Send, X } from "lucide-react";
import Link from "next/link";
import { SITE } from "@/lib/content";
import {
  CHAT_LOCALES,
  CHAT_STRINGS,
  ChatLocale,
} from "@/lib/chat-translations";
import LeadForm, { LeadInfo } from "./LeadForm";
import { TURNSTILE_ENABLED, useChatSession } from "./useChatSession";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type WidgetState = "closed" | "lead-form" | "chatting";

export default function ChatWidget() {
  const [locale, setLocale] = useState<ChatLocale>("en");
  const t = CHAT_STRINGS[locale];

  const [state, setState] = useState<WidgetState>("closed");
  const [leadInfo, setLeadInfo] = useState<LeadInfo>({
    name: "",
    email: "",
    phone: "",
    service: "",
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatError, setChatError] = useState("");
  const [showBubble, setShowBubble] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { container, getSessionToken, clearSessionToken } = useChatSession(
    state !== "closed",
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (state === "chatting") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [state]);

  // Proactive chat bubble
  useEffect(() => {
    if (sessionStorage.getItem("nx-chat-dismissed")) return;
    const timer = setTimeout(() => setShowBubble(true), 20000);
    return () => clearTimeout(timer);
  }, []);

  // Let hero/CTA buttons open the chat from anywhere on the page.
  useEffect(() => {
    const open = () => {
      setShowBubble(false);
      setState((s) => (s === "closed" ? "lead-form" : s));
    };
    window.addEventListener("nexus:open-chat", open);
    return () => window.removeEventListener("nexus:open-chat", open);
  }, []);

  const sendLeadNotification = async (includeTranscript = false) => {
    try {
      const token = TURNSTILE_ENABLED ? await getSessionToken() : "";
      if (TURNSTILE_ENABLED && !token) return;
      const payload: Record<string, unknown> = { ...leadInfo, locale };
      if (includeTranscript) payload.transcript = messages;
      payload.sessionToken = token;
      await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Silently fail; don't block chat UX for notification
    }
  };

  const handleToggle = () => {
    if (state === "closed") {
      setShowBubble(false);
      setState("lead-form");
    } else {
      if (state === "chatting" && messages.length > 1) {
        sendLeadNotification(true);
      }
      setState("closed");
    }
  };

  const handleLeadSubmit = () => {
    sendLeadNotification(false);
    const firstName = leadInfo.name.split(" ")[0];
    setMessages([
      {
        role: "assistant",
        content: t.greeting(firstName, leadInfo.service || null),
      },
    ]);
    setState("chatting");
  };

  const handleSendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsStreaming(true);
    setChatError("");
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const doFetch = (token: string) =>
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          leadInfo,
          locale,
          sessionToken: token,
        }),
      });

    try {
      let token = (TURNSTILE_ENABLED ? await getSessionToken() : "") || "";
      if (TURNSTILE_ENABLED && !token) throw new Error("No session");
      let response = await doFetch(token);
      // Session expired mid-chat (Turnstile mode only): re-mint and retry once.
      if (TURNSTILE_ENABLED && response.status === 401) {
        clearSessionToken();
        token = (await getSessionToken()) || "";
        if (!token) throw new Error("No session");
        response = await doFetch(token);
      }
      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let fullContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: fullContent,
          };
          return updated;
        });
      }
    } catch {
      setChatError(t.errorMessage);
      setMessages((prev) =>
        prev[prev.length - 1]?.content === "" ? prev.slice(0, -1) : prev,
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const isOpen = state !== "closed";

  return (
    <div className="fixed bottom-6 right-4 z-50 sm:right-6">
      {/* Invisible Cloudflare Turnstile mount (renders nothing unless challenged) */}
      <div ref={container} />

      {isOpen && (
        <div
          role="dialog"
          aria-label={t.headerTitle}
          aria-modal="true"
          className="absolute bottom-16 right-0 mb-2 flex max-h-[min(520px,calc(100vh-160px))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:w-[380px]"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between bg-nexus-navy px-4 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-nexus-periwinkle/20">
                <MessageCircle className="h-4 w-4 text-nexus-periwinkle" />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold leading-tight text-white">
                  {t.headerTitle}
                </h3>
                <p className="truncate text-[11px] text-white/60">
                  {state === "chatting"
                    ? t.headerSubtitleOnline
                    : t.headerSubtitleAssistant}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <div
                role="group"
                aria-label={t.languageAriaLabel}
                className="flex items-center rounded-full bg-white/10 p-0.5"
              >
                {CHAT_LOCALES.map(({ code, label }) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLocale(code)}
                    aria-pressed={locale === code}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                      locale === code
                        ? "bg-nexus-periwinkle text-nexus-navy"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleToggle}
                className="p-2 text-white/60 transition-colors hover:text-white"
                aria-label={t.closeChatAria}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {state === "lead-form" && (
            <LeadForm
              locale={locale}
              leadInfo={leadInfo}
              onChange={setLeadInfo}
              onSubmit={handleLeadSubmit}
            />
          )}

          {state === "chatting" && (
            <>
              <div
                aria-live="polite"
                aria-relevant="additions"
                className="chat-scroll min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3"
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-br-md bg-nexus-blue text-white"
                          : "rounded-bl-md bg-gray-100 text-gray-800"
                      }`}
                    >
                      {msg.content || (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
                {chatError && (
                  <p className="text-center text-xs text-red-500">
                    {chatError}
                  </p>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="flex shrink-0 gap-2 px-4 pb-2">
                <Link
                  href="/contact"
                  className="flex-1 rounded-full border border-nexus-navy py-2.5 text-center text-xs font-medium text-nexus-navy transition-colors hover:bg-nexus-navy hover:text-white"
                >
                  {t.contactUs}
                </Link>
                <a
                  href={SITE.phoneHref}
                  className="flex flex-1 items-center justify-center gap-1 rounded-full bg-nexus-navy py-2.5 text-center text-xs font-medium text-white transition-colors hover:bg-nexus-blue"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {t.callNow}
                </a>
              </div>

              {/* Input */}
              <div className="shrink-0 border-t border-gray-100 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={t.inputPlaceholder}
                    aria-label={t.inputAriaLabel}
                    disabled={isStreaming}
                    className="flex-1 rounded-full border border-gray-200 px-3 py-2 text-sm focus:border-nexus-periwinkle focus:outline-none focus:ring-2 focus:ring-nexus-periwinkle/50 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isStreaming}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-nexus-blue text-white transition-colors hover:bg-nexus-navy disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={t.sendMessage}
                  >
                    {isStreaming ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Proactive Chat Bubble */}
      {showBubble && !isOpen && (
        <div className="fixed bottom-24 right-4 z-50 max-w-[220px] rounded-xl bg-white p-3 shadow-lg">
          <button
            onClick={() => {
              setShowBubble(false);
              sessionStorage.setItem("nx-chat-dismissed", "1");
            }}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs"
            aria-label={t.dismiss}
          >
            x
          </button>
          <p className="text-sm text-nexus-ink">{t.proactiveBubble}</p>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={handleToggle}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-nexus-blue text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
        aria-label={isOpen ? t.closeChatAria : t.openChat}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
