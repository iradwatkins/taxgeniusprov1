import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
          <CardDescription>
            Email verification is now handled automatically by our authentication provider
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>

          <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600 dark:text-green-400">
              When you sign up, you'll receive a verification email automatically. Click the link in
              that email to verify your account.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Button asChild className="w-full" variant="default">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
            <Button asChild className="w-full" variant="outline">
              <Link href="/auth/login">Already have an account? Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
