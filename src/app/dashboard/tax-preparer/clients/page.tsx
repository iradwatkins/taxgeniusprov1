import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { getUserPermissions, UserRole } from '@/lib/permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import Link from 'next/link';
import { ReturnQuickComplete } from '@/components/tax-preparer/ReturnQuickComplete';

// Status badge colors
const statusColors: Record<string, 'secondary' | 'default' | 'outline' | 'destructive'> = {
  DRAFT: 'secondary',
  IN_REVIEW: 'default',
  FILED: 'outline',
  ACCEPTED: 'outline',
  REJECTED: 'destructive',
  AMENDED: 'secondary',
};

interface TaxPreparerClientsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function TaxPreparerClientsPage({ searchParams }: TaxPreparerClientsPageProps) {
  // Get authenticated user
  const user = await currentUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Check permissions and role
  const role = user.publicMetadata?.role as UserRole | undefined;
  const customPermissions = user.publicMetadata?.permissions as Record<string, boolean> | undefined;
  const permissions = getUserPermissions(role || 'client', customPermissions);

  // Only tax preparers can access this page
  if (role !== 'tax_preparer' && role !== 'admin') {
    redirect('/forbidden');
  }

  // Get the preparer's profile ID and revenue split
  const preparerProfile = await prisma.profile.findUnique({
    where: { clerkUserId: user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      revenueSplitPercentage: true,
    },
  });

  if (!preparerProfile) {
    redirect('/dashboard/tax-preparer');
  }

  // Get the preparer's configured revenue split (defaults to 30% if not set)
  const preparerRevenueSplit = preparerProfile.revenueSplitPercentage || 30;

  // Get filter parameters
  const search = typeof searchParams.search === 'string' ? searchParams.search : '';
  const statusFilter = typeof searchParams.status === 'string' ? searchParams.status : '';

  let clients: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
    createdAt: Date;
    taxReturns: Array<{
      id: string;
      status: string;
      taxYear: number;
      refundAmount: number | null;
      oweAmount: number | null;
      progress: number | null;
    }>;
    referrerReferrals: Array<{
      id: string;
      referrer: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        role: string;
      };
    }>;
  }[] = [];

  let stats = {
    totalClients: 0,
    activeReturns: 0,
    completedReturns: 0,
    awaitingDocuments: 0,
  };

  try {
    // Build where clause for clients
    const clientsWhere: {
      role: string;
      clientPreparers: { some: { preparerId: string; isActive: boolean } };
      OR?: Array<Record<string, unknown>>;
    } = {
      role: 'CLIENT',
      clientPreparers: {
        some: {
          preparerId: preparerProfile.id,
          isActive: true,
        },
      },
    };

    // Apply search filter
    if (search) {
      clientsWhere.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch clients assigned to this preparer
    clients = await prisma.profile.findMany({
      where: clientsWhere,
      include: {
        taxReturns: {
          where: statusFilter ? { status: statusFilter.toUpperCase() } : undefined,
          orderBy: {
            taxYear: 'desc',
          },
          take: 1,
        },
        referrerReferrals: {
          include: {
            referrer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
          where: {
            status: { in: ['ACTIVE', 'COMPLETED'] },
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate stats
    stats.totalClients = clients.length;
    stats.activeReturns = clients.filter(
      (c) =>
        c.taxReturns[0] &&
        ['DRAFT', 'IN_REVIEW'].includes(c.taxReturns[0].status)
    ).length;
    stats.completedReturns = clients.filter(
      (c) => c.taxReturns[0] && ['FILED', 'ACCEPTED'].includes(c.taxReturns[0].status)
    ).length;
    stats.awaitingDocuments = clients.filter(
      (c) =>
        c.taxReturns[0] && c.taxReturns[0].status === 'DRAFT' && (c.taxReturns[0].progress || 0) < 50
    ).length;
  } catch (error) {
    logger.error('Error fetching preparer clients:', error);
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Clients</h1>
        <p className="text-muted-foreground">
          Manage your assigned clients and their tax returns
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">Assigned to you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Returns</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeReturns}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedReturns}</div>
            <p className="text-xs text-muted-foreground">Filed or accepted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awaiting Docs</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.awaitingDocuments}</div>
            <p className="text-xs text-muted-foreground">Need documents</p>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
          <CardDescription>
            All clients assigned to{' '}
            {preparerProfile.firstName && preparerProfile.lastName
              ? `${preparerProfile.firstName} ${preparerProfile.lastName}`
              : 'you'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Clients Assigned</h3>
              <p className="text-muted-foreground mb-4">
                {search
                  ? 'No clients match your search criteria'
                  : 'You don&apos;t have any clients assigned yet'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Tax Year</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => {
                    const latestReturn = client.taxReturns[0];
                    const fullName = [client.firstName, client.lastName].filter(Boolean).join(' ') || 'N/A';

                    return (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{fullName}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(client.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {client.email && (
                              <div className="flex items-center gap-1 text-xs">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-[200px]">{client.email}</span>
                              </div>
                            )}
                            {client.phone && (
                              <div className="flex items-center gap-1 text-xs">
                                <Phone className="h-3 w-3" />
                                <span>{client.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {latestReturn ? (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{latestReturn.taxYear}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {latestReturn ? (
                            <Badge variant={statusColors[latestReturn.status] || 'default'}>
                              {latestReturn.status.replace('_', ' ')}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Not Started</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {latestReturn ? (
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{ width: `${latestReturn.progress || 0}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {latestReturn.progress || 0}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {latestReturn ? (
                            <div className="flex items-center gap-1">
                              {latestReturn.refundAmount ? (
                                <>
                                  <TrendingUp className="h-3 w-3 text-green-600" />
                                  <span className="text-green-600 font-medium">
                                    ${latestReturn.refundAmount.toLocaleString()}
                                  </span>
                                </>
                              ) : latestReturn.oweAmount ? (
                                <>
                                  <AlertCircle className="h-3 w-3 text-orange-600" />
                                  <span className="text-orange-600 font-medium">
                                    ${latestReturn.oweAmount.toLocaleString()}
                                  </span>
                                </>
                              ) : (
                                <span className="text-muted-foreground">Calculating...</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {latestReturn && (
                              <ReturnQuickComplete
                                taxReturnId={latestReturn.id}
                                clientName={fullName}
                                taxYear={latestReturn.taxYear}
                                currentStatus={latestReturn.status}
                                refundAmount={latestReturn.refundAmount ? parseFloat(latestReturn.refundAmount.toString()) : null}
                                oweAmount={latestReturn.oweAmount ? parseFloat(latestReturn.oweAmount.toString()) : null}
                                referrerInfo={
                                  client.referrerReferrals[0]
                                    ? {
                                        name: `${client.referrerReferrals[0].referrer.firstName || ''} ${client.referrerReferrals[0].referrer.lastName || ''}`.trim(),
                                        commissionRate: 50, // Default $50, can be enhanced to fetch actual rate
                                      }
                                    : null
                                }
                                taxGeniusPercentage={preparerRevenueSplit}
                              />
                            )}
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/file-center?client=${client.id}`}>
                                <FileText className="h-3 w-3 mr-1" />
                                Files
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`mailto:${client.email}`}>
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for managing your clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" asChild>
              <Link href="/admin/file-center">
                <FileText className="mr-2 h-4 w-4" />
                View All Client Files
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/calendar">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/tax-preparer/analytics">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Performance
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
