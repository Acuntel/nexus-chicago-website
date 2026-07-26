import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/home/CtaBand";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Nexus Chicago is a conglomeration of experts in every real estate field, with a management staff bringing over 50 years of experience.",
};

const PILLARS = [
  {
    title: "Full-Time Professionals",
    body: "Nexus agents are full-time, experienced professionals. We don't hire just anyone interested in joining. Every agent brings an impressive resume and thorough knowledge of the communities they serve.",
  },
  {
    title: "Truly Local",
    body: "Every Nexus agent must live, work, and be part of the same communities they represent, from Chicago's lakefront neighborhoods to the North Shore.",
  },
  {
    title: "Technology That Works",
    body: "Thousands of Chicagoland listings updated daily, automated alerts the moment properties hit the market, virtual tours, and comprehensive market analyses.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="About Nexus"
        title="Consumer service, consumer service, consumer service."
        subtitle="Real estate is about location, location, location. Nexus Chicago is about something more."
        image="/images/millennium-park.jpg"
      />

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-14 px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-nexus-navy md:text-4xl">
              Experts in every real estate field.
            </h2>
            <p className="mt-6 leading-relaxed text-nexus-ink/75">
              With a management staff bringing over 50 years of real estate
              experience, Nexus Chicago is a conglomeration of experts across
              every real estate discipline. Whether you're a first-time home
              buyer, a seller, or an experienced investor, our staff of friendly
              professionals assists you at each step.
            </p>
            <p className="mt-4 leading-relaxed text-nexus-ink/75">
              Selling? Our site is viewed by thousands of visitors per day, with
              thousands more buyers in our database. Your home gets prominent
              marketing, a virtual tour, and a comprehensive Comparative Market
              Analysis to make sure it's visible and priced right.
            </p>
            <p className="mt-4 font-medium text-nexus-navy">
              At Nexus, our agents are our #1 resource, and our customers are
              the #1 priority.
            </p>
          </Reveal>
          <Reveal
            delay={0.15}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl"
          >
            <Image
              src="/images/interior.jpg"
              alt="Bright, modern Chicago home interior"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Reveal>
        </div>

        <div className="mx-auto mt-20 grid max-w-7xl gap-8 px-6 md:grid-cols-3 lg:px-8">
          {PILLARS.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i * 0.12}
              className="rounded-2xl bg-nexus-mist/50 p-8 ring-1 ring-nexus-navy/5"
            >
              <h3 className="font-display text-xl font-semibold text-nexus-navy">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-nexus-ink/70">
                {p.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
