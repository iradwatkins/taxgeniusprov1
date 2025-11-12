'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: 'Server Configuration Error',
    description:
      'There is a problem with the server configuration. Please contact support if this persists.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to sign in. Please contact an administrator.',
  },
  Verification: {
    title: 'Verification Failed',
    description: 'The verification token has expired or has already been used.',
  },
  OAuthSignin: {
    title: 'OAuth Sign In Error',
    description: 'Error occurred while trying to sign in with OAuth provider.',
  },
  OAuthCallback: {
    title: 'OAuth Callback Error',
    description: 'Error occurred during OAuth callback.',
  },
  OAuthCreateAccount: {
    title: 'OAuth Account Creation Error',
    description: 'Could not create OAuth provider account.',
  },
  EmailCreateAccount: {
    title: 'Email Account Creation Error',
    description: 'Could not create email account.',
  },
  Callback: {
    title: 'Callback Error',
    description: 'Error occurred during authentication callback.',
  },
  OAuthAccountNotLinked: {
    title: 'Account Not Linked',
    description:
      'This email is already associated with another account. Please sign in with your original method.',
  },
  EmailSignin: {
    title: 'Email Sign In Error',
    description: 'Error occurred while sending verification email.',
  },
  CredentialsSignin: {
    title: 'Sign In Failed',
    description: 'Invalid email or password. Please check your credentials and try again.',
  },
  SessionRequired: {
    title: 'Session Required',
    description: 'You must be signed in to access this page.',
  },
  Default: {
    title: 'Authentication Error',
    description: 'An error occurred during authentication. Please try again.',
  },
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';
  const errorInfo = errorMessages[error] || errorMessages.Default;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-destructive" />
        </div>
        <CardTitle className="text-2xl">{errorInfo.title}</CardTitle>
        <CardDescription className="mt-2">{errorInfo.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error === 'Configuration' && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Technical Details:</strong> The authentication system may be misconfigured.
              Please contact support@taxgeniuspro.tax
            </p>
          </div>
        )}

        {error === 'CredentialsSignin' && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Tip:</strong> Make sure you&apos;re using the correct email and password.
              Passwords are case-sensitive.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/auth/signin">Try Again</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Go Home</Link>
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Need help?{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 px-4">
      <Suspense
        fallback={
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-destructive animate-pulse" />
              </div>
              <CardTitle className="text-2xl">Loading...</CardTitle>
            </CardHeader>
          </Card>
        }
      >
        <ErrorContent />
      </Suspense>
    </div>
  );
}
