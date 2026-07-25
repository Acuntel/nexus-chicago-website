"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const solid = scrolled || open || pathname !== "/";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-nexus-navy/95 shadow-lg shadow-nexus-navy/20 backdrop-blur"
          : "bg-gradient-to-b from-nexus-navy/80 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-wide text-white">
            NEXUS
            <span className="mx-1.5 italic text-nexus-periwinkle">X</span>
            CHICAGO
          </span>
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.25em] text-nexus-periwinkle sm:block">
            Realty Group
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors ${
                pathname === link.href
                  ? "text-nexus-periwinkle"
                  : "text-white/85 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={SITE.phoneHref}
            className="flex items-center gap-2 rounded-full bg-nexus-periwinkle px-4 py-2 text-sm font-semibold text-nexus-navy transition-transform hover:scale-[1.03]"
          >
            <Phone size={15} />
            {SITE.phone}
          </a>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-nexus-navy px-6 pb-8 pt-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 text-base font-medium text-white/90 hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={SITE.phoneHref}
              className="mt-3 flex items-center justify-center gap-2 rounded-full bg-nexus-periwinkle px-4 py-3 text-sm font-semibold text-nexus-navy"
            >
              <Phone size={15} />
              Call {SITE.phone}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
