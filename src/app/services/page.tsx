'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Building,
  Home,
  DollarSign,
  Shield,
  Users,
  Calculator,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Zap,
  Award
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              Professional Tax Services
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Complete Tax <span className="text-primary">Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              From individual returns to complex business filings, our certified professionals
              handle all your tax needs with precision and care.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Individual Tax Returns */}
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all">
              <CardHeader>
                <FileText className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-xl">Individual Tax Returns</CardTitle>
                <CardDescription>
                  Personal tax preparation for individuals and families
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Standard & Itemized Deductions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Multiple Income Sources</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Investment & Retirement Planning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Education Credits & Deductions</span>
                  </div>
                </div>
                <div className="pt-4">
                  <p className="text-2xl font-bold text-primary mb-2">Starting at $149</p>
                  <Button className="w-full">Get Started</Button>
                </div>
              </CardContent>
            </Card>

            {/* Business Tax Returns */}
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all">
              <CardHeader>
                <Building className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-xl">Business Tax Returns</CardTitle>
                <CardDescription>
                  Comprehensive business tax services for all entity types
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">LLC, Corp, Partnership Returns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Self-Employment Tax</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Quarterly Estimated Payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Business Deduction Optimization</span>
                  </div>
                </div>
                <div className="pt-4">
                  <p className="text-2xl font-bold text-primary mb-2">Starting at $299</p>
                  <Button className="w-full">Get Started</Button>
                </div>
              </CardContent>
            </Card>

            {/* Real Estate Professional */}
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all">
              <CardHeader>
                <Home className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-xl">Real Estate Professional</CardTitle>
                <CardDescription>
                  Specialized services for real estate agents and investors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Real Estate Professional Status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Rental Property Optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">1031 Exchange Planning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">Depreciation Strategies</span>
                  </div>
                </div>
                <div className="pt-4">
                  <p className="text-2xl font-bold text-primary mb-2">Starting at $399</p>
                  <Button className="w-full">Get Started</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Additional Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tax solutions to meet all your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <DollarSign className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Tax Advance Loans</h3>
                <p className="text-sm text-muted-foreground">
                  Get your refund faster with our advance loan program
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Audit Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Full audit defense and IRS representation services
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <Calculator className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Tax Planning</h3>
                <p className="text-sm text-muted-foreground">
                  Year-round tax planning and strategy sessions
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Prior Year Returns</h3>
                <p className="text-sm text-muted-foreground">
                  Amended returns and back-filing services
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process makes tax preparation simple and stress-free
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Upload Documents</h3>
              <p className="text-muted-foreground">
                Securely upload your tax documents through our encrypted portal
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Expert Review</h3>
              <p className="text-muted-foreground">
                Our certified professionals review and prepare your return
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Quality Check</h3>
              <p className="text-muted-foreground">
                Multiple quality checks ensure accuracy and maximum refund
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">E-File & Track</h3>
              <p className="text-muted-foreground">
                E-file your return and track your refund status in real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Why Choose Tax Genius Pro?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Award className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Certified Professionals</h3>
                    <p className="text-muted-foreground">
                      Our team includes CPAs, EAs, and tax experts with decades of experience
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <TrendingUp className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Maximum Refund Guarantee</h3>
                    <p className="text-muted-foreground">
                      We find every deduction and credit you're entitled to
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Zap className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Fast & Accurate</h3>
                    <p className="text-muted-foreground">
                      Quick turnaround times with 99.9% accuracy rate
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Audit Protection</h3>
                    <p className="text-muted-foreground">
                      Full audit defense included with every return we prepare
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/wordpress-assets/tax-pro-illustration-4-5-star-rating.png"
                alt="Tax professional"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Ready to Maximize Your Refund?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands who trust Tax Genius Pro for their tax needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Your Return <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">
                <Link href="/contact">Get Free Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}