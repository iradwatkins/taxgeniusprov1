'use client';

import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';
import { Header } from "@/components/header";
import { HeroSection } from '@/components/home/HeroSection';
import { TrustLogosBar } from '@/components/home/TrustLogosBar';
import { ServicesSection } from '@/components/home/ServicesSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { WhyChooseUsSection } from '@/components/home/WhyChooseUsSection';
import { CredentialsSection } from '@/components/home/CredentialsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FAQSection } from '@/components/home/FAQSection';
import { FinalCTASection } from '@/components/home/FinalCTASection';
import { OpportunitiesSection } from '@/components/home/OpportunitiesSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <HeroSection />
      <TrustLogosBar />
      <ServicesSection />
      <HowItWorksSection />
      <WhyChooseUsSection />
      <CredentialsSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
      <OpportunitiesSection />

      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <Button size="lg" className="rounded-full w-14 h-14 shadow-xl bg-primary hover:bg-primary/90 group-hover:scale-110 transition-transform">
          <MessageCircle className="w-6 h-6" />
        </Button>
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-card text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Need help? Chat with us!
        </span>
      </div>
    </div>
  );
}
