import Image from "next/image";
import Reveal from "@/components/Reveal";
import { NEIGHBORHOODS } from "@/lib/content";

export default function Neighborhoods() {
  return (
    <section className="relative overflow-hidden bg-nexus-navy py-24">
      <Image
        src="/images/chicago-street.jpg"
        alt=""
        fill
        className="object-cover opacity-15"
        sizes="100vw"
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-nexus-periwinkle">
            Local First
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-white md:text-5xl">
            We live where we sell.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75">
            Every Nexus agent lives, works, and is part of the communities they
            represent — from the lakefront to the North Shore.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="mt-10 flex flex-wrap gap-3">
          {NEIGHBORHOODS.map((n) => (
            <span
              key={n}
              className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-medium text-white/90 backdrop-blur transition-colors hover:border-nexus-periwinkle hover:text-nexus-periwinkle"
            >
              {n}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
