import { Metadata } from 'next';
import { Suspense } from 'react';
import SimpleTaxForm from '@/components/SimpleTaxForm';
import { ShortLinkTracker } from '@/components/tracking/ShortLinkTracker';

export const metadata: Metadata = {
  title: 'File Your Tax Return - Tax Genius Pro',
  description:
    'Complete your tax return in minutes. Simple questions, expert review, maximum refund guaranteed.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TaxFormPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-background to-green-50 py-12">
      {/* Track short link clicks */}
      <Suspense fallback={null}>
        <ShortLinkTracker />
      </Suspense>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Start Your Tax Return</h1>
          <p className="text-lg text-muted-foreground">
            Answer a few quick questions. No signup required to start.
          </p>
        </div>

        <SimpleTaxForm />
      </div>
    </div>
  );
}
