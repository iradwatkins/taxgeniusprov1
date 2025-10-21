import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { getUserPermissions, UserRole } from '@/lib/permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, Users, AlertCircle, UserCog, Settings } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PermissionManager } from '@/components/admin/PermissionManager';
import { PermissionPresets } from '@/components/admin/PermissionPresets';
import { logger } from '@/lib/logger';

export default async function PermissionsPage() {
  const user = await currentUser();
  if (!user) redirect('/auth/login');

  const role = user.publicMetadata?.role as UserRole | undefined;

  // Only super_admin can access this page
  if (role !== 'super_admin') {
    redirect('/forbidden');
  }

  // Fetch all admin users
  let adminUsers: any[] = [];

  try {
    adminUsers = await prisma.profile.findMany({
      where: {
        role: 'ADMIN',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    logger.error('Error fetching admin users:', error);
    // Continue with empty array - will show "No admin users found" message
  }

  // Default admin permissions (what regular admins get)
  const defaultAdminPermissions = {
    dashboard: true,
    clientsStatus: true,
    referralsStatus: true,
    emails: true,
    calendar: true,
    addressBook: true,
    clientFileCenter: false, // Restricted by default
    analytics: true,
    googleAnalytics: false, // Restricted by default
    referralsAnalytics: true,
    learningCenter: true,
    marketingHub: true,
    contentGenerator: true,
    payouts: true,
    earnings: true,
    store: true,
    users: true,
    database: false, // Restricted by default
    adminManagement: false, // Restricted by default
    settings: true,
    quickShareLinks: true,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Permission Management</h1>
          </div>
          <p className="text-muted-foreground">
            Control access and permissions for admin users and other roles
          </p>
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-200">
                  Super Admin Privileges
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
                  You have full control over all permissions. Changes made here will immediately
                  affect what admin users can access.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="role-permissions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="role-permissions">Role Permissions</TabsTrigger>
            <TabsTrigger value="admin-users">Admin Users ({adminUsers.length})</TabsTrigger>
            <TabsTrigger value="permission-presets">Permission Presets</TabsTrigger>
          </TabsList>

          {/* Role Permissions Tab */}
          <TabsContent value="role-permissions">
            <Card>
              <CardHeader>
                <CardTitle>Section-Based Permissions</CardTitle>
                <CardDescription>
                  Enable or disable entire navigation sections for admin users. Toggle a section to
                  control all items within it.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PermissionManager
                  defaultPermissions={defaultAdminPermissions}
                  targetRole="admin"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Users Tab */}
          <TabsContent value="admin-users">
            <Card>
              <CardHeader>
                <CardTitle>Admin Users</CardTitle>
                <CardDescription>Manage permissions for individual admin users</CardDescription>
              </CardHeader>
              <CardContent>
                {adminUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No admin users found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {adminUsers.map((adminUser) => (
                      <div
                        key={adminUser.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <UserCog className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {adminUser.firstName} {adminUser.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {adminUser.clerkUserId || adminUser.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">Admin</Badge>
                          <Button variant="outline" size="sm">
                            <Settings className="w-3 h-3 mr-1" />
                            Customize
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permission Presets Tab */}
          <TabsContent value="permission-presets">
            <Card>
              <CardHeader>
                <CardTitle>Permission Presets</CardTitle>
                <CardDescription>
                  Quick templates for common permission configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PermissionPresets />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
