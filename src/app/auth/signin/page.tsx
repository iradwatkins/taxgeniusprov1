'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { DollarSign, Shield, Award, CheckCircle, TrendingUp, Users, Zap, Loader2, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get('role') || 'client';

  // Clean the callback URL to prevent 0.0.0.0 or localhost from being used
  let callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  try {
    // If callbackUrl is a full URL, extract just the pathname
    if (callbackUrl.startsWith('http://') || callbackUrl.startsWith('https://')) {
      const url = new URL(callbackUrl);
      callbackUrl = url.pathname + url.search;
    }
  } catch (e) {
    // If parsing fails, default to /dashboard
    callbackUrl = '/dashboard';
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Role-specific content
  const roleContent = {
    client: {
      badge: 'Welcome Back',
      icon: Shield,
      heading: 'Continue Your Tax Filing',
      subheading:
        'Sign in to access your tax documents, track your refund, and manage your account',
      benefits: [
        { icon: CheckCircle, text: 'Pick up where you left off' },
        { icon: TrendingUp, text: 'Track your refund status' },
        { icon: Shield, text: 'Secure & encrypted' },
      ],
      ctaText: 'Sign In to Your Account',
      imageSuggestion: 'Professional reviewing documents confidently',
      theme: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      accentColor: 'text-blue-600 dark:text-blue-400',
      welcomeBack: "Welcome back! Let's get your taxes done.",
    },
    preparer: {
      badge: 'Preparer Portal',
      icon: Award,
      heading: 'Welcome Back, Professional',
      subheading: 'Access your client dashboard, manage tax returns, and track your earnings',
      benefits: [
        { icon: Users, text: 'Manage your clients' },
        { icon: DollarSign, text: 'Track your earnings' },
        { icon: CheckCircle, text: 'Access your tools' },
      ],
      ctaText: 'Sign In to Dashboard',
      imageSuggestion: 'Tax professional at work',
      theme: 'from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20',
      accentColor: 'text-blue-600 dark:text-blue-400',
      welcomeBack: 'Ready to help more clients today?',
    },
    affiliate: {
      badge: '💰 Affiliate Portal',
      icon: DollarSign,
      heading: 'Welcome Back!',
      subheading: "Check your earnings, share your link, and see how much money you've made!",
      benefits: [
        { icon: Zap, text: 'See your earnings instantly' },
        { icon: TrendingUp, text: 'Track active referrals' },
        { icon: DollarSign, text: 'Request payouts' },
      ],
      ctaText: 'Sign In & Start Earning',
      imageSuggestion: 'Person checking earnings on phone happily',
      theme: 'from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-800/20',
      accentColor: 'text-yellow-600 dark:text-yellow-400',
      welcomeBack: "Let's see how much you've earned! 🤑",
    },
  };

  const content = roleContent[role as keyof typeof roleContent] || roleContent.client;
  const IconComponent = content.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
        return;
      }

      // Successful sign in - redirect to callback URL
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Role-specific messaging with image */}
      <div
        className={`relative bg-gradient-to-br ${content.theme} p-8 lg:p-16 flex flex-col justify-center`}
      >
        <div className="max-w-lg mx-auto space-y-8">
          <div>
            <Badge className="mb-4 text-base px-4 py-2">
              <IconComponent className="w-5 h-5 mr-2" />
              {content.badge}
            </Badge>

            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">{content.heading}</h1>

            <p className="text-xl text-muted-foreground">{content.subheading}</p>
          </div>

          {/* Image Placeholder */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/50 dark:bg-black/20 backdrop-blur">
            <div className="aspect-video flex items-center justify-center p-12">
              <div className="text-center">
                <div
                  className={`w-32 h-32 bg-white/80 dark:bg-black/40 rounded-full mx-auto mb-6 flex items-center justify-center`}
                >
                  <IconComponent className={`w-16 h-16 ${content.accentColor}`} />
                </div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">
                  [Replace with image]
                </p>
                <p className="text-xs text-muted-foreground">{content.imageSuggestion}</p>
                <p className="text-xs text-muted-foreground mt-1">Recommended: 800x450px</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            {content.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <benefit.icon
                  className={`w-6 h-6 ${content.accentColor} mr-3 flex-shrink-0 mt-0.5`}
                />
                <p className="text-lg">{benefit.text}</p>
              </div>
            ))}
          </div>

          {/* Welcome back message */}
          <div className="pt-4 border-t">
            <p className="text-lg font-semibold">{content.welcomeBack}</p>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <Image
              src="/images/wordpress-assets/taxgenius-logo.png"
              alt="Tax Genius Pro"
              width={200}
              height={50}
              className="h-12 w-auto mx-auto mb-6"
            />
            <h2 className="text-2xl font-bold mb-2">{content.ctaText}</h2>
            <p className="text-sm text-muted-foreground">
              {role === 'affiliate'
                ? 'Sign in to check your earnings and share your link'
                : role === 'preparer'
                  ? 'Access your professional dashboard'
                  : 'Continue your tax filing journey'}
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  disabled={isLoading}
                />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <a
                href="/auth/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className={`w-full h-12 text-lg ${
                role === 'affiliate' ? 'bg-yellow-500 hover:bg-yellow-600' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a
              href={`/auth/signup${role ? `?role=${role}` : ''}`}
              className="text-primary hover:underline font-semibold"
            >
              Sign up
            </a>
          </div>

          {/* Test Login Link (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-xs text-muted-foreground mb-2">🧪 Development Mode</p>
              <a
                href="/auth/test-login"
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium"
              >
                Use Test Login (Email/Password)
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}
    >
      <SignInContent />
    </Suspense>
  );
}
