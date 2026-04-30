"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Image με Next/Image */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Image
          src="/hero.jpg"
          alt="Opium Luxury Fragrance Hero"
          sizes="100vw"
          fill
          priority
          className="object-cover object-center"
          quality={90}
          loading="eager"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/40 to-transparent z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full container mx-auto px-6 flex flex-col justify-center">
        <div className="w-full space-y-8">
          {/* Top Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <span className="text-[#C5A25D] text-xs font-bold tracking-[0.4em] uppercase">
              Extrait De Parfum — 40% Oil
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif text-white leading-tight"
          >
            Elevate Your Senses <br />
            <span className="italic text-[#C5A25D]">Elegantly</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-neutral-400 text-sm md:text-base max-w-md leading-relaxed font-light"
          >
            Extrait de Parfum with 40% oil concentration for unmatched
            performance. Luxury made accessible.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <Button className="bg-[#C5A25D] hover:bg-[#A3864D] text-black px-10 py-6 text-xs font-bold tracking-widest uppercase rounded-none transition-all duration-300">
              Shop Now
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white hover:text-black px-10 py-6 text-xs font-bold tracking-widest uppercase rounded-none bg-transparent transition-all duration-300"
            >
              Discover Scents
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-12 bg-linear-to-b from-[#C5A25D] to-transparent"
        />
      </div>
    </section>
  );
};

export default Hero;
