"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  const set = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center rounded-2xl bg-nexus-mist/60 p-12 text-center">
        <CheckCircle2 size={44} className="text-nexus-blue" />
        <h3 className="mt-4 font-display text-2xl font-semibold text-nexus-navy">
          Message received.
        </h3>
        <p className="mt-2 max-w-sm text-sm text-nexus-ink/70">
          A Nexus agent will reach out the same day. Need us sooner? Call
          773.259.9676.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:border-nexus-periwinkle focus:outline-none focus:ring-2 focus:ring-nexus-periwinkle/50";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          required
          placeholder="Your name *"
          aria-label="Your name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          className={inputClass}
        />
        <input
          type="email"
          required
          placeholder="Email address *"
          aria-label="Your email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="tel"
          placeholder="Phone (optional)"
          aria-label="Your phone number"
          autoComplete="tel"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          className={inputClass}
        />
        <select
          value={form.interest}
          aria-label="What can we help with?"
          onChange={(e) => set("interest", e.target.value)}
          className={`${inputClass} text-gray-600`}
        >
          <option value="">What can we help with?</option>
          <option>Buying a Home</option>
          <option>Selling a Home</option>
          <option>REO / Short Sale</option>
          <option>New Construction</option>
          <option>Other / Not Sure</option>
        </select>
      </div>
      <textarea
        required
        rows={5}
        placeholder="Tell us about what you're looking for *"
        aria-label="Your message"
        value={form.message}
        onChange={(e) => set("message", e.target.value)}
        className={inputClass}
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="flex items-center gap-2 rounded-full bg-nexus-blue px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-nexus-navy disabled:opacity-60"
      >
        {status === "sending" ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Send size={16} />
        )}
        Send Message
      </button>
      {status === "error" && (
        <p className="text-sm text-red-500">
          Something went wrong — please try again or call 773.259.9676.
        </p>
      )}
    </form>
  );
}
