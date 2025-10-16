'use client';

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Calendar, Upload, UserCheck, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon: Calendar,
    number: 1,
    title: "Book Consultation",
    description: "Schedule a free 30-minute consultation with a licensed CPA",
    delay: 0
  },
  {
    icon: Upload,
    number: 2,
    title: "Upload Documents",
    description: "Securely upload W-2s, 1099s, and receipts through our portal",
    delay: 0.2
  },
  {
    icon: UserCheck,
    number: 3,
    title: "Expert Review",
    description: "CPA finds all eligible deductions and prepares your return",
    delay: 0.4
  },
  {
    icon: CheckCircle,
    number: 4,
    title: "File & Relax",
    description: "We handle IRS submission and track your refund status",
    delay: 0.6,
    isSuccess: true
  }
];

export function HowItWorksSection() {
  return (
    <section id="process" className="py-24 bg-muted/30 relative">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <div className="text-center">
          <p className="text-sm font-semibold">Background: Dashboard UI Screenshots (800×400px, faded)</p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to professional tax preparation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: step.delay }}
              className="text-center relative"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: step.delay + 0.2, type: "spring", stiffness: 200 }}
                className="mb-6 relative"
              >
                <div className={`w-20 h-20 ${step.isSuccess ? 'bg-success/10' : 'bg-primary/10'} rounded-full flex items-center justify-center mx-auto border-4 border-background shadow-lg hover:scale-110 transition-transform cursor-pointer`}>
                  <step.icon className={`w-10 h-10 ${step.isSuccess ? 'text-success' : 'text-primary'}`} />
                </div>
                <div className={`absolute -top-2 -right-2 w-8 h-8 ${step.isSuccess ? 'bg-success text-success-foreground' : 'bg-primary text-primary-foreground'} rounded-full flex items-center justify-center font-bold text-sm shadow-md`}>
                  {step.number}
                </div>
              </motion.div>
              <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="professional" size="lg" asChild>
            <Link href="/start-filing">
              Get Started Today
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
