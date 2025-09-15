'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      scrolled ? "bg-background/95 backdrop-blur-sm shadow-md" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Image
                src="/images/wordpress-assets/taxgenius-logo.png"
                alt="Tax Genius Pro"
                width={200}
                height={50}
                className="h-12 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/services" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Services
            </Link>
            <Link href="/about" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              About
            </Link>
            <Link href="/pricing" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Pricing
            </Link>
            <Link href="/contact" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Contact
            </Link>
            <ThemeToggle />
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Login
            </Button>
            <Button className="bg-primary hover:bg-primary/90 shadow-lg">
              Start Free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2 animate-in slide-in-from-top">
            <Link href="/services" className="block py-2 text-foreground/80">Services</Link>
            <Link href="/about" className="block py-2 text-foreground/80">About</Link>
            <Link href="/pricing" className="block py-2 text-foreground/80">Pricing</Link>
            <Link href="/contact" className="block py-2 text-foreground/80">Contact</Link>
            <div className="flex justify-center py-2">
              <ThemeToggle />
            </div>
            <Button variant="outline" className="w-full mb-2">Login</Button>
            <Button className="w-full">Start Free</Button>
          </nav>
        )}
      </div>
    </header>
  );
}