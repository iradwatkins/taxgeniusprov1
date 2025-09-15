'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Users, TrendingUp, Shield, Star, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              About Tax Genius Pro
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Your Trusted Tax <span className="text-primary">Partners</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              For over a decade, Tax Genius Pro has been helping individuals and businesses
              navigate the complex world of taxes with expertise, integrity, and personalized service.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
              <p className="text-muted-foreground">Happy Clients</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <p className="text-muted-foreground">Years Experience</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">$2.5B+</div>
              <p className="text-muted-foreground">In Refunds Processed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">4.9/5</div>
              <p className="text-muted-foreground">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2010, Tax Genius Pro began with a simple mission: to make tax
                  preparation accessible, accurate, and stress-free for everyone. What started
                  as a small local practice has grown into one of the nation's most trusted
                  tax preparation services.
                </p>
                <p>
                  Our team of certified tax professionals combines decades of experience with
                  cutting-edge technology to deliver exceptional results. We've helped thousands
                  of clients maximize their refunds while ensuring full compliance with ever-changing
                  tax regulations.
                </p>
                <p>
                  Today, we serve clients across all 50 states, offering both in-person and
                  virtual consultations to meet you wherever you are in your tax journey.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/wordpress-assets/consultation.jpg"
                alt="Tax consultation"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do at Tax Genius Pro
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We maintain the highest ethical standards in all our practices.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We strive for perfection in every tax return we prepare.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your success and satisfaction are our top priorities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We embrace technology to improve your experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our certified professionals are here to guide you through every step
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Sarah Johnson, CPA</h3>
                  <p className="text-primary mb-2">Lead Tax Strategist</p>
                  <p className="text-sm text-muted-foreground">
                    15+ years experience in complex tax planning and business consulting
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Michael Chen, EA</h3>
                  <p className="text-primary mb-2">Senior Tax Advisor</p>
                  <p className="text-sm text-muted-foreground">
                    Enrolled Agent specializing in IRS representation and audit defense
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Star className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Amanda Rodriguez</h3>
                  <p className="text-primary mb-2">Client Success Manager</p>
                  <p className="text-sm text-muted-foreground">
                    Ensuring every client receives personalized, exceptional service
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Ready to Experience the Tax Genius Difference?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of satisfied clients who trust us with their tax needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started Today
              </Button>
              <Button size="lg" variant="outline">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}