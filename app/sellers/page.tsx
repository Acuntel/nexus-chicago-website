import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import TipList from "@/components/TipList";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/home/CtaBand";
import { SELLER_TIPS } from "@/lib/content";

export const metadata: Metadata = {
  title: "For Sellers",
  description:
    "Sell faster and at the best possible price: seller preparation guidance from Nexus Chicago Realty Group.",
};

export default function SellersPage() {
  return (
    <>
      <PageHero
        kicker="Seller Resources"
        title="Sell faster, at the best possible price."
        subtitle="As a homeowner, you play an important part in the timely sale of your property. These steps help your Nexus agent get you to the closing table."
        image="/images/sellers.jpg"
      />
      <section className="bg-nexus-mist/60 py-24">
        <Reveal className="mx-auto max-w-4xl px-6 pb-12 lg:px-0">
          <h2 className="font-display text-3xl font-semibold text-nexus-navy md:text-4xl">
            Getting your home ready
          </h2>
          <p className="mt-4 leading-relaxed text-nexus-ink/75">
            The fewer obstacles between buyers and the true appeal of your home,
            the better. Here's where to focus first.
          </p>
        </Reveal>
        <TipList tips={SELLER_TIPS} />
      </section>
      <CtaBand />
    </>
  );
}
