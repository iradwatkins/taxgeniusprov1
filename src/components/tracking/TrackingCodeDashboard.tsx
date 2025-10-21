'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { logger } from '@/lib/logger';
import {
  QrCode,
  Copy,
  CheckCircle2,
  Download,
  ExternalLink,
  AlertCircle,
  Edit3,
  Sparkles,
  TrendingUp,
  Users,
  MousePointerClick,
  DollarSign,
} from 'lucide-react';

interface TrackingCodeData {
  trackingCode: string;
  customTrackingCode: string | null;
  trackingCodeChanged: boolean;
  trackingCodeQRUrl: string | null;
  canCustomize: boolean;
  activeCode: string;
  trackingUrl: string;
}

interface TrackingCodeDashboardProps {
  userId: string;
  profileId: string;
  role: 'tax_preparer' | 'affiliate' | 'client';
}

export function TrackingCodeDashboard({ userId, profileId, role }: TrackingCodeDashboardProps) {
  const [trackingData, setTrackingData] = useState<TrackingCodeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<{
    available: boolean;
    reason?: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copied, setCopied] = useState<'code' | 'url' | null>(null);

  // Fetch tracking code data
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/profile/tracking-code');
        if (!response.ok) throw new Error('Failed to fetch tracking code');
        const result = await response.json();
        setTrackingData(result.data);
      } catch (error) {
        logger.error('Error fetching tracking code:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Check code availability
  const checkAvailability = async (code: string) => {
    if (!code || code.length < 3) {
      setAvailability(null);
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch('/api/profile/tracking-code/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const result = await response.json();
      setAvailability(result);
    } catch (error) {
      logger.error('Error checking availability:', error);
    } finally {
      setIsChecking(false);
    }
  };

  // Handle custom code input
  const handleCodeChange = (value: string) => {
    setCustomCode(value);
    const debounceTimeout = setTimeout(() => {
      checkAvailability(value);
    }, 500);
    return () => clearTimeout(debounceTimeout);
  };

  // Save custom code
  const handleSaveCustomCode = async () => {
    if (!customCode || !availability?.available) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch('/api/profile/tracking-code', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customCode }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save custom code');
      }

      const result = await response.json();
      setTrackingData(result.data);
      setIsEditing(false);
      setCustomCode('');
      setAvailability(null);
    } catch (error) {
      setSaveError(error.message || 'Failed to save custom code');
    } finally {
      setIsSaving(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, type: 'code' | 'url') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      logger.error('Failed to copy:', error);
    }
  };

  // Download QR code
  const downloadQRCode = () => {
    if (!trackingData?.trackingCodeQRUrl) return;

    const link = document.createElement('a');
    link.href = trackingData.trackingCodeQRUrl;
    link.download = `${trackingData.activeCode}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load tracking code. Please refresh the page or contact support.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Tracking Code</h1>
        <p className="text-muted-foreground mt-1">
          Your universal tracking code for all marketing materials and attribution
        </p>
      </div>

      {/* Tracking Code Display & Customization */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Tracking Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Your Tracking Code
            </CardTitle>
            <CardDescription>
              {trackingData.customTrackingCode
                ? 'Your custom tracking code'
                : 'Auto-generated tracking code'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Active Code Display */}
            <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Active Code</Label>
                {trackingData.customTrackingCode && <Badge variant="secondary">Custom</Badge>}
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-2xl font-bold text-primary">
                  {trackingData.activeCode}
                </code>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => copyToClipboard(trackingData.activeCode, 'code')}
                >
                  {copied === 'code' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Tracking URL */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tracking URL</Label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <code className="flex-1 text-sm truncate">{trackingData.trackingUrl}</code>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => copyToClipboard(trackingData.trackingUrl, 'url')}
                >
                  {copied === 'url' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button size="icon" variant="ghost" asChild>
                  <a href={trackingData.trackingUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Customize Button */}
            {trackingData.canCustomize && !isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full">
                <Edit3 className="h-4 w-4 mr-2" />
                Customize Your Code (One-Time)
              </Button>
            )}

            {trackingData.trackingCodeChanged && !trackingData.customTrackingCode && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  You've already customized your tracking code.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              QR Code
            </CardTitle>
            <CardDescription>Download and use in your marketing materials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {trackingData.trackingCodeQRUrl ? (
              <>
                <div className="flex justify-center p-4 bg-white rounded-lg border">
                  <img
                    src={trackingData.trackingCodeQRUrl}
                    alt={`QR Code for ${trackingData.activeCode}`}
                    className="w-64 h-64"
                  />
                </div>
                <Button onClick={downloadQRCode} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
              </>
            ) : (
              <div className="flex justify-center items-center h-64 bg-muted rounded-lg">
                <p className="text-muted-foreground">QR code not available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customization Form */}
      {isEditing && trackingData.canCustomize && (
        <Card className="border-primary/50 shadow-lg">
          <CardHeader>
            <CardTitle>Customize Your Tracking Code</CardTitle>
            <CardDescription>
              Choose a custom code that's easy to remember. This can only be done once.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customCode">Custom Code</Label>
              <Input
                id="customCode"
                value={customCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="my-awesome-code"
                maxLength={20}
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground">
                3-20 characters, letters, numbers, hyphens, and underscores only
              </p>
            </div>

            {/* Availability Status */}
            {isChecking && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                Checking availability...
              </div>
            )}

            {availability && !isChecking && (
              <Alert variant={availability.available ? 'default' : 'destructive'}>
                {availability.available ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {availability.available
                    ? '✓ Code is available!'
                    : availability.reason || 'Code is not available'}
                </AlertDescription>
              </Alert>
            )}

            {/* Save Error */}
            {saveError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{saveError}</AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={handleSaveCustomCode}
                disabled={!availability?.available || isSaving}
                className="flex-1"
              >
                {isSaving ? 'Saving...' : 'Save Custom Code'}
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setCustomCode('');
                  setAvailability(null);
                  setSaveError(null);
                }}
                variant="outline"
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Important:</strong> You can only customize your tracking code once. Choose
                carefully!
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Tracking Code Performance
          </CardTitle>
          <CardDescription>Track how your marketing materials are performing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <MousePointerClick className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <p className="text-xs font-medium text-muted-foreground">Total Clicks</p>
              </div>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">-</p>
              <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                <p className="text-xs font-medium text-muted-foreground">Leads Generated</p>
              </div>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">-</p>
              <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <p className="text-xs font-medium text-muted-foreground">Conversions</p>
              </div>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">-</p>
              <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <p className="text-xs font-medium text-muted-foreground">Revenue</p>
              </div>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">-</p>
              <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Performance tracking will be available once you start using your tracking code in
              marketing materials.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Usage Information */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use Your Tracking Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Add to URLs</h4>
                <p className="text-sm text-muted-foreground">
                  Append your tracking code to any Tax Genius Pro URL:{' '}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    ?ref={trackingData.activeCode}
                  </code>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Use QR Code</h4>
                <p className="text-sm text-muted-foreground">
                  Download and add the QR code to business cards, flyers, and other printed
                  materials
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">3</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Track Performance</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor clicks, leads, conversions, and revenue attributed to your tracking code
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
