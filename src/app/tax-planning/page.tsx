'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Calendar,
  Target,
  Users,
  Shield,
  ArrowRight,
  CheckCircle,
  Phone,
  PiggyBank,
  FileText,
  BarChart3,
  Award,
  Lightbulb,
  Clock,
  DollarSign,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/header';
import Image from 'next/image';
import { ServiceFAQSection } from '@/components/services/ServiceFAQSection';
import { taxPlanningFAQs } from '@/lib/seo-llm/1-core-seo/data/service-faqs';

export default function TaxPlanningPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <Badge className="bg-primary/10 text-primary px-4 py-2">
                <Target className="w-4 h-4 mr-2" />
                Strategic Tax Planning
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold">
                Proactive Tax Planning & <span className="text-primary">Advisory Services</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Don't wait until April. Year-round strategic planning to minimize your tax burden
                and maximize wealth preservation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="professional" size="lg" asChild>
                  <Link href="/start-filing/form">Schedule Strategy Session</Link>
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
                  { icon: Clock, text: 'Year-Round Support' },
                  { icon: DollarSign, text: 'Save 20-40% on Taxes' },
                  { icon: Award, text: 'CPA Tax Strategists' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <item.icon className="w-5 h-5 text-success" />
                    <span>{item.text}</span>
                  </motion.div>
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
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                  alt="Financial planning consultation"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5, type: 'spring' }}
                  className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm border-2 border-background rounded-lg shadow-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">35%</p>
                      <p className="text-sm text-muted-foreground">Avg. Tax Savings</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Plan Year-Round */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Year-Round Planning Matters</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tax planning isn't just for April. Strategic decisions throughout the year can save
              you thousands.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Calendar,
                title: 'Quarterly Reviews',
                desc: 'Regular check-ins to optimize tax position throughout the year',
                delay: 0,
              },
              {
                icon: Lightbulb,
                title: 'Strategic Decisions',
                desc: 'Make informed choices about investments, business expenses, retirement',
                delay: 0.1,
              },
              {
                icon: DollarSign,
                title: 'Maximize Deductions',
                desc: 'Identify opportunities before year-end to reduce taxable income',
                delay: 0.2,
              },
              {
                icon: Shield,
                title: 'Risk Management',
                desc: 'Avoid penalties, estimated tax issues, and surprise tax bills',
                delay: 0.3,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: item.delay }}
                whileHover={{ y: -10, scale: 1.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-all text-center group cursor-pointer">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                      <item.icon className="w-8 h-8 text-primary" />
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

      {/* Planning Process Timeline */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Planning Process</h2>
            <p className="text-lg text-muted-foreground">
              A systematic approach to minimizing your tax liability
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                step: '1',
                title: 'Initial Discovery',
                desc: 'Deep dive into your financial situation, goals, and current tax position',
                icon: Users,
                color: 'bg-blue-500',
              },
              {
                step: '2',
                title: 'Strategy Development',
                desc: 'Create customized tax plan with specific action items and timelines',
                icon: Target,
                color: 'bg-green-500',
              },
              {
                step: '3',
                title: 'Implementation',
                desc: 'Execute strategies with guidance on timing, documentation, and compliance',
                icon: CheckCircle,
                color: 'bg-purple-500',
              },
              {
                step: '4',
                title: 'Ongoing Monitoring',
                desc: 'Quarterly reviews and adjustments based on life changes and tax law updates',
                icon: BarChart3,
                color: 'bg-orange-500',
              },
            ].map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <Card className="hover:shadow-xl transition-all group">
                  <CardContent className="p-8">
                    <div className="flex gap-6 items-start">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-16 h-16 ${phase.color} rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform`}
                        >
                          <phase.icon className="w-8 h-8" />
                        </div>
                        <div className="mt-2 text-center">
                          <Badge variant="secondary" className="font-bold">
                            Step {phase.step}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">{phase.title}</h3>
                        <p className="text-muted-foreground text-lg">{phase.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Planning Services */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">Planning Services We Offer</h2>
                <p className="text-lg text-muted-foreground">
                  Comprehensive advisory covering all aspects of tax optimization
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: PiggyBank,
                    title: 'Retirement Planning',
                    desc: 'IRA, 401(k), SEP, Solo 401(k) strategies to reduce current taxes',
                  },
                  {
                    icon: Home,
                    title: 'Real Estate Strategies',
                    desc: '1031 exchanges, rental property optimization, vacation home rules',
                  },
                  {
                    icon: TrendingUp,
                    title: 'Investment Tax Planning',
                    desc: 'Capital gains harvesting, qualified dividend strategies, wash sales',
                  },
                  {
                    icon: Users,
                    title: 'Estate & Gift Planning',
                    desc: 'Minimize estate taxes, optimize gifting, trust structures',
                  },
                  {
                    icon: FileText,
                    title: 'Business Entity Selection',
                    desc: 'LLC vs S-Corp vs C-Corp analysis for optimal tax treatment',
                  },
                  {
                    icon: Shield,
                    title: 'Multi-State Planning',
                    desc: 'Domicile strategy, state tax minimization for high earners',
                  },
                ].map((service, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex gap-4 items-start p-4 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <service.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{service.title}</h3>
                      <p className="text-muted-foreground text-sm">{service.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-lg overflow-hidden shadow-2xl group">
                <Image
                  src="https://images.unsplash.com/photo-1579532536935-619928decd08?w=700&q=80"
                  alt="Strategic planning session"
                  width={700}
                  height={900}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Planning Packages</h2>
            <p className="text-lg text-muted-foreground">
              Choose the level of support that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Essentials',
                price: '$500',
                period: '/quarter',
                features: [
                  'Quarterly tax planning calls',
                  'Estimated tax calculations',
                  'Basic strategy recommendations',
                  'Email support',
                ],
                cta: 'Get Started',
              },
              {
                name: 'Professional',
                price: '$1,200',
                period: '/quarter',
                features: [
                  'Monthly strategy sessions',
                  'Comprehensive tax modeling',
                  'Business & personal planning',
                  'Priority phone/email support',
                  'Year-end planning session',
                ],
                popular: true,
                cta: 'Most Popular',
              },
              {
                name: 'Executive',
                price: '$2,500',
                period: '/quarter',
                features: [
                  'Unlimited CPA access',
                  'Multi-entity planning',
                  'Estate & succession planning',
                  'Investment strategy review',
                  'Dedicated tax strategist',
                  'Same-day response',
                ],
                cta: 'Premium Support',
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
                  className={`h-full ${plan.popular ? 'border-2 border-primary shadow-xl scale-105' : ''}`}
                >
                  <CardHeader>
                    {plan.popular && (
                      <Badge className="w-fit mb-2 bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    )}
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-primary">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
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
                      <Link href="/start-filing/form">{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground">
              All packages include tax return preparation at no additional cost
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <ServiceFAQSection faqs={taxPlanningFAQs} />

      {/* CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-3xl lg:text-4xl font-bold">Stop Overpaying on Taxes</h2>
            <p className="text-lg text-muted-foreground">
              Schedule your free tax strategy consultation today and discover how much you could be
              saving
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="professional" size="lg" asChild>
                <Link href="/start-filing/form">
                  Schedule Free Consultation <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="tel:+14046271015">
                  <Phone className="mr-2 w-5 h-5" />
                  (404) 627-1015
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
