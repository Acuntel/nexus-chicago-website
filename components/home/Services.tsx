import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

const SERVICES = [
  {
    title: "For Buyers",
    href: "/buyers",
    image: "/images/buyers.jpg",
    body: "First home or fifth: from prequalification to closing, we handle every step with you.",
  },
  {
    title: "For Sellers",
    href: "/sellers",
    image: "/images/sellers.jpg",
    body: "Virtual tours, a comprehensive market analysis, and marketing that prices your home right.",
  },
  {
    title: "REO & New Construction",
    href: "/agents",
    image: "/images/home-2.jpg",
    body: "Deep expertise in REO, short sales, rehab and ground-up development across Chicagoland.",
  },
];

export default function Services() {
  return (
    <section className="bg-nexus-mist/60 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-nexus-steel">
            What We Do
          </p>
          <h2 className="mt-3 max-w-xl font-display text-4xl font-semibold text-nexus-navy md:text-5xl">
            Every side of the transaction, covered.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12}>
              <Link
                href={s.href}
                className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-nexus-navy/5 transition-all hover:-translate-y-1.5 hover:shadow-xl hover:shadow-nexus-blue/10"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-nexus-navy/50 to-transparent" />
                </div>
                <div className="p-7">
                  <h3 className="font-display text-2xl font-semibold text-nexus-navy">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-nexus-ink/70">
                    {s.body}
                  </p>
                  <span className="mt-5 flex items-center gap-2 text-sm font-semibold text-nexus-blue">
                    Learn more
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
