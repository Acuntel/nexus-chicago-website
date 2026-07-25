import Reveal from "@/components/Reveal";
import { STATS } from "@/lib/content";

export default function Stats() {
  return (
    <section className="border-b border-nexus-mist bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-6 py-14 md:grid-cols-4 lg:px-8">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="text-center">
            <p className="font-display text-4xl font-semibold text-nexus-blue md:text-5xl">
              {s.value}
            </p>
            <p className="mx-auto mt-2 max-w-[180px] text-xs font-medium uppercase tracking-wider text-nexus-ink/60">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
