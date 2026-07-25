"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/content";
import type { ChatLocale } from "@/lib/chat-translations";
import { CHAT_STRINGS } from "@/lib/chat-translations";

export interface LeadInfo {
  name: string;
  email: string;
  phone: string;
  service: string;
}

export default function LeadForm({
  locale,
  leadInfo,
  onChange,
  onSubmit,
}: {
  locale: ChatLocale;
  leadInfo: LeadInfo;
  onChange: (info: LeadInfo) => void;
  onSubmit: () => void;
}) {
  const t = CHAT_STRINGS[locale];
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: keyof LeadInfo, value: string) => {
    onChange({ ...leadInfo, [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!leadInfo.name.trim()) next.name = t.nameRequired;
    if (!leadInfo.email.trim()) {
      next.email = t.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadInfo.email)) {
      next.email = t.emailInvalid;
    }
    setErrors(next);
    if (Object.keys(next).length === 0) onSubmit();
  };

  const inputClass = (hasError?: string) =>
    `w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-nexus-periwinkle/60 focus:border-nexus-periwinkle ${
      hasError ? "border-red-400" : "border-gray-200"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-3 overflow-y-auto p-4">
      <p className="mb-1 text-sm text-gray-600">{t.leadFormIntro}</p>

      <div>
        <input
          type="text"
          placeholder={t.namePlaceholder}
          aria-label={t.nameAriaLabel}
          autoComplete="name"
          value={leadInfo.name}
          onChange={(e) => set("name", e.target.value)}
          className={inputClass(errors.name)}
        />
        {errors.name && (
          <p className="mt-0.5 text-[11px] text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <input
          type="email"
          placeholder={t.emailPlaceholder}
          aria-label={t.emailAriaLabel}
          autoComplete="email"
          value={leadInfo.email}
          onChange={(e) => set("email", e.target.value)}
          className={inputClass(errors.email)}
        />
        {errors.email && (
          <p className="mt-0.5 text-[11px] text-red-500">{errors.email}</p>
        )}
      </div>

      <input
        type="tel"
        placeholder={t.phonePlaceholder}
        aria-label={t.phoneAriaLabel}
        autoComplete="tel"
        value={leadInfo.phone}
        onChange={(e) => set("phone", e.target.value)}
        className={inputClass()}
      />

      <select
        value={leadInfo.service}
        aria-label={t.serviceAriaLabel}
        onChange={(e) => set("service", e.target.value)}
        className={`${inputClass()} text-gray-600`}
      >
        <option value="">{t.servicePlaceholder}</option>
        {t.serviceOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-nexus-blue py-2.5 text-sm font-medium text-white transition-colors hover:bg-nexus-navy"
      >
        {t.startChat}
        <ArrowRight className="h-4 w-4" />
      </button>

      <div className="pt-1 text-center">
        <a
          href={SITE.phoneHref}
          className="text-[11px] text-gray-400 transition-colors hover:text-nexus-blue"
        >
          {t.preferToCall(SITE.phone)}
        </a>
      </div>
    </form>
  );
}
