"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface SlideItem {
  image: string;
  alt: string;
}

const slides: SlideItem[] = [
  { image: "/carousel.jpg", alt: "Opium Luxury Interior" },
  { image: "/carousel1.jpg", alt: "Opium Luxury Interior" },
];

const CarouselSection = () => {
  return (
    <section className="py-24 bg-black overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8 order-2 lg:order-1"
          >
            <div className="space-y-4">
              <span className="text-[#C5A25D] text-[10px] font-bold tracking-[0.4em]">
                OUR STORY
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
                Your Extrait Perfume Journey Starts & Ends Here
              </h2>
            </div>

            <div className="space-y-6 text-neutral-400 font-light leading-relaxed">
              <p>
                At Opium, we believe luxury should be accessible. Every
                fragrance is crafted with
                <span className="text-white font-medium">
                  {" "}
                  40% oil concentration
                </span>{" "}
                — the gold standard in perfumery — ensuring unmatched longevity
                and sillage.
              </p>
              <p>
                With 1400+ fragrance codes inspired by the world&apos;s most
                iconic houses, we bring you the essence of luxury at a fraction
                of the price. Smell unforgettable.
              </p>
            </div>

            <div className="pt-4">
              <div className="h-px w-24 bg-[#C5A25D]/50" />
            </div>
          </motion.div>

          {/* Carousel Implementation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 4000,
                }),
              ]}
              className="w-full relative group"
            >
              <CarouselContent>
                {slides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
                      <Image
                        src={slide.image}
                        alt={slide.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-105 h-auto"
                        priority={index === 0}
                        quality={85}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CarouselSection;
