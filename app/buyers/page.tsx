import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import TipList from "@/components/TipList";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/home/CtaBand";
import { BUYER_TIPS } from "@/lib/content";

export const metadata: Metadata = {
  title: "For Buyers",
  description:
    "From prequalification to closing: tips and guidance for buying a home in Chicago from Nexus Chicago Realty Group.",
};

export default function BuyersPage() {
  return (
    <>
      <PageHero
        kicker="Buyer Resources"
        title="Find the answers, and peace of mind."
        subtitle="Whether you've spent years saving or you're just starting to dream, the questions around buying a home can feel endless. Work with one of the industry leaders in experience and service."
        image="/images/buyers.jpg"
      />
      <section className="bg-nexus-mist/60 py-24">
        <Reveal className="mx-auto max-w-4xl px-6 pb-12 lg:px-0">
          <h2 className="font-display text-3xl font-semibold text-nexus-navy md:text-4xl">
            Your path to homeownership
          </h2>
          <p className="mt-4 leading-relaxed text-nexus-ink/75">
            First home, second home, or a fixer-upper: these fundamentals put
            you in position to move quickly and buy with confidence.
          </p>
        </Reveal>
        <TipList tips={BUYER_TIPS} />
      </section>
      <CtaBand />
    </>
  );
}
