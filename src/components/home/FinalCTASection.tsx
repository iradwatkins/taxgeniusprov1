'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Shield, Award, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const trustIndicators = [
  { icon: CheckCircle, text: 'Licensed CPAs', color: 'text-success' },
  { icon: Shield, text: '100% Secure', color: 'text-success' },
  { icon: Award, text: 'BBB A+ Rated', color: 'text-success' },
];

export function FinalCTASection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="relative rounded-lg overflow-hidden shadow-xl group">
              <Image
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=700&q=80"
                alt="Happy family planning their finances"
                width={700}
                height={500}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              {/* Floating badge overlay */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg p-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">98%</p>
                    <p className="text-xs text-muted-foreground">Satisfaction</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Content & CTAs */}
          <div className="order-1 lg:order-2 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                File your taxes online in minutes, or schedule a free consultation with a licensed CPA.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <Button variant="professional" size="lg" className="w-full" asChild>
                <Link href="/start-filing/form">File Your Tax Return Online</Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full" asChild>
                <Link href="/book-appointment">Schedule Free Consultation</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <indicator.icon className={`w-4 h-4 ${indicator.color}`} />
                  <span>{indicator.text}</span>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground text-center lg:text-left">
              Have questions? Call us at{' '}
              <Link href="tel:+14046271015" className="text-primary hover:underline">
                (404) 627-1015
              </Link>{' '}
              or{' '}
              <Link href="/contact" className="text-primary hover:underline">
                contact us online
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
