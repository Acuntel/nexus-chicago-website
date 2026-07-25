import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/home/CtaBand";
import { AGENTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Agents",
  description:
    "Meet the full-time, experienced professionals of Nexus Chicago Realty Group.",
};

export default function AgentsPage() {
  return (
    <>
      <PageHero
        kicker="The Team"
        title="Our agents are our #1 resource."
        subtitle="Full-time professionals who live, work, and belong to the communities they represent."
      />

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-2 lg:px-8">
          {AGENTS.map((agent, i) => (
            <Reveal
              key={agent.name}
              delay={i * 0.12}
              className="flex flex-col rounded-2xl bg-nexus-mist/50 p-9 ring-1 ring-nexus-navy/5"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-nexus-blue font-display text-2xl font-semibold text-white">
                {agent.name
                  .split(" ")
                  .filter((w) => w.length > 2 || w.endsWith("."))
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")}
              </div>
              <h2 className="mt-6 font-display text-2xl font-semibold text-nexus-navy">
                {agent.name}
              </h2>
              <p className="text-sm font-semibold uppercase tracking-wider text-nexus-steel">
                {agent.title}
              </p>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-nexus-ink/75">
                {agent.bio}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {agent.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-nexus-periwinkle/25 px-3.5 py-1.5 text-xs font-semibold text-nexus-blue"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-7 flex flex-col gap-2.5 border-t border-nexus-navy/10 pt-6 text-sm">
                <a
                  href={agent.phoneHref}
                  className="flex items-center gap-2.5 font-medium text-nexus-blue hover:text-nexus-navy"
                >
                  <Phone size={15} /> {agent.phone}
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  className="flex items-center gap-2.5 font-medium text-nexus-blue hover:text-nexus-navy"
                >
                  <Mail size={15} /> {agent.email}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
