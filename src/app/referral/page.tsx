'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  DollarSign,
  Users,
  TrendingUp,
  Gift,
  Share2,
  Wallet,
  Clock,
  CheckCircle,
  Smartphone,
  Mail,
  MessageCircle,
  BarChart3,
  Award,
  Zap
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ReferralPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm shadow-md">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost">Back to Home</Button>
              </Link>
              <Link href="/auth/signup?role=client">
                <Button className="bg-primary hover:bg-primary/90">
                  Join Now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="text-center text-white space-y-8 max-w-4xl mx-auto">
            <Badge className="bg-yellow-400 text-blue-900 border-0 text-base px-4 py-2">
              <Gift className="w-4 h-4 mr-1" />
              Earn Extra Money During Tax Season
            </Badge>

            <h1 className="text-4xl lg:text-7xl font-bold leading-tight">
              Get a Cash Bonus up to <span className="text-yellow-400">$50</span>
            </h1>

            <p className="text-2xl lg:text-3xl">
              For Each Friend You Refer*
            </p>

            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Earn up to $50 for each friend who completes their tax return with us. It's easy money during tax season!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/auth/signup?role=client">
                <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 text-lg px-8 shadow-xl hover:scale-105 transition-transform">
                  Start Referring Now <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 border-2 border-white text-white hover:bg-white/10">
                How It Works
              </Button>
            </div>

            {/* Hero Image Placeholder */}
            <div className="mt-12 max-w-3xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="aspect-video flex items-center justify-center p-12">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-yellow-400/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Gift className="w-16 h-16 text-yellow-400" />
                    </div>
                    <p className="text-lg font-semibold text-white mb-2">
                      [Replace with referral hero image]
                    </p>
                    <p className="text-sm text-white/80">
                      Recommended: 1200x675px (16:9)
                    </p>
                    <p className="text-xs text-white/70 mt-2">
                      Suggestion: Happy people receiving money, friends celebrating, or mobile app screenshot
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm opacity-75 pt-4">*Terms and conditions apply</p>
          </div>
        </div>
      </section>

      {/* How Much Can You Earn */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">How Much Can You Earn?</h2>
            <p className="text-xl text-muted-foreground">The more you refer, the more you earn</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                referrals: "5 Referrals",
                amount: "$250",
                description: "Part-time income"
              },
              {
                referrals: "10 Referrals",
                amount: "$500",
                description: "Nice bonus",
                highlight: true
              },
              {
                referrals: "20+ Referrals",
                amount: "$1,000+",
                description: "Serious earnings"
              }
            ].map((tier, index) => (
              <Card key={index} className={`text-center ${tier.highlight ? 'border-primary border-2 shadow-xl scale-105' : ''}`}>
                <CardHeader>
                  {tier.highlight && (
                    <Badge className="w-fit mx-auto mb-2 bg-primary">Most Popular</Badge>
                  )}
                  <CardTitle className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                    {tier.amount}
                  </CardTitle>
                  <CardDescription className="text-lg">{tier.referrals}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{tier.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl lg:text-5xl font-bold text-center mb-12">
            How It Works - Simple as 1, 2, 3
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                icon: Share2,
                title: "Share Your Link",
                description: "Get your unique referral link and share it with friends, family, and on social media"
              },
              {
                step: "2",
                icon: Users,
                title: "They File Their Taxes",
                description: "Your friends use your link to sign up and complete their tax return with us"
              },
              {
                step: "3",
                icon: Wallet,
                title: "You Get Paid",
                description: "Earn up to $50 per referral, paid directly to your account. No limits!"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <item.icon className="w-10 h-10 text-primary" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-lg">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Why Join Our Referral Program?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: DollarSign,
                title: "High Payouts",
                description: "Earn up to $50 per successful referral"
              },
              {
                icon: Zap,
                title: "No Limits",
                description: "Refer as many people as you want - unlimited earning potential"
              },
              {
                icon: Clock,
                title: "Quick Payments",
                description: "Get paid within 7 days of successful referral"
              },
              {
                icon: BarChart3,
                title: "Track Everything",
                description: "Real-time dashboard to track all your referrals and earnings"
              },
              {
                icon: Smartphone,
                title: "Easy Sharing",
                description: "Share via text, email, social media, or messaging apps"
              },
              {
                icon: Award,
                title: "Bonus Rewards",
                description: "Extra bonuses for top referrers each month"
              },
              {
                icon: TrendingUp,
                title: "Passive Income",
                description: "Earn money without any ongoing work"
              },
              {
                icon: Gift,
                title: "Friends Save Too",
                description: "Your friends get special discounts when they use your link"
              }
            ].map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Share */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl lg:text-5xl font-bold text-center mb-12">
            Easy Ways to Share
          </h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: MessageCircle,
                title: "Social Media",
                description: "Post your link on Facebook, Instagram, Twitter, TikTok"
              },
              {
                icon: Mail,
                title: "Email & Text",
                description: "Send to your contacts via email or SMS"
              },
              {
                icon: Users,
                title: "Word of Mouth",
                description: "Tell friends, family, coworkers about the benefits"
              }
            ].map((method, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <method.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>{method.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{method.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold text-center mb-12">
              Common Questions
            </h2>

            <div className="space-y-4">
              {[
                {
                  question: "How much can I earn per referral?",
                  answer: "You can earn up to $50 per successful referral. The exact amount depends on the tax package your referral purchases."
                },
                {
                  question: "Is there a limit to how many people I can refer?",
                  answer: "No! There's no limit. Refer as many people as you want and earn unlimited income."
                },
                {
                  question: "When do I get paid?",
                  answer: "You'll receive payment within 7 days after your referral successfully completes their tax return and payment."
                },
                {
                  question: "How do I track my referrals?",
                  answer: "You'll have access to a real-time dashboard showing all your referrals, their status, and your earnings."
                },
                {
                  question: "Can I refer my own family members?",
                  answer: "Yes! You can refer anyone - friends, family, coworkers, or anyone who needs tax help."
                }
              ].map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-start text-lg">
                      <CheckCircle className="w-5 h-5 mr-2 text-primary mt-0.5 flex-shrink-0" />
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground ml-7">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-800 border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />
            <CardContent className="p-12 text-center relative">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white">
                Ready to Start Earning?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of people earning extra money by referring friends to Tax Genius Pro
              </p>
              <Link href="/auth/signup?role=client">
                <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 text-lg px-8 shadow-xl hover:scale-105 transition-transform">
                  Get Your Referral Link <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Badge variant="secondary" className="px-3 py-1 bg-white/20 text-white border-white/30">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Up to $50 per referral
                </Badge>
                <Badge variant="secondary" className="px-3 py-1 bg-white/20 text-white border-white/30">
                  <Zap className="w-4 h-4 mr-1" />
                  No limits
                </Badge>
                <Badge variant="secondary" className="px-3 py-1 bg-white/20 text-white border-white/30">
                  <Clock className="w-4 h-4 mr-1" />
                  Quick payouts
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <Link href="/">
            <Image
              src="/images/wordpress-assets/taxgenius-logo.png"
              alt="Tax Genius Pro"
              width={150}
              height={40}
              className="h-10 w-auto mx-auto mb-4"
            />
          </Link>
          <p className="text-sm text-muted-foreground mb-2">
            © 2024 Tax Genius Pro. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            *Referral bonuses are paid when referred customers complete their tax return and payment.
            Bonus amounts vary by package selected. See full terms and conditions.
          </p>
        </div>
      </footer>
    </div>
  );
}
