'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Phone, Mail, MapPin, Video, Clock, User, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  type: string;
  status: string;
  scheduledFor: Date | null;
  duration?: number | null;
  location?: string | null;
  meetingLink?: string | null;
  subject?: string | null;
  clientNotes?: string | null;
  preparerId?: string | null;
}

interface InteractiveCalendarProps {
  appointments: Appointment[];
  onEventClick?: (appointmentId: string) => void;
  onDateClick?: (date: Date) => void;
  onEventUpdate?: (appointmentId: string, newDate: Date) => void;
}

const statusColorMap: Record<string, string> = {
  REQUESTED: '#eab308', // yellow
  SCHEDULED: '#3b82f6', // blue
  CONFIRMED: '#10b981', // green
  COMPLETED: '#6b7280', // gray
  CANCELLED: '#ef4444', // red
  NO_SHOW: '#f97316', // orange
  RESCHEDULED: '#8b5cf6', // purple
};

export function InteractiveCalendar({
  appointments,
  onEventClick,
  onDateClick,
  onEventUpdate,
}: InteractiveCalendarProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Transform appointments to FullCalendar events
  const events = appointments
    .filter((apt) => apt.scheduledFor)
    .map((apt) => ({
      id: apt.id,
      title: apt.clientName,
      start: apt.scheduledFor!,
      end: apt.duration
        ? new Date(new Date(apt.scheduledFor!).getTime() + apt.duration * 60000)
        : apt.scheduledFor!,
      backgroundColor: statusColorMap[apt.status] || '#3b82f6',
      borderColor: statusColorMap[apt.status] || '#3b82f6',
      extendedProps: {
        appointment: apt,
      },
    }));

  const handleEventClick = (info: { event: { extendedProps: { appointment: Appointment }; id: string } }) => {
    const appointment = info.event.extendedProps.appointment;
    setSelectedAppointment(appointment);
    setIsDetailOpen(true);
    onEventClick?.(appointment.id);
  };

  const handleDateClick = (info: { date: Date }) => {
    onDateClick?.(info.date);
  };

  const handleEventDrop = async (info: { event: { id: string; start: Date }; revert: () => void }) => {
    const appointmentId = info.event.id;
    const newDate = info.event.start;

    try {
      await onEventUpdate?.(appointmentId, newDate);
    } catch {
      // Revert if failed
      info.revert();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PHONE_CALL':
        return <Phone className="h-4 w-4" />;
      case 'VIDEO_CALL':
        return <Video className="h-4 w-4" />;
      case 'IN_PERSON':
        return <MapPin className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      REQUESTED: 'bg-yellow-100 text-yellow-800',
      SCHEDULED: 'bg-blue-100 text-blue-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800',
      NO_SHOW: 'bg-orange-100 text-orange-800',
      RESCHEDULED: 'bg-purple-100 text-purple-800',
    };

    return (
      <Badge className={cn('border-0', variants[status] || 'bg-gray-100 text-gray-800')}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
            }}
            events={events}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            eventDrop={handleEventDrop}
            editable={true}
            droppable={true}
            height="auto"
            slotMinTime="07:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short',
            }}
            nowIndicator={true}
            eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
          />
        </CardContent>
      </Card>

      {/* Appointment Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {selectedAppointment && getTypeIcon(selectedAppointment.type)}
                {selectedAppointment?.subject || 'Appointment Details'}
              </span>
              {selectedAppointment && getStatusBadge(selectedAppointment.status)}
            </DialogTitle>
            <DialogDescription>
              {selectedAppointment?.scheduledFor &&
                new Date(selectedAppointment.scheduledFor).toLocaleString('en-US', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                })}
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-6">
              {/* Client Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Client Information
                </h3>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedAppointment.clientName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${selectedAppointment.clientEmail}`}
                      className="text-primary hover:underline"
                    >
                      {selectedAppointment.clientEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${selectedAppointment.clientPhone}`}
                      className="text-primary hover:underline"
                    >
                      {selectedAppointment.clientPhone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Appointment Details
                </h3>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>Type: {selectedAppointment.type.replace('_', ' ')}</span>
                  </div>
                  {selectedAppointment.duration && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Duration: {selectedAppointment.duration} minutes</span>
                    </div>
                  )}
                  {selectedAppointment.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAppointment.location}</span>
                    </div>
                  )}
                  {selectedAppointment.meetingLink && (
                    <div className="flex items-center gap-3">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={selectedAppointment.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Join Meeting
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Notes */}
              {selectedAppointment.clientNotes && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Client Notes
                  </h3>
                  <p className="text-sm bg-muted p-3 rounded-md">
                    {selectedAppointment.clientNotes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1" onClick={() => setIsDetailOpen(false)}>
                  Close
                </Button>
                <Button variant="outline" className="flex-1">
                  Edit Appointment
                </Button>
                {selectedAppointment.status === 'REQUESTED' && (
                  <Button variant="default" className="flex-1">
                    Confirm Appointment
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
