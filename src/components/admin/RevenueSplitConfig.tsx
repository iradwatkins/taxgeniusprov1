'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { TrendingUp, Check, AlertCircle } from 'lucide-react';
import { logger } from '@/lib/logger';

interface RevenueSplitConfigProps {
  userId: string;
  currentSplit: number | null;
  userName: string;
  onUpdate?: () => void;
}

const SPLIT_OPTIONS = [
  { value: 20, label: '20/80', description: 'TaxGenius 20% / Preparer 80%' },
  { value: 30, label: '30/70', description: 'TaxGenius 30% / Preparer 70%' },
  { value: 40, label: '40/60', description: 'TaxGenius 40% / Preparer 60%' },
];

export function RevenueSplitConfig({
  userId,
  currentSplit,
  userName,
  onUpdate,
}: RevenueSplitConfigProps) {
  const [selectedSplit, setSelectedSplit] = useState<number>(currentSplit || 30);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/update-revenue-split', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          revenueSplitPercentage: selectedSplit,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update revenue split');
      }

      toast.success(`Revenue split updated to ${selectedSplit}/${100 - selectedSplit} for ${userName}`);
      onUpdate?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      logger.error('Error updating revenue split:', error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const hasChanged = selectedSplit !== (currentSplit || 30);
  const currentOption = SPLIT_OPTIONS.find((opt) => opt.value === (currentSplit || 30));

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Split:</span>
      </div>

      {currentSplit && !hasChanged ? (
        <Badge variant="outline" className="font-mono">
          {currentSplit}/{100 - currentSplit}
        </Badge>
      ) : null}

      <Select
        value={selectedSplit.toString()}
        onValueChange={(value) => setSelectedSplit(parseInt(value))}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SPLIT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              <div className="flex items-center gap-2">
                <span className="font-mono">{option.label}</span>
                {option.value === currentSplit && (
                  <Check className="h-3 w-3 text-green-600" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasChanged && (
        <Button size="sm" onClick={handleUpdate} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      )}

      {selectedSplit !== 30 && (
        <Badge variant="secondary" className="text-xs">
          Custom
        </Badge>
      )}
    </div>
  );
}
