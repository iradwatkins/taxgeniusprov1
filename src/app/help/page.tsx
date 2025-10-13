'use client';

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  HelpCircle,
  Search,
  Phone,
  Mail,
  MessageCircle,
  FileText,
  CreditCard,
  Shield,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Book,
  Calculator,
  AlertCircle,
  Video,
  Headphones
} from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/header';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const helpCategories = [
  {
    icon: FileText,
    title: 'Filing Your Return',
    desc: 'Getting started, uploading documents, filing status',
    articles: 12,
    color: 'text-blue-500'
  },
  {
    icon: CreditCard,
    title: 'Payments & Pricing',
    desc: 'Payment methods, refunds, pricing questions',
    articles: 8,
    color: 'text-green-500'
  },
  {
    icon: Shield,
    title: 'Security & Privacy',
    desc: 'Data protection, account security, privacy policy',
    articles: 6,
    color: 'text-purple-500'
  },
  {
    icon: Users,
    title: 'Working with CPAs',
    desc: 'Communication, document requests, consultation',
    articles: 10,
    color: 'text-orange-500'
  },
  {
    icon: Calculator,
    title: 'Deductions & Credits',
    desc: 'What you can claim, documentation needed',
    articles: 15,
    color: 'text-pink-500'
  },
  {
    icon: AlertCircle,
    title: 'IRS Issues',
    desc: 'Notices, audits, payment plans, resolution',
    articles: 9,
    color: 'text-red-500'
  }
];

const popularArticles = [
  { title: 'How do I upload my tax documents?', views: '12.5K' },
  { title: 'When will I receive my refund?', views: '10.2K' },
  { title: 'What documents do I need to file?', views: '9.8K' },
  { title: 'How do I contact my assigned CPA?', views: '8.4K' },
  { title: 'Can I amend my tax return after filing?', views: '7.9K' },
  { title: 'What payment methods do you accept?', views: '6.5K' }
];

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How long does it take to file my taxes?',
        a: 'Most returns are completed within 3-5 business days after you submit all required documents. Complex returns (business, investments, rental property) may take 5-7 days. Rush service is available for urgent situations.'
      },
      {
        q: 'What documents do I need to file?',
        a: 'You\'ll need W-2s from employers, 1099 forms for other income, receipts for deductions, last year\'s tax return, and any relevant tax documents like 1098 (mortgage interest), 1095-A (health insurance), etc. Your CPA will provide a personalized checklist.'
      },
      {
        q: 'Can I file taxes from any state?',
        a: 'Yes! We prepare federal and state returns for all 50 states. Our CPAs are licensed and experienced with multi-state filings, including part-year resident returns.'
      }
    ]
  },
  {
    category: 'Payments & Refunds',
    questions: [
      {
        q: 'When do I pay for tax preparation?',
        a: 'You pay after your return is completed and you\'ve reviewed and approved it. We don\'t charge until you\'re 100% satisfied. Payment is due before we file with the IRS.'
      },
      {
        q: 'How quickly will I get my refund?',
        a: 'With direct deposit, federal refunds typically arrive in 7-21 days after IRS acceptance. Paper check refunds take 2-4 weeks longer. We track your refund status and notify you of updates.'
      },
      {
        q: 'Do you offer refund advances?',
        a: 'Yes! Eligible clients can receive their refund in 24 hours with our instant refund advance program. Approval and loan amount depend on your expected refund and credit check.'
      }
    ]
  },
  {
    category: 'CPA Services',
    questions: [
      {
        q: 'Will I work with the same CPA?',
        a: 'Yes. You\'re assigned a dedicated CPA who handles your return from start to finish. They\'re available year-round for questions and become familiar with your tax situation.'
      },
      {
        q: 'How do I communicate with my CPA?',
        a: 'You can message your CPA directly through our secure portal, schedule video calls, or call their direct line. Most CPAs respond within 24 hours on business days.'
      },
      {
        q: 'Are your tax preparers licensed?',
        a: 'All our preparers are licensed CPAs (Certified Public Accountants) or Enrolled Agents (EAs) authorized to represent clients before the IRS. All hold active licenses and complete continuing education.'
      }
    ]
  },
  {
    category: 'Security & Privacy',
    questions: [
      {
        q: 'Is my information secure?',
        a: 'Absolutely. We use bank-level 256-bit encryption, secure servers, and strict access controls. We\'re SOC 2 Type II certified and comply with IRS security requirements for tax preparers.'
      },
      {
        q: 'Who has access to my tax information?',
        a: 'Only your assigned CPA and authorized support staff. We never sell your data. All employees sign confidentiality agreements and undergo background checks.'
      },
      {
        q: 'What happens to my documents after filing?',
        a: 'Documents are securely stored for 7 years (IRS requirement) then permanently deleted. You can download your return and documents anytime from your secure portal.'
      }
    ]
  }
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Search */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
              <HelpCircle className="w-5 h-5" />
              <span className="font-semibold">Help Center</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold">
              How Can We <span className="text-primary">Help You?</span>
            </h1>

            <p className="text-xl text-muted-foreground">
              Search our knowledge base or contact our support team
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for answers... (e.g., 'How do I upload documents?')"
                  className="pl-14 h-16 text-lg shadow-lg"
                />
                <Button className="absolute right-2 top-1/2 -translate-y-1/2 h-12" variant="professional">
                  Search
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-8">
              {[
                { icon: Book, label: '150+ Articles', color: 'text-blue-500' },
                { icon: Video, label: '50+ Videos', color: 'text-purple-500' },
                { icon: Users, label: '24/7 Support', color: 'text-green-500' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-12 h-12 ${item.color} bg-primary/5 rounded-full flex items-center justify-center`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 bg-muted/30 border-y">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Phone,
                title: 'Phone Support',
                desc: 'Mon-Fri: 9AM-7PM ET',
                action: '(404) 627-1015',
                href: 'tel:+14046271015',
                color: 'text-green-500'
              },
              {
                icon: MessageCircle,
                title: 'Live Chat',
                desc: 'Average wait: < 2 min',
                action: 'Start Chat',
                href: '#',
                color: 'text-blue-500'
              },
              {
                icon: Mail,
                title: 'Email Support',
                desc: 'Response within 24 hours',
                action: 'Send Email',
                href: 'mailto:support@taxgeniuspro.tax',
                color: 'text-purple-500'
              },
              {
                icon: Video,
                title: 'Video Call',
                desc: 'Schedule with your CPA',
                action: 'Book Call',
                href: '/book-appointment',
                color: 'text-orange-500'
              }
            ].map((option, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="hover:shadow-lg transition-all cursor-pointer group h-full">
                  <CardContent className="pt-6 text-center">
                    <div className={`w-14 h-14 ${option.color} bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <option.icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{option.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{option.desc}</p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={option.href}>{option.action}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Browse by Category</h2>
            <p className="text-lg text-muted-foreground">Find answers organized by topic</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {helpCategories.map((category, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link href={`/help/${category.title.toLowerCase().replace(/ /g, '-')}`}>
                  <Card className="hover:shadow-xl transition-all cursor-pointer group h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 ${category.color} bg-primary/5 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <category.icon className="w-7 h-7" />
                        </div>
                        <Badge variant="secondary">{category.articles} articles</Badge>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {category.title}
                      </CardTitle>
                      <CardDescription className="text-base">{category.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-primary font-semibold">
                        <span>View Articles</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Popular Articles</h2>
            <p className="text-lg text-muted-foreground">Most viewed this month</p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {popularArticles.map((article, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/help/article/${i}`}>
                  <Card className="hover:shadow-lg transition-all group cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">{article.views} views</p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Quick answers to common questions</p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {faqs.map((section, sectionIdx) => (
              <motion.div
                key={sectionIdx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sectionIdx * 0.1 }}
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-primary" />
                  </div>
                  {section.category}
                </h3>

                <Accordion type="single" collapsible className="space-y-4">
                  {section.questions.map((faq, faqIdx) => (
                    <AccordionItem
                      key={faqIdx}
                      value={`${sectionIdx}-${faqIdx}`}
                      className="bg-card rounded-lg px-6 border hover:border-primary transition-colors"
                    >
                      <AccordionTrigger className="hover:no-underline text-left">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="font-semibold">{faq.q}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pl-8 pt-2 leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Need Help CTA */}
      <section className="py-24 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="max-w-4xl mx-auto overflow-hidden border-2">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <Image
                    src="https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=600&q=80"
                    alt="Support team"
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Headphones className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>

                <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-3">Still Need Help?</h3>
                  <p className="text-muted-foreground mb-6">
                    Our support team is standing by to assist you with any questions.
                  </p>

                  <div className="space-y-3">
                    <Button variant="professional" className="w-full h-12" asChild>
                      <Link href="tel:+14046271015">
                        <Phone className="mr-2 w-5 h-5" />
                        Call (404) 627-1015
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full h-12">
                      <MessageCircle className="mr-2 w-5 h-5" />
                      Start Live Chat
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 pt-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-success" />
                      <span>Available 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span>Avg. 2min response</span>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
