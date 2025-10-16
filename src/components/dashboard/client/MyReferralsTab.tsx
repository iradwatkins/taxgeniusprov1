'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Users, DollarSign, TrendingUp, Info, Copy, Share2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { AttributionStatsCard } from '../attribution-stats-card'
import { RecentLeadsTable } from '../recent-leads-table'
import { EarningsOverviewCard } from '../earnings-overview-card'
import { PayoutRequestDialog } from '../payout-request-dialog'

interface MyReferralsTabProps {
  shortLinkUsername?: string | null
  totalLeads?: number
}

export function MyReferralsTab({ shortLinkUsername, totalLeads = 0 }: MyReferralsTabProps) {
  const { toast } = useToast()

  // If no referral link set up yet
  if (!shortLinkUsername) {
    return (
      <div className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Want to earn commissions by referring new clients? Set up your referral link to get started!
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Start Referring & Earn</CardTitle>
            <CardDescription>
              Earn commissions when you refer friends, family, or colleagues to TaxGeniusPro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Share2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Share Your Link</h3>
                <p className="text-sm text-muted-foreground">
                  Get a unique referral link to share
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Track Referrals</h3>
                <p className="text-sm text-muted-foreground">
                  See who signs up through your link
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Earn Commissions</h3>
                <p className="text-sm text-muted-foreground">
                  Get paid for every successful referral
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button size="lg" className="w-full sm:w-auto">
                <Share2 className="mr-2 h-4 w-4" />
                Set Up Referral Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User has referral link set up
  const referralLink = `https://taxgeniuspro.com/ref/${shortLinkUsername}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast({
      title: 'Link copied!',
      description: 'Your referral link has been copied to clipboard.',
    })
  }

  return (
    <div className="space-y-6">
      {/* Referral Link Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link to start earning commissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 p-3 rounded-lg bg-muted font-mono text-sm break-all">
              {referralLink}
            </div>
            <Button variant="outline" size="icon" onClick={handleCopyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleCopyLink}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* EPIC 6: Attribution Analytics */}
      <AttributionStatsCard period="30d" />

      {/* EPIC 6: Earnings Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <EarningsOverviewCard />

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Your referral performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Leads</p>
                  <p className="text-2xl font-bold">{totalLeads}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">-</p>
                </div>
              </div>
            </div>

            <PayoutRequestDialog />
          </CardContent>
        </Card>
      </div>

      {/* EPIC 6: Recent Leads with Attribution */}
      <RecentLeadsTable limit={10} />
    </div>
  )
}
