import { redirect } from 'next/navigation';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { UserRole } from '@prisma/client';
import {
  Users,
  MousePointerClick,
  UserPlus,
  FileCheck,
  DollarSign,
  TrendingUp,
  Target,
  Zap,
} from 'lucide-react';
import { getCompanyLeadsSummary } from '@/lib/services/lead-analytics.service';
import { LeadMetricCard } from '@/components/admin/analytics/LeadMetricCard';
import { createFunnelStages } from '@/lib/utils/analytics';
import { ConversionFunnelChart } from '@/components/admin/analytics/ConversionFunnelChart';
import {
  SourceBreakdownChart,
  createSourceBreakdown,
} from '@/components/admin/analytics/SourceBreakdownChart';
import { ExportButton } from '@/components/admin/analytics/ExportButton';
import { AnalyticsPeriodSelector } from './AnalyticsPeriodSelector';
import type { Period } from '@/components/admin/analytics/PeriodToggle';

export const metadata = {
  title: 'Lead Generation Analytics - Admin | Tax Genius Pro',
  description: 'Track lead generation performance across all sources',
};

async function checkAdminAccess() {
  const user = await currentUser();
  if (!user) return { hasAccess: false, userId: null, role: null };

  const role = user.publicMetadata?.role as string;
  const hasAccess = role === 'admin' || role === 'super_admin';

  return { hasAccess, userId: user.id, role };
}

export default async function AdminAnalyticsOverviewPage({
  searchParams,
}: {
  searchParams: { period?: string };
}) {
  const { hasAccess, userId, role } = await checkAdminAccess();

  if (!hasAccess || !userId) {
    redirect('/forbidden');
  }

  // Get period from URL or default to 30d
  const period = (searchParams.period as Period) || '30d';

  // Fetch lead generation summary
  const summary = await getCompanyLeadsSummary(userId, role as UserRole, period);

  // Prepare export data
  const exportData = [
    {
      source: 'Tax Genius',
      clicks: summary.taxGeniusLeads.clicks,
      leads: summary.taxGeniusLeads.leads,
      conversions: summary.taxGeniusLeads.conversions,
      returnsFiled: summary.taxGeniusLeads.returnsFiled,
      conversionRate: summary.taxGeniusLeads.conversionRate,
      revenue: summary.taxGeniusLeads.revenue,
      growthRate: summary.taxGeniusLeads.growthRate,
    },
    {
      source: 'Tax Preparers',
      clicks: summary.taxPreparerLeads.clicks,
      leads: summary.taxPreparerLeads.leads,
      conversions: summary.taxPreparerLeads.conversions,
      returnsFiled: summary.taxPreparerLeads.returnsFiled,
      conversionRate: summary.taxPreparerLeads.conversionRate,
      revenue: summary.taxPreparerLeads.revenue,
      growthRate: summary.taxPreparerLeads.growthRate,
    },
    {
      source: 'Affiliates',
      clicks: summary.affiliateLeads.clicks,
      leads: summary.affiliateLeads.leads,
      conversions: summary.affiliateLeads.conversions,
      returnsFiled: summary.affiliateLeads.returnsFiled,
      conversionRate: summary.affiliateLeads.conversionRate,
      revenue: summary.affiliateLeads.revenue,
      growthRate: summary.affiliateLeads.growthRate,
    },
    {
      source: 'Client Referrals',
      clicks: summary.clientReferrals.clicks,
      leads: summary.clientReferrals.leads,
      conversions: summary.clientReferrals.conversions,
      returnsFiled: summary.clientReferrals.returnsFiled,
      conversionRate: summary.clientReferrals.conversionRate,
      revenue: summary.clientReferrals.revenue,
      growthRate: summary.clientReferrals.growthRate,
    },
  ];

  // Calculate totals
  const totalClicks = exportData.reduce((sum, s) => sum + s.clicks, 0);
  const totalLeads = exportData.reduce((sum, s) => sum + s.leads, 0);
  const totalConversions = exportData.reduce((sum, s) => sum + s.conversions, 0);
  const totalReturnsFiled = exportData.reduce((sum, s) => sum + s.returnsFiled, 0);
  const overallConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

  // Create funnel data for overall conversion
  const funnelStages = createFunnelStages(
    totalClicks,
    totalLeads,
    totalConversions,
    totalReturnsFiled
  );

  // Create source breakdown data
  const sourceBreakdown = createSourceBreakdown(
    summary.taxGeniusLeads.leads,
    summary.taxPreparerLeads.leads,
    summary.affiliateLeads.leads,
    summary.clientReferrals.leads
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Generation Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Company-wide lead tracking across all sources
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AnalyticsPeriodSelector currentPeriod={period} />
          <ExportButton data={exportData} filename="lead-analytics-overview" variant="default" />
        </div>
      </div>

      {/* Overall Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <LeadMetricCard
          title="Total Clicks"
          value={totalClicks}
          growthRate={
            (summary.taxGeniusLeads.growthRate +
              summary.taxPreparerLeads.growthRate +
              summary.affiliateLeads.growthRate +
              summary.clientReferrals.growthRate) /
            4
          }
          icon={MousePointerClick}
          color="blue"
          format="number"
          subtitle={`${period === '7d' ? 'Last 7 days' : period === '30d' ? 'Last 30 days' : period === '90d' ? 'Last 90 days' : 'All time'}`}
        />
        <LeadMetricCard
          title="Total Leads"
          value={totalLeads}
          icon={UserPlus}
          color="purple"
          format="number"
        />
        <LeadMetricCard
          title="Conversions"
          value={totalConversions}
          icon={FileCheck}
          color="green"
          format="number"
        />
        <LeadMetricCard
          title="Total Revenue"
          value={summary.totalRevenue}
          icon={DollarSign}
          color="yellow"
          format="currency"
        />
      </div>

      {/* Source Performance Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Performance by Source</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Tax Genius Leads */}
          <LeadMetricCard
            title="Tax Genius Leads"
            value={summary.taxGeniusLeads.leads}
            growthRate={summary.taxGeniusLeads.growthRate}
            icon={Zap}
            color="blue"
            format="number"
            subtitle={`${summary.taxGeniusLeads.conversionRate.toFixed(1)}% conversion`}
          />

          {/* Tax Preparer Leads */}
          <LeadMetricCard
            title="Tax Preparer Leads"
            value={summary.taxPreparerLeads.leads}
            growthRate={summary.taxPreparerLeads.growthRate}
            icon={Users}
            color="purple"
            format="number"
            subtitle={`${summary.taxPreparerLeads.conversionRate.toFixed(1)}% conversion`}
          />

          {/* Affiliate Leads */}
          <LeadMetricCard
            title="Affiliate Leads"
            value={summary.affiliateLeads.leads}
            growthRate={summary.affiliateLeads.growthRate}
            icon={Target}
            color="orange"
            format="number"
            subtitle={`${summary.affiliateLeads.conversionRate.toFixed(1)}% conversion`}
          />

          {/* Client Referral Leads */}
          <LeadMetricCard
            title="Client Referrals"
            value={summary.clientReferrals.leads}
            growthRate={summary.clientReferrals.growthRate}
            icon={TrendingUp}
            color="green"
            format="number"
            subtitle={`${summary.clientReferrals.conversionRate.toFixed(1)}% conversion`}
          />
        </div>
      </div>

      {/* Revenue by Source Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Revenue by Source</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <LeadMetricCard
            title="Tax Genius Revenue"
            value={summary.taxGeniusLeads.revenue}
            icon={DollarSign}
            color="blue"
            format="currency"
            subtitle={`${summary.taxGeniusLeads.returnsFiled} returns filed`}
          />
          <LeadMetricCard
            title="Tax Preparer Revenue"
            value={summary.taxPreparerLeads.revenue}
            icon={DollarSign}
            color="purple"
            format="currency"
            subtitle={`${summary.taxPreparerLeads.returnsFiled} returns filed`}
          />
          <LeadMetricCard
            title="Affiliate Revenue"
            value={summary.affiliateLeads.revenue}
            icon={DollarSign}
            color="orange"
            format="currency"
            subtitle={`${summary.affiliateLeads.returnsFiled} returns filed`}
          />
          <LeadMetricCard
            title="Referral Revenue"
            value={summary.clientReferrals.revenue}
            icon={DollarSign}
            color="green"
            format="currency"
            subtitle={`${summary.clientReferrals.returnsFiled} returns filed`}
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Conversion Funnel */}
        <ConversionFunnelChart
          stages={funnelStages}
          title="Overall Conversion Funnel"
          subtitle="Aggregate performance across all lead sources"
        />

        {/* Source Breakdown */}
        <SourceBreakdownChart
          data={sourceBreakdown}
          title="Leads by Source"
          subtitle="Distribution of leads across channels"
        />
      </div>

      {/* Quick Links to Detailed Pages */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/admin/analytics/preparers"
          className="block p-6 border rounded-lg hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">Tax Preparer Analytics</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            View individual preparer performance and filter by specific preparers
          </p>
        </Link>

        <Link
          href="/admin/analytics/affiliates"
          className="block p-6 border rounded-lg hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold">Affiliate Analytics</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Track affiliate campaign performance and earnings
          </p>
        </Link>

        <Link
          href="/admin/analytics/clients"
          className="block p-6 border rounded-lg hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold">Client Referral Analytics</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Monitor client referral programs and rewards
          </p>
        </Link>
      </div>
    </div>
  );
}
