'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  DollarSign,
  Shield,
  Award,
  CheckCircle,
  TrendingUp,
  Users,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

function SignUpContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get('role') || 'client';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Role-specific content
  const roleContent = {
    client: {
      badge: 'Professional Tax Services',
      icon: Shield,
      heading: 'Get Your Taxes Done by Professionals',
      subheading:
        'Join 50,000+ satisfied customers who trust us for accurate, stress-free tax filing',
      benefits: [
        { icon: CheckCircle, text: 'Maximum refund guaranteed' },
        { icon: Shield, text: 'IRS-certified CPAs' },
        { icon: TrendingUp, text: 'Average refund: $3,259' },
      ],
      ctaText: 'Start Your Free Tax Filing',
      imageSuggestion: 'Happy family receiving tax refund',
      theme: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      accentColor: 'text-blue-600 dark:text-blue-400',
    },
    preparer: {
      badge: 'Career Opportunity',
      icon: Award,
      heading: 'Build Your Tax Preparation Career',
      subheading:
        'Join our network of professional tax preparers. Flexible hours, remote work, earn $45-75 per return',
      benefits: [
        { icon: DollarSign, text: 'Earn up to $5,000/month' },
        { icon: Users, text: '100% remote - work from anywhere' },
        { icon: Shield, text: 'E&O insurance included' },
      ],
      ctaText: 'Start Your Application',
      imageSuggestion: 'Professional tax preparer working confidently',
      theme: 'from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20',
      accentColor: 'text-blue-600 dark:text-blue-400',
    },
    affiliate: {
      badge: '💰 Start Earning Today',
      icon: DollarSign,
      heading: 'Start Making Money Now!',
      subheading:
        'Earn up to $50 for each friend you refer. Easy money, unlimited potential. Join thousands earning extra cash!',
      benefits: [
        { icon: DollarSign, text: 'Up to $50 per referral - No limits!' },
        { icon: TrendingUp, text: 'Get paid within 7 days' },
        { icon: CheckCircle, text: 'Super easy - just share your link' },
      ],
      ctaText: 'Get Your Referral Link Now',
      imageSuggestion: 'Excited people celebrating money earnings',
      theme: 'from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-800/20',
      accentColor: 'text-yellow-600 dark:text-yellow-400',
    },
  };

  const content = roleContent[role as keyof typeof roleContent] || roleContent.client;
  const IconComponent = content.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Create user account
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create account');
        setIsLoading(false);
        return;
      }

      // Account created successfully - redirect to select role or dashboard
      router.push('/auth/select-role');
    } catch (error) {
      console.error('Sign up error:', error);
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

          {/* Trust indicators */}
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              {role === 'affiliate'
                ? '🔥 Join 10,000+ people already earning extra cash'
                : role === 'preparer'
                  ? '✓ Trusted by 500+ professional tax preparers'
                  : '✓ Trusted by 50,000+ satisfied customers'}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
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
                ? 'Create your account and start earning in minutes'
                : role === 'preparer'
                  ? 'Create your professional account to get started'
                  : 'Create your account to begin filing'}
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                className="h-12"
              />
            </div>

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
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={isLoading}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-12"
              />
            </div>

            <div className="text-xs text-muted-foreground">
              By creating an account, you agree to our{' '}
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
              .
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <a
              href={`/auth/signin${role ? `?role=${role}` : ''}`}
              className="text-primary hover:underline font-semibold"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}
    >
      <SignUpContent />
    </Suspense>
  );
}
