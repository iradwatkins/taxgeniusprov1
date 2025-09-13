import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Shield, Globe, Loader2 } from "lucide-react";
import { useAuth } from "@/core/providers/AuthProvider";

type UserRole = 'client' | 'referrer' | 'preparer';

const Login = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { signIn, signUp, signInWithMagicLink, signInWithGoogle, user } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("client");
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  // Redirect if already authenticated
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isNewUser) {
        if (password !== confirmPassword) {
          setError(t('auth.passwordMismatch') || 'Passwords do not match');
          return;
        }

        const { error } = await signUp(email, password, selectedRole);
        if (error) {
          setError(error.message);
        } else {
          setSuccess(t('auth.checkEmail') || 'Check your email to confirm your account');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");
    
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLinkAuth = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error } = await signInWithMagicLink(email);
      if (error) {
        setError(error.message);
      } else {
        setSuccess(t('auth.magicLinkSent') || 'Magic link sent to your email!');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
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

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Tax Genius</h1>
          <p className="text-muted-foreground">{t('welcome')}</p>
        </div>

        <Card className="shadow-lg border-border">
          <CardHeader>
            <CardTitle className="text-center">
              {isNewUser ? t('auth.register') : t('auth.login')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            {/* Role Selection for New Users */}
            {isNewUser && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t('roles.selectRole')}</Label>
                <RadioGroup
                  value={selectedRole}
                  onValueChange={(value) => setSelectedRole(value as UserRole)}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="client" id="client" />
                    <Label htmlFor="client">
                      {t('roles.client')} - {t('roles.clientDescription')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="referrer" id="referrer" />
                    <Label htmlFor="referrer">
                      {t('roles.referrer')} - {t('roles.referrerDescription')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="preparer" id="preparer" />
                    <Label htmlFor="preparer">
                      {t('roles.preparer')} - {t('roles.preparerDescription')}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="email">{t('auth.email')}</TabsTrigger>
                <TabsTrigger value="google">Google</TabsTrigger>
                <TabsTrigger value="magic">{t('auth.magicLink')}</TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="enter@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  {isNewUser && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isNewUser ? t('auth.register') : t('auth.login')}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="google" className="space-y-4">
                <Button
                  variant="outline"
                  onClick={handleGoogleAuth}
                  className="w-full"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {t('auth.signInWithGoogle')}
                </Button>
              </TabsContent>

              <TabsContent value="magic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="magic-email">{t('auth.email')}</Label>
                  <Input
                    id="magic-email"
                    type="email"
                    placeholder="enter@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <Button onClick={handleMagicLinkAuth} className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Mail className="h-4 w-4 mr-2" />
                  {t('auth.magicLink')}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => setIsNewUser(!isNewUser)}
                className="text-primary hover:underline"
                disabled={loading}
              >
                {isNewUser
                  ? t('auth.alreadyHaveAccount')
                  : t('auth.dontHaveAccount')}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;