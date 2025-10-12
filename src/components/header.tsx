'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { CartIcon } from '@/components/CartIcon';
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
      "sticky top-0 z-50 transition-all duration-300 border-b",
      scrolled ? "bg-white/98 dark:bg-card/98 backdrop-blur-sm shadow-sm" : "bg-white/95 dark:bg-card/95 backdrop-blur-sm"
    )}>
      <div className="container mx-auto px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/wordpress-assets/taxgenius-logo.png"
                alt="Tax Genius Pro"
                width={180}
                height={45}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link href="/services" className="px-4 py-2 text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors font-medium text-sm">
              Services
            </Link>
            <Link href="/store" className="px-4 py-2 text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors font-medium text-sm">
              Store
            </Link>
            <Link href="/about" className="px-4 py-2 text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors font-medium text-sm">
              About
            </Link>
            <Link href="/pricing" className="px-4 py-2 text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors font-medium text-sm">
              Pricing
            </Link>
            <Link href="/contact" className="px-4 py-2 text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors font-medium text-sm">
              Contact
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <CartIcon />
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button variant="professional" size="sm" asChild>
              <Link href="/start-filing">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 space-y-1 animate-in slide-in-from-top border-t pt-4">
            <Link href="/services" className="block px-4 py-2 text-foreground/80 hover:bg-muted/50 rounded-md">Services</Link>
            <Link href="/store" className="block px-4 py-2 text-foreground/80 hover:bg-muted/50 rounded-md">Store</Link>
            <Link href="/about" className="block px-4 py-2 text-foreground/80 hover:bg-muted/50 rounded-md">About</Link>
            <Link href="/pricing" className="block px-4 py-2 text-foreground/80 hover:bg-muted/50 rounded-md">Pricing</Link>
            <Link href="/contact" className="block px-4 py-2 text-foreground/80 hover:bg-muted/50 rounded-md">Contact</Link>
            <div className="flex items-center justify-center gap-4 py-3">
              <CartIcon />
              <ThemeToggle />
            </div>
            <div className="pt-3 space-y-2">
              <Button variant="outline" className="w-full" size="sm" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button variant="professional" className="w-full" size="sm" asChild>
                <Link href="/start-filing">Get Started</Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}