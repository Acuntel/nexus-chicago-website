import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import Reveal from "@/components/Reveal";
import { TESTIMONIALS } from "@/lib/content";

export default function TestimonialsPreview() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-nexus-steel">
              Client Stories
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-nexus-navy md:text-5xl">
              Outstanding service, on record.
            </h2>
          </div>
          <Link
            href="/testimonials"
            className="flex items-center gap-2 text-sm font-semibold text-nexus-blue hover:text-nexus-navy"
          >
            All testimonials <ArrowRight size={15} />
          </Link>
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.slice(0, 3).map((t, i) => (
            <Reveal
              key={t.author}
              delay={i * 0.12}
              className="flex flex-col rounded-2xl bg-nexus-mist/50 p-8 ring-1 ring-nexus-navy/5"
            >
              <Quote size={28} className="text-nexus-periwinkle" />
              <p className="mt-5 flex-1 text-[15px] leading-relaxed text-nexus-ink/80">
                “{t.quote}”
              </p>
              <p className="mt-6 text-sm font-semibold text-nexus-navy">
                {t.author}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
