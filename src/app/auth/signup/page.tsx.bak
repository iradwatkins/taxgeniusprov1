'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  ArrowRight,
  Globe,
  AlertCircle,
  Loader2,
  DollarSign,
  Zap,
  CheckCircle,
  Users
} from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<'en' | 'es'>('en')
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)

  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    referralCode: ''
  })

  const content = {
    en: {
      title: "Get Your $7,000 Today!",
      subtitle: "Join 5,000+ people who got cash this week",
      urgentBadge: "⚡ Limited time: $0 fees until April 15",
      steps: {
        1: "Basic Info",
        2: "Contact",
        3: "Get Cash"
      },
      firstName: "First Name",
      firstNamePlaceholder: "John",
      lastName: "Last Name",
      lastNamePlaceholder: "Doe",
      email: "Email Address",
      emailPlaceholder: "you@example.com",
      phone: "Phone Number",
      phonePlaceholder: "(555) 123-4567",
      password: "Create Password",
      passwordPlaceholder: "At least 8 characters",
      referralCode: "Referral Code (Optional)",
      referralPlaceholder: "Enter code for $50 bonus",
      continueButton: "Continue",
      signUpButton: "Sign Up & Get Cash",
      googleButton: "Sign up with Google",
      orDivider: "OR GET STARTED INSTANTLY",
      benefits: [
        "Instant approval decision",
        "No credit check required",
        "Money in account same day",
        "No hidden fees"
      ],
      existingAccount: "Already have an account?",
      login: "Login here",
      terms: "By signing up, you agree to our Terms and Privacy Policy"
    },
    es: {
      title: "¡Obtén $7,000 Hoy!",
      subtitle: "Únete a 5,000+ personas que obtuvieron efectivo esta semana",
      urgentBadge: "⚡ Tiempo limitado: $0 comisiones hasta el 15 de abril",
      steps: {
        1: "Información Básica",
        2: "Contacto",
        3: "Obtener Efectivo"
      },
      firstName: "Nombre",
      firstNamePlaceholder: "Juan",
      lastName: "Apellido",
      lastNamePlaceholder: "Pérez",
      email: "Correo Electrónico",
      emailPlaceholder: "tu@ejemplo.com",
      phone: "Número de Teléfono",
      phonePlaceholder: "(555) 123-4567",
      password: "Crear Contraseña",
      passwordPlaceholder: "Al menos 8 caracteres",
      referralCode: "Código de Referido (Opcional)",
      referralPlaceholder: "Ingresa código para $50 de bono",
      continueButton: "Continuar",
      signUpButton: "Registrarse y Obtener Efectivo",
      googleButton: "Registrarse con Google",
      orDivider: "O COMIENZA INSTANTÁNEAMENTE",
      benefits: [
        "Decisión de aprobación instantánea",
        "No requiere verificación de crédito",
        "Dinero en cuenta el mismo día",
        "Sin cargos ocultos"
      ],
      existingAccount: "¿Ya tienes cuenta?",
      login: "Inicia sesión aquí",
      terms: "Al registrarte, aceptas nuestros Términos y Política de Privacidad"
    }
  }

  const t = content[language]

  const handleGoogleSignup = () => {
    window.location.href = '/api/auth/google'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step < 3) {
      setStep(step + 1)
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push('/apply')
    }, 1500)
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const progress = (step / 3) * 100

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="flex items-center gap-1"
          >
            <Globe className="w-4 h-4" />
            {language === 'en' ? 'ES' : 'EN'}
          </Button>
        </div>

        <CardDescription className="text-base">{t.subtitle}</CardDescription>

        {/* Urgency Badge */}
        <Alert className="bg-accent dark:bg-accent border-accent-foreground">
          <Zap className="h-4 w-4 text-accent-foreground" />
          <AlertDescription className="text-sm font-medium text-accent-foreground">
            {t.urgentBadge}
          </AlertDescription>
        </Alert>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            {Object.entries(t.steps).map(([num, label]) => (
              <span
                key={num}
                className={step >= parseInt(num) ? 'text-primary font-semibold' : ''}
              >
                {num}. {label}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Google Signup */}
        <Button
          variant="outline"
          className="w-full h-12 text-base"
          onClick={handleGoogleSignup}
          disabled={isLoading}
          type="button"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {t.googleButton}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t.orDivider}
            </span>
          </div>
        </div>

        {/* Multi-step Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t.firstName}</Label>
                  <Input
                    id="firstName"
                    placeholder={t.firstNamePlaceholder}
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t.lastName}</Label>
                  <Input
                    id="lastName"
                    placeholder={t.lastNamePlaceholder}
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral">{t.referralCode}</Label>
                <Input
                  id="referral"
                  placeholder={t.referralPlaceholder}
                  value={formData.referralCode}
                  onChange={(e) => updateFormData('referralCode', e.target.value)}
                  className="h-12"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t.phone}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t.phonePlaceholder}
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className="h-12"
                  required
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  className="h-12"
                  required
                  minLength={8}
                />
              </div>

              {/* Benefits */}
              <div className="space-y-2 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                {t.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {step === 3 ? t.signUpButton : t.continueButton}
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>

          {step > 1 && (
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setStep(step - 1)}
            >
              ← Back
            </Button>
          )}
        </form>

        {/* Live counter */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-primary rounded-full" />
          <Users className="w-4 h-4" />
          <span>247 people signing up now</span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          <span className="text-muted-foreground">{t.existingAccount} </span>
          <Link
            href="/auth/login"
            className="text-primary font-semibold hover:underline"
          >
            {t.login}
          </Link>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          {t.terms}
        </p>
      </CardFooter>
    </Card>
  )
}