"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  IoLocationOutline,
  IoTimeOutline,
  IoLogoGoogle,
} from "react-icons/io5";
import { FiExternalLink } from "react-icons/fi";
import { SiApple } from "react-icons/si";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Store {
  name: string;
  address: string;
  hours: string;
  googleMapsUrl: string;
  appleMapsUrl: string;
}

const stores: Store[] = [
  {
    name: "Νέα Ιωνία",
    address: "Λεωφ. Ηρακλείου 123, Νέα Ιωνία",
    hours: "Mon–Sat 10:00–21:00",
    googleMapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Leof.+Irakleiou+123+Nea+Ionia",
    appleMapsUrl: "https://maps.apple.com/?daddr=Leof.+Irakleiou+123+Nea+Ionia",
  },
  {
    name: "Χαλάνδρι",
    address: "Λεωφ. Κηφισίας 45, Χαλάνδρι",
    hours: "Mon–Sat 10:00–21:00",
    googleMapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Leof.+Kifisias+45+Chalandri",
    appleMapsUrl: "https://maps.apple.com/?daddr=Leof.+Kifisias+45+Chalandri",
  },
  {
    name: "Νέο Ηράκλειο",
    address: "Λεωφ. Ηρακλείου 78, Νέο Ηράκλειο",
    hours: "Mon–Sat 10:00–21:00",
    googleMapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Leof.+Irakleiou+78+Neo+Irakleio",
    appleMapsUrl:
      "https://maps.apple.com/?daddr=Leof.+Irakleiou+78+Neo+Irakleio",
  },
];

const StoreLocations = () => {
  return (
    <section className="py-24 bg-black px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <motion.span className="text-[#C5A25D] text-[10px] font-bold tracking-[0.4em] uppercase">
            Visit Us
          </motion.span>
          <motion.h2 className="text-4xl md:text-5xl font-serif text-white">
            Our Stores
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stores.map((store, index) => (
            <motion.div
              key={store.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              {/* Αφαιρέσαμε το <a> wrapper από όλη την κάρτα για να δουλέψει το Popover σωστά */}
              <Card className="bg-[#0A0A0A] border-white/5 hover:border-[#C5A25D]/40 transition-all duration-500 h-full flex flex-col rounded-none relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#C5A25D]/0 group-hover:bg-[#C5A25D]/3 transition-colors duration-500" />

                <CardHeader className="pt-8 px-8 relative z-10">
                  <CardTitle className="text-xl font-serif text-[#C5A25D] tracking-wide group-hover:text-white transition-colors duration-500">
                    {store.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-8 pb-8 space-y-6 grow relative z-10">
                  <div className="flex items-start gap-4 text-neutral-400 group-hover:text-neutral-200 transition-colors">
                    <IoLocationOutline className="text-xl text-[#C5A25D] shrink-0" />
                    <p className="text-sm font-light leading-relaxed">
                      {store.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-neutral-400 group-hover:text-neutral-200 transition-colors">
                    <IoTimeOutline className="text-xl text-[#C5A25D] shrink-0" />
                    <p className="text-sm font-light">{store.hours}</p>
                  </div>
                </CardContent>

                <CardFooter className="px-8 pb-8 relative z-10">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-white uppercase hover:text-[#C5A25D] transition-all duration-300 outline-none">
                        Get Directions
                        <FiExternalLink className="text-sm" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 bg-[#0A0A0A] border-white/10 rounded-none p-2 shadow-2xl">
                      <div className="flex flex-col gap-1">
                        <a
                          href={store.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-3 py-2 text-[10px] font-bold tracking-widest text-neutral-400 hover:text-[#C5A25D] hover:bg-white/5 transition-all uppercase"
                        >
                          <IoLogoGoogle className="text-base" />
                          Google Maps
                        </a>
                        <a
                          href={store.appleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-3 py-2 text-[10px] font-bold tracking-widest text-neutral-400 hover:text-[#C5A25D] hover:bg-white/5 transition-all uppercase"
                        >
                          <SiApple className="text-base" />
                          Apple Maps
                        </a>
                      </div>
                    </PopoverContent>
                  </Popover>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoreLocations;
