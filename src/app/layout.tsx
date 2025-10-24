import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/theme-provider';
import { Providers } from '@/lib/providers';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ClerkProvider } from '@clerk/nextjs';
import { ConditionalFooter } from '@/components/ConditionalFooter';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Tax Genius Pro - Professional Tax Management Platform',
  description:
    'Complete tax preparation, document management, and client portal solution for tax professionals and individuals',
  keywords:
    'tax preparation, tax management, tax software, tax filing, document management, client portal',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '100x100', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon-32x32.png',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#ff6b35',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tax Genius Pro',
  },
  openGraph: {
    title: 'Tax Genius Pro - Professional Tax Management Platform',
    description: 'Streamline your tax preparation process with our comprehensive platform',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <GoogleAnalytics />
        </head>
        <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              <ErrorBoundary>
                <TooltipProvider>
                  {children}
                  <ConditionalFooter />
                  <Toaster />
                  <Sonner />
                </TooltipProvider>
              </ErrorBoundary>
            </Providers>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
