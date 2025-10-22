'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, DollarSign, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { logger } from '@/lib/logger';

interface ReturnQuickCompleteProps {
  taxReturnId: string;
  clientName: string;
  taxYear: number;
  currentStatus: string;
  refundAmount?: number | null;
  oweAmount?: number | null;
  referrerInfo?: {
    name: string;
    commissionRate: number; // Dollar amount
  } | null;
  taxGeniusPercentage?: number; // 20, 30, or 40
}

export function ReturnQuickComplete({
  taxReturnId,
  clientName,
  taxYear,
  currentStatus,
  refundAmount,
  oweAmount,
  referrerInfo,
  taxGeniusPercentage = 30,
}: ReturnQuickCompleteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processingFee, setProcessingFee] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Calculate revenue split using preparer's configured percentage
  const feeAmount = parseFloat(processingFee) || 0;
  const taxGeniusRevenue = feeAmount * (taxGeniusPercentage / 100);
  const preparerRevenue = feeAmount * ((100 - taxGeniusPercentage) / 100);
  const preparerPercentage = 100 - taxGeniusPercentage;

  // Calculate commission (if there's a referrer)
  const referrerCommission = referrerInfo?.commissionRate || 0;
  const netToTaxGenius = taxGeniusRevenue - referrerCommission;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!processingFee || feeAmount <= 0) {
      setError('Please enter a valid processing fee amount');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/tax-returns/mark-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taxReturnId,
          processingFeeCharged: feeAmount,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to mark return as complete');
      }

      // Success! Close dialog and refresh
      setOpen(false);
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      logger.error('Error marking return complete:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isCompleted = currentStatus === 'FILED' || currentStatus === 'ACCEPTED';

  return (
    <Dialog open={open} onSetChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isCompleted ? 'outline' : 'default'}
          size="sm"
          disabled={currentStatus === 'DRAFT'}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {isCompleted ? 'Update Revenue' : 'Mark Complete'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Complete Tax Return</DialogTitle>
            <DialogDescription>
              Report the processing fee for {clientName}&apos;s {taxYear} return
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Processing Fee Input */}
            <div className="grid gap-2">
              <Label htmlFor="processing-fee">
                Processing Fee Charged to Client <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="processing-fee"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="450.00"
                  value={processingFee}
                  onChange={(e) => setProcessingFee(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the total fee you charged the client for tax preparation
              </p>
            </div>

            {/* Revenue Split Breakdown */}
            {feeAmount > 0 && (
              <div className="space-y-3 rounded-lg border p-4 bg-muted/50">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-sm font-semibold">
                    Revenue Breakdown ({taxGeniusPercentage}/{preparerPercentage} Split)
                  </h4>
                </div>

                <div className="space-y-2 text-sm">
                  {/* TaxGenius Revenue */}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      TaxGenius ({taxGeniusPercentage}%):
                    </span>
                    <Badge variant="outline">
                      ${taxGeniusRevenue.toFixed(2)}
                    </Badge>
                  </div>

                  {/* Preparer Revenue */}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">
                      Your Revenue ({preparerPercentage}%):
                    </span>
                    <Badge variant="default" className="bg-green-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      ${preparerRevenue.toFixed(2)}
                    </Badge>
                  </div>

                  {/* Referrer Commission (if applicable) */}
                  {referrerInfo && (
                    <>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground text-xs">
                            Commission to {referrerInfo.name}:
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            -${referrerCommission.toFixed(2)}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-muted-foreground text-xs font-medium">
                            Net to TaxGenius:
                          </span>
                          <Badge variant="outline" className="text-xs">
                            ${netToTaxGenius.toFixed(2)}
                          </Badge>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Return Info */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax Year:</span>
                <span className="font-medium">{taxYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Client:</span>
                <span className="font-medium">{clientName}</span>
              </div>
              {refundAmount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Refund Amount:</span>
                  <span className="font-medium text-green-600">
                    ${refundAmount.toLocaleString()}
                  </span>
                </div>
              )}
              {oweAmount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owed Amount:</span>
                  <span className="font-medium text-orange-600">
                    ${oweAmount.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Info Alert */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                This action will mark the return as complete and calculate commissions. Revenue
                split: {taxGeniusPercentage}% TaxGenius / {preparerPercentage}% Preparer.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !processingFee || feeAmount <= 0}>
              {loading ? 'Processing...' : isCompleted ? 'Update Revenue' : 'Mark Complete'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
