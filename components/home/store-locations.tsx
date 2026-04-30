"use client";

import React from "react";
import { motion } from "framer-motion";
import { IoLocationOutline, IoTimeOutline } from "react-icons/io5";
import { FiExternalLink } from "react-icons/fi";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Store {
  name: string;
  address: string;
  hours: string;
  googleMapsUrl: string;
}

const stores: Store[] = [
  {
    name: "Nea Ionia",
    address: "Λεωφ. Ηρακλείου 123, Νέα Ιωνία",
    hours: "Mon–Sat 10:00–21:00",
    googleMapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Leof.+Irakleiou+123+Nea+Ionia",
  },
  {
    name: "Chalandri",
    address: "Λεωφ. Κηφισίας 45, Χαλάνδρι",
    hours: "Mon–Sat 10:00–21:00",
    googleMapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Leof.+Kifisias+45+Chalandri",
  },
  {
    name: "Nea Heraklio",
    address: "Λεωφ. Ηρακλείου 78, Νέο Ηράκλειο",
    hours: "Mon–Sat 10:00–21:00",
    googleMapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Leof.+Irakleiou+78+Neo+Irakleio",
  },
];

const StoreLocations: React.FC = () => {
  return (
    <section className="py-24 bg-black px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[#C5A25D] text-[10px] font-bold tracking-[0.4em] uppercase"
          >
            Visit Us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-white"
          >
            Our Stores
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stores.map((store, index) => (
            <motion.div
              key={store.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }} // Ανεπαίσθητο ανέβασμα της κάρτας
              className="h-full"
            >
              <a
                href={store.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full group"
              >
                <Card className="bg-[#0A0A0A] border-white/5 group-hover:border-[#C5A25D]/40 transition-all duration-500 h-full flex flex-col rounded-none relative overflow-hidden">
                  {/* Subtle Background Glow on Hover */}
                  <div className="absolute inset-0 bg-[#C5A25D]/0 group-hover:bg-[#C5A25D]/3 transition-colors duration-500" />

                  <CardHeader className="pt-8 px-8 relative z-10">
                    <CardTitle className="text-xl font-serif text-[#C5A25D] tracking-wide group-hover:text-white transition-colors duration-500">
                      {store.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="px-8 pb-8 space-y-6 grow relative z-10">
                    <div className="flex items-start gap-4 text-neutral-400 group-hover:text-neutral-200 transition-colors duration-500">
                      <IoLocationOutline className="text-xl text-[#C5A25D] shrink-0" />
                      <p className="text-sm font-light leading-relaxed">
                        {store.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-neutral-400 group-hover:text-neutral-200 transition-colors duration-500">
                      <IoTimeOutline className="text-xl text-[#C5A25D] shrink-0" />
                      <p className="text-sm font-light">{store.hours}</p>
                    </div>
                  </CardContent>

                  <CardFooter className="px-8 pb-8 relative z-10">
                    <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-white uppercase group-hover:text-[#C5A25D] transition-all duration-300">
                      Get Directions
                      <FiExternalLink className="text-sm transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </span>
                  </CardFooter>
                </Card>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoreLocations;
