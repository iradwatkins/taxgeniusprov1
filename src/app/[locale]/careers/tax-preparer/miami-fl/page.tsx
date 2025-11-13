'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Home,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  MapPin,
  Phone,
  MessageSquare,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function MiamiTaxPreparerPage() {
  const [income, setIncome] = useState(0);

  useEffect(() => {
    const target = 150000;
    const duration = 2500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setIncome(target);
        clearInterval(timer);
      } else {
        setIncome(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 text-lg px-4 py-2" variant="secondary">
                <MapPin className="w-4 h-4 mr-2 inline" />
                Miami, Florida
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Earn Up to <motion.span
                className="text-primary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 150, delay: 0.5 }}
              >
                ${income.toLocaleString()}/Year
              </motion.span><br />
              as a Tax Preparer in Miami
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              No Experience Needed! Work from home in South Beach, Brickell, Wynwood, or anywhere in Miami
            </motion.p>

            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Free training • Flexible hours • Remote work • Year-round income
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/preparer/start">
                  Apply Now - Start Earning
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
                <Link href="/preparer/start">
                  Learn More - $75,000+ Income
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+14046271015" className="hover:text-primary">+1 (404) 627-1015</a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <a href="sms:+14046271015" className="hover:text-primary">+1 (404) 627-1015 - Text for Info</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <Card className="overflow-hidden h-full">
                <div className="relative h-64 w-full bg-muted/20 p-4">
                  <Image
                    src="/golden-eggs.png"
                    alt="Earn $75,000-$150,000"
                    fill
                    className="object-contain p-4"
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-2">$75,000-$150,000</h3>
                  <p className="text-muted-foreground">
                    Annual income potential with top earners making $150k+. Even part-time preparers earn $75k+
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <Card className="overflow-hidden h-full">
                <div className="relative h-64 w-full bg-muted/20 p-4">
                  <Image
                    src="/work-from-home.png"
                    alt="Work From Home"
                    fill
                    className="object-contain p-4"
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-2">Work From Home</h3>
                  <p className="text-muted-foreground">
                    Work from anywhere in Miami - South Beach, Brickell, Coral Gables, Wynwood, or your home
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <Card className="overflow-hidden h-full">
                <div className="relative h-64 w-full bg-muted/20 p-4">
                  <Image
                    src="/employee-smile.webp"
                    alt="Flexible Hours"
                    fill
                    className="object-contain p-4"
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-2xl font-bold mb-2">Flexible Hours</h3>
                  <p className="text-muted-foreground">
                    Set your own schedule. Perfect for parents, retirees, or anyone seeking work-life balance
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-3xl font-bold mb-6">Break Free From Dead-End Jobs in Miami</h2>

            <p className="text-lg leading-relaxed mb-6">
              Miami's booming tax season demand is creating a golden opportunity for career changers, retirees,
              and part-time workers ready to break free from dead-end jobs, traffic-clogged commutes, and
              inflexible schedules. With <strong>Tax Genius Pro</strong>, you can earn <strong>$75,000+ annually</strong>—or
              even top earners' <strong>$150,000</strong>—from the comfort of your home, while serving high-need
              neighborhoods like <strong>South Beach, Downtown Miami, Coral Gables, Wynwood, and Brickell</strong>.
            </p>

            <div className="bg-primary/10 border-l-4 border-primary p-6 my-8 rounded">
              <h3 className="text-2xl font-bold mb-4">Why Now is the Perfect Time</h3>
              <p className="mb-4">
                Say goodbye to low pay and rigid 9-to-5 hours. As a Tax Genius Pro, you'll enjoy:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Flexible hours</strong> that work around YOUR schedule</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Remote work</strong> - no commute, no office politics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>Be your own boss</strong> - perfect for stay-at-home parents and retirees</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>4-6 week FREE training</strong> (self-paced, no cost)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span><strong>No-cost certification</strong> included</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold mb-6 mt-12">Thriving Market in Miami</h2>

            <p className="text-lg leading-relaxed mb-6">
              Miami's population of <strong>467,963+</strong> means a thriving market for tax preparers, especially
              with <strong>seasonal tax season peaks</strong> and <strong>year-round income potential</strong>. Whether
              you're bilingual or just starting fresh, this is your chance to thrive in a city where opportunity
              meets demand.
            </p>

            <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary my-8">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-8 h-8" />
                  Miami's Opportunity
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-3xl font-bold text-primary">467,963+</div>
                    <div className="text-sm text-muted-foreground">Population</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">Year-Round</div>
                    <div className="text-sm text-muted-foreground">Income Potential</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">Bilingual</div>
                    <div className="text-sm text-muted-foreground">Bonus Opportunity</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">Remote</div>
                    <div className="text-sm text-muted-foreground">Work Setup</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <h2 className="text-3xl font-bold mb-6 mt-12">Act Now - Limited Spots Available</h2>

            <p className="text-lg leading-relaxed mb-6">
              <strong>Training spots are limited</strong>, and tax season is fast approaching. Don't let another
              year slip by while stuck in a job that doesn't pay you what you're worth.
            </p>

            <p className="text-xl font-semibold mb-8">
              <strong>Join Tax Genius Pro in Miami</strong> today and transform your life—click to apply before
              opportunities run out!
            </p>
          </div>

          {/* Success Stories / Testimonials */}
          <section className="py-16 px-6 bg-muted/20 rounded-lg mt-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Real Success Stories from Miami Tax Preparers</h2>
              <p className="text-lg text-muted-foreground">Join hundreds of successful tax preparers earning $75k-$150k annually</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: 'Angela Richards',
                  location: 'Miami, FL',
                  income: '$92,000',
                  image: '/testimonials/angelarichards.png',
                  quote: 'Free training changed my life. Now I work from home and earn more than my corporate job!'
                },
                {
                  name: 'Chelsea Michelle Lowe',
                  location: 'Miami Beach, FL',
                  income: '$115,000',
                  image: '/testimonials/chelseamichelllowe.png',
                  quote: 'Best career decision I ever made. Flexible hours, great income, and I help families.'
                },
                {
                  name: 'Gelsia White',
                  location: 'Coral Gables, FL',
                  income: '$87,500',
                  image: '/testimonials/gelsiawhite.png',
                  quote: 'No experience needed is true! The training was excellent and support is amazing.'
                },
                {
                  name: 'Yaumar Williams',
                  location: 'Brickell, FL',
                  income: '$105,000',
                  image: '/testimonials/yaumarwilliams.png',
                  quote: 'Work-life balance is incredible. I choose my hours and earn more than ever before.'
                }
              ].map((testimonial) => (
                <Card key={testimonial.name} className="overflow-hidden">
                  <CardContent className="pt-6 text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm italic mb-4 text-muted-foreground">"{testimonial.quote}"</p>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                    <div className="text-primary font-bold mt-2 text-lg">{testimonial.income}/year</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-lg p-8 text-center text-white mt-12">
            <h3 className="text-3xl font-bold mb-4">Your Future as a Tax Pro Starts Now</h3>
            <p className="text-lg mb-6 opacity-90">
              Free training • No experience needed • Work from home • $75,000-$150,000/year
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link href="/preparer/start">
                  Apply Now - Become a Tax Preparer
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 text-white border-white">
                <Link href="/preparer/start">
                  Learn More - $75,000+ Income
                </Link>
              </Button>
            </div>
          </div>

          {/* Service Areas */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-4">Serving All Miami Neighborhoods</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {['South Beach', 'Downtown Miami', 'Coral Gables', 'Wynwood', 'Brickell', 'Little Havana', 'Coconut Grove', 'Miami Beach'].map((area) => (
                <Badge key={area} variant="secondary" className="text-sm px-3 py-1">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
