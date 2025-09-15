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

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [countdown, setCountdown] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [liveCount, setLiveCount] = useState(1247);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate live count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 5));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const calculateRefund = () => {
    const income = parseFloat(refundAmount) || 0;
    const estimatedRefund = Math.max(0, income * 0.15 - 2000);
    return estimatedRefund.toFixed(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Special Offer Banner */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center">
        <p className="text-sm font-bold animate-pulse">
          ⚡ Tax Season Special - Save $100 Today! Ends In: {countdown.hours}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')} ⚡
        </p>
      </div>

      {/* Header */}
      <header className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/95 backdrop-blur-sm shadow-md" : "bg-transparent"
      )}>
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Image
                src="/images/wordpress-assets/taxgenius-logo.png"
                alt="Tax Genius Pro"
                width={200}
                height={50}
                className="h-12 w-auto"
                priority
              />
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

      {/* Hero Section with WordPress Design */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center rounded-full bg-primary/10 text-primary border border-primary/20 px-4 py-2">
                <Star className="w-4 h-4 mr-1 fill-primary" />
                <span className="font-semibold">4.9/5 Rating from 50,000+ Customers</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Get Your <span className="text-primary">Maximum Refund</span> Guaranteed
                </h1>
                <p className="text-xl text-muted-foreground">
                  File your taxes with confidence. Our expert CPAs ensure you get every deduction you deserve. Average refund: $3,259
                </p>
              </div>

              {/* Live Counter */}
              <div className="flex items-center bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full w-fit">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                LIVE: {liveCount.toLocaleString()} people got cash in the last hour
              </div>

              {/* Quick Calculator */}
              <Card className="border-primary/20 bg-card/50 backdrop-blur shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-primary" />
                    Quick Refund Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Enter your income"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      className="flex-1"
                    />
                    <Button className="bg-primary hover:bg-primary/90">
                      Calculate
                    </Button>
                  </div>
                  {refundAmount && (
                    <p className="mt-3 text-2xl font-bold text-primary animate-in fade-in">
                      Estimated Refund: ${calculateRefund()}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 shadow-xl hover:scale-105 transition-transform">
                  Start Free Filing <ArrowRight className="ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                  <Phone className="mr-2" /> (888) TAX-HELP
                </Button>
              </div>

              {/* Trust Logos */}
              <div className="flex items-center gap-6 pt-4">
                <Image src="/images/wordpress-assets/logo-forbes.png" alt="Forbes" width={80} height={30} className="opacity-60 hover:opacity-100 transition-opacity" />
                <Image src="/images/wordpress-assets/logo-yahoo.png" alt="Yahoo" width={80} height={30} className="opacity-60 hover:opacity-100 transition-opacity" />
                <Badge variant="secondary" className="px-3 py-1">
                  <Shield className="w-4 h-4 mr-1" />
                  IRS Authorized
                </Badge>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/wordpress-assets/tax-pro-illustration-4-5-star-rating.png"
                  alt="Tax Professional"
                  width={600}
                  height={600}
                  className="w-full h-auto"
                  priority
                />
              </div>
              {/* Floating Stats */}
              <Card className="absolute -bottom-6 -left-6 bg-white dark:bg-card shadow-xl animate-in slide-in-from-left">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">$7,259</p>
                      <p className="text-sm text-muted-foreground">Max Refund This Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Our Tax Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive tax solutions for individuals and businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FileText,
                title: "Personal Tax Filing",
                description: "Simple & accurate tax filing for W-2 employees",
                price: "Starting at $49"
              },
              {
                icon: Calculator,
                title: "Self-Employed",
                description: "Maximize deductions for 1099 contractors",
                price: "Starting at $99"
              },
              {
                icon: HandshakeIcon,
                title: "Business Tax",
                description: "Complete business tax preparation & planning",
                price: "Starting at $199"
              },
              {
                icon: Shield,
                title: "Audit Protection",
                description: "Full IRS audit defense & representation",
                price: "Included Free"
              }
            ].map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader>
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="mt-2">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-primary">{service.price}</p>
                  <Button className="w-full mt-4" variant="outline">
                    Learn More <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section id="process" className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Get your refund in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: Upload,
                title: "Upload Documents",
                description: "Securely upload your W-2s and tax documents",
                time: "30 seconds"
              },
              {
                step: "2",
                icon: UserCheck,
                title: "Expert Review",
                description: "CPA reviews and maximizes your deductions",
                time: "Instant"
              },
              {
                step: "3",
                icon: Banknote,
                title: "Get Your Refund",
                description: "Receive your refund in as fast as 24 hours",
                time: "Same day"
              }
            ].map((item, index) => (
              <div key={index} className="relative group">
                {index < 2 && (
                  <div className="hidden lg:block absolute top-20 left-full w-full h-1 bg-gradient-to-r from-primary to-primary/30 -z-10 transform translate-y-1/2" />
                )}
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-12 h-12 text-primary" />
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
                    <Zap className="w-3 h-3 mr-1" />
                    {item.time}
                  </Badge>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-xl">
              Start Your Free Tax Filing <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Referral Program Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="text-center text-white space-y-6">
            <h2 className="text-3xl lg:text-5xl font-bold">Refer Your Friends</h2>
            <p className="text-4xl lg:text-7xl font-bold">
              Get a Cash Bonus up to <span className="text-yellow-400">$50</span>
            </p>
            <p className="text-xl opacity-90">Each Referral*</p>
            <p className="text-lg max-w-2xl mx-auto opacity-90">
              Earn up to $50 for each friend who does their taxes with us.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:scale-105 transition-transform">
              Start Referring Now <ArrowRight className="ml-2" />
            </Button>
            <p className="text-sm opacity-75">*Terms and conditions apply</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Why Choose Tax Genius Pro?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built with security, speed, and your success in mind
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Instant Approval",
                description: "Get your decision in seconds, not days",
                stat: "2 min avg"
              },
              {
                icon: Shield,
                title: "Bank-Level Security",
                description: "Your data is always protected with 256-bit encryption",
                stat: "100% Secure"
              },
              {
                icon: Phone,
                title: "24/7 Support",
                description: "Expert CPAs available whenever you need help",
                stat: "24/7 Live"
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{feature.title}</CardTitle>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {feature.stat}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">Bank-Level Security</h3>
              <p className="text-sm text-muted-foreground">256-bit encryption</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">Trusted by Thousands</h3>
              <p className="text-sm text-muted-foreground">50,000+ happy customers</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg">Fast Growing</h3>
              <p className="text-sm text-muted-foreground">99.2% approval rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Real People, Real Results</h2>
            <div className="flex justify-center items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-primary text-primary" />
              ))}
              <span className="text-xl font-semibold ml-2">4.9/5</span>
            </div>
            <p className="text-muted-foreground">Based on 50,000+ reviews</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Small Business Owner",
                content: "Got $5,432 more than last year! The CPA found deductions I never knew existed.",
                rating: 5,
                refund: "$5,432"
              },
              {
                name: "Michael Chen",
                role: "Software Engineer",
                content: "Fast, easy, and professional. Received my refund in just 3 days!",
                rating: 5,
                refund: "$3,200"
              },
              {
                name: "Maria Garcia",
                role: "Teacher",
                content: "Best tax service I've ever used. Highly recommend to everyone!",
                rating: 5,
                refund: "$2,100"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-base">"{testimonial.content}"</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      {testimonial.refund}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
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

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <CardContent className="p-12 text-center relative">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                Ready to Get Your Maximum Refund?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join 50,000+ satisfied customers who trust us with their taxes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 shadow-xl hover:scale-105 transition-transform">
                  Start Free Filing Now <ArrowRight className="ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                  Schedule Consultation <Calendar className="ml-2" />
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Badge variant="secondary" className="px-3 py-1">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  No Credit Card Required
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  <Shield className="w-4 h-4 mr-1" />
                  100% Accuracy Guarantee
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Maximum Refund Guarantee
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/images/wordpress-assets/taxgenius-logo.png"
                alt="Tax Genius Pro"
                width={150}
                height={40}
                className="h-10 w-auto mb-4"
              />
              <p className="text-sm text-muted-foreground">
                Professional tax services with maximum refund guarantee.
              </p>
              <div className="flex gap-2 mt-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Award className="w-3 h-3 mr-1" />
                  IRS Authorized
                </Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Personal Tax</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Business Tax</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Tax Planning</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">IRS Resolution</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Tax Calculator</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Tax Guide 2024</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Support Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center"><Phone className="w-4 h-4 mr-2" />1-888-TAX-HELP</li>
                <li>support@taxgeniuspro.com</li>
                <li>Mon-Fri: 8AM-8PM EST</li>
                <li>Sat-Sun: 9AM-5PM EST</li>
              </ul>
              <Button className="mt-4 w-full" variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Live Chat
              </Button>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Tax Genius Pro. All rights reserved. | Privacy Policy | Terms of Service | Security</p>
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