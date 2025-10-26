'use client';

/**
 * Referral Links Manager Component
 *
 * Displays user's auto-generated referral links with QR codes
 * Supports:
 * - Two links: intake form + appointment booking
 * - QR code display and download
 * - Vanity name customization (one-time)
 * - Click analytics and conversion tracking
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Copy,
  Download,
  QrCode,
  Link as LinkIcon,
  Calendar,
  FileText,
  TrendingUp,
  Users,
  Edit,
  Check,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { logger } from '@/lib/logger';

interface ReferralLink {
  id: string;
  shortCode: string;
  shortUrl: string;
  fullUrl: string;
  destination: string;
  title: string;
  qrCodeUrl: string | null;
  clicks: number;
  leads: number;
  conversions: number;
  isActive: boolean;
}

interface TrackingCodeData {
  code: string;
  isCustom: boolean;
  qrCodeUrl: string | null;
  canCustomize: boolean;
}

export function ReferralLinksManager() {
  const [loading, setLoading] = useState(true);
  const [intakeLink, setIntakeLink] = useState<ReferralLink | null>(null);
  const [appointmentLink, setAppointmentLink] = useState<ReferralLink | null>(null);
  const [trackingCode, setTrackingCode] = useState<TrackingCodeData | null>(null);
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const [customizing, setCustomizing] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<{
    available: boolean;
    reason?: string;
  } | null>(null);

  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    // Only load data when Clerk auth is fully loaded and user is signed in
    if (isLoaded && isSignedIn) {
      loadReferralLinks();
      loadTrackingCode();
    }
  }, [isLoaded, isSignedIn]);

  const loadReferralLinks = async () => {
    try {
      const response = await fetch('/api/links');

      if (!response.ok) {
        // Don't throw error if we get redirected (auth issue)
        if (response.status === 401 || response.status === 403) {
          logger.info('Not authenticated, skipping referral links load');
          return;
        }
        throw new Error('Failed to fetch referral links');
      }

      const data = await response.json();
      const links = data.links || [];

      // Find the auto-generated links
      const intake = links.find((link: ReferralLink) => link.shortCode.endsWith('-intake'));
      const appointment = links.find((link: ReferralLink) => link.shortCode.endsWith('-appt'));

      setIntakeLink(intake || null);
      setAppointmentLink(appointment || null);
    } catch (error) {
      logger.error('Error loading referral links:', error);
      toast.error('Failed to load referral links');
    } finally {
      setLoading(false);
    }
  };

  const loadTrackingCode = async () => {
    try {
      const response = await fetch('/api/profile/tracking-code');

      if (!response.ok) {
        // Don't throw error if we get redirected (auth issue)
        if (response.status === 401 || response.status === 403) {
          logger.info('Not authenticated, skipping tracking code load');
          return;
        }
        throw new Error('Failed to fetch tracking code');
      }

      const data = await response.json();
      setTrackingCode(data.data);
    } catch (error) {
      logger.error('Error loading tracking code:', error);
      toast.error('Failed to load tracking code');
    }
  };

  const checkAvailability = async (code: string) => {
    if (!code || code.trim().length < 3) {
      setAvailabilityStatus(null);
      return;
    }

    setCheckingAvailability(true);
    try {
      const response = await fetch('/api/links/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), type: 'tracking-code' }),
      });

      const data = await response.json();
      setAvailabilityStatus(data);
    } catch (error) {
      logger.error('Error checking availability:', error);
      setAvailabilityStatus({ available: false, reason: 'Error checking availability' });
    } finally {
      setCheckingAvailability(false);
    }
  };

  const customizeTrackingCode = async () => {
    if (!customCode.trim() || !availabilityStatus?.available) {
      return;
    }

    setCustomizing(true);
    try {
      const response = await fetch('/api/profile/tracking-code', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customCode: customCode.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to customize tracking code');
      }

      toast.success('Vanity name updated successfully! Your referral links have been regenerated.');
      setShowCustomizeDialog(false);
      setCustomCode('');
      setAvailabilityStatus(null);

      // Reload data
      await Promise.all([loadTrackingCode(), loadReferralLinks()]);
    } catch (error: any) {
      logger.error('Error customizing tracking code:', error);
      toast.error(error.message || 'Failed to customize vanity name');
    } finally {
      setCustomizing(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const downloadQRCode = (qrCodeUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${filename}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded!');
  };

  const renderLinkCard = (link: ReferralLink | null, type: 'intake' | 'appointment') => {
    if (!link) {
      return (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              {type === 'intake' ? (
                <FileText className="h-5 w-5" />
              ) : (
                <Calendar className="h-5 w-5" />
              )}
              {type === 'intake' ? 'Tax Filing Link' : 'Appointment Link'}
            </CardTitle>
            <CardDescription>
              {type === 'intake'
                ? 'Direct your referrals to start their tax filing process'
                : 'Let referrals book an appointment with a tax preparer'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-amber-600 dark:bg-amber-400 animate-pulse" />
              <span>Setting up your referral link...</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your link will appear here automatically. This usually takes just a few seconds. If it
              doesn't appear, try refreshing the page.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                {type === 'intake' ? (
                  <FileText className="h-5 w-5" />
                ) : (
                  <Calendar className="h-5 w-5" />
                )}
                {link.title}
              </CardTitle>
              <CardDescription>{link.description || link.targetPage}</CardDescription>
            </div>
            <Badge variant={link.isActive ? 'default' : 'secondary'}>
              {link.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Short URL */}
          <div className="space-y-2">
            <Label>Share Link</Label>
            <div className="flex gap-2">
              <Input value={link.shortUrl} readOnly className="font-mono text-sm" />
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(link.shortUrl, 'Link')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* QR Code */}
          {link.qrCodeUrl && (
            <div className="space-y-2">
              <Label>QR Code</Label>
              <div className="flex gap-4 items-start">
                <div className="border rounded-lg p-2 bg-white">
                  <Image
                    src={link.qrCodeUrl}
                    alt={`QR Code for ${link.title}`}
                    width={150}
                    height={150}
                    className="rounded"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Share this QR code on flyers, business cards, or social media. Anyone who scans
                    it will be tracked as your referral.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadQRCode(link.qrCodeUrl!, link.shortCode)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Analytics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Clicks</p>
              <p className="text-2xl font-bold">{link.clicks}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Leads</p>
              <p className="text-2xl font-bold">{link.leads}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Returns Filed</p>
              <p className="text-2xl font-bold">{link.conversions}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Referral Links</CardTitle>
          <CardDescription>Loading your referral links...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                My Referral Links
              </CardTitle>
              <CardDescription>
                Share these links to earn commissions. Every click is tracked automatically.
              </CardDescription>
            </div>
            {trackingCode && trackingCode.canCustomize && (
              <Dialog open={showCustomizeDialog} onOpenChange={setShowCustomizeDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Customize Vanity Name
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Customize Your Vanity Name</DialogTitle>
                    <DialogDescription>
                      Choose a memorable vanity name for your referral links. This can only be done
                      once.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="customCode">Vanity Name</Label>
                      <Input
                        id="customCode"
                        placeholder="Enter your desired vanity name"
                        value={customCode}
                        onChange={(e) => {
                          setCustomCode(e.target.value);
                          checkAvailability(e.target.value);
                        }}
                      />
                      {checkingAvailability && (
                        <p className="text-sm text-muted-foreground">Checking availability...</p>
                      )}
                      {availabilityStatus && !checkingAvailability && (
                        <div className="flex items-center gap-2">
                          {availabilityStatus.available ? (
                            <>
                              <Check className="h-4 w-4 text-green-600" />
                              <p className="text-sm text-green-600">Available!</p>
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4 text-red-600" />
                              <p className="text-sm text-red-600">
                                {availabilityStatus.reason || 'Not available'}
                              </p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Your links will become:</p>
                      <div className="space-y-1 font-mono text-sm bg-muted p-3 rounded">
                        <p>taxgeniuspro.tax/go/{customCode || 'yourname'}-intake</p>
                        <p>taxgeniuspro.tax/go/{customCode || 'yourname'}-appt</p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCustomizeDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={customizeTrackingCode}
                      disabled={
                        !customCode.trim() ||
                        !availabilityStatus?.available ||
                        customizing ||
                        checkingAvailability
                      }
                    >
                      {customizing ? 'Customizing...' : 'Customize'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {trackingCode && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Your Tracking Code:</Label>
                <Badge variant="secondary" className="font-mono">
                  {trackingCode.code}
                  {trackingCode.isCustom && <span className="ml-2 text-xs">(Custom)</span>}
                </Badge>
                {!trackingCode.canCustomize && (
                  <span className="text-xs text-muted-foreground">(Cannot be changed)</span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Links Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {renderLinkCard(intakeLink, 'intake')}
        {renderLinkCard(appointmentLink, 'appointment')}
      </div>

      {/* Quick Stats */}
      {(intakeLink || appointmentLink) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Combined Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-3xl font-bold">
                  {(intakeLink?.clicks || 0) + (appointmentLink?.clicks || 0)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-3xl font-bold">
                  {(intakeLink?.leads || 0) + (appointmentLink?.leads || 0)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Returns</p>
                <p className="text-3xl font-bold">
                  {(intakeLink?.conversions || 0) + (appointmentLink?.conversions || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
