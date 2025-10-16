'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  FileText,
  Download,
  Eye,
  CheckCircle,
  Calendar,
  UserCheck,
  Users,
  Store,
  Palette,
  ShoppingCart,
  Package,
  Sparkles,
  Award,
  Briefcase,
  MessageSquare,
  ChevronRight,
  DollarSign,
  FileCheck,
  Mail,
  FolderOpen,
  BookUser
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { MaterialsTable } from '@/components/analytics/MaterialsTable'
import { ConversionFunnel } from '@/components/analytics/ConversionFunnel'
import { SourceBreakdown } from '@/components/analytics/SourceBreakdown'
import { StatsGrid } from '@/components/dashboard/preparer/StatsGrid'
import { OverviewTab } from '@/components/dashboard/preparer/OverviewTab'
import { ClientsTab } from '@/components/dashboard/preparer/ClientsTab'
import { LeadsManagementTab } from '@/components/dashboard/preparer/LeadsManagementTab'
import { WorkflowTab } from '@/components/dashboard/preparer/WorkflowTab'
import { getStatusIcon, getStatusColor, getPriorityColor } from '@/components/dashboard/preparer/utils'
import { AttributionStatsCard } from '@/components/dashboard/attribution-stats-card'
import { RecentLeadsTable } from '@/components/dashboard/recent-leads-table'

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

  // Helper functions are imported from utils

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
        <StatsGrid stats={stats} />

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-8 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="store">Store</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <OverviewTab clients={clients} getPriorityColor={getPriorityColor} />

            {/* EPIC 6: Attribution Analytics - Track referrer partnerships */}
            <AttributionStatsCard period="30d" />

            {/* EPIC 6: Recent Leads from Referrers */}
            <RecentLeadsTable limit={10} />
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            {/* Leads Management - Promote LEAD → CLIENT */}
            <LeadsManagementTab />

            {/* Existing Clients */}
            <ClientsTab
              clients={clients}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
              onSelectClient={setSelectedClient}
            />
          </TabsContent>

          <TabsContent value="workflow" className="space-y-4">
            <WorkflowTab
              clients={clients}
              getPriorityColor={getPriorityColor}
              onUpdateStatus={handleUpdateStatus}
            />
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

          <TabsContent value="analytics" className="space-y-4">
            {/* Client Source Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Client Source Tracking</CardTitle>
                <CardDescription>Understand where your clients are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <SourceBreakdown dateRange="month" />
              </CardContent>
            </Card>

            {/* My Marketing Materials Performance */}
            <Card>
              <CardContent className="pt-6">
                <MaterialsTable limit={10} dateRange="all" />
              </CardContent>
            </Card>

            {/* Conversion Performance */}
            <div className="grid gap-4 md:grid-cols-2">
              <ConversionFunnel dateRange="month" />

              {/* Referrer Partnership Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Referrer Partnerships</CardTitle>
                  <CardDescription>Top referrers sending you clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">Referrer partnership data will appear here</p>
                      <p className="text-xs mt-2">When referrers send you clients, you'll see their performance metrics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            {/* Professional Tools Access */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Professional Tools
                </CardTitle>
                <CardDescription>
                  Access your client management and communication tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  <Button variant="outline" className="h-auto flex-col gap-2 py-6" asChild>
                    <Link href="/admin/file-center">
                      <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <FolderOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">File Center</p>
                        <p className="text-xs text-muted-foreground">Manage client documents</p>
                      </div>
                    </Link>
                  </Button>

                  <Button variant="outline" className="h-auto flex-col gap-2 py-6" asChild>
                    <Link href="/admin/calendar">
                      <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">Calendar</p>
                        <p className="text-xs text-muted-foreground">Schedule appointments</p>
                      </div>
                    </Link>
                  </Button>

                  <Button variant="outline" className="h-auto flex-col gap-2 py-6" asChild>
                    <Link href="/admin/emails">
                      <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">Emails</p>
                        <p className="text-xs text-muted-foreground">Client communication</p>
                      </div>
                    </Link>
                  </Button>

                  <Button variant="outline" className="h-auto flex-col gap-2 py-6" asChild>
                    <Link href="/admin/address-book">
                      <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <BookUser className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">Address Book</p>
                        <p className="text-xs text-muted-foreground">Contact management</p>
                      </div>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

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