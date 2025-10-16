'use client';

import { motion } from 'framer-motion';

const logos = [
  { name: 'IRS E-File', width: 100 },
  { name: 'BBB Accredited', width: 100 },
  { name: 'State CPA Board', width: 100 },
  { name: 'NATP Member', width: 100 }
];

export function TrustLogosBar() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-8 border-y bg-card"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
          {logos.map((logo, index) => (
            <div key={index} className="opacity-60 hover:opacity-100 transition-opacity">
              <div className="bg-muted rounded border border-border px-6 py-3 text-center">
                <p className="text-xs font-semibold text-muted-foreground">{logo.name}</p>
                <p className="text-[10px] text-muted-foreground">{logo.width}×60px</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
