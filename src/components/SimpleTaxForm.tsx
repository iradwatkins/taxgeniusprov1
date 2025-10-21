'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, Upload, FileUp, Share2, Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { logger } from '@/lib/logger';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PreparerCard } from '@/components/PreparerCard';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';

// Tax intake form data structure
interface TaxFormData {
  // Page 2: Personal Information
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
  country_code: string;

  // Page 3: Address
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  zip_code: string;

  // Page 4: Identity Information
  date_of_birth: string;
  ssn: string;

  // Page 5: Dependent Status
  claimed_as_dependent: 'no' | 'yes' | '';

  // Page 6: Employment & Filing Status
  filing_status: string;
  employment_type: 'W2' | '1099' | 'Both' | '';
  occupation: string;

  // Page 7: Education
  in_college: 'no' | 'yes' | '';

  // Page 8: Dependents
  has_dependents: 'none' | 'yes' | '';
  number_of_dependents: string;
  dependents_under_24_student_or_disabled: 'no' | 'yes' | '';
  dependents_in_college: 'no' | 'yes' | '';
  child_care_provider: 'no' | 'yes' | '';

  // Page 9: Property
  has_mortgage: 'no' | 'yes' | '';

  // Page 10: Tax Credits
  denied_eitc: 'no' | 'yes' | '';

  // Page 11: IRS PIN
  has_irs_pin: 'no' | 'yes' | 'yes_locate' | '';
  irs_pin: string;

  // Page 12: Refund Advance
  wants_refund_advance: 'no' | 'yes' | '';

  // Page 13: Identification Documents
  drivers_license: string;
  license_expiration: string;
  license_file: File | null;
}

interface PreparerInfo {
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  companyName?: string | null;
  licenseNo?: string | null;
  bio?: string | null;
}

export default function SimpleTaxForm() {
  const { user, isLoaded } = useUser();
  const [page, setPage] = useState(1);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [preparer, setPreparer] = useState<PreparerInfo | null>(null);
  const [formData, setFormData] = useState<TaxFormData>({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
    country_code: '+1',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zip_code: '',
    date_of_birth: '',
    ssn: '',
    claimed_as_dependent: 'no',
    filing_status: '',
    employment_type: '',
    occupation: '',
    in_college: 'no',
    has_dependents: 'none',
    number_of_dependents: '',
    dependents_under_24_student_or_disabled: 'no',
    dependents_in_college: 'no',
    child_care_provider: 'no',
    has_mortgage: 'no',
    denied_eitc: 'no',
    has_irs_pin: 'no',
    irs_pin: '',
    wants_refund_advance: 'no',
    drivers_license: '',
    license_expiration: '',
    license_file: null,
  });

  // Fetch preparer info on mount
  useEffect(() => {
    const fetchPreparerInfo = async () => {
      try {
        const response = await fetch('/api/preparer/info');
        if (response.ok) {
          const data = await response.json();
          if (data.preparer) {
            setPreparer(data.preparer);
            logger.info('Preparer info loaded', { preparer: data.preparer.firstName });
          }
        }
      } catch (error) {
        logger.error('Error fetching preparer info:', error);
      }
    };

    fetchPreparerInfo();
  }, []);

  // Auto-fill email from authenticated user
  useEffect(() => {
    if (isLoaded && user && user.emailAddresses && user.emailAddresses.length > 0) {
      const userEmail = user.emailAddresses[0].emailAddress;
      setFormData(prev => ({
        ...prev,
        email: userEmail
      }));
      logger.info('Email auto-filled from authenticated user', { email: userEmail });
    }
  }, [isLoaded, user]);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Desktop has 10 pages, mobile has 14
  const totalPages = isDesktop ? 10 : 14;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        license_file: e.target.files[0],
      });
    }
  };

  // Save lead data to database
  const saveLeadData = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/tax-intake/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.first_name,
          middle_name: formData.middle_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          country_code: formData.country_code,
          address_line_1: formData.address_line_1,
          address_line_2: formData.address_line_2,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save lead data');
      }

      const data = await response.json();
      logger.info('Lead saved:', data.leadId);
    } catch (error) {
      logger.error('Error saving lead:', error);
      // Continue anyway - don't block the user
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    // Save lead data after personal info + address pages
    if ((isDesktop && page === 2) || (!isDesktop && page === 3)) {
      await saveLeadData();
    }

    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    // Save to localStorage
    localStorage.setItem('taxFormData', JSON.stringify(formData));

    // Check if user is authenticated
    if (user && isLoaded) {
      // Authenticated user: show thank you page, then auto-redirect to dashboard
      logger.info('Authenticated user submitted tax form', { userId: user.id });
      setShowThankYou(true);
    } else {
      // Unauthenticated user: redirect to signup, then to referral tab
      logger.info('Unauthenticated user submitted tax form, redirecting to signup');
      window.location.href = `/auth/signup?email=${encodeURIComponent(formData.email)}&hint=tax_client&redirect_url=/dashboard/client?tab=referrals`;
    }
  };

  const isPageValid = (): boolean => {
    if (isDesktop) {
      // Desktop: 10 grouped pages
      switch (page) {
        case 1:
          return true; // Welcome
        case 2:
          return !!(
            formData.first_name &&
            formData.last_name &&
            formData.email &&
            formData.phone &&
            formData.address_line_1 &&
            formData.city &&
            formData.state &&
            formData.zip_code
          ); // Personal + Address
        case 3:
          return !!(formData.date_of_birth && formData.ssn); // Identity
        case 4:
          return !!(
            formData.claimed_as_dependent &&
            formData.filing_status &&
            formData.employment_type &&
            formData.occupation
          ); // Dependent Status + Filing
        case 5:
          return !!(
            formData.in_college &&
            formData.has_dependents &&
            (formData.has_dependents === 'none' || formData.number_of_dependents)
          ); // Education + Dependents
        case 6:
          return !!formData.has_mortgage; // Mortgage
        case 7:
          return !!(formData.denied_eitc && formData.has_irs_pin); // Tax Credits + IRS PIN
        case 8:
          return !!formData.wants_refund_advance; // Refund Advance
        case 9:
          return !!(formData.drivers_license && formData.license_expiration); // ID Documents
        case 10:
          return true; // Congratulations
        default:
          return false;
      }
    } else {
      // Mobile: 14 individual pages
      switch (page) {
        case 1:
          return true; // Welcome
        case 2:
          return !!(formData.first_name && formData.last_name && formData.email && formData.phone);
        case 3:
          return !!(
            formData.address_line_1 &&
            formData.city &&
            formData.state &&
            formData.zip_code
          );
        case 4:
          return !!(formData.date_of_birth && formData.ssn);
        case 5:
          return !!formData.claimed_as_dependent;
        case 6:
          return !!(formData.filing_status && formData.employment_type && formData.occupation);
        case 7:
          return !!formData.in_college;
        case 8:
          return !!(
            formData.has_dependents &&
            (formData.has_dependents === 'none' || formData.number_of_dependents)
          );
        case 9:
          return !!formData.has_mortgage;
        case 10:
          return !!formData.denied_eitc;
        case 11:
          return !!formData.has_irs_pin;
        case 12:
          return !!formData.wants_refund_advance;
        case 13:
          return !!(formData.drivers_license && formData.license_expiration);
        case 14:
          return true; // Congratulations
        default:
          return false;
      }
    }
  };

  // Map desktop page to mobile pages for rendering
  const getPageContent = () => {
    if (isDesktop) {
      // Desktop pages (grouped)
      switch (page) {
        case 1:
          return <WelcomePage onNext={handleNext} />;
        case 2:
          return (
            <PersonalAndAddressPage
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
            />
          );
        case 3:
          return <IdentityPage formData={formData} handleInputChange={handleInputChange} />;
        case 4:
          return (
            <DependentAndFilingPage
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
            />
          );
        case 5:
          return (
            <EducationAndDependentsPage
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
            />
          );
        case 6:
          return <MortgagePage formData={formData} setFormData={setFormData} />;
        case 7:
          return (
            <TaxCreditsAndPinPage
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
            />
          );
        case 8:
          return <RefundAdvancePage formData={formData} setFormData={setFormData} />;
        case 9:
          return (
            <IdDocumentsPage
              formData={formData}
              handleInputChange={handleInputChange}
              handleFileChange={handleFileChange}
            />
          );
        case 10:
          return <CongratulationsPage handleSubmit={handleSubmit} />;
        default:
          return null;
      }
    } else {
      // Mobile pages (individual)
      switch (page) {
        case 1:
          return <WelcomePage onNext={handleNext} />;
        case 2:
          return (
            <PersonalInfoPage
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
            />
          );
        case 3:
          return <AddressPage formData={formData} handleInputChange={handleInputChange} />;
        case 4:
          return <IdentityPage formData={formData} handleInputChange={handleInputChange} />;
        case 5:
          return <DependentStatusPage formData={formData} setFormData={setFormData} />;
        case 6:
          return (
            <FilingStatusPage
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
            />
          );
        case 7:
          return <EducationPage formData={formData} setFormData={setFormData} />;
        case 8:
          return <DependentsPage formData={formData} setFormData={setFormData} />;
        case 9:
          return <MortgagePage formData={formData} setFormData={setFormData} />;
        case 10:
          return <TaxCreditsPage formData={formData} setFormData={setFormData} />;
        case 11:
          return (
            <IrsPinPage
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
            />
          );
        case 12:
          return <RefundAdvancePage formData={formData} setFormData={setFormData} />;
        case 13:
          return (
            <IdDocumentsPage
              formData={formData}
              handleInputChange={handleInputChange}
              handleFileChange={handleFileChange}
            />
          );
        case 14:
          return <CongratulationsPage handleSubmit={handleSubmit} />;
        default:
          return null;
      }
    }
  };

  // Show thank you page for authenticated users after submission
  if (showThankYou) {
    return (
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        <CardContent className="p-8">
          <ThankYouPage />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Preparer Card - Show on all pages if preparer is assigned */}
      {preparer && page > 1 && (
        <PreparerCard preparer={preparer} />
      )}

      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        {/* Progress Header */}
        {page > 1 && page < totalPages && (
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="text-sm">
                Page {page} of {totalPages}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {Math.round(((page - 1) / (totalPages - 1)) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((page - 1) / (totalPages - 1)) * 100}%` }}
              />
            </div>
          </CardHeader>
        )}

        <CardContent className="space-y-6 p-8">
          {getPageContent()}

          {/* Navigation Buttons */}
          {page > 1 && page < totalPages && (
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={handleBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                type="button"
                size="lg"
                className="flex-1"
                onClick={handleNext}
                disabled={!isPageValid() || isSaving}
              >
                {isSaving ? 'Saving...' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Individual Page Components

function ThankYouPage() {
  useEffect(() => {
    // Auto-redirect to client dashboard after 3 seconds
    const timer = setTimeout(() => {
      window.location.href = '/dashboard/client?tab=referrals';
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 text-center py-12">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Thank You!</h2>
        <p className="text-xl text-muted-foreground">
          Your tax information has been submitted successfully.
        </p>
        <p className="text-lg">
          Get your referral link and start earning money by referring friends!
        </p>
      </div>
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Please wait</span>
      </div>
    </div>
  );
}

function WelcomePage({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-8 text-center py-8">
      {/* Tax Genius Logo */}
      <div className="flex justify-center">
        <Image
          src="/images/tax-genius-logo.png"
          alt="Tax Genius Pro - Owliver"
          width={240}
          height={120}
          className="h-24 w-auto"
          priority
        />
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Hi! I'm Owliver</h2>
        <p className="text-xl text-muted-foreground">
          Your trusted Tax Genius, ready to help you maximize your returns.
        </p>
        <div className="max-w-md mx-auto pt-4">
          <p className="text-lg">Let's start with the basic questions and we will do the rest.</p>
        </div>
      </div>
      <Button size="lg" onClick={onNext} className="mt-8">
        Get Started
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </div>
  );
}

function PersonalInfoPage({ formData, handleInputChange, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <CardTitle className="text-2xl mb-2">Personal Information</CardTitle>
        <p className="text-muted-foreground">Let's start with your basic details</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
            className="text-lg p-6"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="middle_name">Middle Name</Label>
          <Input
            id="middle_name"
            name="middle_name"
            value={formData.middle_name}
            onChange={handleInputChange}
            className="text-lg p-6"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
            className="text-lg p-6"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="text-lg p-6"
          placeholder="your@email.com"
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
          required
          className="text-lg p-6"
          placeholder="(555) 123-4567"
        />
      </div>
    </div>
  );
}

function AddressPage({ formData, handleInputChange }: any) {
  return (
    <div className="space-y-6">
      <div>
        <CardTitle className="text-2xl mb-2">Address</CardTitle>
        <p className="text-muted-foreground">Where do you currently live?</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address_line_1">Address Line 1 *</Label>
        <Input
          id="address_line_1"
          name="address_line_1"
          value={formData.address_line_1}
          onChange={handleInputChange}
          required
          className="text-lg p-6"
          placeholder="123 Main Street"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address_line_2">Address Line 2</Label>
        <Input
          id="address_line_2"
          name="address_line_2"
          value={formData.address_line_2}
          onChange={handleInputChange}
          className="text-lg p-6"
          placeholder="Apt 4B, Suite 100, etc."
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
            className="text-lg p-6"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
            className="text-lg p-6"
            placeholder="GA"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zip_code">Zip Code *</Label>
          <Input
            id="zip_code"
            name="zip_code"
            value={formData.zip_code}
            onChange={handleInputChange}
            required
            className="text-lg p-6"
            placeholder="30315"
          />
        </div>
      </div>
    </div>
  );
}

// Combined page for desktop
function PersonalAndAddressPage({ formData, handleInputChange, setFormData }: any) {
  return (
    <div className="space-y-8">
      <PersonalInfoPage
        formData={formData}
        handleInputChange={handleInputChange}
        setFormData={setFormData}
      />
      <div className="border-t pt-8">
        <AddressPage formData={formData} handleInputChange={handleInputChange} />
      </div>
    </div>
  );
}

function IdentityPage({ formData, handleInputChange }: any) {
  return (
    <div className="space-y-6">
      <div>
        <CardTitle className="text-2xl mb-2">Identity Information</CardTitle>
        <p className="text-muted-foreground">We need this to file your taxes securely</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date_of_birth">Date Of Birth *</Label>
        <Input
          id="date_of_birth"
          name="date_of_birth"
          type="date"
          value={formData.date_of_birth}
          onChange={handleInputChange}
          required
          className="text-lg p-6"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ssn">Social Security Number *</Label>
        <Input
          id="ssn"
          name="ssn"
          type="text"
          maxLength={11}
          value={formData.ssn}
          onChange={handleInputChange}
          required
          className="text-lg p-6"
          placeholder="XXX-XX-XXXX"
        />
        <p className="text-xs text-muted-foreground">Your information is encrypted and secure</p>
      </div>
    </div>
  );
}

function DependentStatusPage({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <CardTitle className="text-2xl mb-2">Dependent Status</CardTitle>
        <p className="text-muted-foreground">Let us know about your filing situation</p>
      </div>

      <div className="space-y-3">
        <Label className="text-base">
          Will anyone be claiming you or plans on claiming you as their Dependent this Tax season? *
        </Label>
        <Select
          value={formData.claimed_as_dependent}
          onValueChange={(value) =>
            setFormData({ ...formData, claimed_as_dependent: value as any })
          }
        >
          <SelectTrigger className="text-lg p-6 h-auto">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function FilingStatusPage({ formData, handleInputChange, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <CardTitle className="text-2xl mb-2">Employment & Filing Status</CardTitle>
        <p className="text-muted-foreground">Tell us about your work situation</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filing_status">What Is Your Filing Status? *</Label>
        <Select
          value={formData.filing_status}
          onValueChange={(value) => setFormData({ ...formData, filing_status: value })}
        >
          <SelectTrigger className="text-lg p-6 h-auto">
            <SelectValue placeholder="Select filing status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Single">Single</SelectItem>
            <SelectItem value="Married filing separately">Married filing separately</SelectItem>
            <SelectItem value="Married filing jointly">Married filing jointly</SelectItem>
            <SelectItem value="Head of House Hold">Head of House Hold</SelectItem>
            <SelectItem value="Qualifying widow(er) with dependent child">
              Qualifying widow(er) with dependent child
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-base">Are you filing as Employee or Self Employed? *</Label>
        <Select
          value={formData.employment_type}
          onValueChange={(value) => setFormData({ ...formData, employment_type: value as any })}
        >
          <SelectTrigger className="text-lg p-6 h-auto">
            <SelectValue placeholder="Select employment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="W2">W2 (Company Employee)</SelectItem>
            <SelectItem value="1099">1099 (freelancers, gig workers)</SelectItem>
            <SelectItem value="Both">Both Employee & Self Employed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="occupation">What is Your Current Occupation? *</Label>
        <Input
          id="occupation"
          name="occupation"
          value={formData.occupation}
          onChange={handleInputChange}
          required
          className="text-lg p-6"
          placeholder="what do you do for a living Currently"
        />
      </div>
    </div>
  );
}

// Combined page for desktop
function DependentAndFilingPage({ formData, handleInputChange, setFormData }: any) {
  return (
    <div className="space-y-8">
      <DependentStatusPage formData={formData} setFormData={setFormData} />
      <div className="border-t pt-8">
        <FilingStatusPage
          formData={formData}
          handleInputChange={handleInputChange}
          setFormData={setFormData}
        />
      </div>
    </div>
  );
}

function EducationPage({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <CardTitle className="text-2xl mb-2">Education</CardTitle>
        <p className="text-muted-foreground">This can affect your tax credits</p>
      </div>

      <div className="space-y-3">
        <Label className="text-base">Are you in College? *</Label>
        <Select
          value={formData.in_college}
          onValueChange={(value) => setFormData({ ...formData, in_college: value as any })}
        >
          <SelectTrigger className="text-lg p-6 h-auto">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function DependentsPage({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <CardTitle className="text-2xl mb-2">Dependents</CardTitle>
        <p className="text-muted-foreground">Information about people you support</p>
      </div>

      <div className="space-y-3">
        <Label className="text-base">Do You Have Dependents? *</Label>
        <Select
          value={formData.has_dependents}
          onValueChange={(value) => setFormData({ ...formData, has_dependents: value as any })}
        >
          <SelectTrigger className="text-lg p-6 h-auto">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.has_dependents === 'yes' && (
        <div className="space-y-2">
          <Label htmlFor="number_of_dependents">Number of Dependents *</Label>
          <Input
            id="number_of_dependents"
            name="number_of_dependents"
            type="number"
            min="1"
            value={formData.number_of_dependents}
            onChange={handleInputChange}
            required
            className="text-lg p-6"
            placeholder="How many dependents?"
          />
        </div>
      )}

      <div className="space-y-3">
        <Label className="text-base">
          Are any/all of your dependents under 24 and a full-time student, or any age and disabled?
          *
        </Label>
        <Select
          value={formData.dependents_under_24_student_or_disabled}
          onValueChange={(value) =>
            setFormData({ ...formData, dependents_under_24_student_or_disabled: value as any })
          }
        >
          <SelectTrigger className="text-lg p-6 h-auto">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-base">Are Your Dependents in College? *</Label>
        <Select
          value={formData.dependents_in_college}
          onValueChange={(value) =>
            setFormData({ ...formData, dependents_in_college: value as any })
          }
        >
          <SelectTrigger className="text-lg p-6 h-auto">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-base">
          Did A Person or Organizations (Company) Provide Child Care? *
        </Label>
        <Select
          value={formData.child_care_provider}
          onValueChange={(value) => setFormData({ ...formData, child_care_provider: value as any })}
        >
          <SelectTrigger className="text-lg p-6 h-auto">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Combined page for desktop
function EducationAndDependentsPage({ formData, handleInputChange, setFormData }: any) {
  return (
    <div className="space-y-8">
      <EducationPage formData={formData} setFormData={setFormData} />
      <div className="border-t pt-8">
        <DependentsPage formData={formData} setFormData={setFormData} />
      </div>
    </div>
  );
}

function MortgagePage({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <CardTitle className="text-2xl mb-2">Property</CardTitle>
        <p className="text-muted-foreground">Tell us about your home</p>
      </div>

      <div className="space-y-3">
        <Label className="text-base">Do you have a Mortgage? *</Label>
        <Select
          value={formData.has_mortgage}
          onValueChange={(value) => setFormData({ ...formData, has_mortgage: value as any })}
        >
          <SelectTrigger className="text-lg p-6 h-auto">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function TaxCreditsPage({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <CardTitle className="text-2xl mb-2">Tax Credits</CardTitle>
        <p className="text-muted-foreground">Important information for your return</p>
      </div>

      <div className="space-y-3">
        <Label className="text-base">
          Have you ever been denied the Earned Income Tax Credit? *
        </Label>
        <Select
          value={formData.denied_eitc}
          onValueChange={(value) => setFormData({ ...formData, denied_eitc: value as any })}
        >
          <SelectTrigger className="text-lg p-6 h-auto">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
          </SelectContent>
        </Select>
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note:</strong> If the IRS rejected one or more of these credits: EITC, CTC, ACTC
            or AOTC, you may have received a letter stating that the credit was disallowed. Keep
            filling out the forms and we will see what can be done to fix this issue.
          </p>
        </div>
      </div>
    </div>
  );
}

function IrsPinPage({ formData, handleInputChange, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <CardTitle className="text-2xl mb-2">IRS PIN</CardTitle>
        <p className="text-muted-foreground">Identity protection PIN from the IRS</p>
      </div>

      <div className="space-y-3">
        <Label className="text-base">Do you have an IRS PIN? *</Label>
        <Select
          value={formData.has_irs_pin}
          onValueChange={(value) => setFormData({ ...formData, has_irs_pin: value as any })}
        >
          <SelectTrigger className="text-lg p-6 h-auto">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="yes_locate">Yes but I have to locate it</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.has_irs_pin === 'yes' && (
        <div className="space-y-2">
          <Label htmlFor="irs_pin">IRS PIN</Label>
          <Input
            id="irs_pin"
            name="irs_pin"
            type="text"
            maxLength={6}
            value={formData.irs_pin}
            onChange={handleInputChange}
            className="text-lg p-6"
            placeholder="Enter your 6-digit IRS PIN"
          />
        </div>
      )}
    </div>
  );
}

// Combined page for desktop
function TaxCreditsAndPinPage({ formData, handleInputChange, setFormData }: any) {
  return (
    <div className="space-y-8">
      <TaxCreditsPage formData={formData} setFormData={setFormData} />
      <div className="border-t pt-8">
        <IrsPinPage
          formData={formData}
          handleInputChange={handleInputChange}
          setFormData={setFormData}
        />
      </div>
    </div>
  );
}

function RefundAdvancePage({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <CardTitle className="text-2xl mb-2">Refund Advance</CardTitle>
        <p className="text-muted-foreground">Get your money faster</p>
      </div>

      <div className="space-y-3">
        <Label className="text-base">Would You Like Refund Cash Advance? *</Label>
        <Select
          value={formData.wants_refund_advance}
          onValueChange={(value) =>
            setFormData({ ...formData, wants_refund_advance: value as any })
          }
        >
          <SelectTrigger className="text-lg p-6 h-auto">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function IdDocumentsPage({ formData, handleInputChange, handleFileChange }: any) {
  return (
    <div className="space-y-6">
      <div>
        <CardTitle className="text-2xl mb-2">Identification Documents</CardTitle>
        <p className="text-muted-foreground">We need a copy of your ID to verify your identity</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="drivers_license">Driver's license or State ID Number *</Label>
        <Input
          id="drivers_license"
          name="drivers_license"
          value={formData.drivers_license}
          onChange={handleInputChange}
          required
          className="text-lg p-6"
          placeholder="DL123456789"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="license_expiration">Expiration Date *</Label>
        <Input
          id="license_expiration"
          name="license_expiration"
          type="date"
          value={formData.license_expiration}
          onChange={handleInputChange}
          required
          className="text-lg p-6"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="license_file">Upload Drivers License or State ID</Label>
        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
          <FileUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <Input
            id="license_file"
            name="license_file"
            type="file"
            onChange={handleFileChange}
            accept="image/*,.pdf"
            className="max-w-xs mx-auto"
          />
          {formData.license_file && (
            <p className="text-sm text-green-600 mt-2">✓ {formData.license_file.name}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">JPG, PNG or PDF (max 10MB)</p>
        </div>
      </div>
    </div>
  );
}

function CongratulationsPage({ handleSubmit }: any) {
  return (
    <div className="space-y-8 text-center py-8">
      <div className="w-32 h-32 bg-gradient-to-br from-success/20 to-success/10 rounded-full mx-auto flex items-center justify-center">
        <Share2 className="w-16 h-16 text-success" />
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Congratulations!</h2>
        <p className="text-xl text-muted-foreground">You've completed the tax intake form!</p>
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 max-w-2xl mx-auto">
        <div className="space-y-4">
          <div className="text-5xl">💰</div>
          <h3 className="text-2xl font-bold">Earn Money with Referrals!</h3>
          <p className="text-lg leading-relaxed">
            Get <span className="font-bold text-primary">$50 for each person</span> who completes
            their taxes with us.
          </p>
          <p className="text-lg leading-relaxed">
            After your 10th referral, I'll crank it up to{' '}
            <span className="font-bold text-primary">$100 per person!</span>
          </p>
          <div className="pt-4">
            <Button size="lg" variant="outline" asChild>
              <a href="/referral">
                Learn More About Referrals
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Button size="lg" onClick={handleSubmit} className="mt-8">
        Complete & Upload Documents
        <Upload className="ml-2 w-5 h-5" />
      </Button>
    </div>
  );
}
