import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Calculator, TrendingUp, Globe } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const userRole = localStorage.getItem("userRole");

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (userRole) {
      navigate("/dashboard");
    }
  }, [userRole, navigate]);

  const features = [
    {
      icon: Shield,
      title: "Secure & Professional",
      description: "Bank-level security for your sensitive tax information"
    },
    {
      icon: Calculator,
      title: "Expert Preparation",
      description: "Certified tax professionals handle your returns"
    },
    {
      icon: TrendingUp,
      title: "Maximize Refunds",
      description: "Find every deduction and credit you qualify for"
    },
    {
      icon: Users,
      title: "Referral Rewards",
      description: "Earn money by referring friends and family"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          {i18n.language === 'en' ? 'ES' : 'EN'}
        </Button>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            {t('welcome')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Professional tax preparation made simple. Get maximum refunds with expert help and earn rewards through our referral program.
          </p>
          
          <div className="flex gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={() => navigate("/login")}
              className="px-8"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/login")}
              className="px-8"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 p-8 bg-primary/5 rounded-lg max-w-2xl mx-auto border border-primary/20">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to start your tax preparation?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of satisfied customers who trust Tax Genius with their tax returns.
          </p>
          <Button 
            variant="success" 
            size="lg"
            onClick={() => navigate("/login")}
            className="px-8"
          >
            Start Your Return Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
