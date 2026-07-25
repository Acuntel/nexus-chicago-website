import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Services from "@/components/home/Services";
import Neighborhoods from "@/components/home/Neighborhoods";
import TestimonialsPreview from "@/components/home/TestimonialsPreview";
import CtaBand from "@/components/home/CtaBand";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-nexus-steel">
              Welcome to Nexus
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-nexus-navy md:text-5xl">
              Consumer service,
              <br />
              three times over.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-nexus-ink/75">
              Real estate is about location, location, location. Nexus Chicago
              is about consumer service, consumer service, consumer service.
              Whether you're selling your home or searching the latest Chicago
              listings, our experienced agents assist with every real estate
              need — backed by a management staff with over 50 years of
              experience.
            </p>
            <p className="mt-4 text-base leading-relaxed text-nexus-ink/75">
              Our mission: an excellent experience and outstanding service that
              builds memorable relationships and strengthens our commitment to
              community.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-nexus-blue hover:text-nexus-navy"
            >
              More about us <ArrowRight size={15} />
            </Link>
          </Reveal>
          <Reveal delay={0.15} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="/images/millennium-park.jpg"
                alt="Cloud Gate sculpture in Millennium Park, Chicago"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-nexus-blue p-6 text-white shadow-xl md:block">
              <p className="font-display text-3xl font-semibold">From click</p>
              <p className="text-sm text-white/80">to close.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <Services />
      <Neighborhoods />
      <TestimonialsPreview />
      <CtaBand />
    </>
  );
}
