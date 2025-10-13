import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  CheckCircle,
  DollarSign,
  Shield,
  Clock,
  Star,
  Zap,
  TrendingUp,
  ArrowRight,
  Users
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Start Your Tax Return - Fast Filing & Maximum Refund | Tax Genius Pro',
  description: 'File your taxes in minutes and get every dollar you deserve. Expert CPAs find all deductions and credits. Average client refund: $3,200. Start your return now.',
  keywords: 'file taxes fast, maximum tax refund, tax preparation, CPA tax filing, quick tax return',
  openGraph: {
    title: 'Get Your Maximum Tax Refund Fast | Tax Genius Pro',
    description: 'File your taxes in minutes with certified CPAs. See what you qualify for today.',
    type: 'website',
  }
}

export default function StartFilingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Tax Genius Pro - Tax Preparation Service',
    description: 'Fast tax filing service with expert CPAs. File your taxes in 15 minutes and get your maximum refund.',
    provider: {
      '@type': 'Organization',
      name: 'Tax Genius Pro',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '1632 Jonesboro Rd SE',
        addressLocality: 'Atlanta',
        addressRegion: 'GA',
        postalCode: '30315',
        addressCountry: 'US'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-404-627-1015',
        contactType: 'customer service'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      ratingCount: '50000'
    },
    offers: {
      '@type': 'Offer',
      description: 'Professional tax preparation with maximum refund guarantee',
      priceCurrency: 'USD'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-background to-green-50">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-16 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap className="h-4 w-4" />
              File in 15 Minutes
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Get Every Dollar You <span className="text-green-600">Deserve</span> This Tax Season
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Expert CPAs find all the deductions and credits you qualify for. Fast, easy, and you keep more money.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/start-filing/form">
                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8">
                  Start Your Return Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-green-500" />
                No signup required to start
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t">
              <div>
                <div className="text-3xl font-bold text-green-600">15min</div>
                <p className="text-sm text-muted-foreground">Average filing time</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">$3,200</div>
                <p className="text-sm text-muted-foreground">Average refund</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">4.9★</div>
                <p className="text-sm text-muted-foreground">Client rating</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-green-100 to-blue-100">
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80&auto=format&fit=crop"
                alt="Happy person celebrating tax refund on laptop"
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
            {/* Floating stat card */}
            <Card className="absolute -bottom-6 -left-6 shadow-xl border-2 border-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">50,000+</div>
                    <p className="text-sm text-muted-foreground">Refunds Processed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Speed + Money Section */}
      <section className="bg-white py-16 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Why People Choose Tax Genius Pro
            </h2>
            <p className="text-xl text-muted-foreground">
              We focus on what matters most: your time and your money
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Lightning Fast Filing</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Most clients complete their return in under 15 minutes. Our smart form asks only what's needed for YOUR situation.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Simple questions, no tax jargon</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Save & resume anytime</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Returns filed within 48 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Maximum Refund Promise</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Our CPAs find every deduction and credit you qualify for. See what you're entitled to - most clients get $3,200+.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Expert review of your return</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Find hidden deductions</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">100% accuracy guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/start-filing/form">
              <Button size="lg" className="text-lg h-14 px-8">
                See What You Qualify For
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof - Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Real People, Real Results</h2>
          <p className="text-xl text-muted-foreground">
            See what clients say about their refunds and experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                "Filed my taxes in 12 minutes during lunch break! Got back $3,850 - way more than I expected. These guys know their stuff."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
                <div>
                  <div className="font-semibold">Marcus T.</div>
                  <div className="text-sm text-muted-foreground">Atlanta, GA</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                "I was shocked! Found deductions I didn't even know existed. Got $4,200 back and the whole process took less time than my coffee break."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full"></div>
                <div>
                  <div className="font-semibold">Sarah J.</div>
                  <div className="text-sm text-muted-foreground">Decatur, GA</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                "Super fast and easy. My CPA found credits I missed last year. Got $2,800 refund and paid way less in fees than H&R Block wanted."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full"></div>
                <div>
                  <div className="font-semibold">James W.</div>
                  <div className="text-sm text-muted-foreground">Marietta, GA</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-muted px-6 py-3 rounded-full">
            <Users className="h-5 w-5 text-green-600" />
            <span className="font-semibold">Join 50,000+ satisfied clients</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Get Your Refund in 3 Simple Steps</h2>
            <p className="text-xl text-muted-foreground">
              Fast, easy, and designed for real people
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="relative mx-auto mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-4xl font-bold text-white">1</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-yellow-900" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Answer Quick Questions</h3>
              <p className="text-muted-foreground">
                Takes 15 minutes or less. Simple questions about your income, family, and deductions.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mx-auto mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-4xl font-bold text-white">2</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-yellow-900" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Expert CPA Review</h3>
              <p className="text-muted-foreground">
                Licensed tax professionals review your return and find every deduction you qualify for.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mx-auto mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-4xl font-bold text-white">3</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-yellow-900" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Get Your Maximum Refund</h3>
              <p className="text-muted-foreground">
                We file your return and you get every dollar you deserve. Fast, secure, guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <Image
                  src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&q=80&auto=format&fit=crop"
                  alt="Person excited about tax refund"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to See What You Qualify For?
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Start your return now. No signup required. Most people finish in under 15 minutes.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Find all deductions and credits</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Expert CPA reviews your return</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>100% accuracy guaranteed</span>
                  </div>
                </div>

                <Link href="/start-filing/form">
                  <Button size="lg" className="w-full text-lg h-14">
                    Start Your Tax Return Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Average refund: $3,200 • File in 15 minutes
                </p>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-4 pb-20">
        <div className="flex justify-center items-center gap-8 flex-wrap text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="font-semibold">IRS Authorized E-File Provider</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="font-semibold">256-Bit Bank-Level Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="font-semibold">BBB A+ Rated</span>
          </div>
        </div>
      </section>
    </div>
  )
}
