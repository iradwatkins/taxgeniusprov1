'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Phone, Mail, Calendar, FileText, MessageSquare } from 'lucide-react';

interface AddInteractionDialogProps {
  contactId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface InteractionFormData {
  type: 'EMAIL' | 'PHONE_CALL' | 'MEETING' | 'NOTE' | 'OTHER';
  direction: 'INBOUND' | 'OUTBOUND';
  subject: string;
  body: string;
  duration?: number;
}

const interactionTypes = [
  { value: 'PHONE_CALL', label: 'Phone Call', icon: Phone },
  { value: 'EMAIL', label: 'Email', icon: Mail },
  { value: 'MEETING', label: 'Meeting', icon: Calendar },
  { value: 'NOTE', label: 'Note', icon: FileText },
  { value: 'OTHER', label: 'Other', icon: MessageSquare },
];

export function AddInteractionDialog({
  contactId,
  open,
  onOpenChange,
  onSuccess,
}: AddInteractionDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<InteractionFormData>({
    type: 'PHONE_CALL',
    direction: 'OUTBOUND',
    subject: '',
    body: '',
    duration: undefined,
  });

  const updateFormData = (field: keyof InteractionFormData, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/crm/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId,
          ...formData,
          duration: formData.duration ? Number(formData.duration) : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to log interaction');
      }

      toast({
        title: 'Interaction Logged',
        description: 'The interaction has been recorded successfully.',
      });

      // Reset form
      setFormData({
        type: 'PHONE_CALL',
        direction: 'OUTBOUND',
        subject: '',
        body: '',
        duration: undefined,
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to log interaction',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedType = interactionTypes.find((t) => t.value === formData.type);
  const Icon = selectedType?.icon || MessageSquare;
  const showDuration = formData.type === 'PHONE_CALL' || formData.type === 'MEETING';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            Log Interaction
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Interaction Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Interaction Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                updateFormData(
                  'type',
                  value as 'EMAIL' | 'PHONE_CALL' | 'MEETING' | 'NOTE' | 'OTHER'
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {interactionTypes.map((type) => {
                  const TypeIcon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Direction */}
          <div className="space-y-2">
            <Label htmlFor="direction">Direction</Label>
            <Select
              value={formData.direction}
              onValueChange={(value) =>
                updateFormData('direction', value as 'INBOUND' | 'OUTBOUND')
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OUTBOUND">Outbound (I initiated)</SelectItem>
                <SelectItem value="INBOUND">Inbound (They initiated)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration (for calls and meetings) */}
          {showDuration && (
            <div className="space-y-2">
              <Label htmlFor="duration">
                Duration (minutes) {formData.type === 'MEETING' ? '' : '(optional)'}
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                placeholder="e.g., 15"
                value={formData.duration || ''}
                onChange={(e) =>
                  updateFormData('duration', e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>
          )}

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject {formData.type === 'NOTE' ? '(optional)' : ''}</Label>
            <Input
              id="subject"
              placeholder={
                formData.type === 'EMAIL'
                  ? 'Email subject line'
                  : formData.type === 'PHONE_CALL'
                    ? 'Call topic (e.g., Initial consultation)'
                    : formData.type === 'MEETING'
                      ? 'Meeting topic'
                      : 'Brief subject'
              }
              value={formData.subject}
              onChange={(e) => updateFormData('subject', e.target.value)}
            />
          </div>

          {/* Body/Notes */}
          <div className="space-y-2">
            <Label htmlFor="body">
              {formData.type === 'EMAIL' ? 'Email Body' : 'Notes'} (optional)
            </Label>
            <Textarea
              id="body"
              rows={6}
              placeholder={
                formData.type === 'EMAIL'
                  ? 'Email content...'
                  : formData.type === 'PHONE_CALL'
                    ? 'Call notes: What was discussed, next steps, follow-up needed...'
                    : formData.type === 'MEETING'
                      ? 'Meeting notes: Key discussion points, decisions made, action items...'
                      : 'Additional notes or details...'
              }
              value={formData.body}
              onChange={(e) => updateFormData('body', e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Logging...' : 'Log Interaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
