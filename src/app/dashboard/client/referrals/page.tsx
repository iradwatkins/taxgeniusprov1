'use client';

import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { MyReferralsTab } from '@/components/dashboard/client/MyReferralsTab';

export default function ClientReferralsPage() {
  // Fetch dashboard data to get referral info
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['client-dashboard'],
    queryFn: async () => {
      const response = await fetch('/api/client/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  const totalLeads = dashboardData?.referralStats?.totalLeads || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Referrals</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Earn money by referring friends and family
          </p>
        </div>

        <MyReferralsTab totalLeads={totalLeads} />
      </div>
    </div>
  );
}
