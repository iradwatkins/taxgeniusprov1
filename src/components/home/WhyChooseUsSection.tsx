'use client';

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Award, DollarSign, Phone, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const benefits = [
  {
    icon: Award,
    title: "Licensed CPAs with 25+ Years Experience",
    description: "Our team of certified professionals stays current with tax law changes to maximize your refund.",
    bgColor: "bg-primary/10",
    iconColor: "text-primary"
  },
  {
    icon: DollarSign,
    title: "Maximum Refund Guaranteed in Writing",
    description: "We guarantee you'll get the largest refund possible, or we'll pay you the difference.",
    bgColor: "bg-success/10",
    iconColor: "text-success"
  },
  {
    icon: Phone,
    title: "Year-Round Support (Not Just Tax Season)",
    description: "Get answers to your tax questions anytime. We're here for you all year, not just in April.",
    bgColor: "bg-primary/10",
    iconColor: "text-primary"
  },
  {
    icon: Shield,
    title: "Bank-Level Security & Encryption",
    description: "Your sensitive information is protected with military-grade 256-bit encryption.",
    bgColor: "bg-primary/10",
    iconColor: "text-primary"
  }
];

export function WhyChooseUsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold">Why 50,000+ Americans Trust Us</h2>
              <p className="text-lg text-muted-foreground">
                Professional tax preparation with the personal touch you deserve
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 ${benefit.bgColor} rounded-full flex items-center justify-center`}>
                      <benefit.icon className={`w-6 h-6 ${benefit.iconColor}`} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button variant="professional" size="lg" asChild>
                <Link href="/about">
                  Learn More About Us
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Side - Large Feature Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-lg overflow-hidden shadow-2xl group">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                alt="Professional tax team collaborating"
                width={800}
                height={600}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Overlay Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-card border-2 border-background rounded-lg shadow-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">BBB A+</p>
                  <p className="text-sm text-muted-foreground">Rated</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
