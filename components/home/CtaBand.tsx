import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/content";

export default function CtaBand() {
  return (
    <section className="bg-gradient-to-br from-nexus-blue via-nexus-navy to-nexus-navy py-20">
      <Reveal className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center lg:px-8">
        <h2 className="max-w-2xl font-display text-4xl font-semibold text-white md:text-5xl">
          Ready to make your move?
        </h2>
        <p className="mt-4 max-w-xl text-base text-white/75">
          Tell us what you're looking for and a Nexus agent will reach out the
          same day — se habla español · mówimy po polsku.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="group flex items-center gap-2 rounded-full bg-nexus-periwinkle px-7 py-3.5 text-sm font-semibold text-nexus-navy transition-colors hover:bg-white"
          >
            Get in Touch
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <a
            href={SITE.phoneHref}
            className="flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            <Phone size={15} /> {SITE.phone}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
