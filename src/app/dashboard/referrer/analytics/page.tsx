import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import {
  MousePointerClick,
  UserPlus,
  FileCheck,
  DollarSign,
  Link2,
  TrendingUp,
  Gift,
  Clock,
} from 'lucide-react'
import { getMyReferralAnalytics } from '@/lib/services/lead-analytics.service'
import { MetricsGrid } from '@/components/admin/analytics/MetricsGrid'
import { createFunnelStages } from '@/lib/utils/analytics'
import { ConversionFunnelChart } from '@/components/admin/analytics/ConversionFunnelChart'
import { ExportButton } from '@/components/admin/analytics/ExportButton'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export const metadata = {
  title: 'My Referral Analytics | Tax Genius Pro',
  description: 'Track your referral performance and rewards',
}

async function checkClientAccess() {
  const user = await currentUser()
  if (!user) return { hasAccess: false, userId: null }

  const role = user.publicMetadata?.role as string
  // Clients and referrers can access this page
  const hasAccess = role === 'client' || role === 'referrer'

  return { hasAccess, userId: user.id }
}

export default async function ReferrerAnalyticsPage() {
  const { hasAccess, userId } = await checkClientAccess()

  if (!hasAccess || !userId) {
    redirect('/forbidden')
  }

  // Fetch my analytics - ONLY my data
  const myData = await getMyReferralAnalytics(userId)

  // Create funnel data
  const funnelStages = createFunnelStages(
    myData.clicks,
    myData.leads,
    myData.conversions,
    myData.returnsFiled
  )

  // Prepare export data
  const exportData = {
    clientName: myData.clientName,
    clientEmail: myData.clientEmail,
    referralLinksCount: myData.referralLinksCount,
    clicks: myData.clicks,
    referrals: myData.leads,
    conversions: myData.conversions,
    returnsFiled: myData.returnsFiled,
    conversionRate: myData.conversionRate,
    revenue: myData.revenue,
    rewardsEarned: myData.rewardsEarned,
    rewardsPending: myData.rewardsPending,
    lastActive: myData.lastActive?.toISOString() || 'Never',
    linkBreakdown: myData.linkBreakdown,
    recentReferrals: myData.recentLeads,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Referral Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your referral performance and earned rewards
          </p>
        </div>
        <ExportButton
          data={[exportData]}
          filename="my-referral-analytics"
          variant="default"
        />
      </div>

      {/* Key Metrics */}
      <MetricsGrid
        metrics={[
          {
            title: "Referral Links",
            value: myData.referralLinksCount,
            icon: Link2,
            color: "blue",
            format: "number",
            subtitle: "Active links"
          },
          {
            title: "Total Clicks",
            value: myData.clicks,
            icon: MousePointerClick,
            color: "purple",
            format: "number"
          },
          {
            title: "Successful Referrals",
            value: myData.leads,
            icon: UserPlus,
            color: "green",
            format: "number"
          },
          {
            title: "Total Revenue Generated",
            value: myData.revenue,
            icon: DollarSign,
            color: "yellow",
            format: "currency"
          }
        ]}
      />

      {/* Reward Metrics */}
      <MetricsGrid
        metrics={[
          {
            title: "Rewards Earned",
            value: myData.rewardsEarned,
            icon: Gift,
            color: "green",
            format: "currency",
            subtitle: "Received"
          },
          {
            title: "Pending Rewards",
            value: myData.rewardsPending,
            icon: Clock,
            color: "orange",
            format: "currency",
            subtitle: "Processing"
          },
          {
            title: "Conversion Rate",
            value: myData.conversionRate.toFixed(1),
            icon: TrendingUp,
            color: "purple",
            format: "percent"
          },
          {
            title: "Reward per Referral",
            value: myData.leads > 0 ? myData.rewardsEarned / myData.leads : 0,
            icon: DollarSign,
            color: "blue",
            format: "currency"
          }
        ]}
      />

      {/* Conversion Funnel */}
      <ConversionFunnelChart
        stages={funnelStages}
        title="My Referral Funnel"
        subtitle="Your referral program performance breakdown"
      />

      {/* Referral Link Performance */}
      {myData.linkBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Referral Link Performance</CardTitle>
            <CardDescription>
              Performance metrics for each of your referral links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myData.linkBreakdown.map((link) => (
                <div
                  key={link.linkId}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium truncate">{link.linkName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {link.linkUrl}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-semibold">{link.conversionRate.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">conversion</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="text-center p-2 bg-blue-50 dark:bg-blue-950 rounded">
                      <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                        {link.clicks}
                      </p>
                      <p className="text-xs text-muted-foreground">Clicks</p>
                    </div>
                    <div className="text-center p-2 bg-purple-50 dark:bg-purple-950 rounded">
                      <p className="text-xl font-bold text-purple-700 dark:text-purple-300">
                        {link.leads}
                      </p>
                      <p className="text-xs text-muted-foreground">Referrals</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 dark:bg-green-950 rounded">
                      <p className="text-xl font-bold text-green-700 dark:text-green-300">
                        {link.conversions}
                      </p>
                      <p className="text-xs text-muted-foreground">Conversions</p>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-950 rounded">
                      <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">
                        ${link.revenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                    <div className="text-center p-2 bg-orange-50 dark:bg-orange-950 rounded">
                      <p className="text-xl font-bold text-orange-700 dark:text-orange-300">
                        ${link.reward?.toLocaleString() || '0'}
                      </p>
                      <p className="text-xs text-muted-foreground">Reward</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Referrals */}
      {myData.recentLeads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Referrals</CardTitle>
            <CardDescription>
              Your latest successful referrals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {myData.recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="flex items-center gap-2">
                      {lead.status === 'CONVERTED' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                          ✓ Converted
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {myData.referralLinksCount === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
                <Gift className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Start Referring Friends</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Create your referral link and start earning rewards when friends file their taxes
                </p>
              </div>
              <a
                href="/dashboard/referrer/links"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                Get My Referral Link
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
