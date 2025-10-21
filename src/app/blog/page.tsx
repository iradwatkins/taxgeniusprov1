'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  BookOpen,
  TrendingUp,
  DollarSign,
  Home,
  Briefcase,
  Calculator,
  Award,
  Clock,
  ArrowRight,
  Search,
  Mail,
  Calendar,
  User,
  Tag,
} from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/header';
import Image from 'next/image';

const blogPosts = [
  {
    id: 1,
    title: '10 Tax Deductions You Might Be Missing in 2024',
    excerpt:
      'Discover often-overlooked deductions that could save you thousands on your tax return this year.',
    category: 'Deductions',
    author: 'Sarah Johnson, CPA',
    date: 'Jan 15, 2025',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&q=80',
    featured: true,
    tags: ['Deductions', 'Tax Tips', 'Personal Tax'],
  },
  {
    id: 2,
    title: 'Self-Employment Tax Guide: What You Need to Know',
    excerpt:
      'Complete guide to understanding and managing self-employment taxes, including quarterly estimates.',
    category: 'Business Tax',
    author: 'Michael Chen, EA',
    date: 'Jan 12, 2025',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80',
    featured: true,
    tags: ['Self-Employment', 'Business Tax', 'Quarterly Taxes'],
  },
  {
    id: 3,
    title: 'Home Office Deduction: Complete 2024 Guide',
    excerpt:
      'How to calculate and claim the home office deduction for remote workers and business owners.',
    category: 'Deductions',
    author: 'Lisa Martinez, CPA',
    date: 'Jan 10, 2025',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80',
    featured: true,
    tags: ['Home Office', 'Deductions', 'Remote Work'],
  },
  {
    id: 4,
    title: 'Crypto Tax Reporting: Everything You Need to Know',
    excerpt: 'Navigate cryptocurrency tax reporting requirements and avoid common mistakes.',
    category: 'Investments',
    author: 'David Kim, CPA',
    date: 'Jan 8, 2025',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&q=80',
    tags: ['Cryptocurrency', 'Investments', 'Tax Law'],
  },
  {
    id: 5,
    title: 'Maximize Your Retirement Contributions for Tax Savings',
    excerpt: 'Strategic guide to 401(k), IRA, and other retirement account contributions.',
    category: 'Retirement',
    author: 'Sarah Johnson, CPA',
    date: 'Jan 5, 2025',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&q=80',
    tags: ['Retirement', 'Tax Planning', '401k'],
  },
  {
    id: 6,
    title: 'Small Business Tax Deadlines: 2024 Calendar',
    excerpt: 'Never miss a deadline with our comprehensive small business tax calendar.',
    category: 'Business Tax',
    author: 'Michael Chen, EA',
    date: 'Jan 3, 2025',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=80',
    tags: ['Business Tax', 'Deadlines', 'Small Business'],
  },
  {
    id: 7,
    title: 'Real Estate Investment Tax Strategies',
    excerpt:
      'Learn how to minimize taxes on rental properties, flips, and real estate investments.',
    category: 'Investments',
    author: 'Lisa Martinez, CPA',
    date: 'Dec 28, 2024',
    readTime: '11 min read',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
    tags: ['Real Estate', 'Investments', 'Tax Strategy'],
  },
  {
    id: 8,
    title: 'Child Tax Credit Changes for 2024',
    excerpt: 'What parents need to know about claiming the Child Tax Credit this year.',
    category: 'Credits',
    author: 'David Kim, CPA',
    date: 'Dec 22, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&q=80',
    tags: ['Credits', 'Child Tax Credit', 'Family Tax'],
  },
  {
    id: 9,
    title: 'Electric Vehicle Tax Credits Explained',
    excerpt: 'Guide to federal and state tax credits for electric and hybrid vehicle purchases.',
    category: 'Credits',
    author: 'Sarah Johnson, CPA',
    date: 'Dec 18, 2024',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80',
    tags: ['Credits', 'EV Tax Credit', 'Green Energy'],
  },
];

const categories = [
  { name: 'All Posts', icon: BookOpen, count: 9 },
  { name: 'Business Tax', icon: Briefcase, count: 3 },
  { name: 'Deductions', icon: DollarSign, count: 2 },
  { name: 'Investments', icon: TrendingUp, count: 2 },
  { name: 'Credits', icon: Award, count: 2 },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto space-y-8"
          >
            <Badge className="bg-primary/10 text-primary px-4 py-2">
              <BookOpen className="w-4 h-4 mr-2" />
              Tax Blog & Resources
            </Badge>

            <h1 className="text-4xl lg:text-6xl font-bold">
              Tax Tips & <span className="text-primary">Expert Insights</span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Stay informed with the latest tax news, strategies, and advice from our team of
              licensed CPAs.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tax topics..."
                  className="pl-12 h-14 text-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 border-y bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Button variant={i === 0 ? 'default' : 'outline'} className="gap-2">
                  <category.icon className="w-4 h-4" />
                  {category.name}
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-primary" />
                Featured Articles
              </h2>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogPosts
              .filter((post) => post.featured)
              .map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all group cursor-pointer h-full">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={600}
                        height={400}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                        {post.category}
                      </Badge>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed mt-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{post.date}</span>
                      </div>

                      <Button
                        variant="ghost"
                        className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        Read More <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Latest Articles</h2>
            <p className="text-muted-foreground">Expert tax advice and strategies</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ scale: 1.03 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer h-full">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={600}
                      height={400}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 left-3 text-xs">{post.category}</Badge>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="max-w-4xl mx-auto overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <Image
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80"
                    alt="Newsletter signup"
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Mail className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>

                <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-3">Get Tax Tips in Your Inbox</h3>
                  <p className="text-muted-foreground mb-6">
                    Join 10,000+ subscribers getting weekly tax tips, strategies, and updates.
                  </p>

                  <div className="space-y-3">
                    <Input placeholder="Your email address" type="email" className="h-12" />
                    <Button variant="professional" className="w-full h-12">
                      Subscribe Free
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      No spam. Unsubscribe anytime.
                    </p>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-3xl lg:text-4xl font-bold">Need Professional Tax Help?</h2>
            <p className="text-lg text-muted-foreground">
              Reading is great, but nothing beats working with a licensed CPA who knows your
              situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="professional" size="lg" asChild>
                <Link href="/start-filing">
                  Work with a CPA <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
