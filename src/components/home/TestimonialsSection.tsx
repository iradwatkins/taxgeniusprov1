'use client';

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Star, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { TypingText } from './TypingText';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    location: "Austin, TX",
    content: "The CPA team was incredibly knowledgeable and helped me find deductions I didn't even know existed. Professional service from start to finish.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    delay: 0
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    location: "San Francisco, CA",
    content: "Fast, efficient, and professional. The entire process was seamless and my CPA answered all my questions promptly.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    delay: 500
  },
  {
    name: "Maria Garcia",
    role: "Teacher",
    location: "Miami, FL",
    content: "Best tax service I've used. They made everything easy to understand and were always available when I had questions.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&q=80",
    delay: 1000
  }
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-primary text-primary" />
            ))}
            <span className="text-lg font-semibold ml-2 text-muted-foreground">4.9 out of 5</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-3">What Our Clients Say</h2>
          <p className="text-muted-foreground">Based on 50,000+ verified reviews</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-2 h-full">
                <CardHeader>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.2 }}
                    className="flex gap-0.5 mb-4"
                  >
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </motion.div>
                  <CardDescription className="text-base leading-relaxed text-foreground min-h-[120px]">
                    <TypingText text={`"${testimonial.content}"`} delay={testimonial.delay} />
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-background ring-2 ring-primary/20">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle className="w-3 h-3 text-success" />
                        <p className="text-xs text-muted-foreground">Verified Client</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/testimonials">
              Read More Reviews
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
