'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Users,
  DollarSign,
  TrendingUp,
  Trophy,
  FileText,
  Share2,
  QrCode,
  Bell,
  BarChart3,
  Calendar,
  Wallet
} from 'lucide-react'
import { ContestDisplay } from '@/components/ContestDisplay'
import { VanityLinkManager } from '@/components/VanityLinkManager'
import { QRPosterGenerator } from '@/components/QRPosterGenerator'
import { MarketingHub } from '@/components/MarketingHub'
import { NotificationBell } from '@/components/NotificationBell'
import { StatCard } from '@/components/StatCard'
import { useReferrerStats, useRecentActivity } from '@/hooks/useReferrerData'

export default function ReferrerDashboard() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState('overview')
  const { data: stats, isLoading: statsLoading } = useReferrerStats()
  const { data: activity, isLoading: activityLoading } = useRecentActivity(5)

  // Referrer ID comes from auth context - placeholder for development
  const referrerId = 'current-referrer-id'
  const referrerName = 'Referrer' // Will be replaced with real name from auth

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Referrer Dashboard</h1>
            <p className="text-muted-foreground">
              Track your referrals, earnings, and grow your network
            </p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell userId={referrerId} />
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsLoading ? (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          ) : (
            <>
              <StatCard
                title="Total Referrals"
                value={stats?.total_referrals || 0}
                icon={<Users className="h-4 w-4" />}
                description="+12% from last month"
                trend="up"
              />
              <StatCard
                title="Completed Returns"
                value={stats?.completed_returns || 0}
                icon={<FileText className="h-4 w-4" />}
                description="Tax returns filed"
              />
              <StatCard
                title="Total Earnings"
                value={`$${stats?.total_earnings || 0}`}
                icon={<DollarSign className="h-4 w-4" />}
                description={`$${stats?.earnings_this_month || 0} this month`}
                trend="up"
                onClick={() => router.push('/dashboard/referrer/earnings')}
                className="cursor-pointer hover:shadow-md transition-shadow"
              />
              <StatCard
                title="Contest Rank"
                value={stats?.contest_rank ? `#${stats.contest_rank}` : 'N/A'}
                icon={<Trophy className="h-4 w-4" />}
                description="Current leaderboard position"
                trend={stats?.contest_rank && stats.contest_rank <= 10 ? 'up' : undefined}
              />
            </>
          )}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="links">Links & QR</TabsTrigger>
            <TabsTrigger value="contests">Contests</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest referral activities</CardDescription>
                </CardHeader>
                <CardContent>
                  {activityLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-12" />
                      <Skeleton className="h-12" />
                      <Skeleton className="h-12" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activity?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{item.client_name}</p>
                            <p className="text-xs text-muted-foreground">{item.action}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-primary">+${item.amount}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {(!activity || activity.length === 0) && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No recent activity
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => router.push('/dashboard/referrer/earnings')}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    View Earnings & Request Payout
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => setSelectedTab('links')}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Referral Link
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => setSelectedTab('links')}
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    Generate QR Poster
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => setSelectedTab('analytics')}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Full Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>Your performance metrics for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">New Referrals</p>
                    <p className="text-2xl font-bold">{stats?.referrals_this_month || 0}</p>
                    <Badge variant="secondary">Target: 20</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Monthly Earnings</p>
                    <p className="text-2xl font-bold">${stats?.earnings_this_month || 0}</p>
                    <Badge variant="secondary">Target: $2,000</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                    <p className="text-2xl font-bold">
                      {stats?.total_referrals && stats?.completed_returns
                        ? `${Math.round((stats.completed_returns / stats.total_referrals) * 100)}%`
                        : '0%'}
                    </p>
                    <Badge variant="secondary">Target: 75%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links" className="space-y-4">
            <VanityLinkManager referrerId={referrerId} />
            <QRPosterGenerator
              referralUrl={`https://taxgenius.com/${referrerName.toLowerCase().replace(/\s+/g, '')}`}
              referrerName={referrerName}
            />
          </TabsContent>

          <TabsContent value="contests" className="space-y-4">
            <ContestDisplay referrerId={referrerId} currentUserId={referrerId} />
          </TabsContent>

          <TabsContent value="marketing" className="space-y-4">
            <MarketingHub />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>Detailed performance metrics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mr-4" />
                  <p>Advanced analytics coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}