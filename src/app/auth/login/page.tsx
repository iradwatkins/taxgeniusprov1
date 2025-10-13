'use client';

import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { DollarSign, Shield, Award, CheckCircle, TrendingUp, Users, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Suspense } from 'react';

function LoginContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'client';

  // Role-specific content
  const roleContent = {
    client: {
      badge: 'Welcome Back',
      icon: Shield,
      heading: 'Continue Your Tax Filing',
      subheading: 'Sign in to access your tax documents, track your refund, and manage your account',
      benefits: [
        { icon: CheckCircle, text: 'Pick up where you left off' },
        { icon: TrendingUp, text: 'Track your refund status' },
        { icon: Shield, text: 'Secure & encrypted' },
      ],
      ctaText: 'Sign In to Your Account',
      imageSuggestion: 'Professional reviewing documents confidently',
      theme: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      accentColor: 'text-blue-600 dark:text-blue-400',
      welcomeBack: 'Welcome back! Let\'s get your taxes done.',
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
    referrer: {
      badge: '💰 Referrer Portal',
      icon: DollarSign,
      heading: 'Welcome Back!',
      subheading: 'Check your earnings, share your link, and see how much money you\'ve made!',
      benefits: [
        { icon: Zap, text: 'See your earnings instantly' },
        { icon: TrendingUp, text: 'Track active referrals' },
        { icon: DollarSign, text: 'Request payouts' },
      ],
      ctaText: 'Sign In & Start Earning',
      imageSuggestion: 'Person checking earnings on phone happily',
      theme: 'from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-800/20',
      accentColor: 'text-yellow-600 dark:text-yellow-400',
      welcomeBack: 'Let\'s see how much you\'ve earned! 🤑',
    },
  };

  const content = roleContent[role as keyof typeof roleContent] || roleContent.client;
  const IconComponent = content.icon;

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Role-specific messaging with image */}
      <div className={`relative bg-gradient-to-br ${content.theme} p-8 lg:p-16 flex flex-col justify-center`}>
        <div className="max-w-lg mx-auto space-y-8">
          <div>
            <Badge className="mb-4 text-base px-4 py-2">
              <IconComponent className="w-5 h-5 mr-2" />
              {content.badge}
            </Badge>

            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {content.heading}
            </h1>

            <p className="text-xl text-muted-foreground">
              {content.subheading}
            </p>
          </div>

          {/* Image Placeholder */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/50 dark:bg-black/20 backdrop-blur">
            <div className="aspect-video flex items-center justify-center p-12">
              <div className="text-center">
                <div className={`w-32 h-32 bg-white/80 dark:bg-black/40 rounded-full mx-auto mb-6 flex items-center justify-center`}>
                  <IconComponent className={`w-16 h-16 ${content.accentColor}`} />
                </div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">
                  [Replace with image]
                </p>
                <p className="text-xs text-muted-foreground">
                  {content.imageSuggestion}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 800x450px
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            {content.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <benefit.icon className={`w-6 h-6 ${content.accentColor} mr-3 flex-shrink-0 mt-0.5`} />
                <p className="text-lg">{benefit.text}</p>
              </div>
            ))}
          </div>

          {/* Welcome back message */}
          <div className="pt-4 border-t">
            <p className="text-lg font-semibold">
              {content.welcomeBack}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Clerk SignIn Form */}
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
              {role === 'referrer'
                ? 'Sign in to check your earnings and share your link'
                : role === 'preparer'
                ? 'Access your professional dashboard'
                : 'Continue your tax filing journey'
              }
            </p>
          </div>

          <SignIn
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-xl border-2 border-primary/10',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'border-2 hover:bg-accent',
                formButtonPrimary: `bg-primary hover:bg-primary/90 text-lg py-3 ${
                  role === 'referrer' ? 'bg-yellow-500 hover:bg-yellow-600' : ''
                }`,
                footerActionLink: 'text-primary hover:text-primary/80',
                formFieldInput__emailAddress: 'hidden',
                formFieldInput__password: 'hidden',
                formFieldLabel__emailAddress: 'hidden',
                formFieldLabel__password: 'hidden',
                identityPreviewEditButton: 'hidden',
              },
            }}
            forceRedirectUrl="/dashboard"
            signUpUrl="/auth/signup"
          />

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a href={`/auth/signup${role ? `?role=${role}` : ''}`} className="text-primary hover:underline font-semibold">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
