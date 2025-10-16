'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Wallet,
  Calendar,
  AlertCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { logger } from '@/lib/logger'

interface Commission {
  id: string
  amount: number
  clientName: string
  createdAt: string
  status: string
}

interface PayoutRequest {
  id: string
  amount: number
  status: string
  requestedAt: string
  processedAt: string | null
  paymentRef: string | null
}

interface EarningsData {
  pendingBalance: number
  totalEarningsAllTime: number
  totalPaidOut: number
  commissionCount: number
  canRequestPayout: boolean
  minimumPayout: number
  pendingCommissions: Commission[]
  recentPayouts: PayoutRequest[]
}

export default function ReferrerEarningsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [earnings, setEarnings] = useState<EarningsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState(false)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchEarnings()
  }, [])

  const fetchEarnings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/payments/commission/payout')
      if (response.ok) {
        const data = await response.json()
        setEarnings(data)
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to load earnings data',
          variant: 'destructive'
        })
      }
    } catch (error) {
      logger.error('Error fetching earnings:', error)
      toast({
        title: 'Error',
        description: 'Failed to load earnings data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRequestPayout = async () => {
    setRequesting(true)
    try {
      const response = await fetch('/api/payments/commission/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod, notes })
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: 'Success! 🎉',
          description: `Payout request for ${formatCurrency(data.payoutRequest.amount)} submitted successfully`
        })
        setShowRequestDialog(false)
        fetchEarnings() // Refresh data
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to request payout',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to request payout. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setRequesting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: any, color: string }> = {
      PENDING: { variant: 'outline', icon: Clock, color: 'text-orange-600' },
      PROCESSING: { variant: 'secondary', icon: Clock, color: 'text-blue-600' },
      PAID: { variant: 'default', icon: CheckCircle, color: 'text-green-600' },
      REJECTED: { variant: 'destructive', icon: XCircle, color: 'text-red-600' }
    }

    const config = variants[status] || variants.PENDING
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (!earnings) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Failed to load earnings data</p>
            <Button className="mt-4" onClick={fetchEarnings}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const amountUntilPayout = Math.max(0, earnings.minimumPayout - earnings.pendingBalance)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Earnings & Payouts</h1>
            <p className="text-muted-foreground">
              Track your commission earnings and request payouts
            </p>
          </div>
          <Button
            onClick={() => router.push('/dashboard/referrer')}
            variant="outline"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Pending Balance Card */}
          <Card className="border-2 border-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {formatCurrency(earnings.pendingBalance)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {earnings.commissionCount} pending commission(s)
              </p>
              {earnings.canRequestPayout ? (
                <Button
                  className="w-full mt-4"
                  onClick={() => setShowRequestDialog(true)}
                >
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Request Payout
                </Button>
              ) : (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-xs text-muted-foreground">
                    Earn {formatCurrency(amountUntilPayout)} more to request payout
                  </p>
                  <p className="text-xs font-medium mt-1">
                    Minimum: {formatCurrency(earnings.minimumPayout)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Total Earnings Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(earnings.totalEarningsAllTime)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All-time commission earnings
              </p>
            </CardContent>
          </Card>

          {/* Total Paid Out Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Paid Out</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(earnings.totalPaidOut)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Successfully received
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Commissions */}
        {earnings.pendingCommissions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Commissions</CardTitle>
              <CardDescription>
                Commissions awaiting payout request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Earned Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {earnings.pendingCommissions.map((commission) => (
                      <TableRow key={commission.id}>
                        <TableCell className="font-medium">
                          {commission.clientName}
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {formatCurrency(commission.amount)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(commission.createdAt)}
                        </TableCell>
                        <TableCell>{getStatusBadge(commission.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payout History */}
        <Card>
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
            <CardDescription>
              Recent payout requests and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {earnings.recentPayouts.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Processed</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {earnings.recentPayouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell className="font-semibold text-green-600">
                          {formatCurrency(payout.amount)}
                        </TableCell>
                        <TableCell>{getStatusBadge(payout.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(payout.requestedAt)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {payout.processedAt ? formatDate(payout.processedAt) : '-'}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {payout.paymentRef || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No payout requests yet</p>
                <p className="text-xs">Request your first payout once you reach the minimum balance</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Request Payout Dialog */}
        <AlertDialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Request Payout</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to request a payout of{' '}
                <strong>{formatCurrency(earnings.pendingBalance)}</strong> for{' '}
                <strong>{earnings.commissionCount}</strong> pending commission(s).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                    <SelectItem value="PAYPAL">PayPal</SelectItem>
                    <SelectItem value="SQUARE_CASH">Square Cash App</SelectItem>
                    <SelectItem value="VENMO">Venmo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any special instructions or notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>⏰ Processing Time:</strong> Payouts are typically processed within 1-2
                  business days and funds arrive in 3-5 business days.
                </p>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={requesting}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRequestPayout} disabled={requesting}>
                {requesting ? 'Submitting...' : 'Submit Payout Request'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
