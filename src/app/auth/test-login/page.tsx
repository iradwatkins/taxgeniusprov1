'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Test Login Page - Classic Email/Password Authentication
 *
 * This page provides a simple email/password login form for testing
 * authentication flows without relying on Clerk's OAuth.
 *
 * Use this for:
 * - Testing authentication logic
 * - Debugging role-based access
 * - Development environment testing
 */

export default function TestLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/test-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setSuccess('Login successful! Redirecting...');

      // Redirect based on role
      const redirectUrl = data.redirectUrl || '/dashboard';
      setTimeout(() => {
        router.push(redirectUrl);
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick test accounts for different roles
  const testAccounts = [
    { email: 'admin@test.com', password: 'admin123', role: 'Admin' },
    { email: 'preparer@test.com', password: 'preparer123', role: 'Tax Preparer' },
    { email: 'affiliate@test.com', password: 'affiliate123', role: 'Affiliate' },
    { email: 'client@test.com', password: 'client123', role: 'Client' },
  ];

  const fillTestAccount = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Image
              src="/images/wordpress-assets/taxgenius-logo.png"
              alt="Tax Genius Pro"
              width={200}
              height={50}
              className="h-12 w-auto"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-center">Test Login</CardTitle>
            <CardDescription className="text-center mt-2">
              Classic email/password authentication for testing
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Test Accounts Quick Access */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Quick Test Accounts:
            </p>
            <div className="space-y-1">
              {testAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => fillTestAccount(account.email, account.password)}
                  className="w-full text-left text-xs bg-background hover:bg-accent rounded px-3 py-2 transition-colors"
                >
                  <span className="font-medium">{account.role}:</span>{' '}
                  <span className="text-muted-foreground">{account.email}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500 text-green-700 dark:text-green-400">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
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

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or use production login
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Button variant="outline" asChild className="w-full">
              <Link href="/auth/login">
                Login with Clerk (Production)
              </Link>
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
          <p>⚠️ This is a test authentication page</p>
          <p>Use for development and testing only</p>
        </CardFooter>
      </Card>
    </div>
  );
}
