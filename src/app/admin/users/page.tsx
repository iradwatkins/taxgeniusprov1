import { redirect } from 'next/navigation'
import { currentUser, clerkClient } from '@clerk/nextjs/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Users, Search, Filter, Download, UserPlus, Mail, Shield } from 'lucide-react'
import { UserManagementClient } from '@/components/UserManagementClient'

export const metadata = {
  title: 'User Management - Admin | Tax Genius Pro',
  description: 'Manage users and roles',
}

async function isAdmin() {
  const user = await currentUser()
  if (!user) return false
  const role = user.publicMetadata?.role as string
  return role === 'admin' || role === 'super_admin'
}

export default async function AdminUsersPage() {
  const userIsAdmin = await isAdmin()

  if (!userIsAdmin) {
    redirect('/forbidden')
  }

  const currentUserData = await currentUser()
  const isSuperAdmin = currentUserData?.publicMetadata?.role === 'super_admin'

  // Fetch all users from Clerk
  const clerk = await clerkClient()
  const { data: users } = await clerk.users.getUserList({
    limit: 100,
  })

  // Format users data for client component
  const formattedUsers = users.map(user => ({
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    role: (user.publicMetadata?.role as string) || 'client',
    permissions: user.publicMetadata?.permissions as Record<string, boolean> | undefined,
    createdAt: new Date(user.createdAt).toISOString(),
  }))

  // Count users by role
  const usersByRole = users.reduce((acc, user) => {
    const role = (user.publicMetadata?.role as string) || 'no_role'
    acc[role] = (acc[role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage users, roles, and permissions across the platform
          </p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all roles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Preparers</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersByRole['tax_preparer'] || 0}</div>
            <p className="text-xs text-muted-foreground">
              Professional tax preparers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referrers</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersByRole['referrer'] || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active referrers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Mail className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersByRole['client'] || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active clients
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Table - Client Component */}
      <UserManagementClient
        users={formattedUsers}
        isSuperAdmin={isSuperAdmin}
      />
    </div>
  )
}
