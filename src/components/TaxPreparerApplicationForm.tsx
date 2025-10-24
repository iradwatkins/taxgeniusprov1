'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, CheckCircle, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { logger } from '@/lib/logger';

interface PreparerFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  languages: string;
  experienceLevel: string;
  taxSoftware: string[];
  smsConsent: 'yes' | 'no' | '';
}

interface TaxPreparerApplicationFormProps {
  onSubmitSuccess?: () => void;
}

export default function TaxPreparerApplicationForm({
  onSubmitSuccess,
}: TaxPreparerApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [formData, setFormData] = useState<PreparerFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    languages: '',
    experienceLevel: '',
    taxSoftware: [],
    smsConsent: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save preparer application
      const response = await fetch('/api/preparers/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      // Show calendar booking
      setShowCalendar(true);

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      logger.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.languages &&
      formData.experienceLevel &&
      formData.smsConsent === 'yes'
    );
  };

  useEffect(() => {
    if (showCalendar) {
      // Load Calendly script
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [showCalendar]);

  if (showCalendar) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl text-center">Application Received!</CardTitle>
          <CardDescription className="text-center text-base">
            Schedule your interview appointment
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted p-6 rounded-lg space-y-2">
            <p className="font-semibold">✓ We've received your application:</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                • Name: {formData.firstName} {formData.middleName} {formData.lastName}
              </li>
              <li>• Email: {formData.email}</li>
              <li>• Phone: {formData.phone}</li>
              <li>• Languages: {formData.languages}</li>
            </ul>
          </div>

          {/* Calendar Booking Component */}
          <div className="border-2 border-primary/20 rounded-lg p-6 bg-primary/5">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Book Your Interview</h3>
            </div>

            {/* Calendly Inline Widget */}
            <div
              className="calendly-inline-widget rounded-lg overflow-hidden"
              data-url={`https://calendly.com/taxgenius/preparer-interview?name=${encodeURIComponent(formData.firstName + ' ' + formData.lastName)}&email=${encodeURIComponent(formData.email)}&a1=${encodeURIComponent(formData.phone)}`}
              style={{ minWidth: '320px', height: '700px' }}
            />
          </div>

          <div className="text-sm text-center text-muted-foreground space-y-2">
            <p>📧 A confirmation email has been sent to {formData.email}</p>
            <p>📱 We'll text you at {formData.phone} with interview details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">
            <UserPlus className="w-3 h-3 mr-1" />
            Tax Preparer Application
          </Badge>
        </div>
        <CardTitle className="text-2xl">Join Tax Genius as a Preparer</CardTitle>
        <CardDescription>
          Fill out the form below to apply. After submission, you'll schedule your interview.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                required
                className="text-lg p-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                placeholder="Michael"
                className="text-lg p-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Smith"
                required
                className="text-lg p-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john.smith@example.com"
                required
                className="text-lg p-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone/Mobile (USA) *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
                required
                className="text-lg p-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages">What Languages can you speak? *</Label>
              <Select
                value={formData.languages}
                onValueChange={(value) => setFormData({ ...formData, languages: value })}
                required
              >
                <SelectTrigger className="text-lg p-6">
                  <SelectValue placeholder="- Select -" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Tax Preparation Experience *</Label>
              <Select
                value={formData.experienceLevel}
                onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}
                required
              >
                <SelectTrigger className="text-lg p-6">
                  <SelectValue placeholder="- Select -" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">New to Tax Preparation - Need Training</SelectItem>
                  <SelectItem value="INTERMEDIATE">1-3 Years of Experience</SelectItem>
                  <SelectItem value="SEASONED">Seasoned Tax Professional (3+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(formData.experienceLevel === 'INTERMEDIATE' ||
              formData.experienceLevel === 'SEASONED') && (
              <div className="space-y-3 p-4 border-2 border-primary/30 rounded-lg bg-primary/5">
                <Label className="text-base font-semibold">Tax Software Experience</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select all tax software programs you have used (check all that apply)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'ATX',
                    'CCH ProSystem',
                    'Crosslink',
                    'Drake',
                    'Lacerte',
                    'MyTaxPrep Office',
                    'ProSeries',
                    'Taxact',
                    'Taxslayer',
                    'TaxWise',
                    'Turbo Tax',
                    'Ultra Tax',
                    'None',
                    'Other',
                  ].map((software) => (
                    <label key={software} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={formData.taxSoftware.includes(software)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              taxSoftware: [...formData.taxSoftware, software],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              taxSoftware: formData.taxSoftware.filter((s) => s !== software),
                            });
                          }
                        }}
                      />
                      <span className="text-sm">{software}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
              <Label className="text-sm leading-relaxed">
                By selecting Yes below, I consent to receive text messages from Tax Genius or its
                service providers, regarding employment opportunities at the phone number above. I
                understand my consent is not a condition of employment. *
              </Label>
              <Select
                value={formData.smsConsent}
                onValueChange={(value) => setFormData({ ...formData, smsConsent: value as any })}
                required
              >
                <SelectTrigger className="text-lg p-6 h-auto">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg text-sm">
              <p className="text-blue-900 dark:text-blue-100">
                By submitting this form, you acknowledge that Tax Genius may process the data you
                provide to contact you with information related to your request/submission as
                described in our Privacy Statement.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-lg"
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? (
              <>Submitting Application...</>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Submit Application & Book Interview
              </>
            )}
          </Button>

          <div className="text-center">
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${isFormValid() ? 100 : 0}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {isFormValid() ? '✓ Ready to submit' : 'Complete all required fields'}
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
