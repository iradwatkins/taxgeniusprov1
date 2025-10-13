import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Upload,
  Folder,
  File,
  Image,
  FileSpreadsheet,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react'

export const metadata = {
  title: 'Documents | Tax Genius Pro',
  description: 'Manage client documents',
}

async function isTaxPreparer() {
  const user = await currentUser()
  if (!user) return false
  const role = user.publicMetadata?.role
  return role === 'tax_preparer' || role === 'admin'
}

export default async function TaxPreparerDocumentsPage() {
  const userIsTaxPreparer = await isTaxPreparer()

  if (!userIsTaxPreparer) {
    redirect('/forbidden')
  }

  // Mock documents data
  const documents = [
    {
      id: '1',
      name: 'W2_2024_Anderson.pdf',
      client: 'John Anderson',
      type: 'W-2 Form',
      category: 'Income',
      size: '245 KB',
      uploadedDate: '2024-03-15',
      status: 'Reviewed',
      year: 2024,
    },
    {
      id: '2',
      name: 'Form_1099_Garcia.pdf',
      client: 'Maria Garcia',
      type: '1099 Form',
      category: 'Income',
      size: '189 KB',
      uploadedDate: '2024-03-14',
      status: 'Reviewed',
      year: 2024,
    },
    {
      id: '3',
      name: 'Mortgage_Interest_Chen.pdf',
      client: 'David Chen',
      type: 'Form 1098',
      category: 'Deductions',
      size: '312 KB',
      uploadedDate: '2024-03-13',
      status: 'Pending Review',
      year: 2024,
    },
    {
      id: '4',
      name: 'Student_Loan_Interest_Williams.pdf',
      client: 'Sarah Williams',
      type: 'Form 1098-E',
      category: 'Deductions',
      size: '156 KB',
      uploadedDate: '2024-03-12',
      status: 'Pending Review',
      year: 2024,
    },
    {
      id: '5',
      name: 'Business_Expenses_Brown.xlsx',
      client: 'Michael Brown',
      type: 'Expense Report',
      category: 'Business',
      size: '423 KB',
      uploadedDate: '2024-03-11',
      status: 'Needs Attention',
      year: 2024,
    },
    {
      id: '6',
      name: 'Charitable_Donations_Anderson.pdf',
      client: 'John Anderson',
      type: 'Receipts',
      category: 'Deductions',
      size: '678 KB',
      uploadedDate: '2024-03-10',
      status: 'Reviewed',
      year: 2024,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reviewed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'Needs Attention':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Reviewed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case 'Pending Review':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'Needs Attention':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-5 h-5 text-green-600" />
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image className="w-5 h-5 text-blue-600" />
      default:
        return <File className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Library</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all client documents
          </p>
        </div>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {documents.filter(d => d.status === 'Reviewed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Completed review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {documents.filter(d => d.status === 'Pending Review').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {documents.filter(d => d.status === 'Needs Attention').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires action
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Documents</CardTitle>
              <CardDescription>Browse and manage client documents</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  className="pl-9 w-64"
                />
              </div>
              <Select defaultValue="all-categories">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="deductions">Deductions</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-status">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Status</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="needs-attention">Needs Attention</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* File Icon */}
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    {getFileIcon(doc.name)}
                  </div>

                  {/* Document Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{doc.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {doc.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {doc.client}
                      </div>
                      <div className="flex items-center gap-1">
                        <Folder className="w-3 h-3" />
                        {doc.category}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(doc.uploadedDate).toLocaleDateString()}
                      </div>
                      <span>{doc.size}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {getStatusIcon(doc.status)}
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Categories */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Income Documents</CardTitle>
            <CardDescription>W-2s, 1099s, and other income forms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">W-2 Forms</span>
                <Badge variant="outline">2</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">1099 Forms</span>
                <Badge variant="outline">1</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Other Income</span>
                <Badge variant="outline">0</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deduction Documents</CardTitle>
            <CardDescription>Mortgage, donations, and deductions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Form 1098</span>
                <Badge variant="outline">1</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Charitable Donations</span>
                <Badge variant="outline">1</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Student Loan Interest</span>
                <Badge variant="outline">1</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Documents</CardTitle>
            <CardDescription>Business expenses and records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Expense Reports</span>
                <Badge variant="outline">1</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Receipts</span>
                <Badge variant="outline">0</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Invoices</span>
                <Badge variant="outline">0</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
