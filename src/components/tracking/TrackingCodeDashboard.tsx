'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Copy,
  CheckCircle2,
  Download,
  ExternalLink,
  AlertCircle,
  Edit3,
  Sparkles,
  QrCode,
  Lock,
  Shield,
  Link2,
  FileText,
  Calendar,
  RefreshCw,
} from 'lucide-react';

interface TrackingCodeData {
  trackingCode: string;
  customTrackingCode: string | null;
  trackingCodeChanged: boolean;
  trackingCodeFinalized: boolean;
  trackingCodeQRUrl: string | null;
  canCustomize: boolean;
  activeCode: string;
  trackingUrl: string;
}

interface IntegratedLink {
  id: string;
  code: string;
  url: string;
  shortUrl: string | null;
  title: string | null;
  description: string | null;
  qrCodeImageUrl: string | null;
  targetPage: string;
  clicks?: number;
  uniqueClicks?: number;
  conversions?: number;
}

interface TrackingCodeDashboardProps {
  userId: string;
  profileId: string;
  role: 'tax_preparer' | 'affiliate' | 'client';
  canEdit?: boolean;
  canViewAnalytics?: boolean;
}

export function TrackingCodeDashboard({ userId, profileId, role }: TrackingCodeDashboardProps) {
  const [trackingData, setTrackingData] = useState<TrackingCodeData | null>(null);
  const [integratedLinks, setIntegratedLinks] = useState<IntegratedLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<{
    available: boolean;
    reason?: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Fetch tracking code data
  useEffect(() => {
    async function fetchData() {
      try {
        const [trackingResponse, linksResponse] = await Promise.all([
          fetch('/api/profile/tracking-code'),
          fetch('/api/profile/tracking-links'),
        ]);

        if (!trackingResponse.ok) throw new Error('Failed to fetch tracking code');

        const trackingResult = await trackingResponse.json();
        setTrackingData(trackingResult.data);

        if (linksResponse.ok) {
          const linksResult = await linksResponse.json();
          setIntegratedLinks(linksResult.links || []);
        }
      } catch (error) {
        toast.error('Failed to load tracking code');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Check code availability with debounce
  useEffect(() => {
    if (!customCode || customCode.length < 3) {
      setAvailability(null);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsChecking(true);
      try {
        const response = await fetch('/api/profile/tracking-code/check-availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: customCode }),
        });
        const result = await response.json();
        setAvailability(result);
      } catch (error) {
        toast.error('Failed to check availability');
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [customCode]);

  // Save custom code
  const handleSaveCustomCode = async () => {
    if (!customCode || !availability?.available) return;

    setIsSaving(true);

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
      toast.success('Tracking code updated!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save custom code');
    } finally {
      setIsSaving(false);
    }
  };

  // Finalize tracking code
  const handleFinalize = async () => {
    if (!confirm('Are you sure you want to finalize your tracking code? This action cannot be undone and your code will be permanently locked.')) {
      return;
    }

    setIsFinalizing(true);

    try {
      const response = await fetch('/api/profile/tracking-code/finalize', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to finalize tracking code');
      }

      const result = await response.json();
      setTrackingData(result.data);
      setIntegratedLinks(result.integratedLinks || []);
      toast.success('Tracking code finalized successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to finalize tracking code');
    } finally {
      setIsFinalizing(false);
    }
  };


  // Copy to clipboard
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  // Download QR code
  const downloadQRCode = (qrUrl: string, filename: string) => {
    if (!qrUrl) {
      toast.error('QR code not available');
      return;
    }

    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded!');
  };

  // Get icon for link type
  const getLinkIcon = (targetPage: string) => {
    if (targetPage.includes('filing') || targetPage.includes('form')) {
      return <FileText className="h-4 w-4 text-primary" />;
    }
    if (targetPage.includes('appointment') || targetPage.includes('book')) {
      return <Calendar className="h-4 w-4 text-primary" />;
    }
    return <Link2 className="h-4 w-4 text-primary" />;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6 max-w-5xl">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load tracking code. Please refresh the page.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isFinalized = trackingData.trackingCodeFinalized;

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Tracking Code</h1>
        <p className="text-muted-foreground mt-1">
          {isFinalized
            ? 'Your tracking code is finalized and integrated across all your links'
            : 'Customize your tracking code before finalizing'}
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Tracking Code Card */}
        <Card className={isFinalized ? 'border-green-500/50' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isFinalized ? (
                <>
                  <Shield className="h-5 w-5 text-green-600" />
                  Finalized Tracking Code
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 text-primary" />
                  Your Tracking Code
                </>
              )}
            </CardTitle>
            <CardDescription>
              {trackingData.customTrackingCode ? 'Custom code' : 'Auto-generated code'}
              {isFinalized && ' (Permanently Locked)'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Active Code */}
            <div className={`p-4 border rounded-lg ${isFinalized ? 'bg-green-50 border-green-200' : 'bg-primary/5 border-primary/20'}`}>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Active Code</Label>
                <div className="flex gap-2">
                  {trackingData.customTrackingCode && <Badge>Custom</Badge>}
                  {isFinalized && <Badge variant="secondary" className="bg-green-100 text-green-800"><Lock className="h-3 w-3 mr-1" />Locked</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-2xl font-mono font-bold text-primary">
                  {trackingData.activeCode}
                </code>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => copyToClipboard(trackingData.activeCode, 'code')}
                  title="Copy code"
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
              <Label className="text-sm font-medium">Main Tracking URL</Label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <code className="flex-1 text-sm truncate font-mono">
                  {trackingData.trackingUrl}
                </code>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => copyToClipboard(trackingData.trackingUrl, 'url')}
                  title="Copy URL"
                >
                  {copied === 'url' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button size="icon" variant="ghost" asChild title="Open in new tab">
                  <a href={trackingData.trackingUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Edit/Finalize Buttons */}
            {!isFinalized && (
              <div className="space-y-2">
                {trackingData.canCustomize && !isEditing && (
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full">
                    <Edit3 className="h-4 w-4 mr-2" />
                    {trackingData.customTrackingCode ? 'Edit Custom Code' : 'Customize Code'}
                  </Button>
                )}
                <Button onClick={handleFinalize} disabled={isFinalizing} className="w-full" variant="default">
                  {isFinalizing ? (
                    'Finalizing...'
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Finalize & Lock Code
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  You can edit your code multiple times before finalizing
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* QR Code Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              QR Code
            </CardTitle>
            <CardDescription>Download for marketing materials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {trackingData.trackingCodeQRUrl ? (
              <>
                <div className="flex justify-center p-6 bg-white rounded-lg border">
                  <img
                    src={trackingData.trackingCodeQRUrl}
                    alt={`QR Code for ${trackingData.activeCode}`}
                    className="w-48 h-48"
                  />
                </div>
                <Button
                  onClick={() => downloadQRCode(trackingData.trackingCodeQRUrl!, `tracking-qr-${trackingData.activeCode}.png`)}
                  className="w-full"
                  variant="default"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  QR codes are permanent and linked to your tracking code
                </p>
              </>
            ) : (
              <div className="flex justify-center items-center h-64 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">QR code not available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customization Form */}
      {isEditing && !isFinalized && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Customize Your Tracking Code</CardTitle>
            <CardDescription>
              Choose a memorable code. You can change it multiple times before finalizing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customCode">Custom Code</Label>
              <Input
                id="customCode"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                placeholder="my-code"
                maxLength={20}
                disabled={isSaving}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                3-20 characters: lowercase letters, numbers, hyphens, underscores
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

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={handleSaveCustomCode}
                disabled={!availability?.available || isSaving}
                className="flex-1"
              >
                {isSaving ? 'Saving...' : 'Save Code'}
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setCustomCode('');
                  setAvailability(null);
                }}
                variant="outline"
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integrated Links Section (Only show after finalization) */}
      {isFinalized && integratedLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>All Your Tracking Links</CardTitle>
            <CardDescription>
              Your tracking code is automatically integrated into all these links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {integratedLinks.map((link) => (
                <div key={link.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getLinkIcon(link.targetPage)}
                      <div>
                        <h4 className="font-medium">{link.title || link.code}</h4>
                        {link.description && (
                          <p className="text-sm text-muted-foreground">{link.description}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-muted rounded-md text-sm">
                    <code className="flex-1 truncate font-mono">{link.shortUrl || link.url}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(link.shortUrl || link.url, `link-${link.id}`)}
                    >
                      {copied === `link-${link.id}` ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {link.qrCodeImageUrl && (
                    <div className="space-y-3">
                      {/* QR Code Image Display */}
                      <div className="flex justify-center p-4 bg-white rounded-lg border">
                        <img
                          src={link.qrCodeImageUrl}
                          alt={`QR Code for ${link.title || link.code}`}
                          className="w-48 h-48"
                        />
                      </div>

                      {/* Download Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadQRCode(link.qrCodeImageUrl!, `${link.code}-qr.png`)}
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download QR Code
                      </Button>

                      {/* Click Stats */}
                      {(link.clicks !== undefined || link.uniqueClicks !== undefined) && (
                        <div className="flex gap-3 text-sm text-muted-foreground justify-center">
                          {link.clicks !== undefined && <span>{link.clicks} clicks</span>}
                          {link.uniqueClicks !== undefined && <span>{link.uniqueClicks} unique</span>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Guide */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div>
                <h4 className="font-medium">{isFinalized ? 'Use Your Links' : 'Customize Your Code'}</h4>
                <p className="text-sm text-muted-foreground">
                  {isFinalized
                    ? 'All your forms and marketing materials include your tracking code automatically'
                    : 'Edit your tracking code as many times as needed, then finalize when ready'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <div>
                <h4 className="font-medium">{isFinalized ? 'Track Results' : 'Finalize Your Code'}</h4>
                <p className="text-sm text-muted-foreground">
                  {isFinalized
                    ? 'Monitor clicks and conversions on all your integrated tracking links'
                    : 'Once finalized, your code will be locked and integrated into all your links'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">3</span>
              </div>
              <div>
                <h4 className="font-medium">Use QR Codes</h4>
                <p className="text-sm text-muted-foreground">
                  Print QR codes on business cards, flyers, and marketing materials
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
