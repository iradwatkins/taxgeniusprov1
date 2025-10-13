import TaxPreparerApplicationForm from '@/components/TaxPreparerApplicationForm';
import { CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Tax Genius New Preparer Form | Start Your Application',
  description: 'You are on your way to becoming a tax preparer! Fill out your information and schedule your appointment.',
};

export default function PreparerStartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tax Genius New Preparer Form
          </h1>
          <p className="text-xl">
            Thanks for showing interest in our Tax Genius Tax preparation program. Fill out the information below,
            Setup an appointment and someone will call you to discuss your next steps.
          </p>
        </div>
      </section>

      {/* Benefits Banner */}
      <section className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">WORK FROM HOME AS A REMOTE WORKERS!!!</h2>
            <p className="text-xl text-muted-foreground">
              Want a job that works around you for a change? Enjoy a flexible schedule, earning extra income,
              perfecting a life skill that helps millions every year, and more as a TAX GENIUS PRO.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "💰",
                title: "High Income Potential",
                description: "Unlock High Earning Potential. Explore opportunities for additional income that can boost your financial goals year-round."
              },
              {
                icon: "⏰",
                title: "Flexible Hours",
                description: "Work from the comfort of your home or any chosen location, set your own hours, and take charge of your schedule."
              },
              {
                icon: "📊",
                title: "Career Stability",
                description: "A career in the tax business offers stability due to the constant need for tax services, regardless of economic conditions."
              },
              {
                icon: "✨",
                title: "AND MUCH, MUCH, MORE",
                description: "Free training, marketing materials, 24/7 support, and a community of successful tax preparers."
              }
            ].map((benefit, i) => (
              <div key={i} className="bg-card border rounded-xl p-6 text-center">
                <div className="text-5xl mb-3">{benefit.icon}</div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <h3 className="font-bold">{benefit.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Image Placeholder */}
            <div className="hidden lg:block sticky top-24">
              <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="text-8xl mb-4">💼</div>
                    <p className="text-lg font-semibold text-muted-foreground">[Success Image Placeholder]</p>
                    <p className="text-sm text-muted-foreground">Happy tax preparer celebrating success</p>
                    <p className="text-xs text-muted-foreground/60">Recommended size: 600x800px</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div>
              <TaxPreparerApplicationForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 px-4 bg-primary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-2xl font-bold mb-4">
            Still Have Questions?
          </h3>
          <p className="text-lg mb-4">
            Questions? Call us at <a href="tel:+15551234567" className="text-primary font-semibold">(555) 123-4567</a> or email <a href="mailto:careers@taxgenius.com" className="text-primary font-semibold">careers@taxgenius.com</a>
          </p>
        </div>
      </section>
    </div>
  );
}
