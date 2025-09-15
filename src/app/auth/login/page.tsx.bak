'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Mail,
  Lock,
  ArrowRight,
  Globe,
  AlertCircle,
  Smartphone,
  Loader2
} from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<'en' | 'es'>('en')
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const content = {
    en: {
      title: "Welcome Back!",
      subtitle: "Get your cash advance in minutes",
      urgentBadge: "🔥 1,247 people logged in today",
      tabs: {
        email: "Email",
        phone: "Phone"
      },
      emailLabel: "Email Address",
      emailPlaceholder: "you@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      phoneLabel: "Phone Number",
      phonePlaceholder: "(555) 123-4567",
      forgotPassword: "Forgot password?",
      loginButton: "Login & Get Cash",
      magicLinkButton: "Send Magic Link",
      magicLinkSent: "Check your email! Login link sent.",
      googleButton: "Continue with Google",
      orDivider: "OR",
      noAccount: "Don't have an account?",
      signUp: "Sign up and get $7,000",
      terms: "By logging in, you agree to our Terms and Privacy Policy",
      errors: {
        required: "All fields are required",
        invalid: "Invalid email or password"
      }
    },
    es: {
      title: "¡Bienvenido de Nuevo!",
      subtitle: "Obtén tu adelanto en minutos",
      urgentBadge: "🔥 1,247 personas iniciaron sesión hoy",
      tabs: {
        email: "Correo",
        phone: "Teléfono"
      },
      emailLabel: "Correo Electrónico",
      emailPlaceholder: "tu@ejemplo.com",
      passwordLabel: "Contraseña",
      passwordPlaceholder: "Ingresa tu contraseña",
      phoneLabel: "Número de Teléfono",
      phonePlaceholder: "(555) 123-4567",
      forgotPassword: "¿Olvidaste tu contraseña?",
      loginButton: "Iniciar Sesión y Obtener Efectivo",
      magicLinkButton: "Enviar Enlace Mágico",
      magicLinkSent: "¡Revisa tu correo! Enlace enviado.",
      googleButton: "Continuar con Google",
      orDivider: "O",
      noAccount: "¿No tienes cuenta?",
      signUp: "Regístrate y obtén $7,000",
      terms: "Al iniciar sesión, aceptas nuestros Términos y Política de Privacidad",
      errors: {
        required: "Todos los campos son requeridos",
        invalid: "Correo o contraseña inválidos"
      }
    }
  }

  const t = content[language]

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push('/dashboard/client')
    }, 1500)
  }

  const handleMagicLink = async () => {
    setIsLoading(true)

    // Simulate sending magic link
    setTimeout(() => {
      setIsLoading(false)
      setMagicLinkSent(true)
    }, 1000)
  }

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    window.location.href = '/api/auth/google'
  }

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate SMS verification
    setTimeout(() => {
      setIsLoading(false)
      router.push('/auth/verify-phone')
    }, 1500)
  }

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
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

        {/* Urgency Signal */}
        <Alert className="bg-accent dark:bg-accent border-accent-foreground">
          <AlertDescription className="text-sm font-medium">
            {t.urgentBadge}
          </AlertDescription>
        </Alert>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Google Login */}
        <Button
          variant="outline"
          className="w-full h-12 text-base"
          onClick={handleGoogleLogin}
          disabled={isLoading}
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

        {/* Email/Phone Tabs */}
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {t.tabs.email}
            </TabsTrigger>
            <TabsTrigger value="phone" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              {t.tabs.phone}
            </TabsTrigger>
          </TabsList>

          {/* Email Login */}
          <TabsContent value="email" className="space-y-4 mt-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.emailLabel}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">{t.passwordLabel}</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    {t.forgotPassword}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {t.loginButton}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleMagicLink}
                  disabled={isLoading || !email}
                  className="text-primary"
                >
                  {t.magicLinkButton}
                </Button>
              </div>

              {magicLinkSent && (
                <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-600">
                    {t.magicLinkSent}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </TabsContent>

          {/* Phone Login */}
          <TabsContent value="phone" className="space-y-4 mt-4">
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t.phoneLabel}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t.phonePlaceholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {t.loginButton}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          <span className="text-muted-foreground">{t.noAccount} </span>
          <Link
            href="/auth/signup"
            className="text-primary font-semibold hover:underline"
          >
            {t.signUp}
          </Link>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          {t.terms}
        </p>
      </CardFooter>
    </Card>
  )
}