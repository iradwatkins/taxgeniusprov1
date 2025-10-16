'use client';

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const opportunities = [
  {
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=700&q=80",
    alt: "Professional working on laptop",
    badge: "$45-75 per return",
    badgeColor: "bg-primary text-primary-foreground",
    categoryBadge: "Career Opportunity",
    categoryColor: "bg-primary/10 text-primary border-primary/20",
    title: "Become a Tax Preparer",
    description: "Join our network of professional tax preparers. Earn $45-75 per return with flexible hours and remote work.",
    benefits: [
      "Flexible schedule - work when you want",
      "100% remote - work from anywhere",
      "Professional E&O insurance included"
    ],
    link: "/preparer",
    buttonText: "Learn More",
    buttonColor: "bg-primary hover:bg-primary/90",
    checkColor: "text-primary",
    delay: 0
  },
  {
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=700&q=80",
    alt: "People celebrating success",
    badge: "Up to $50 per referral",
    badgeColor: "bg-yellow-500 text-yellow-950",
    categoryBadge: "Earn Extra Cash",
    categoryColor: "bg-yellow-400/20 text-yellow-700 dark:text-yellow-400 border-yellow-400/30",
    title: "Referral Program",
    description: "Earn up to $50 for each friend you refer. Easy money during tax season with unlimited earning potential.",
    benefits: [
      "Earn up to $50 per successful referral",
      "No limits - refer as many people as you want",
      "Quick payouts within 7 days"
    ],
    link: "/referral",
    buttonText: "Join Program",
    buttonColor: "bg-yellow-500 hover:bg-yellow-600 text-yellow-950",
    checkColor: "text-yellow-600 dark:text-yellow-400",
    delay: 0.2
  }
];

export function OpportunitiesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">Join Our Team</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Looking for career opportunities or want to earn extra income?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {opportunities.map((opportunity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: opportunity.delay }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={opportunity.image}
                    alt={opportunity.alt}
                    width={700}
                    height={400}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <Badge className={`${opportunity.badgeColor} text-sm px-3 py-1`}>
                      {opportunity.badge}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <Badge className={`w-fit ${opportunity.categoryColor} mb-2`}>
                    {opportunity.categoryBadge}
                  </Badge>
                  <CardTitle className="text-2xl">{opportunity.title}</CardTitle>
                  <CardDescription className="text-base">
                    {opportunity.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {opportunity.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start text-sm">
                        <CheckCircle className={`w-4 h-4 mr-2 ${opportunity.checkColor} mt-0.5 flex-shrink-0`} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={opportunity.link}>
                    <Button className={`w-full ${opportunity.buttonColor}`}>
                      {opportunity.buttonText} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
