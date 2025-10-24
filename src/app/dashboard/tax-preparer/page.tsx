'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, FileCheck, Sparkles, ShoppingCart, Palette } from 'lucide-react';
import { AttributionStatsCard } from '@/components/dashboard/attribution-stats-card';
import { RecentLeadsTable } from '@/components/dashboard/recent-leads-table';
import { StatsGrid } from '@/components/dashboard/preparer/StatsGrid';
import { OverviewTab } from '@/components/dashboard/preparer/OverviewTab';
import { getPriorityColor } from '@/components/dashboard/preparer/utils';
import { ReferralLinksManager } from '@/components/dashboard/ReferralLinksManager';

// Types
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  taxYear: number;
  status: 'DRAFT' | 'IN_REVIEW' | 'FILED' | 'ACCEPTED' | 'REJECTED' | 'AMENDED';
  documentsCount: number;
  lastActivity: string;
  assignedDate: string;
  dueDate: string;
  refundAmount?: number;
  oweAmount?: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface PreparerStats {
  totalClients: number;
  inProgress: number;
  completed: number;
  awaitingDocuments: number;
  totalRevenue: number;
  averageProcessingTime: number;
}

export default function PreparerDashboard() {
  // Mock data
  const stats: PreparerStats = {
    totalClients: 47,
    inProgress: 12,
    completed: 31,
    awaitingDocuments: 4,
    totalRevenue: 7050,
    averageProcessingTime: 3.5,
  };

  const clients: Client[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      taxYear: 2023,
      status: 'IN_REVIEW',
      documentsCount: 5,
      lastActivity: '2 hours ago',
      assignedDate: '2024-01-10',
      dueDate: '2024-02-15',
      refundAmount: 2500,
      priority: 'HIGH',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '(555) 234-5678',
      taxYear: 2023,
      status: 'DRAFT',
      documentsCount: 3,
      lastActivity: '1 day ago',
      assignedDate: '2024-01-12',
      dueDate: '2024-02-20',
      oweAmount: 1200,
      priority: 'MEDIUM',
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'mbrown@email.com',
      phone: '(555) 345-6789',
      taxYear: 2023,
      status: 'ACCEPTED',
      documentsCount: 8,
      lastActivity: '3 days ago',
      assignedDate: '2024-01-05',
      dueDate: '2024-02-10',
      refundAmount: 3800,
      priority: 'LOW',
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Preparer Dashboard</h1>
        <p className="text-muted-foreground">Manage your clients and tax preparations</p>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={stats} />

      {/* Quick Access */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Quick Access
          </CardTitle>
          <CardDescription>Your most important tools and features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-6 bg-white dark:bg-gray-950 hover:shadow-lg transition-all"
              asChild
            >
              <a href="/dashboard/tax-preparer/analytics">
                <div className="h-14 w-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <BarChart3 className="h-7 w-7 text-purple-600" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm">My Analytics</p>
                  <p className="text-xs text-muted-foreground mt-1">Track performance</p>
                </div>
              </a>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-6 bg-white dark:bg-gray-950 hover:shadow-lg transition-all"
              asChild
            >
              <a href="/dashboard/tax-preparer/tracking">
                <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <FileCheck className="h-7 w-7 text-green-600" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm">My Tracking Code</p>
                  <p className="text-xs text-muted-foreground mt-1">Referral link</p>
                </div>
              </a>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-6 bg-white dark:bg-gray-950 hover:shadow-lg transition-all"
              asChild
            >
              <a href="/app/academy">
                <div className="h-14 w-14 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Sparkles className="h-7 w-7 text-orange-600" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm">Academy</p>
                  <p className="text-xs text-muted-foreground mt-1">6 training videos</p>
                </div>
              </a>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-6 bg-white dark:bg-gray-950 hover:shadow-lg transition-all"
              asChild
            >
              <a href="/store">
                <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <ShoppingCart className="h-7 w-7 text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm">Store</p>
                  <p className="text-xs text-muted-foreground mt-1">Marketing materials</p>
                </div>
              </a>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-3 py-6 bg-white dark:bg-gray-950 hover:shadow-lg transition-all"
              asChild
            >
              <a href="/dashboard/tax-preparer/settings">
                <div className="h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-900/30 flex items-center justify-center">
                  <Palette className="h-7 w-7 text-gray-600" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm">Settings</p>
                  <p className="text-xs text-muted-foreground mt-1">Account & profile</p>
                </div>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Referral Links */}
      <ReferralLinksManager />

      {/* Overview Content */}
      <OverviewTab clients={clients} getPriorityColor={getPriorityColor} />

      {/* Attribution Stats */}
      <AttributionStatsCard period="30d" />

      {/* Recent Leads */}
      <RecentLeadsTable limit={10} />
    </div>
  );
}
