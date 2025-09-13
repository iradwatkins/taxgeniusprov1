import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Tax Genius Pro - Professional Tax Management Platform",
  description: "Complete tax preparation, document management, and client portal solution for tax professionals and individuals",
  keywords: "tax preparation, tax management, tax software, tax filing, document management, client portal",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}