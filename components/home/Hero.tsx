"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-nexus-navy">
      <Image
        src="/images/chicago-skyline.jpg"
        alt="Aerial view of the Chicago skyline at dusk"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-nexus-navy/90 via-nexus-navy/60 to-nexus-navy/20" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-nexus-navy/80 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-24 pt-40 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs font-semibold uppercase tracking-[0.35em] text-nexus-periwinkle"
        >
          Chicago · North Shore · River Forest
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[1.08] text-white md:text-7xl"
        >
          The crossroads of{" "}
          <span className="italic text-nexus-periwinkle">Chicago</span> real
          estate.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22 }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-white/85"
        >
          From click to close: full-time, local experts guiding you through
          buying, selling, and everything in between.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.34 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            href="/contact"
            className="group flex items-center gap-2 rounded-full bg-nexus-periwinkle px-7 py-3.5 text-sm font-semibold text-nexus-navy transition-all hover:bg-white"
          >
            Start Your Search
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("nexus:open-chat"))
            }
            className="flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
          >
            <MessageCircle size={16} />
            Ask Us Anything (EN · ES · PL)
          </button>
        </motion.div>
      </div>
    </section>
  );
}
