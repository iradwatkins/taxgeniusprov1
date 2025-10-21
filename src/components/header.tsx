'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, ArrowRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { CartIcon } from '@/components/CartIcon';
import { StartTaxReturnButton } from '@/components/StartTaxReturnButton';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 border-b',
        scrolled
          ? 'bg-white/98 dark:bg-card/98 backdrop-blur-sm shadow-sm'
          : 'bg-white/95 dark:bg-card/95 backdrop-blur-sm'
      )}
    >
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
            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-2 text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors font-medium text-sm flex items-center gap-1">
                  Services
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/personal-tax-filing" className="cursor-pointer">
                    Personal Tax Filing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/business-tax" className="cursor-pointer">
                    Business Tax Services
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/tax-planning" className="cursor-pointer">
                    Tax Planning & Advisory
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/audit-protection" className="cursor-pointer">
                    Audit Protection
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/irs-resolution" className="cursor-pointer">
                    IRS Resolution Services
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/services" className="cursor-pointer font-semibold text-primary">
                    View All Services →
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-2 text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors font-medium text-sm flex items-center gap-1">
                  Resources
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/tax-guide" className="cursor-pointer">
                    2024 Tax Guide
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/blog" className="cursor-pointer">
                    Tax Blog & Tips
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help" className="cursor-pointer">
                    Help Center
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/tax-calculator" className="cursor-pointer">
                    Tax Calculator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/find-a-refund" className="cursor-pointer">
                    Find My Refund
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Opportunities Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-2 text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors font-medium text-sm flex items-center gap-1">
                  Join Us
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/preparer/start" className="cursor-pointer">
                    Become a Tax Preparer
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/affiliate/apply" className="cursor-pointer">
                    Join as Affiliate
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/referral" className="cursor-pointer">
                    Referral Program
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/about"
              className="px-4 py-2 text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors font-medium text-sm"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-md transition-colors font-medium text-sm"
            >
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
            <StartTaxReturnButton size="sm" />
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
            {/* Services Section */}
            <div className="px-2 py-2">
              <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Services
              </p>
              <Link
                href="/personal-tax-filing"
                className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted/50 rounded-md"
              >
                Personal Tax Filing
              </Link>
              <Link
                href="/business-tax"
                className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted/50 rounded-md"
              >
                Business Tax Services
              </Link>
              <Link
                href="/tax-planning"
                className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted/50 rounded-md"
              >
                Tax Planning & Advisory
              </Link>
              <Link
                href="/audit-protection"
                className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted/50 rounded-md"
              >
                Audit Protection
              </Link>
              <Link
                href="/irs-resolution"
                className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted/50 rounded-md"
              >
                IRS Resolution
              </Link>
              <Link
                href="/services"
                className="block px-4 py-2 text-sm text-primary font-semibold hover:bg-muted/50 rounded-md"
              >
                View All Services →
              </Link>
            </div>

            {/* Resources Section */}
            <div className="px-2 py-2">
              <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Resources
              </p>
              <Link
                href="/tax-guide"
                className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted/50 rounded-md"
              >
                2024 Tax Guide
              </Link>
              <Link
                href="/blog"
                className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted/50 rounded-md"
              >
                Tax Blog & Tips
              </Link>
              <Link
                href="/help"
                className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted/50 rounded-md"
              >
                Help Center
              </Link>
              <Link
                href="/tax-calculator"
                className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted/50 rounded-md"
              >
                Tax Calculator
              </Link>
              <Link
                href="/find-a-refund"
                className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted/50 rounded-md"
              >
                Find My Refund
              </Link>
            </div>

            {/* Main Links */}
            <div className="border-t pt-2">
              <Link
                href="/about"
                className="block px-4 py-2 text-foreground/80 hover:bg-muted/50 rounded-md"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 text-foreground/80 hover:bg-muted/50 rounded-md"
              >
                Contact
              </Link>
            </div>

            {/* Join Us Mobile Section */}
            <div className="px-2 py-2 border-t">
              <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Join Us
              </p>
              <Link
                href="/preparer/start"
                className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted/50 rounded-md"
              >
                Become a Tax Preparer
              </Link>
              <Link
                href="/affiliate/apply"
                className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted/50 rounded-md"
              >
                Join as Affiliate
              </Link>
              <Link
                href="/referral"
                className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted/50 rounded-md"
              >
                Referral Program
              </Link>
            </div>

            <div className="flex items-center justify-center gap-4 py-3 border-t">
              <CartIcon />
              <ThemeToggle />
            </div>
            <div className="pt-3 space-y-2">
              <Button variant="outline" className="w-full" size="sm" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <div className="w-full">
                <StartTaxReturnButton size="sm" className="w-full" />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
