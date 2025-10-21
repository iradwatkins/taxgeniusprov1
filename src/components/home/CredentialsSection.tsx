'use client';

import { Shield, Award, CheckCircle } from 'lucide-react';

const credentials = [
  {
    icon: Shield,
    title: 'IRS E-File Provider',
    subtitle: 'Authorized',
    color: 'text-primary',
  },
  {
    icon: Award,
    title: 'BBB Accredited',
    subtitle: 'A+ Rating',
    color: 'text-primary',
  },
  {
    icon: CheckCircle,
    title: 'State Licensed',
    subtitle: 'CPA Board Certified',
    color: 'text-primary',
  },
  {
    icon: Shield,
    title: '256-Bit SSL',
    subtitle: 'Bank-Level Security',
    color: 'text-success',
  },
];

export function CredentialsSection() {
  return (
    <section className="py-16 bg-muted/50 border-y">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3">Trusted & Certified</h2>
          <p className="text-muted-foreground">Licensed professionals with verified credentials</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {credentials.map((credential, index) => (
            <div key={index} className="text-center group">
              <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
                <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <credential.icon className={`w-12 h-12 ${credential.color}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">📸 150×150px</p>
                  <p className="font-semibold">{credential.title}</p>
                  <p className="text-sm text-muted-foreground">{credential.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            All our preparers are licensed, bonded, and insured for your protection
          </p>
        </div>
      </div>
    </section>
  );
}
