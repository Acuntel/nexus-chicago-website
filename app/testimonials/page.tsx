import type { Metadata } from "next";
import { Quote } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/home/CtaBand";
import { TESTIMONIALS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "What clients say about buying and selling with Nexus Chicago Realty Group.",
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        kicker="Client Stories"
        title="Don't take our word for it."
        subtitle="Buyers and sellers on what it's like to work with Nexus Chicago."
        image="/images/interior.jpg"
      />
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 md:grid-cols-2 lg:px-8">
          {TESTIMONIALS.map((t, i) => (
            <Reveal
              key={t.author}
              delay={i * 0.1}
              className="flex flex-col rounded-2xl bg-nexus-mist/50 p-9 ring-1 ring-nexus-navy/5"
            >
              <Quote size={30} className="text-nexus-periwinkle" />
              <p className="mt-5 flex-1 text-[15px] leading-relaxed text-nexus-ink/80">
                “{t.quote}”
              </p>
              <p className="mt-6 font-semibold text-nexus-navy">— {t.author}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
