'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, ArrowRight, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function PreparerJobFormPage() {
  const t = useTranslations('apply');
  const tCommon = useTranslations('common');

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    languages: '',
    smsConsent: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLanguageChange = (value: string) => {
    setFormData({
      ...formData,
      languages: value,
    });
  };

  const handleSmsConsentChange = (value: string) => {
    setFormData({
      ...formData,
      smsConsent: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/admin/preparer-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-2 border-green-500">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">{t('success.title')}</h2>
              <p className="text-lg text-muted-foreground mb-6">
                {t('success.message')}
              </p>
              <p className="text-muted-foreground mb-8">
                {t('success.contactMessage')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/admin/preparer-landing">
                  <Button size="lg" variant="outline">
                    {t('success.backToLanding')}
                  </Button>
                </Link>
                <Link href="/admin/tax-course">
                  <Button size="lg" className="bg-[#4054b2] hover:bg-[#2a3a7a]">
                    {t('success.viewTraining')} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-[#4054b2] to-[#2a3a7a] text-white py-12 px-4 mb-12 rounded-2xl">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t('header.title')}
          </h1>
          <p className="text-xl">
            {t('header.subtitle')}
          </p>
        </div>
      </section>

      {/* Form Section */}
      <div className="container mx-auto max-w-3xl">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">{t('form.title')}</CardTitle>
            <CardDescription className="text-base">
              {t('form.description')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    {t('form.firstName')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder={t('form.firstNamePlaceholder')}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middleName">{t('form.middleName')}</Label>
                  <Input
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    placeholder={t('form.middleNamePlaceholder')}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    {t('form.lastName')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder={t('form.lastNamePlaceholder')}
                    required
                    className="h-12"
                  />
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {t('form.email')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t('form.emailPlaceholder')}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    {t('form.phone')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t('form.phonePlaceholder')}
                    required
                    className="h-12"
                  />
                </div>
              </div>

              {/* Languages Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="languages">
                  {t('form.languages')} <span className="text-destructive">*</span>
                </Label>
                <Select onValueChange={handleLanguageChange} required>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={t('form.languagesPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">{t('form.languageEnglish')}</SelectItem>
                    <SelectItem value="spanish">{t('form.languageSpanish')}</SelectItem>
                    <SelectItem value="english-spanish">{t('form.languageBoth')}</SelectItem>
                    <SelectItem value="french">{t('form.languageFrench')}</SelectItem>
                    <SelectItem value="mandarin">{t('form.languageMandarin')}</SelectItem>
                    <SelectItem value="other">{t('form.languageOther')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* SMS Consent */}
              <div className="space-y-3 border-t pt-6">
                <Label className="text-base font-semibold">
                  {t('form.smsConsent')} <span className="text-destructive">*</span>
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('form.smsConsentQuestion')}
                </p>
                <RadioGroup onValueChange={handleSmsConsentChange} required>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="yes" id="sms-yes" />
                    <Label htmlFor="sms-yes" className="cursor-pointer flex-1 font-normal">
                      {t('form.smsConsentYes')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="no" id="sms-no" />
                    <Label htmlFor="sms-no" className="cursor-pointer flex-1 font-normal">
                      {t('form.smsConsentNo')}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
                  <p className="text-sm font-medium">{submitError}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg bg-[#4054b2] hover:bg-[#2a3a7a]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('form.submitting') : t('form.submitButton')}
                  {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5" />}
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground pt-2">
                {t('form.privacyText')}{' '}
                <a href="/terms" className="text-[#4054b2] hover:underline">
                  {t('form.termsLink')}
                </a>{' '}
                {t('form.and')}{' '}
                <a href="/privacy" className="text-[#4054b2] hover:underline">
                  {t('form.privacyLink')}
                </a>
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            {t('footer.question')}{' '}
            <a href="mailto:careers@taxgeniuspro.tax" className="text-[#4054b2] hover:underline font-medium">
              {t('footer.contactTeam')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
