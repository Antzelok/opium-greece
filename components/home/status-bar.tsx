"use client";

import React from "react";
import { motion } from "framer-motion";

interface StatItem {
  value: string;
  label: string;
}

const stats: StatItem[] = [
  {
    value: "1400+",
    label: "FRAGRANCE CODES",
  },
  {
    value: "40%",
    label: "OIL CONCENTRATION",
  },
  {
    value: "5000+",
    label: "HAPPY CUSTOMERS",
  },
  {
    value: "24h",
    label: "FAST SHIPPING IN GREECE",
  },
];

const StatusBar: React.FC = () => {
  return (
    <section className="bg-black py-16 border-y border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat: StatItem, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center text-center space-y-2"
            >
              <span className="text-3xl md:text-4xl font-serif text-[#C5A25D] tracking-tight">
                {stat.value}
              </span>
              <span className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatusBar;
