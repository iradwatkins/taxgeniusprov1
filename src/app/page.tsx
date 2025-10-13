'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
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

// Animated counter component
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: 2000 })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [isInView, motionValue, value])

  useEffect(() => {
    springValue.on('change', (latest) => {
      setDisplayValue(Math.floor(latest))
    })
  }, [springValue])

  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}{suffix}
    </span>
  )
}

// Typing animation component
function TypingText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState('')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const hasStarted = useRef(false)

  useEffect(() => {
    if (isInView && !hasStarted.current) {
      hasStarted.current = true
      let currentIndex = 0

      const timeout = setTimeout(() => {
        const intervalId = setInterval(() => {
          currentIndex++
          setDisplayText(text.slice(0, currentIndex))

          if (currentIndex > text.length) {
            clearInterval(intervalId)
          }
        }, 30)

        return () => clearInterval(intervalId)
      }, delay)

      return () => clearTimeout(timeout)
    }
  }, [isInView, text, delay])

  return <span ref={ref}>{displayText}</span>
}

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
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
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
            </motion.div>

            {/* Right Column - Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=80"
                  alt="Professional tax advisor helping client"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full"
                />
                {/* Floating Stats Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border-2 border-background rounded-lg shadow-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold"><AnimatedCounter value={50000} suffix="+" /></p>
                      <p className="text-sm text-muted-foreground">Happy Clients</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Logos Bar */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-8 border-y bg-card"
      >
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
      </motion.section>

      {/* Services Section - Professional 3-Column Grid */}
      <section id="services" className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Tax Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional tax solutions tailored to your needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Personal Tax Filing Service */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              whileHover={{ y: -10 }}
            >
            <Card className="hover:shadow-lg transition-all duration-200 group overflow-hidden h-full cursor-pointer">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80"
                  alt="Personal tax filing"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Personal Tax Filing</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Professional preparation for individuals and families. We handle W-2s, deductions, and credits.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/services/personal">
                    Learn More
                  </Link>
                </Button>
              </CardContent>
            </Card>
            </motion.div>

            {/* Business Tax Services */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -10 }}
            >
            <Card className="hover:shadow-lg transition-all duration-200 group overflow-hidden border-primary/20 h-full cursor-pointer">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80"
                  alt="Business tax services"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <Badge className="bg-blue-600 text-white">For Businesses</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Business Tax Services</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Comprehensive tax preparation and planning for small businesses, LLCs, and S-Corps.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/services/business">
                    Learn More
                  </Link>
                </Button>
              </CardContent>
            </Card>
            </motion.div>

            {/* Tax Planning & Advisory */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -10 }}
            >
            <Card className="hover:shadow-lg transition-all duration-200 group overflow-hidden h-full cursor-pointer">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80"
                  alt="Tax planning and advisory"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <Badge className="bg-purple-600 text-white">Expert Advice</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Tax Planning & Advisory</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Year-round strategic tax planning to minimize liability and maximize savings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/services/planning">
                    Learn More
                  </Link>
                </Button>
              </CardContent>
            </Card>
            </motion.div>
          </div>

          {/* Additional Services Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground">All services include free audit protection and year-round support</p>
          </motion.div>
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
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="text-center relative"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6 relative"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border-4 border-background shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <Calendar className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  1
                </div>
              </motion.div>
              <h3 className="text-lg font-semibold mb-3">Book Consultation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Schedule a free 30-minute consultation with a licensed CPA
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center relative"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200 }}
                className="mb-6 relative"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border-4 border-background shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  2
                </div>
              </motion.div>
              <h3 className="text-lg font-semibold mb-3">Upload Documents</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Securely upload W-2s, 1099s, and receipts through our portal
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center relative"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 200 }}
                className="mb-6 relative"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border-4 border-background shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <UserCheck className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  3
                </div>
              </motion.div>
              <h3 className="text-lg font-semibold mb-3">Expert Review</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                CPA finds all eligible deductions and prepares your return
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center relative"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8, type: "spring", stiffness: 200 }}
                className="mb-6 relative"
              >
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto border-4 border-background shadow-lg hover:scale-110 transition-transform cursor-pointer">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-success text-success-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  4
                </div>
              </motion.div>
              <h3 className="text-lg font-semibold mb-3">File & Relax</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We handle IRS submission and track your refund status
              </p>
            </motion.div>
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
            ].map((testimonial, index) => (
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
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=700&q=80"
                  alt="Professional working on laptop"
                  width={700}
                  height={400}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1">
                    $45-75 per return
                  </Badge>
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
            </motion.div>

            {/* Referral Program */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=700&q=80"
                  alt="People celebrating success"
                  width={700}
                  height={400}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-yellow-500 text-yellow-950 text-sm px-3 py-1">
                    Up to $50 per referral
                  </Badge>
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
            </motion.div>
          </div>
        </div>
      </section>

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