'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet'
import { ErrorTestButton } from '@/components/ErrorTestButton'
import {
  DollarSign,
  Clock,
  Shield,
  Star,
  ArrowRight,
  Zap,
  Menu,
  CheckCircle,
  Phone,
  Globe,
  TrendingUp,
  Users,
  Smartphone
} from 'lucide-react'

export default function TaxGeniusLanding() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [language, setLanguage] = useState<'en' | 'es'>('en')
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 })
  const [peopleCount, setPeopleCount] = useState(1247)

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return { hours: 23, minutes: 59, seconds: 59 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulate people getting cash
  useEffect(() => {
    const timer = setInterval(() => {
      setPeopleCount(prev => prev + Math.floor(Math.random() * 3) + 1)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const content = {
    en: {
      hero: {
        badge: "Get Cash in Minutes",
        title: "GET UP TO",
        amount: "$7,000",
        subtitle: "TODAY!",
        description: "Need cash fast? Get an instant advance on your tax refund. No waiting, no hassle.",
        cta: "GET CASH NOW",
        ctaSecondary: "Calculate My Refund",
        trust: `${peopleCount.toLocaleString()} people got cash in the last hour`
      },
      howItWorks: {
        title: "How It Works",
        steps: [
          { icon: Smartphone, title: "Upload W2", time: "30 seconds", desc: "Take a photo with your phone" },
          { icon: Zap, title: "Get Approved", time: "Instant", desc: "AI-powered instant decision" },
          { icon: DollarSign, title: "Receive Cash", time: "Same day", desc: "Money in your account today" }
        ]
      },
      urgency: {
        title: "Limited Time Offer",
        subtitle: "Tax Season Special Ends In:",
        cta: "Don't Miss Out - Apply Now"
      },
      testimonials: [
        { name: "Maria G.", role: "Uber Driver", text: "Got $5,000 in 10 minutes! This saved my month.", rating: 5 },
        { name: "James T.", role: "DoorDash", text: "No more waiting weeks for my refund. Game changer!", rating: 5 },
        { name: "Ashley R.", role: "Hair Stylist", text: "Easy, fast, and they speak Spanish too!", rating: 5 }
      ],
      features: [
        { icon: Clock, title: "Instant Approval", desc: "Get your decision in seconds" },
        { icon: Shield, title: "Bank-Level Security", desc: "Your data is always protected" },
        { icon: Phone, title: "24/7 Support", desc: "We're here when you need us" }
      ],
      footer: {
        login: "Already a member? Login",
        refer: "Earn $50 per referral"
      }
    },
    es: {
      hero: {
        badge: "Obtén Efectivo en Minutos",
        title: "OBTÉN HASTA",
        amount: "$7,000",
        subtitle: "¡HOY MISMO!",
        description: "¿Necesitas dinero rápido? Obtén un adelanto instantáneo de tu reembolso de impuestos.",
        cta: "OBTENER EFECTIVO AHORA",
        ctaSecondary: "Calcular Mi Reembolso",
        trust: `${peopleCount.toLocaleString()} personas obtuvieron efectivo en la última hora`
      },
      howItWorks: {
        title: "Cómo Funciona",
        steps: [
          { icon: Smartphone, title: "Sube tu W2", time: "30 segundos", desc: "Toma una foto con tu teléfono" },
          { icon: Zap, title: "Aprobación", time: "Instantánea", desc: "Decisión instantánea con IA" },
          { icon: DollarSign, title: "Recibe Efectivo", time: "Mismo día", desc: "Dinero en tu cuenta hoy" }
        ]
      },
      urgency: {
        title: "Oferta Por Tiempo Limitado",
        subtitle: "Especial de Temporada Termina En:",
        cta: "No Te Lo Pierdas - Aplica Ahora"
      },
      testimonials: [
        { name: "Maria G.", role: "Conductora Uber", text: "¡Obtuve $5,000 en 10 minutos! Esto salvó mi mes.", rating: 5 },
        { name: "James T.", role: "DoorDash", text: "No más esperar semanas por mi reembolso. ¡Increíble!", rating: 5 },
        { name: "Ashley R.", role: "Estilista", text: "¡Fácil, rápido, y hablan español también!", rating: 5 }
      ],
      features: [
        { icon: Clock, title: "Aprobación Instantánea", desc: "Decisión en segundos" },
        { icon: Shield, title: "Seguridad Bancaria", desc: "Tus datos siempre protegidos" },
        { icon: Phone, title: "Soporte 24/7", desc: "Estamos cuando nos necesitas" }
      ],
      footer: {
        login: "¿Ya eres miembro? Iniciar sesión",
        refer: "Gana $50 por referido"
      }
    }
  }

  const t = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Urgent Banner */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center">
        <p className="text-sm font-bold">
          ⚡ {t.urgency.subtitle} {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')} ⚡
        </p>
      </div>

      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-full px-6 lg:px-12 xl:px-16 2xl:px-24 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-primary rounded-full flex items-center justify-center">
                <DollarSign className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <span className="text-2xl lg:text-3xl xl:text-4xl font-bold text-primary">
                Tax Genius Pro
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className="flex items-center gap-2 text-lg"
              >
                <Globe className="w-5 h-5" />
                {language === 'en' ? 'ES' : 'EN'}
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-6 py-3">{t.footer.login}</Button>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors text-lg px-8 py-3">
                {t.hero.cta} →
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-8">
                  <Button
                    variant="ghost"
                    onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                    className="w-full justify-start"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Español' : 'English'}
                  </Button>
                  <Button variant="outline" className="w-full">{t.footer.login}</Button>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                    {t.hero.cta}
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-32 lg:py-48 xl:py-64 2xl:py-80 px-6 lg:px-12 xl:px-16 2xl:px-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto max-w-full relative">
          <div className="text-center space-y-8 lg:space-y-12 xl:space-y-16 2xl:space-y-20">
            <Badge variant="secondary" className="px-8 py-4 text-lg lg:text-xl">
              <Zap className="w-6 h-6 lg:w-8 lg:h-8 mr-3" />
              {t.hero.badge}
            </Badge>

            <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-10xl font-bold leading-tight tracking-tight">
              <span className="block">{t.hero.title}</span>
              <span className="block text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-10xl font-bold text-primary">
                {t.hero.amount}
              </span>
              <span className="block text-4xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl">{t.hero.subtitle}</span>
            </h1>

            <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-muted-foreground max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto">
              {t.hero.description}
            </p>

            {/* Trust Signal */}
            <div className="flex items-center justify-center space-x-4 text-lg md:text-xl lg:text-2xl xl:text-3xl">
              <div className="flex items-center bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-6 py-3 lg:px-8 lg:py-4 rounded-full">
                <div className="w-4 h-4 lg:w-6 lg:h-6 bg-primary rounded-full mr-3" />
                LIVE: {t.hero.trust}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 xl:gap-12 2xl:gap-16 justify-center items-center pt-8 max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-8xl mx-auto">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-2xl md:text-3xl lg:text-4xl xl:text-5xl px-12 py-6 lg:px-16 lg:py-8 xl:px-20 xl:py-10 shadow-xl transition-colors"
              >
                {t.hero.cta}
                <ArrowRight className="ml-4 w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12" />
              </Button>
              <Button variant="outline" size="lg" className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl px-10 py-6 lg:px-14 lg:py-8 xl:px-18 xl:py-10">
                {t.hero.ctaSecondary}
              </Button>
            </div>

            {/* Rating */}
            <div className="flex justify-center items-center space-x-2 lg:space-x-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-4 text-2xl lg:text-3xl xl:text-4xl font-bold">4.9</span>
              <span className="text-muted-foreground text-xl lg:text-2xl xl:text-3xl">(5,421)</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-32 lg:py-48 xl:py-64 2xl:py-80 px-6 lg:px-12 xl:px-16 2xl:px-24 bg-muted/30">
        <div className="container mx-auto max-w-full">
          <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-center mb-16 lg:mb-24 xl:mb-32 2xl:mb-40">
            {t.howItWorks.title}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 xl:gap-24 2xl:gap-32">
            {t.howItWorks.steps.map((step, index) => (
              <div key={index} className="relative">
                {index < t.howItWorks.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-2 bg-primary/30 -z-10" />
                )}
                <Card className="hover:shadow-xl transition-all duration-300 border-4 hover:border-primary h-full">
                  <CardHeader className="text-center p-8 lg:p-12">
                    <div className="w-32 h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <step.icon className="w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 text-primary" />
                    </div>
                    <CardTitle className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4">{index + 1}. {step.title}</CardTitle>
                    <Badge variant="secondary" className="mx-auto text-lg lg:text-xl px-4 py-2">
                      {step.time}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-8 lg:p-12">
                    <p className="text-center text-muted-foreground text-lg lg:text-xl xl:text-2xl">{step.desc}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-32 lg:py-48 xl:py-64 2xl:py-80 px-6 lg:px-12 xl:px-16 2xl:px-24">
        <div className="container mx-auto max-w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 xl:gap-24 2xl:gap-32">
            {t.features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow h-full border-2 hover:border-primary">
                <CardHeader className="p-8 lg:p-12">
                  <feature.icon className="w-20 h-20 lg:w-28 lg:h-28 xl:w-32 xl:h-32 text-primary mx-auto mb-6" />
                  <CardTitle className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-8 lg:p-12">
                  <CardDescription className="text-lg md:text-xl lg:text-2xl xl:text-3xl">{feature.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-32 lg:py-48 xl:py-64 2xl:py-80 px-6 lg:px-12 xl:px-16 2xl:px-24 bg-muted/30">
        <div className="container mx-auto max-w-full">
          <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-center mb-16 lg:mb-24 xl:mb-32 2xl:mb-40">
            Real People, Real Money
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16 2xl:gap-20">
            {t.testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow h-full border-2 hover:border-primary">
                <CardHeader className="p-8 lg:p-10">
                  <div className="flex items-center space-x-2 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 lg:w-8 lg:h-8 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="italic text-lg lg:text-xl xl:text-2xl">
                    "{testimonial.text}"
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 lg:p-10">
                  <p className="font-semibold text-lg lg:text-xl">{testimonial.name}</p>
                  <p className="text-base lg:text-lg text-muted-foreground">{testimonial.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-32 lg:py-48 xl:py-64 2xl:py-80 px-6 lg:px-12 xl:px-16 2xl:px-24 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-full text-center text-white">
          <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold mb-8 lg:mb-12 xl:mb-16">
            {t.urgency.title}
          </h2>
          <p className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl mb-12 lg:mb-16 xl:mb-20 opacity-90 max-w-6xl mx-auto">
            {t.urgency.subtitle} {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </p>
          <Button size="lg" variant="secondary" className="text-2xl lg:text-3xl xl:text-4xl px-12 py-6 lg:px-16 lg:py-8 xl:px-20 xl:py-10 transition-all hover:scale-105">
            {t.urgency.cta}
            <ArrowRight className="ml-4 w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12" />
          </Button>

          <div className="mt-12 lg:mt-16 xl:mt-20 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 xl:gap-16 2xl:gap-20 text-white/80">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 lg:w-10 lg:h-10 mr-4" />
              <span className="text-xl lg:text-2xl xl:text-3xl">No credit check</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 lg:w-10 lg:h-10 mr-4" />
              <span className="text-xl lg:text-2xl xl:text-3xl">No hidden fees</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 lg:w-10 lg:h-10 mr-4" />
              <span className="text-xl lg:text-2xl xl:text-3xl">Instant approval</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12 lg:py-16 xl:py-20 px-6 lg:px-12 xl:px-16 2xl:px-24">
        <div className="container mx-auto max-w-full">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-accent rounded-full flex items-center justify-center">
                <DollarSign className="w-7 h-7 lg:w-10 lg:h-10 text-white" />
              </div>
              <span className="text-2xl lg:text-3xl xl:text-4xl font-bold">Tax Genius Pro</span>
            </div>

            <div className="flex items-center space-x-8 lg:space-x-12">
              <Button variant="link" className="text-primary text-lg lg:text-xl xl:text-2xl">
                <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 mr-3" />
                {t.footer.refer}
              </Button>
              <Button variant="link" className="text-lg lg:text-xl xl:text-2xl">
                {t.footer.login}
              </Button>
            </div>
          </div>

          <div className="mt-12 lg:mt-16 pt-8 lg:pt-12 border-t text-center text-lg lg:text-xl text-muted-foreground">
            <p>&copy; 2024 Tax Genius Pro. All rights reserved. | NMLS #123456</p>
            <p className="mt-4">
              <Shield className="w-6 h-6 lg:w-8 lg:h-8 inline mr-2" />
              Your information is secure and will never be shared.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}