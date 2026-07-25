import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { NAV_LINKS, NEIGHBORHOODS, SITE } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-nexus-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-2xl font-semibold">
            NEXUS<span className="mx-1 italic text-nexus-periwinkle">X</span>
            CHICAGO
          </p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-nexus-periwinkle">
            Realty Group LLC
          </p>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
            {SITE.tagline}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nexus-periwinkle">
            Explore
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-white/80 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-nexus-periwinkle">
            Neighborhoods
          </p>
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-white/60">
            {NEIGHBORHOODS.join(" · ")}
          </p>
        </div>

        <div className="space-y-4 text-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nexus-periwinkle">
            Contact
          </p>
          <a
            href={SITE.phoneHref}
            className="flex items-center gap-3 text-white/80 hover:text-white"
          >
            <Phone size={16} className="text-nexus-periwinkle" /> {SITE.phone}
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="flex items-center gap-3 text-white/80 hover:text-white"
          >
            <Mail size={16} className="text-nexus-periwinkle" /> {SITE.email}
          </a>
          <p className="flex items-start gap-3 text-white/80">
            <MapPin
              size={16}
              className="mt-0.5 shrink-0 text-nexus-periwinkle"
            />
            {SITE.address}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
