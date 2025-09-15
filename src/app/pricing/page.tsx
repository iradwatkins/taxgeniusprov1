'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Star,
  Zap,
  Shield,
  Award,
  Users,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { Header } from '@/components/header';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              Transparent Pricing
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Simple, Fair <span className="text-primary">Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              No hidden fees, no surprises. Choose the plan that fits your tax situation
              and get expert preparation at an affordable price.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Basic Individual */}
            <Card className="relative hover:shadow-xl transition-all">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-2xl">Basic Individual</CardTitle>
                  <Badge variant="secondary">Most Popular</Badge>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary">$149</span>
                  <span className="text-muted-foreground ml-2">per return</span>
                </div>
                <CardDescription>
                  Perfect for simple tax situations with W-2 income
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">W-2 and 1099 income reporting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Standard or itemized deductions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Basic investment income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">E-filing included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Audit protection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Maximum refund guarantee</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Premium Individual */}
            <Card className="relative hover:shadow-xl transition-all border-primary/50">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-6 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Recommended
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Premium Individual</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary">$249</span>
                  <span className="text-muted-foreground ml-2">per return</span>
                </div>
                <CardDescription>
                  For complex situations with multiple income sources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Everything in Basic plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Rental property income/losses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Self-employment income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Stock sales and capital gains</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Education credits and deductions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Priority support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Tax planning consultation</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Business */}
            <Card className="relative hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-2xl">Business</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary">$399</span>
                  <span className="text-muted-foreground ml-2">starting at</span>
                </div>
                <CardDescription>
                  Comprehensive business tax preparation and planning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">LLC, S-Corp, C-Corp, Partnership</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Business expense optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Quarterly estimated payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Payroll tax assistance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Business tax planning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Dedicated business advisor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-sm">Year-round support</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Get Quote <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
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
              Enhance your tax preparation with these optional services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Express Service</h3>
                <p className="text-2xl font-bold text-primary mb-2">+$50</p>
                <p className="text-sm text-muted-foreground">
                  24-hour guaranteed turnaround
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <DollarSign className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Tax Advance</h3>
                <p className="text-2xl font-bold text-primary mb-2">2.9% APR</p>
                <p className="text-sm text-muted-foreground">
                  Get your refund in 1-2 days
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Audit Defense+</h3>
                <p className="text-2xl font-bold text-primary mb-2">+$99</p>
                <p className="text-sm text-muted-foreground">
                  Enhanced audit protection coverage
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <Award className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Tax Planning</h3>
                <p className="text-2xl font-bold text-primary mb-2">$149</p>
                <p className="text-sm text-muted-foreground">
                  Year-round tax strategy session
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Our Guarantees
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Maximum Refund</h3>
                <p className="text-sm text-muted-foreground">
                  We find every deduction you're entitled to
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">100% Accurate</h3>
                <p className="text-sm text-muted-foreground">
                  If we make an error, we fix it for free
                </p>
              </div>
              <div className="text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Satisfaction</h3>
                <p className="text-sm text-muted-foreground">
                  Not happy? We'll make it right or refund
                </p>
              </div>
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              Join over 50,000 satisfied customers who trust Tax Genius Pro
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Your Return Today <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}