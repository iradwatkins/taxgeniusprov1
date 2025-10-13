'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Users,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Eye,
  Send,
  MessageSquare,
  Calendar,
  Filter,
  Search,
  ChevronRight,
  Calculator,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  UserCheck,
  Archive,
  Store,
  Palette,
  ShoppingCart,
  Package,
  CreditCard,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

// Types
interface Client {
  id: string
  name: string
  email: string
  phone: string
  taxYear: number
  status: 'DRAFT' | 'IN_REVIEW' | 'FILED' | 'ACCEPTED' | 'REJECTED' | 'AMENDED'
  documentsCount: number
  lastActivity: string
  assignedDate: string
  dueDate: string
  refundAmount?: number
  oweAmount?: number
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

interface PreparerStats {
  totalClients: number
  inProgress: number
  completed: number
  awaitingDocuments: number
  totalRevenue: number
  averageProcessingTime: number
}

export default function PreparerDashboard() {
  const { toast } = useToast()
  const [selectedTab, setSelectedTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  // Mock data
  const stats: PreparerStats = {
    totalClients: 47,
    inProgress: 12,
    completed: 31,
    awaitingDocuments: 4,
    totalRevenue: 7050,
    averageProcessingTime: 3.5
  }

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
      priority: 'HIGH'
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
      priority: 'MEDIUM'
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
      priority: 'LOW'
    }
  ]

  const getStatusIcon = (status: Client['status']) => {
    switch (status) {
      case 'DRAFT':
        return <Clock className="h-4 w-4 text-gray-500" />
      case 'IN_REVIEW':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'FILED':
        return <Send className="h-4 w-4 text-blue-500" />
      case 'ACCEPTED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'AMENDED':
        return <FileText className="h-4 w-4 text-purple-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: Client['status']) => {
    switch (status) {
      case 'DRAFT':
        return 'secondary'
      case 'IN_REVIEW':
        return 'warning'
      case 'FILED':
        return 'default'
      case 'ACCEPTED':
        return 'success'
      case 'REJECTED':
        return 'destructive'
      case 'AMENDED':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getPriorityColor = (priority: Client['priority']) => {
    switch (priority) {
      case 'HIGH':
        return 'destructive'
      case 'MEDIUM':
        return 'warning'
      case 'LOW':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || client.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleUpdateStatus = async (clientId: string, newStatus: Client['status']) => {
    try {
      // TODO: Update status via API
      toast({
        title: 'Status updated',
        description: `Client status has been updated to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'Failed to update client status',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Preparer Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your clients and tax preparations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
            <Button>
              <UserCheck className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Actively working</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">This tax season</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Awaiting Docs</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.awaitingDocuments}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageProcessingTime} days</div>
              <p className="text-xs text-muted-foreground">Per return</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="store">Store</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Priority Clients */}
              <Card>
                <CardHeader>
                  <CardTitle>Priority Clients</CardTitle>
                  <CardDescription>Clients requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {clients
                      .filter(c => c.priority === 'HIGH')
                      .slice(0, 5)
                      .map((client) => (
                        <div key={client.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{client.name}</p>
                              <p className="text-xs text-muted-foreground">Due: {client.dueDate}</p>
                            </div>
                          </div>
                          <Badge variant={getPriorityColor(client.priority) as any}>
                            {client.priority}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest client interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm">John Smith uploaded W2 form</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-blue-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm">Filed return for Sarah Johnson</p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm">New message from Michael Brown</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm">Return accepted for Lisa Davis</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common preparer tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 md:grid-cols-4">
                <Button variant="outline" className="justify-start">
                  <Calculator className="mr-2 h-4 w-4" />
                  Tax Calculator
                </Button>
                <Button variant="outline" className="justify-start">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Review Documents
                </Button>
                <Button variant="outline" className="justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Client Messages
                </Button>
                <Button variant="outline" className="justify-start">
                  <Archive className="mr-2 h-4 w-4" />
                  Archive Returns
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Management</CardTitle>
                <CardDescription>View and manage all your clients</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search clients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="IN_REVIEW">In Review</SelectItem>
                      <SelectItem value="FILED">Filed</SelectItem>
                      <SelectItem value="ACCEPTED">Accepted</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    More Filters
                  </Button>
                </div>

                {/* Clients Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Tax Year</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Documents</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {client.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{client.name}</p>
                                <p className="text-sm text-muted-foreground">{client.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{client.taxYear}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(client.status) as any}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(client.status)}
                                {client.status.replace('_', ' ')}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {client.documentsCount}
                            </span>
                          </TableCell>
                          <TableCell>{client.dueDate}</TableCell>
                          <TableCell>
                            <Badge variant={getPriorityColor(client.priority) as any}>
                              {client.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedClient(client)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflow" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Draft */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Draft ({clients.filter(c => c.status === 'DRAFT').length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {clients
                        .filter(c => c.status === 'DRAFT')
                        .map((client) => (
                          <Card key={client.id} className="p-3">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-sm">{client.name}</p>
                                <Badge variant={getPriorityColor(client.priority) as any} className="text-xs">
                                  {client.priority}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {client.documentsCount} documents • Due {client.dueDate}
                              </p>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" className="h-7 text-xs">
                                  Review
                                </Button>
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="h-7 text-xs"
                                  onClick={() => handleUpdateStatus(client.id, 'IN_REVIEW')}
                                >
                                  Start Review
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* In Review */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">In Review ({clients.filter(c => c.status === 'IN_REVIEW').length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {clients
                        .filter(c => c.status === 'IN_REVIEW')
                        .map((client) => (
                          <Card key={client.id} className="p-3">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-sm">{client.name}</p>
                                <Badge variant={getPriorityColor(client.priority) as any} className="text-xs">
                                  {client.priority}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {client.documentsCount} documents • Due {client.dueDate}
                              </p>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" className="h-7 text-xs">
                                  Message
                                </Button>
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="h-7 text-xs"
                                  onClick={() => handleUpdateStatus(client.id, 'FILED')}
                                >
                                  File Return
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Filed/Completed */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Completed ({clients.filter(c => ['FILED', 'ACCEPTED'].includes(c.status)).length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {clients
                        .filter(c => ['FILED', 'ACCEPTED'].includes(c.status))
                        .map((client) => (
                          <Card key={client.id} className="p-3">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-sm">{client.name}</p>
                                <Badge variant="success" className="text-xs">
                                  {client.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {client.refundAmount ? `Refund: $${client.refundAmount}` : `Owe: $${client.oweAmount}`}
                              </p>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" className="h-7 text-xs">
                                  View
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs">
                                  Download
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Review Queue</CardTitle>
                <CardDescription>Documents awaiting your review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.map((client) => (
                    <div key={client.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {client.documentsCount} documents uploaded
                          </p>
                        </div>
                        <Badge variant={getStatusColor(client.status) as any}>
                          {client.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="grid gap-2">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">W2_2023_Employer.pdf</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">1099_Bank_Interest.pdf</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline">
                          Request More Documents
                        </Button>
                        <Button size="sm">
                          Approve All
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            {/* Academy Link */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Tax Preparer Academy
                </CardTitle>
                <CardDescription>
                  Watch 6 comprehensive training videos to master tax preparation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Videos Available</p>
                    <p className="text-2xl font-bold">6 Lessons</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Duration</p>
                    <p className="text-2xl font-bold">~105 min</p>
                  </div>
                </div>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/app/academy">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Start Learning
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Essential Forms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Essential Tax Forms
                </CardTitle>
                <CardDescription>
                  Download commonly used forms and templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'W-4 Form Template', size: '124 KB', type: 'PDF' },
                    { name: '1040 Instructions Guide', size: '2.3 MB', type: 'PDF' },
                    { name: 'State Tax Forms Library', size: '856 KB', type: 'ZIP' },
                    { name: 'Client Intake Questionnaire', size: '89 KB', type: 'PDF' },
                  ].map((form) => (
                    <div key={form.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{form.name}</p>
                          <p className="text-xs text-muted-foreground">{form.type} • {form.size}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Checklists */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Professional Checklists
                </CardTitle>
                <CardDescription>
                  Ensure accuracy with our comprehensive checklists
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Pre-Filing Checklist', items: '24 items', category: 'Before Filing' },
                    { name: 'Document Verification Checklist', items: '18 items', category: 'Review' },
                    { name: 'Quality Assurance Checklist', items: '31 items', category: 'Final Check' },
                  ].map((checklist) => (
                    <div key={checklist.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{checklist.name}</p>
                          <p className="text-xs text-muted-foreground">{checklist.category} • {checklist.items}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reference Guides */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Reference Guides & Tables
                </CardTitle>
                <CardDescription>
                  Quick reference materials for tax preparation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    { name: '2024 Tax Brackets Guide', icon: DollarSign },
                    { name: 'Standard vs Itemized Deduction Guide', icon: FileCheck },
                    { name: 'Tax Credit Reference Sheet', icon: Award },
                    { name: 'Business Expense Categories', icon: Briefcase },
                  ].map((guide) => (
                    <div key={guide.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-2">
                        <guide.icon className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium text-sm">{guide.name}</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Useful Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Useful Links & Resources
                </CardTitle>
                <CardDescription>
                  External resources to enhance your tax preparation knowledge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: 'IRS.gov Official Website', url: 'https://www.irs.gov', desc: 'Official IRS forms and publications' },
                    { name: 'Tax Professional Development', url: '#', desc: 'Continuing education resources' },
                    { name: 'State Tax Authority Links', url: '#', desc: 'All 50 states tax websites' },
                    { name: 'Tax Software Training', url: '#', desc: 'Platform-specific tutorials' },
                  ].map((link) => (
                    <div key={link.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div>
                        <p className="font-medium text-sm">{link.name}</p>
                        <p className="text-xs text-muted-foreground">{link.desc}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="store" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Store Access Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Marketing Store
                  </CardTitle>
                  <CardDescription>
                    Purchase customized marketing materials and subscriptions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      As a tax preparer, you get access to:
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Customized marketing materials with your name & photo
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Personalized QR codes and tracking links
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Landing page subscriptions with your branding
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Custom email address (@taxgeniuspro.com)
                      </li>
                    </ul>
                  </div>
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/store">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Browse Store
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Active Subscriptions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Your Subscriptions
                  </CardTitle>
                  <CardDescription>Active marketing products</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm">Premium Landing Page</p>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Renews: March 15, 2025
                      </p>
                      <p className="text-sm font-semibold">$39/month</p>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        Manage Subscription
                      </Button>
                    </div>
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">No other active subscriptions</p>
                      <Button variant="link" size="sm" asChild>
                        <Link href="/store">Browse products</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
                <CardDescription>Quick access to marketing products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <Button variant="outline" className="h-auto flex-col py-6" asChild>
                    <Link href="/store?category=landing-pages">
                      <Sparkles className="h-8 w-8 mb-2" />
                      <span className="font-semibold">Landing Pages</span>
                      <span className="text-xs text-muted-foreground mt-1">From $29/mo</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col py-6" asChild>
                    <Link href="/store?category=marketing-materials">
                      <Package className="h-8 w-8 mb-2" />
                      <span className="font-semibold">Marketing Materials</span>
                      <span className="text-xs text-muted-foreground mt-1">Print & Digital</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col py-6" asChild>
                    <Link href="/store?category=email-addresses">
                      <MessageSquare className="h-8 w-8 mb-2" />
                      <span className="font-semibold">Email Addresses</span>
                      <span className="text-xs text-muted-foreground mt-1">Professional</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col py-6" asChild>
                    <Link href="/store?category=digital-assets">
                      <FileText className="h-8 w-8 mb-2" />
                      <span className="font-semibold">Digital Assets</span>
                      <span className="text-xs text-muted-foreground mt-1">Social Media</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Brand Studio
                </CardTitle>
                <CardDescription>
                  Create customized marketing materials with your personal branding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Your Professional Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Professional Title</Label>
                      <Input placeholder="Certified Tax Preparer" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input placeholder="(555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <Label>License Number</Label>
                      <Input placeholder="TX-12345" />
                    </div>
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Professional Photo</h3>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a professional photo for your marketing materials
                    </p>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Upload Photo
                    </Button>
                  </div>
                </div>

                {/* Branding Preview */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Material Preview</h3>
                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-lg">John Doe</h4>
                          <p className="text-sm text-muted-foreground">Certified Tax Preparer</p>
                          <p className="text-sm font-semibold">(555) 123-4567</p>
                        </div>
                      </div>
                      <p className="text-sm mb-4">
                        Get expert tax preparation services with personalized attention to maximize your refund.
                      </p>
                      <Badge>Tax Genius Pro Certified</Badge>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button className="flex-1">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Save Branding
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Materials
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Your Marketing Campaigns</CardTitle>
                <CardDescription>Track performance of your customized materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">Business Card QR Code</p>
                        <p className="text-sm text-muted-foreground">Created: Jan 15, 2024</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">127</p>
                        <p className="text-xs text-muted-foreground">Views</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">43</p>
                        <p className="text-xs text-muted-foreground">Clicks</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-xs text-muted-foreground">Signups</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">8</p>
                        <p className="text-xs text-muted-foreground">Conversions</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center py-6 text-muted-foreground">
                    <p className="text-sm mb-2">Create more campaigns to track performance</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/store">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Create Campaign
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}