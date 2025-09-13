import { Users, CheckCircle, Trophy, DollarSign, QrCode, Link as LinkIcon, RefreshCw, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar } from "@/components/Sidebar";
import { StatCard } from "@/components/StatCard";
import { VanityLinkManager } from "@/components/VanityLinkManager";
import { MarketingHub } from "@/components/MarketingHub";
import { QRPosterDialog } from "@/components/QRPosterDialog";
import { ContestDisplay } from "@/components/ContestDisplay";
import { NotificationBell } from "@/components/NotificationBell";
import { useAuth } from "@/core/providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { 
  useReferrerStats, 
  useRecentActivity, 
  useRefreshReferrerData 
} from "@/hooks/useReferrerData";

const ReferrerDashboard = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Get referrer profile ID for queries
  const referrerId = user?.profile?.id;
  const userId = user?.id;

  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading, error: statsError } = useReferrerStats(referrerId);
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity(referrerId, 5);
  const { mutate: refreshData, isPending: isRefreshing } = useRefreshReferrerData(referrerId, userId);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const handleRefresh = () => {
    refreshData();
  };

  // Sample chart data for the last 30 days (in a real app, this would come from analytics)
  const chartData = [
    { date: '30d ago', referrals: 0 },
    { date: '25d ago', referrals: 2 },
    { date: '20d ago', referrals: 5 },
    { date: '15d ago', referrals: 12 },
    { date: '10d ago', referrals: 18 },
    { date: '5d ago', referrals: 25 },
    { date: 'Today', referrals: stats?.total_referrals || 0 },
  ];

  // Loading state
  if (statsLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar role="referrer" onLogout={handleLogout} />
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (statsError) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar role="referrer" onLogout={handleLogout} />
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Referrer Dashboard
              </h1>
              <p className="text-muted-foreground">
                Unable to load dashboard data. Please try again.
              </p>
              <Button onClick={handleRefresh} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar role="referrer" onLogout={handleLogout} />
      
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">

          {/* Header with refresh button and notifications */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Referrer Dashboard
              </h1>
              <p className="text-muted-foreground">
                Track your referrals and earnings
              </p>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell userId={userId} />
              <Button 
                onClick={handleRefresh} 
                disabled={isRefreshing}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Total Referrals"
              value={stats?.total_referrals || 0}
              icon={Users}
              description={`+${stats?.referrals_this_month || 0} this month`}
            />
            <StatCard
              title="Completed Returns"
              value={stats?.completed_returns || 0}
              icon={CheckCircle}
              description="Returns filed this season"
            />
            <StatCard
              title="Contest Rank"
              value={stats?.contest_rank ? `#${stats.contest_rank}` : 'Not ranked'}
              icon={Trophy}
              description={stats?.contest_rank ? 'Current ranking' : 'Join a contest!'}
            />
            <StatCard
              title="Total Earnings"
              value={`$${stats?.total_earnings?.toFixed(2) || '0.00'}`}
              icon={DollarSign}
              description={`+$${stats?.earnings_this_month?.toFixed(2) || '0.00'} this month`}
            />
          </div>

          {/* Chart */}
          <Card className="mb-8 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Referral Growth (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="referrals" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Vanity Link Manager */}
          <div className="mb-8">
            <VanityLinkManager 
              referrerId={referrerId || ''} 
              currentSlug={user?.profile?.vanity_slug} 
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <QRPosterDialog
                    referralUrl={user?.profile?.vanity_slug ? `https://taxgenius.com/${user.profile.vanity_slug}` : 'https://taxgenius.com/refer'}
                    referrerName={user?.profile?.first_name && user?.profile?.last_name ? 
                      `${user.profile.first_name} ${user.profile.last_name}` : 
                      user?.profile?.vanity_slug || 'Referrer'}
                  />
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Social Media Kit
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Share Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Marketing Hub */}
          <div className="mb-8">
            <MarketingHub 
              referralUrl={user?.profile?.vanity_slug ? `https://taxgenius.com/${user.profile.vanity_slug}` : 'https://taxgenius.com/refer'}
            />
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {activityLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between py-2">
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="h-4 w-12" />
                      </div>
                    ))}
                  </div>
                ) : recentActivity && recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => {
                      const timeAgo = new Date(activity.date).toLocaleDateString();
                      return (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div>
                            <p className="text-sm font-medium">{activity.client_name}</p>
                            <p className="text-xs text-muted-foreground">{activity.action} • {timeAgo}</p>
                          </div>
                          <span className="text-sm font-medium text-green-600">
                            ${activity.amount}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent activity</p>
                    <p className="text-xs">Start referring clients to see activity here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contest & Leaderboard */}
          <ContestDisplay 
            currentUserId={userId}
            referrerId={referrerId}
          />
        </div>
      </div>
    </div>
  );
};

export default ReferrerDashboard;