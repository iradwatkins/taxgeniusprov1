import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, FileText, CreditCard, Shield, Clock, Calculator, PieChart } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: <Users className="h-10 w-10 text-blue-500" />,
      title: "Client Management",
      description: "Efficiently manage all your tax clients in one centralized platform"
    },
    {
      icon: <FileText className="h-10 w-10 text-green-500" />,
      title: "Document Storage",
      description: "Secure cloud storage for all tax documents with encryption"
    },
    {
      icon: <Calculator className="h-10 w-10 text-purple-500" />,
      title: "Tax Calculations",
      description: "Advanced tax calculators and estimation tools"
    },
    {
      icon: <CreditCard className="h-10 w-10 text-yellow-500" />,
      title: "Payment Processing",
      description: "Accept payments via Square, including Cash App Pay"
    },
    {
      icon: <Shield className="h-10 w-10 text-red-500" />,
      title: "Bank-Level Security",
      description: "Your data is protected with enterprise-grade encryption"
    },
    {
      icon: <Clock className="h-10 w-10 text-indigo-500" />,
      title: "Appointment Scheduling",
      description: "Easy online booking for tax consultations"
    }
  ];

  const plans = [
    {
      name: "Individual",
      price: "$49",
      description: "Perfect for personal tax filing",
      features: [
        "1 Tax Return",
        "Document Storage (5GB)",
        "Basic Support",
        "E-filing Included"
      ]
    },
    {
      name: "Professional",
      price: "$149",
      description: "For tax professionals and small firms",
      features: [
        "Unlimited Tax Returns",
        "Document Storage (50GB)",
        "Priority Support",
        "Client Portal",
        "Payment Processing",
        "Appointment Scheduling"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large tax firms",
      features: [
        "Everything in Professional",
        "Unlimited Storage",
        "Dedicated Support",
        "Custom Integrations",
        "White Labeling",
        "API Access"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <PieChart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Tax Genius Pro</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional Tax Management
            <span className="text-blue-600"> Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Complete tax preparation, document management, and client portal solution.
            Trusted by thousands of tax professionals and individuals.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Tax Season
          </h2>
          <p className="text-xl text-gray-600">
            Comprehensive tools to streamline your tax preparation process
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20 bg-gray-50 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600">
            Choose the plan that fits your needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'border-blue-600 border-2' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-gray-600">/year</span>}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full mt-6" 
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-blue-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Simplify Your Tax Process?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied users and start your free trial today
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="px-8">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <PieChart className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">Tax Genius Pro</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gray-900">Terms of Service</Link>
              <Link href="/contact" className="hover:text-gray-900">Contact</Link>
            </div>
          </div>
          <div className="text-center mt-8 text-sm text-gray-500">
            © 2024 Tax Genius Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}