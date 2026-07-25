import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Nexus Chicago Realty Group — 325 Park Ave, River Forest, IL 60305. Call 773.259.9676.",
};

const DETAILS = [
  { icon: Phone, label: "Phone", value: SITE.phone, href: SITE.phoneHref },
  {
    icon: Mail,
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  },
  { icon: MapPin, label: "Office", value: SITE.address },
  { icon: Clock, label: "Response Time", value: "Same-day follow-up" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact"
        title="Let's talk real estate."
        subtitle="Tell us what you're looking for and a Nexus agent will reach out the same day. Se habla español · Mówimy po polsku."
      />
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
          <Reveal className="space-y-7">
            <h2 className="font-display text-3xl font-semibold text-nexus-navy">
              Reach us directly
            </h2>
            {DETAILS.map((d) => (
              <div key={d.label} className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-nexus-periwinkle/25">
                  <d.icon size={18} className="text-nexus-blue" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-nexus-steel">
                    {d.label}
                  </p>
                  {d.href ? (
                    <a
                      href={d.href}
                      className="text-base font-medium text-nexus-navy hover:text-nexus-blue"
                    >
                      {d.value}
                    </a>
                  ) : (
                    <p className="text-base font-medium text-nexus-navy">
                      {d.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.12}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
