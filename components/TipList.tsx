import Reveal from "@/components/Reveal";

export default function TipList({
  tips,
}: {
  tips: { title: string; body: string }[];
}) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 lg:px-0">
      {tips.map((tip, i) => (
        <Reveal
          key={tip.title}
          delay={i * 0.06}
          className="flex gap-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-nexus-navy/5"
        >
          <span className="font-display text-4xl font-semibold text-nexus-periwinkle">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="font-display text-xl font-semibold text-nexus-navy">
              {tip.title}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-nexus-ink/75">
              {tip.body}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
