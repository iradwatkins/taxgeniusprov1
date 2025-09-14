'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  FileText,
  Upload,
  DollarSign,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Eye,
  Trash2,
  Send,
  Paperclip,
  User,
  CreditCard,
  Home,
  Building,
  Calculator
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Types
interface TaxReturn {
  id: string
  taxYear: number
  status: 'DRAFT' | 'IN_REVIEW' | 'FILED' | 'ACCEPTED' | 'REJECTED' | 'AMENDED'
  filedDate?: string
  acceptedDate?: string
  refundAmount?: number
  oweAmount?: number
  documents: Document[]
}

interface Document {
  id: string
  type: 'W2' | 'FORM_1099' | 'RECEIPT' | 'TAX_RETURN' | 'OTHER'
  fileName: string
  fileUrl: string
  fileSize: number
  uploadedAt: string
}

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  createdAt: string
  isFromPreparer: boolean
}

export default function ClientDashboard() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedTab, setSelectedTab] = useState('overview')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() - 1)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [messageContent, setMessageContent] = useState('')

  // Mock data - replace with actual API calls
  const currentReturn: TaxReturn = {
    id: '1',
    taxYear: selectedYear,
    status: 'IN_REVIEW',
    refundAmount: 2500,
    documents: [
      {
        id: '1',
        type: 'W2',
        fileName: 'W2_2023_Employer.pdf',
        fileUrl: '#',
        fileSize: 245000,
        uploadedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        type: 'FORM_1099',
        fileName: '1099_Interest_Bank.pdf',
        fileUrl: '#',
        fileSize: 189000,
        uploadedAt: '2024-01-16T14:20:00Z'
      }
    ]
  }

  const messages: Message[] = [
    {
      id: '1',
      content: 'Hi! I\'ve received your W2 form. Could you also upload your 1099 forms if you have any?',
      senderId: 'preparer1',
      senderName: 'Sarah Johnson',
      createdAt: '2024-01-16T15:00:00Z',
      isFromPreparer: true
    },
    {
      id: '2',
      content: 'Sure, I\'ll upload them now. I have two 1099 forms from different banks.',
      senderId: 'client1',
      senderName: 'You',
      createdAt: '2024-01-16T15:30:00Z',
      isFromPreparer: false
    }
  ]

  const getStatusIcon = (status: TaxReturn['status']) => {
    switch (status) {
      case 'DRAFT':
        return <Clock className="h-5 w-5 text-gray-500" />
      case 'IN_REVIEW':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'FILED':
        return <Send className="h-5 w-5 text-blue-500" />
      case 'ACCEPTED':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'AMENDED':
        return <FileText className="h-5 w-5 text-purple-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: TaxReturn['status']) => {
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

  const getProgressPercentage = (status: TaxReturn['status']) => {
    switch (status) {
      case 'DRAFT':
        return 20
      case 'IN_REVIEW':
        return 50
      case 'FILED':
        return 75
      case 'ACCEPTED':
        return 100
      case 'REJECTED':
        return 75
      case 'AMENDED':
        return 60
      default:
        return 0
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploadingFile(true)

    try {
      const file = files[0]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'document')
      formData.append('taxReturnId', currentReturn.id)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()

      toast({
        title: 'Document uploaded',
        description: `${file.name} has been uploaded successfully.`,
      })

      // Refresh documents list
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your document.',
        variant: 'destructive',
      })
    } finally {
      setUploadingFile(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return

    try {
      // TODO: Send message via API
      toast({
        title: 'Message sent',
        description: 'Your message has been sent to your tax preparer.',
      })
      setMessageContent('')
    } catch (error) {
      toast({
        title: 'Failed to send message',
        description: 'There was an error sending your message.',
        variant: 'destructive',
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tax Return Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your tax documents and track your return status
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor(currentReturn.status) as any} className="px-3 py-1">
              {getStatusIcon(currentReturn.status)}
              <span className="ml-2">{currentReturn.status.replace('_', ' ')}</span>
            </Badge>
          </div>
        </div>

        {/* Year Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Tax Year</CardTitle>
            <CardDescription>Select the tax year you want to view</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {[2023, 2022, 2021].map((year) => (
                <Button
                  key={year}
                  variant={selectedYear === year ? 'default' : 'outline'}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Return Status</CardTitle>
            <CardDescription>Track the progress of your tax return</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={getProgressPercentage(currentReturn.status)} className="h-2" />

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div className={currentReturn.status !== 'DRAFT' ? 'opacity-100' : 'opacity-50'}>
                <CheckCircle className="h-8 w-8 mx-auto text-green-500" />
                <p className="text-sm mt-1">Documents Uploaded</p>
              </div>
              <div className={['IN_REVIEW', 'FILED', 'ACCEPTED'].includes(currentReturn.status) ? 'opacity-100' : 'opacity-50'}>
                <Eye className="h-8 w-8 mx-auto text-blue-500" />
                <p className="text-sm mt-1">Under Review</p>
              </div>
              <div className={['FILED', 'ACCEPTED'].includes(currentReturn.status) ? 'opacity-100' : 'opacity-50'}>
                <Send className="h-8 w-8 mx-auto text-purple-500" />
                <p className="text-sm mt-1">Filed</p>
              </div>
              <div className={currentReturn.status === 'ACCEPTED' ? 'opacity-100' : 'opacity-50'}>
                <CheckCircle className="h-8 w-8 mx-auto text-green-500" />
                <p className="text-sm mt-1">Accepted</p>
              </div>
              <div className={currentReturn.refundAmount && currentReturn.refundAmount > 0 ? 'opacity-100' : 'opacity-50'}>
                <DollarSign className="h-8 w-8 mx-auto text-green-500" />
                <p className="text-sm mt-1">Refund Issued</p>
              </div>
            </div>

            {currentReturn.refundAmount && currentReturn.refundAmount > 0 && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Expected refund: <strong>${currentReturn.refundAmount.toLocaleString()}</strong>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tax Year</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{selectedYear}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Documents</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentReturn.documents.length}</div>
                  <p className="text-xs text-muted-foreground">Uploaded</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  {getStatusIcon(currentReturn.status)}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentReturn.status.replace('_', ' ')}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expected Refund</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${currentReturn.refundAmount?.toLocaleString() || '0'}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks for your tax return</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 md:grid-cols-2">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
                <Button variant="outline" className="justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Preparer
                </Button>
                <Button variant="outline" className="justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Download Return
                </Button>
                <Button variant="outline" className="justify-start">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Make Payment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tax Documents</CardTitle>
                <CardDescription>Upload and manage your tax documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop your documents here, or click to browse
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFile}
                  >
                    {uploadingFile ? 'Uploading...' : 'Select Files'}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                </div>

                {/* Documents List */}
                <div className="space-y-2">
                  {currentReturn.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="font-medium">{doc.fileName}</p>
                          <p className="text-sm text-gray-500">
                            {doc.type} • {formatFileSize(doc.fileSize)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>Messages with Your Tax Preparer</CardTitle>
                <CardDescription>Secure communication about your tax return</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages List */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isFromPreparer ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.isFromPreparer
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        <p className="text-sm font-medium mb-1">
                          {message.senderName}
                        </p>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View your payment transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Tax Preparation Fee</p>
                      <p className="text-sm text-gray-500">Paid on Jan 20, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">$150.00</p>
                      <Badge variant="success">Paid</Badge>
                    </div>
                  </div>

                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No pending payments</p>
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