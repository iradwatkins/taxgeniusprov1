'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Header } from '@/components/header';
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
import { MobileHubRedirect } from '@/components/MobileHubRedirect';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Auto-redirect mobile users to mobile hub if logged in */}
      <MobileHubRedirect />

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
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 group">
        <Button
          size="lg"
          className="rounded-full w-12 h-12 md:w-14 md:h-14 shadow-xl bg-primary hover:bg-primary/90 group-hover:scale-110 transition-transform"
          aria-label="Open live chat support"
        >
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
        </Button>
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-card text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Need help? Chat with us!
        </span>
      </div>
    </div>
  );
}
