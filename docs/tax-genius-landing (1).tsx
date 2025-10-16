import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Calculator, 
  CreditCard, 
  Shield, 
  Calendar,
  CheckCircle,
  Star,
  ArrowRight,
  Zap
} from 'lucide-react';

export default function TaxGeniusLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Tax Genius Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Sign In</Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Trusted by thousands of tax professionals
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Professional Tax Management
              <span className="block text-blue-600">Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Complete tax preparation, document management, and client portal solution. 
              Trusted by thousands of tax professionals and individuals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Tax Season
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools to streamline your tax preparation process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Client Management",
                description: "Efficiently manage all your tax clients in one centralized platform"
              },
              {
                icon: FileText,
                title: "Document Storage",
                description: "Secure cloud storage for all tax documents with encryption"
              },
              {
                icon: Calculator,
                title: "Tax Calculations",
                description: "Advanced tax calculators and estimation tools"
              },
              {
                icon: CreditCard,
                title: "Payment Processing",
                description: "Accept payments via Square, including Cash App Pay"
              },
              {
                icon: Shield,
                title: "Bank-Level Security",
                description: "Your data is protected with enterprise-grade encryption"
              },
              {
                icon: Calendar,
                title: "Appointment Scheduling",
                description: "Easy online booking for tax consultations"
              }
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-sm">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Individual Plan */}
            <Card className="relative border-2 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Individual</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-gray-600">/year</span>
                </div>
                <CardDescription className="mt-2">Perfect for personal tax filing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "1 Tax Return",
                  "Document Storage (5GB)",
                  "Basic Support",
                  "E-filing Included"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
                <Button className="w-full mt-8" variant="outline">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="relative border-2 border-blue-200 hover:shadow-xl transition-shadow duration-300 scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
              </div>
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl">Professional</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$149</span>
                  <span className="text-gray-600">/year</span>
                </div>
                <CardDescription className="mt-2">For tax professionals and small firms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Unlimited Tax Returns",
                  "Document Storage (50GB)",
                  "Priority Support",
                  "Client Portal",
                  "Payment Processing",
                  "Appointment Scheduling"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
                <Button className="w-full mt-8 bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative border-2 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
                <CardDescription className="mt-2">For large tax firms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Everything in Professional",
                  "Unlimited Storage",
                  "Dedicated Support",
                  "Custom Integrations",
                  "White Labeling",
                  "API Access"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
                <Button className="w-full mt-8" variant="outline">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 bg-gray-50/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Loved by Millions of Americans
          </h2>
          <div className="flex justify-center items-center space-x-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-2xl font-bold ml-4">4.9/5</span>
          </div>
          <div className="bg-white rounded-2xl p-12 shadow-sm">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <blockquote className="text-xl text-gray-700 italic mb-6">
              &quot;Tax Genius Pro has completely transformed how we handle tax season.
              The client portal and document management features are game-changers.&quot;
            </blockquote>
            <div className="text-gray-600">
              <div className="font-semibold">Sarah Johnson</div>
              <div>CPA, Johnson Tax Services</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Simplify Your Tax Process?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied users and start your free trial today
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Tax Genius Pro</span>
              </div>
              <p className="text-gray-400">
                Professional tax management made simple.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Tax Genius Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}