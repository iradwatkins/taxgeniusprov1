'use client';

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Home, DollarSign, CheckCircle, ArrowRight, Shield, TrendingUp, Clock, Award, Phone } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/header';
import Image from 'next/image';

export default function PersonalTaxFilingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary">Professional Tax Preparation</Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">Personal Tax <span className="text-primary">Filing Made Simple</span></h1>
            <p className="text-xl text-muted-foreground mb-8">Expert CPAs handle your personal tax return from start to finish. Maximum refund guaranteed.</p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild><Link href="/start-filing">Get Started Today <ArrowRight className="ml-2 w-5 h-5" /></Link></Button>
              <Button size="lg" variant="outline" asChild><Link href="/contact"><Phone className="mr-2 w-5 h-5" />Talk to a Tax Pro</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What's Included</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: FileText, title: 'Simple Returns', desc: 'W-2 income, standard deduction' },
              { icon: Home, title: 'Homeowners', desc: 'Mortgage interest, property taxes' },
              { icon: Users, title: 'Families', desc: 'Child tax credit, dependent care' },
              { icon: DollarSign, title: 'Investments', desc: 'Stocks, bonds, dividends' },
              { icon: TrendingUp, title: 'Retirement', desc: 'IRA, 401(k), Social Security' },
              { icon: Shield, title: 'Audit Protection', desc: 'Full IRS audit defense included' }
            ].map((item, i) => (
              <Card key={i} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <item.icon className="w-10 h-10 text-primary mb-4" />
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent><p className="text-muted-foreground">{item.desc}</p></CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Transparent Pricing</h2>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground mb-2">Basic</p><p className="text-4xl font-bold text-primary mb-2">$149</p><p className="text-sm">Simple W-2 returns</p></CardContent></Card>
              <Card className="border-2 border-primary"><CardContent className="pt-6"><Badge className="mb-2">Most Popular</Badge><p className="text-sm text-muted-foreground mb-2">Standard</p><p className="text-4xl font-bold text-primary mb-2">$249</p><p className="text-sm">Itemized deductions, credits</p></CardContent></Card>
              <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground mb-2">Complex</p><p className="text-4xl font-bold text-primary mb-2">$399+</p><p className="text-sm">Investments, rental property</p></CardContent></Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to File Your Taxes?</h2>
            <p className="text-lg text-muted-foreground mb-8">Join 100,000+ satisfied clients. File with confidence.</p>
            <Button size="lg" asChild><Link href="/start-filing">Start Your Return <ArrowRight className="ml-2 w-5 h-5" /></Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
