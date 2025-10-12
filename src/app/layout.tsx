import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/components/theme-provider'
import { Providers } from '@/lib/providers'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ClerkProvider } from '@clerk/nextjs'
import { Footer } from '@/components/footer'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Tax Genius Pro - Professional Tax Management Platform",
  description: "Complete tax preparation, document management, and client portal solution for tax professionals and individuals",
  keywords: "tax preparation, tax management, tax software, tax filing, document management, client portal",
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#ff6b35',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tax Genius Pro'
  },
  openGraph: {
    title: "Tax Genius Pro - Professional Tax Management Platform",
    description: "Streamline your tax preparation process with our comprehensive platform",
    type: "website",
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
        <body
          className={`${inter.variable} font-sans antialiased min-h-screen`}
        >
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
                  <Footer />
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