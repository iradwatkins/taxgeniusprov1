'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Star,
  Shield,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Phone,
  CheckCircle,
  Calculator,
  FileText,
  Award,
  Zap,
  Menu,
  Globe,
  Upload,
  UserCheck,
  Banknote,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  Calendar,
  BarChart3,
  HandshakeIcon,
  Smartphone
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Header } from "@/components/header";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Professional Design */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Trust Badges Row */}
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold bg-primary/10 text-primary border-primary/20">
                  <Shield className="w-4 h-4 mr-2" />
                  IRS Authorized
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold">
                  <Award className="w-4 h-4 mr-2" />
                  BBB A+ Rated
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold">
                  <Users className="w-4 h-4 mr-2" />
                  25+ Years
                </Badge>
              </div>

              {/* Headline */}
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-foreground">
                  Professional Tax Preparation<br />
                  <span className="text-primary">You Can Trust</span>
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
                  Expert CPAs. Maximum Refunds. Peace of Mind. Get professional tax services from licensed professionals who know how to save you money.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button variant="professional" size="lg" asChild>
                  <Link href="/start-filing">
                    Schedule Free Consultation
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="tel:+14046271015">
                    <Phone className="mr-2 w-5 h-5" />
                    (404) 627-1015
                  </Link>
                </Button>
              </div>

              {/* Small Trust Text */}
              <p className="text-sm text-muted-foreground">
                No obligation. Speak with a licensed CPA today.
              </p>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative">
              {/* Image Placeholder */}
              <div className="relative rounded-lg overflow-hidden shadow-xl bg-muted border border-border">
                <div className="aspect-[4/3] flex items-center justify-center p-12">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                      <Users className="w-12 h-12 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-muted-foreground">📸 IMAGE PLACEHOLDER</p>
                      <p className="font-bold text-lg">Professional Tax Preparer with Client</p>
                      <p className="text-sm text-muted-foreground">600×500px</p>
                      <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                        Modern office setting, natural lighting, professional attire, welcoming smile
                      </p>
                      <p className="text-xs text-muted-foreground italic">
                        Similar to: H&R Block hero images
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Logos Bar */}
      <section className="py-8 border-y bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {/* Image Placeholders for Partner Logos */}
            {[
              { name: 'IRS E-File', width: 100 },
              { name: 'BBB Accredited', width: 100 },
              { name: 'State CPA Board', width: 100 },
              { name: 'NATP Member', width: 100 }
            ].map((logo, index) => (
              <div key={index} className="opacity-60 hover:opacity-100 transition-opacity">
                <div className="bg-muted rounded border border-border px-6 py-3 text-center">
                  <p className="text-xs font-semibold text-muted-foreground">{logo.name}</p>
                  <p className="text-[10px] text-muted-foreground">{logo.width}×60px</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Professional 3-Column Grid */}
      <section id="services" className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Tax Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional tax solutions tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Personal Tax Filing Service */}
            <Card className="hover:shadow-lg transition-all duration-200 group overflow-hidden">
              {/* Image Background Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center border-b">
                <div className="text-center space-y-2 p-4">
                  <FileText className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-xs font-semibold text-muted-foreground">📸 Image: 400×300px</p>
                  <p className="text-xs text-muted-foreground">Individual reviewing documents</p>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Personal Tax Filing</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Professional preparation for individuals and families. We handle W-2s, deductions, and credits.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">$89</span>
                    <span className="text-sm text-muted-foreground">per return</span>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/services/personal">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Business Tax Services */}
            <Card className="hover:shadow-lg transition-all duration-200 group overflow-hidden border-primary/20">
              {/* Image Background Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center border-b">
                <div className="text-center space-y-2 p-4">
                  <HandshakeIcon className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-xs font-semibold text-muted-foreground">📸 Image: 400×300px</p>
                  <p className="text-xs text-muted-foreground">Small business owner in shop</p>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Business Tax Services</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Comprehensive tax preparation and planning for small businesses, LLCs, and S-Corps.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">$299</span>
                    <span className="text-sm text-muted-foreground">per return</span>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/services/business">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tax Planning & Advisory */}
            <Card className="hover:shadow-lg transition-all duration-200 group overflow-hidden">
              {/* Image Background Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center border-b">
                <div className="text-center space-y-2 p-4">
                  <BarChart3 className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-xs font-semibold text-muted-foreground">📸 Image: 400×300px</p>
                  <p className="text-xs text-muted-foreground">CPA reviewing charts with client</p>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Tax Planning & Advisory</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Year-round strategic tax planning to minimize liability and maximize savings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">$199</span>
                    <span className="text-sm text-muted-foreground">per session</span>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/services/planning">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Services Note */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">All services include free audit protection and year-round support</p>
            <Button variant="professional" size="lg" asChild>
              <Link href="/pricing">
                View All Pricing
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works - Professional Process */}
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
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="mb-6 relative">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border-4 border-background shadow-lg">
                  <Calendar className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  1
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-3">Book Consultation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Schedule a free 30-minute consultation with a licensed CPA
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="mb-6 relative">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border-4 border-background shadow-lg">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  2
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-3">Upload Documents</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Securely upload W-2s, 1099s, and receipts through our portal
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="mb-6 relative">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border-4 border-background shadow-lg">
                  <UserCheck className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  3
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-3">Expert Review</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                CPA finds all eligible deductions and prepares your return
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center relative">
              <div className="mb-6 relative">
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto border-4 border-background shadow-lg">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-success text-success-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  4
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-3">File & Relax</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We handle IRS submission and track your refund status
              </p>
            </div>
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

      {/* Why Choose Us - Split Layout */}
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
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Licensed CPAs with 25+ Years Experience</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Our team of certified professionals stays current with tax law changes to maximize your refund.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-success" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Maximum Refund Guaranteed in Writing</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We guarantee you'll get the largest refund possible, or we'll pay you the difference.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Year-Round Support (Not Just Tax Season)</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Get answers to your tax questions anytime. We're here for you all year, not just in April.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Bank-Level Security & Encryption</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Your sensitive information is protected with military-grade 256-bit encryption.
                    </p>
                  </div>
                </div>
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
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden shadow-2xl bg-muted border border-border">
                <div className="aspect-[4/3] flex items-center justify-center p-12">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                      <Users className="w-12 h-12 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-muted-foreground">📸 IMAGE PLACEHOLDER</p>
                      <p className="font-bold text-lg">Tax Professional Team in Office</p>
                      <p className="text-sm text-muted-foreground">700×600px</p>
                      <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                        Multiple CPAs, diverse team, professional office setting, collaborative atmosphere
                      </p>
                      <p className="text-xs text-muted-foreground italic">
                        Similar to: H&R Block "Our Team" sections
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlay Badge */}
              <div className="absolute -bottom-6 -left-6 bg-card border-2 border-background rounded-lg shadow-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">BBB A+</p>
                    <p className="text-sm text-muted-foreground">Rated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials & Certifications Section */}
      <section className="py-16 bg-muted/50 border-y">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-3">Trusted & Certified</h2>
            <p className="text-muted-foreground">Licensed professionals with verified credentials</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {/* IRS Authorized */}
            <div className="text-center group">
              <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
                <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Shield className="w-12 h-12 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">📸 150×150px</p>
                  <p className="font-semibold">IRS E-File Provider</p>
                  <p className="text-sm text-muted-foreground">Authorized</p>
                </div>
              </div>
            </div>

            {/* BBB Accredited */}
            <div className="text-center group">
              <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
                <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Award className="w-12 h-12 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">📸 150×150px</p>
                  <p className="font-semibold">BBB Accredited</p>
                  <p className="text-sm text-muted-foreground">A+ Rating</p>
                </div>
              </div>
            </div>

            {/* State Licensed */}
            <div className="text-center group">
              <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
                <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">📸 150×150px</p>
                  <p className="font-semibold">State Licensed</p>
                  <p className="text-sm text-muted-foreground">CPA Board Certified</p>
                </div>
              </div>
            </div>

            {/* Secure Platform */}
            <div className="text-center group">
              <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
                <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Shield className="w-12 h-12 text-success" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">📸 150×150px</p>
                  <p className="font-semibold">256-Bit SSL</p>
                  <p className="text-sm text-muted-foreground">Bank-Level Security</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              All our preparers are licensed, bonded, and insured for your protection
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials - Professional Design */}
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
            {[
              {
                name: "Sarah Johnson",
                role: "Small Business Owner",
                location: "Austin, TX",
                content: "The CPA team was incredibly knowledgeable and helped me find deductions I didn't even know existed. Professional service from start to finish.",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Software Engineer",
                location: "San Francisco, CA",
                content: "Fast, efficient, and professional. The entire process was seamless and my CPA answered all my questions promptly.",
                rating: 5
              },
              {
                name: "Maria Garcia",
                role: "Teacher",
                location: "Miami, FL",
                content: "Best tax service I've used. They made everything easy to understand and were always available when I had questions.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-base leading-relaxed text-foreground">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center border-2 border-background">
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground">80×80px</p>
                        </div>
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

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-card rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  How quickly can I get my refund?
                </AccordionTrigger>
                <AccordionContent>
                  With direct deposit, you can receive your federal refund in as little as 24 hours after IRS acceptance. Paper checks typically take 2-3 weeks.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-card rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  What documents do I need to file?
                </AccordionTrigger>
                <AccordionContent>
                  You'll need your W-2s, 1099s, receipts for deductions, last year's tax return, and any other income or deduction documents. Our platform will guide you through everything you need.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="bg-card rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  Is my information secure?
                </AccordionTrigger>
                <AccordionContent>
                  Yes! We use bank-level 256-bit encryption and are IRS-authorized. Your data is protected with the same security standards used by major financial institutions.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="bg-card rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  What if I need help during filing?
                </AccordionTrigger>
                <AccordionContent>
                  Our CPAs are available via chat, phone, or video call. Premium plans include unlimited CPA support throughout the filing process.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="bg-card rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  Do you offer audit protection?
                </AccordionTrigger>
                <AccordionContent>
                  Yes! All our plans include free audit protection. If you're audited, we'll represent you and handle all IRS communications at no extra cost.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA - Professional Soft Sell */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left Side - Image */}
            <div className="order-2 lg:order-1">
              <div className="relative rounded-lg overflow-hidden shadow-xl bg-muted border border-border">
                <div className="aspect-[4/3] flex items-center justify-center p-12">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                      <Users className="w-12 h-12 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-muted-foreground">📸 IMAGE PLACEHOLDER</p>
                      <p className="font-bold text-lg">Modern Office or Happy Family</p>
                      <p className="text-sm text-muted-foreground">600×500px</p>
                      <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                        Warm, welcoming, professional atmosphere
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content & Form */}
            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold">Ready to Get Started?</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Schedule a free consultation with a licensed CPA. No obligation, no pressure.
                </p>
              </div>

              {/* Contact Form */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">Request Free Consultation</CardTitle>
                  <CardDescription>We'll contact you within 24 hours</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cta-name">Full Name</Label>
                    <Input id="cta-name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta-email">Email Address</Label>
                    <Input id="cta-email" type="email" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta-phone">Phone Number</Label>
                    <Input id="cta-phone" type="tel" placeholder="(555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta-time">Best Time to Call</Label>
                    <Input id="cta-time" placeholder="Morning, Afternoon, Evening" />
                  </div>
                  <Button variant="professional" size="lg" className="w-full" asChild>
                    <Link href="/start-filing">
                      Request Free Consultation
                    </Link>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    No credit card required. No obligation.
                  </p>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Licensed CPAs</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-success" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="w-4 h-4 text-success" />
                  <span>BBB A+ Rated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Section - Hiring & Referrals */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Join Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Looking for career opportunities or want to earn extra income?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Tax Preparer Opportunity */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center">
                {/* IMAGE PLACEHOLDER - Replace with actual image */}
                <div className="text-center">
                  <div className="w-32 h-32 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-16 h-16 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    [Replace with professional tax preparer image]
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Dimensions: 600x400px
                  </p>
                </div>
              </div>
              <CardHeader>
                <Badge className="w-fit bg-primary/10 text-primary border-primary/20 mb-2">
                  Career Opportunity
                </Badge>
                <CardTitle className="text-2xl">Become a Tax Preparer</CardTitle>
                <CardDescription className="text-base">
                  Join our network of professional tax preparers. Earn $45-75 per return with flexible hours and remote work.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 mr-2 text-primary mt-0.5 flex-shrink-0" />
                    <span>Flexible schedule - work when you want</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 mr-2 text-primary mt-0.5 flex-shrink-0" />
                    <span>100% remote - work from anywhere</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 mr-2 text-primary mt-0.5 flex-shrink-0" />
                    <span>Professional E&O insurance included</span>
                  </li>
                </ul>
                <Link href="/preparer">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Learn More <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Referral Program */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-64 bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-800/20 flex items-center justify-center">
                {/* IMAGE PLACEHOLDER - Replace with actual image */}
                <div className="text-center">
                  <div className="w-32 h-32 bg-yellow-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <DollarSign className="w-16 h-16 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    [Replace with people earning money image]
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Dimensions: 600x400px
                  </p>
                </div>
              </div>
              <CardHeader>
                <Badge className="w-fit bg-yellow-400/20 text-yellow-700 dark:text-yellow-400 border-yellow-400/30 mb-2">
                  Earn Extra Cash
                </Badge>
                <CardTitle className="text-2xl">Referral Program</CardTitle>
                <CardDescription className="text-base">
                  Earn up to $50 for each friend you refer. Easy money during tax season with unlimited earning potential.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Earn up to $50 per successful referral</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>No limits - refer as many people as you want</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Quick payouts within 7 days</span>
                  </li>
                </ul>
                <Link href="/referral">
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-950">
                    Join Program <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer - Professional Comprehensive Design */}
      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Top Section - 4 Columns */}
          <div className="py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Column 1 - About */}
            <div className="space-y-4">
              <Image
                src="/images/wordpress-assets/taxgenius-logo.png"
                alt="Tax Genius Pro"
                width={160}
                height={40}
                className="h-10 w-auto"
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Professional tax preparation services with licensed CPAs. Serving individuals and businesses since 1999.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  IRS Authorized
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <Award className="w-3 h-3 mr-1" />
                  BBB A+
                </Badge>
              </div>
            </div>

            {/* Column 2 - Services */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Services</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/services/personal" className="text-muted-foreground hover:text-primary transition-colors">
                    Personal Tax Filing
                  </Link>
                </li>
                <li>
                  <Link href="/services/business" className="text-muted-foreground hover:text-primary transition-colors">
                    Business Tax Services
                  </Link>
                </li>
                <li>
                  <Link href="/services/planning" className="text-muted-foreground hover:text-primary transition-colors">
                    Tax Planning & Advisory
                  </Link>
                </li>
                <li>
                  <Link href="/services/audit" className="text-muted-foreground hover:text-primary transition-colors">
                    Audit Protection
                  </Link>
                </li>
                <li>
                  <Link href="/services/resolution" className="text-muted-foreground hover:text-primary transition-colors">
                    IRS Resolution Services
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 - Resources */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/calculator" className="text-muted-foreground hover:text-primary transition-colors">
                    Tax Calculator
                  </Link>
                </li>
                <li>
                  <Link href="/guide" className="text-muted-foreground hover:text-primary transition-colors">
                    2024 Tax Guide
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                    Tax Blog & Tips
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-muted-foreground hover:text-primary transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4 - Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Contact Us</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <Link href="tel:+14046271015" className="hover:text-primary transition-colors font-medium">
                      +1 404-627-1015
                    </Link>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Globe className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="leading-relaxed">
                      1632 Jonesboro Rd SE<br />
                      Atlanta, GA 30315
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>Mon-Fri: 9AM-7PM</p>
                    <p>Sat: 10AM-5PM</p>
                    <p>Sun: Closed</p>
                  </div>
                </li>
              </ul>
              <div className="mt-6 space-y-3">
                <div className="flex gap-3">
                  <Link
                    href="https://www.facebook.com/Taxgeniusfb/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-muted hover:bg-primary/10 transition-colors rounded p-2 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </Link>
                  <Link
                    href="https://www.instagram.com/taxgeniusig/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-muted hover:bg-primary/10 transition-colors rounded p-2 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                    </svg>
                  </Link>
                  <Link
                    href="https://www.linkedin.com/company/mytaxgenius"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-muted hover:bg-primary/10 transition-colors rounded p-2 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </Link>
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/contact">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Section - Legal & Compliance */}
          <div className="border-t py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                <Link href="/security" className="hover:text-primary transition-colors">Security</Link>
                <Link href="/accessibility" className="hover:text-primary transition-colors">Accessibility</Link>
              </div>
              <div className="text-center md:text-right">
                <p>EFIN: 12-3456789 | IRS Registered</p>
                <p className="mt-1">© 2024 TaxGeniusPro. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

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