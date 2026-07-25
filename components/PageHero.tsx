import Image from "next/image";

export default function PageHero({
  title,
  kicker,
  subtitle,
  image = "/images/chicago-skyline.jpg",
}: {
  title: string;
  kicker: string;
  subtitle?: string;
  image?: string;
}) {
  return (
    <section className="relative flex min-h-[380px] items-end overflow-hidden bg-nexus-navy pb-14 pt-36">
      <Image
        src={image}
        alt=""
        fill
        priority
        className="object-cover opacity-30"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-nexus-navy via-nexus-navy/60 to-nexus-navy/30" />
      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-nexus-periwinkle">
          {kicker}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
