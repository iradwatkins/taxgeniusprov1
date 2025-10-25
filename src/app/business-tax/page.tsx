'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  TrendingUp,
  FileText,
  Users,
  Shield,
  Calculator,
  ArrowRight,
  CheckCircle,
  Phone,
  Briefcase,
  PieChart,
  DollarSign,
  Award,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/header';
import Image from 'next/image';
import { ServiceFAQSection } from '@/components/services/ServiceFAQSection';
import { businessTaxFAQs } from '@/lib/seo-llm/1-core-seo/data/service-faqs';

export default function BusinessTaxPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <Badge className="bg-primary/10 text-primary px-4 py-2">
                <Building2 className="w-4 h-4 mr-2" />
                Business Tax Services
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold">
                Expert Tax Solutions for <span className="text-primary">Your Business</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Comprehensive tax preparation and planning for small businesses, startups, and
                growing companies. Maximize deductions, minimize liability.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="professional" size="lg" asChild>
                  <Link href="/start-filing/form">Schedule Business Consultation</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="tel:+14046271015">
                    <Phone className="mr-2 w-5 h-5" />
                    (404) 627-1015
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-6 pt-4">
                {[
                  { icon: CheckCircle, text: '500+ Businesses Served' },
                  { icon: Award, text: 'IRS Authorized' },
                  { icon: Shield, text: 'Audit Protection Included' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <item.icon className="w-5 h-5 text-success" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80"
                  alt="Business professionals in modern office"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full"
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-sm border-2 border-background rounded-lg shadow-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">$25K+</p>
                      <p className="text-sm text-muted-foreground">Avg. Tax Savings</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Business Types Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">We Serve All Business Types</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Expert tax preparation for every business structure
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Users,
                title: 'Sole Proprietor',
                desc: 'Schedule C filing, self-employment tax optimization',
                color: 'text-blue-500',
                delay: 0,
              },
              {
                icon: Briefcase,
                title: 'LLC',
                desc: 'Single & multi-member LLC returns, entity election strategy',
                color: 'text-green-500',
                delay: 0.1,
              },
              {
                icon: Building2,
                title: 'S-Corporation',
                desc: 'Form 1120-S, reasonable compensation, K-1 distributions',
                color: 'text-purple-500',
                delay: 0.2,
              },
              {
                icon: TrendingUp,
                title: 'C-Corporation',
                desc: 'Form 1120, corporate tax planning, profit optimization',
                color: 'text-orange-500',
                delay: 0.3,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: item.delay }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
                  <CardHeader>
                    <div
                      className={`w-16 h-16 ${item.color} bg-primary/5 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <item.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Included */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80"
                alt="Tax professional analyzing business documents"
                width={700}
                height={500}
                className="rounded-lg shadow-xl object-cover"
              />
            </motion.div>

            <div className="space-y-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">What's Included</h2>
                <p className="text-lg text-muted-foreground">
                  Comprehensive tax services tailored to your business needs
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: FileText,
                    title: 'Federal & State Tax Returns',
                    desc: 'Complete preparation and e-filing for all entities',
                  },
                  {
                    icon: Calculator,
                    title: 'Tax Planning & Strategy',
                    desc: 'Year-round guidance to minimize tax liability',
                  },
                  {
                    icon: PieChart,
                    title: 'Quarterly Estimated Taxes',
                    desc: 'Calculate and file quarterly payments to avoid penalties',
                  },
                  {
                    icon: Shield,
                    title: 'Audit Protection',
                    desc: 'Full representation if IRS selects your return',
                  },
                  {
                    icon: DollarSign,
                    title: 'Deduction Maximization',
                    desc: 'Identify all eligible business write-offs',
                  },
                  {
                    icon: Clock,
                    title: 'Year-Round Support',
                    desc: 'Ongoing access to your CPA team',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex gap-4 items-start group"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Specializations */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Industry Expertise</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We understand the unique tax challenges of your industry
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'E-Commerce & Online Retail',
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
              },
              {
                name: 'Professional Services',
                image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
              },
              {
                name: 'Real Estate',
                image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
              },
              {
                name: 'Healthcare',
                image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
              },
              {
                name: 'Construction & Contractors',
                image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80',
              },
              {
                name: 'Restaurants & Hospitality',
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
              },
            ].map((industry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="overflow-hidden cursor-pointer group h-full">
                  <div className="relative h-48">
                    <Image
                      src={industry.image}
                      alt={industry.name}
                      width={600}
                      height={400}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-lg">{industry.name}</h3>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Business Tax Pricing</h2>
            <p className="text-lg text-muted-foreground">Transparent pricing with no hidden fees</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Sole Proprietor',
                price: '$299',
                features: [
                  'Schedule C filing',
                  'Self-employment tax',
                  'Basic deductions',
                  'E-file included',
                ],
                popular: false,
              },
              {
                name: 'LLC / S-Corp',
                price: '$799',
                features: [
                  'Form 1065/1120-S',
                  'K-1 preparation',
                  'Payroll tax review',
                  'Quarterly estimates',
                  'Audit protection',
                ],
                popular: true,
              },
              {
                name: 'C-Corporation',
                price: '$1,299',
                features: [
                  'Form 1120',
                  'Corporate tax planning',
                  'Multi-state filing',
                  'Tax strategy consulting',
                  'Priority support',
                ],
                popular: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -10 }}
              >
                <Card
                  className={`h-full ${plan.popular ? 'border-2 border-primary shadow-xl' : ''}`}
                >
                  <CardHeader>
                    {plan.popular && (
                      <Badge className="w-fit mb-2 bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    )}
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold text-primary mt-4">{plan.price}</div>
                    <p className="text-sm text-muted-foreground">Starting price</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={plan.popular ? 'professional' : 'outline'}
                      className="w-full"
                      asChild
                    >
                      <Link href="/start-filing/form">Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <ServiceFAQSection faqs={businessTaxFAQs} />

      {/* CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Optimize Your Business Taxes?
            </h2>
            <p className="text-lg text-muted-foreground">
              Schedule a free consultation with a business tax specialist today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="professional" size="lg" asChild>
                <Link href="/start-filing/form">
                  Schedule Consultation <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="tel:+14046271015">
                  <Phone className="mr-2 w-5 h-5" />
                  Call Now
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
