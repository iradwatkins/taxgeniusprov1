import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  Activity,
  ArrowUp,
  ArrowDown,
  Download,
  Calendar,
} from 'lucide-react'
import {
  getDashboardStats,
  getRevenueData,
  getUserGrowthData,
  getTopServices,
  getUserActivity,
  getConversionFunnel,
} from '@/lib/services/analytics.service'

export const metadata = {
  title: 'Analytics - Admin | Tax Genius Pro',
  description: 'View platform analytics and insights',
}

async function isAdmin() {
  const user = await currentUser()
  if (!user) return false
  const role = user.publicMetadata?.role as string
  return role === 'admin' || role === 'super_admin'
}

export default async function AdminAnalyticsPage() {
  const userIsAdmin = await isAdmin()

  if (!userIsAdmin) {
    redirect('/forbidden')
  }

  // Fetch real analytics data
  const stats = await getDashboardStats()
  const revenueData = await getRevenueData()
  const userGrowthData = await getUserGrowthData()
  const topServices = await getTopServices()
  const userActivity = await getUserActivity()
  const conversionFunnel = await getConversionFunnel()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track platform performance and user engagement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <div className={`flex items-center text-xs mt-1 ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.revenueGrowth >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
              {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <div className={`flex items-center text-xs mt-1 ${stats.usersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.usersGrowth >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
              {stats.usersGrowth >= 0 ? '+' : ''}{stats.usersGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returns Filed</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.returnsFiled}</div>
            <div className={`flex items-center text-xs mt-1 ${stats.returnsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.returnsGrowth >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
              {stats.returnsGrowth >= 0 ? '+' : ''}{stats.returnsGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (30d)</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSessions}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              Recently active users
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p className="text-sm">No revenue data available</p>
              </div>
            ) : (
              <div className="h-[300px] flex items-end justify-between gap-2">
                {revenueData.map((data) => (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-primary rounded-t-lg transition-all hover:bg-primary/80"
                      style={{ height: data.height }}
                    />
                    <div className="text-sm font-medium">{data.month}</div>
                    <div className="text-xs text-muted-foreground">
                      ${(data.value / 1000).toFixed(1)}k
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            {userGrowthData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p className="text-sm">No user growth data available</p>
              </div>
            ) : (
              <div className="h-[300px] flex items-end justify-between gap-2">
                {userGrowthData.map((data) => (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-400"
                      style={{ height: data.height }}
                    />
                    <div className="text-sm font-medium">{data.month}</div>
                    <div className="text-xs text-muted-foreground">
                      {data.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Services</CardTitle>
            <CardDescription>Most popular tax services this month</CardDescription>
          </CardHeader>
          <CardContent>
            {topServices.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p className="text-sm">No service data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topServices.map((service) => (
                  <div key={service.name} className="flex items-center gap-4">
                    <div className={`w-2 h-12 rounded-full ${service.color}`} />
                    <div className="flex-1">
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">{service.revenue}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      {service.growth}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>User engagement by role</CardDescription>
          </CardHeader>
          <CardContent>
            {userActivity.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p className="text-sm">No user activity data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userActivity.map((data) => (
                  <div key={data.role} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{data.role}</span>
                      <span className="text-sm text-muted-foreground">
                        {data.active}/{data.count} active
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${data.color} transition-all`}
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{data.percentage}% engagement</span>
                      <Badge variant="outline" className="text-xs">
                        {data.percentage >= 75 ? 'High' : data.percentage >= 50 ? 'Medium' : 'Low'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>User journey from signup to return filing</CardDescription>
        </CardHeader>
        <CardContent>
          {conversionFunnel.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p className="text-sm">No conversion data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {conversionFunnel.map((stage) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{stage.stage}</span>
                    <span className="text-sm text-muted-foreground">
                      {stage.count.toLocaleString()} users ({stage.percentage}%)
                    </span>
                  </div>
                  <div className="h-8 bg-muted rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${stage.color} transition-all flex items-center px-4 text-white text-sm font-medium`}
                      style={{ width: `${stage.percentage}%` }}
                    >
                      {stage.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
