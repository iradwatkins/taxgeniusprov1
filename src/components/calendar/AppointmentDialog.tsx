'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  initialDate?: Date;
  mode?: 'create' | 'edit';
  appointmentData?: Partial<AppointmentFormData>;
}

export interface AppointmentFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  type: string;
  status: string;
  scheduledFor: Date;
  duration: number;
  location?: string;
  meetingLink?: string;
  subject: string;
  clientNotes?: string;
}

export function AppointmentDialog({
  open,
  onOpenChange,
  onSubmit,
  initialDate,
  mode = 'create',
  appointmentData,
}: AppointmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<AppointmentFormData>>({
    clientName: appointmentData?.clientName || '',
    clientEmail: appointmentData?.clientEmail || '',
    clientPhone: appointmentData?.clientPhone || '',
    type: appointmentData?.type || 'CONSULTATION',
    status: appointmentData?.status || 'SCHEDULED',
    scheduledFor: appointmentData?.scheduledFor || initialDate || new Date(),
    duration: appointmentData?.duration || 30,
    location: appointmentData?.location || '',
    meetingLink: appointmentData?.meetingLink || '',
    subject: appointmentData?.subject || '',
    clientNotes: appointmentData?.clientNotes || '',
  });

  const [selectedTime, setSelectedTime] = useState<string>(
    appointmentData?.scheduledFor
      ? format(appointmentData.scheduledFor, 'HH:mm')
      : '10:00'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Combine date and time
      const [hours, minutes] = selectedTime.split(':');
      const scheduledDate = new Date(formData.scheduledFor!);
      scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const submitData: AppointmentFormData = {
        clientName: formData.clientName!,
        clientEmail: formData.clientEmail!,
        clientPhone: formData.clientPhone!,
        type: formData.type!,
        status: formData.status!,
        scheduledFor: scheduledDate,
        duration: formData.duration!,
        location: formData.location,
        meetingLink: formData.meetingLink,
        subject: formData.subject!,
        clientNotes: formData.clientNotes,
      };

      await onSubmit(submitData);
      onOpenChange(false);
      // Reset form
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        type: 'CONSULTATION',
        status: 'SCHEDULED',
        scheduledFor: new Date(),
        duration: 30,
        location: '',
        meetingLink: '',
        subject: '',
        clientNotes: '',
      });
    } catch (error) {
      console.error('Error submitting appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof AppointmentFormData, value: string | number | Date) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Appointment' : 'Edit Appointment'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Schedule a new appointment with a client'
              : 'Update appointment details'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Client Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => updateFormData('clientName', e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email *</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => updateFormData('clientEmail', e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Phone Number *</Label>
              <Input
                id="clientPhone"
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => updateFormData('clientPhone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Appointment Details</h3>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => updateFormData('subject', e.target.value)}
                placeholder="Tax consultation for 2024"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Appointment Type *</Label>
                <Select value={formData.type} onValueChange={(value) => updateFormData('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PHONE_CALL">Phone Call</SelectItem>
                    <SelectItem value="VIDEO_CALL">Video Call</SelectItem>
                    <SelectItem value="IN_PERSON">In Person</SelectItem>
                    <SelectItem value="CONSULTATION">Consultation</SelectItem>
                    <SelectItem value="FOLLOW_UP">Follow Up</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REQUESTED">Requested</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="NO_SHOW">No Show</SelectItem>
                    <SelectItem value="RESCHEDULED">Rescheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !formData.scheduledFor && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.scheduledFor ? (
                        format(formData.scheduledFor, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.scheduledFor}
                      onSelect={(date) => date && updateFormData('scheduledFor', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  step="15"
                  value={formData.duration}
                  onChange={(e) => updateFormData('duration', parseInt(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location (if in-person)</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  placeholder="123 Main St, Suite 100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingLink">Meeting Link (if virtual)</Label>
                <Input
                  id="meetingLink"
                  type="url"
                  value={formData.meetingLink}
                  onChange={(e) => updateFormData('meetingLink', e.target.value)}
                  placeholder="https://zoom.us/j/..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientNotes">Notes</Label>
              <Textarea
                id="clientNotes"
                value={formData.clientNotes}
                onChange={(e) => updateFormData('clientNotes', e.target.value)}
                placeholder="Additional notes or special requests..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Create Appointment' : 'Update Appointment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
