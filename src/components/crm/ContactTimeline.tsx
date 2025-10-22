'use client';

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Phone,
  Mail,
  Calendar,
  FileText,
  MessageSquare,
  User,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  type: string;
  status: string;
  scheduledFor: Date | string;
  duration?: number;
  subject?: string;
  clientNotes?: string;
  location?: string;
  meetingLink?: string;
}

interface Interaction {
  id: string;
  type: 'EMAIL' | 'PHONE_CALL' | 'MEETING' | 'NOTE' | 'OTHER';
  direction: 'INBOUND' | 'OUTBOUND';
  subject?: string;
  body?: string;
  duration?: number;
  createdAt: Date | string;
  clerkUserId: string;
}

interface TimelineItem {
  id: string;
  type: 'appointment' | 'interaction';
  date: Date;
  data: Appointment | Interaction;
}

interface ContactTimelineProps {
  appointments: Appointment[];
  interactions: Interaction[];
}

const interactionIcons = {
  EMAIL: Mail,
  PHONE_CALL: Phone,
  MEETING: Calendar,
  NOTE: FileText,
  OTHER: MessageSquare,
};

const appointmentStatusColors = {
  requested: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  scheduled: 'bg-blue-100 text-blue-800 border-blue-300',
  confirmed: 'bg-green-100 text-green-800 border-green-300',
  completed: 'bg-gray-100 text-gray-800 border-gray-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300',
  no_show: 'bg-orange-100 text-orange-800 border-orange-300',
};

export function ContactTimeline({ appointments, interactions }: ContactTimelineProps) {
  const timelineItems = useMemo(() => {
    const items: TimelineItem[] = [];

    // Add appointments
    appointments.forEach((apt) => {
      items.push({
        id: `apt-${apt.id}`,
        type: 'appointment',
        date: new Date(apt.scheduledFor),
        data: apt,
      });
    });

    // Add interactions
    interactions.forEach((int) => {
      items.push({
        id: `int-${int.id}`,
        type: 'interaction',
        date: new Date(int.createdAt),
        data: int,
      });
    });

    // Sort by date descending (most recent first)
    return items.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [appointments, interactions]);

  if (timelineItems.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No activity yet</p>
            <p className="text-sm mt-2">
              Interactions and appointments will appear here once you start engaging with this
              contact.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {timelineItems.map((item, index) => {
        const isLast = index === timelineItems.length - 1;

        if (item.type === 'appointment') {
          const apt = item.data as Appointment;
          const statusColor =
            appointmentStatusColors[apt.status as keyof typeof appointmentStatusColors] ||
            'bg-gray-100 text-gray-800 border-gray-300';

          return (
            <div key={item.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-blue-100 p-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                {!isLast && <div className="w-px bg-border flex-1 my-2" />}
              </div>

              <Card className="flex-1 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">Appointment: {apt.subject || apt.type}</h4>
                        <Badge className={statusColor} variant="outline">
                          {apt.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(new Date(apt.scheduledFor), 'PPP')} at{' '}
                            {format(new Date(apt.scheduledFor), 'p')}
                          </span>
                          {apt.duration && <span>({apt.duration} min)</span>}
                        </div>

                        {apt.location && (
                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 mt-0.5" />
                            <span>{apt.location}</span>
                          </div>
                        )}

                        {apt.meetingLink && (
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 mt-0.5" />
                            <a
                              href={apt.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Join meeting
                            </a>
                          </div>
                        )}

                        {apt.clientNotes && (
                          <div className="mt-2 p-3 bg-muted rounded-md">
                            <p className="text-sm">{apt.clientNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground text-right">
                      {format(new Date(apt.scheduledFor), 'MMM d, yyyy')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        }

        if (item.type === 'interaction') {
          const int = item.data as Interaction;
          const Icon = interactionIcons[int.type] || MessageSquare;
          const isInbound = int.direction === 'INBOUND';

          return (
            <div key={item.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-primary/10 p-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                {!isLast && <div className="w-px bg-border flex-1 my-2" />}
              </div>

              <Card className="flex-1 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">
                          {int.type.replace('_', ' ')}
                          {int.subject && `: ${int.subject}`}
                        </h4>
                        <Badge variant="outline" className="gap-1">
                          {isInbound ? (
                            <>
                              <ArrowDownLeft className="h-3 w-3" />
                              Inbound
                            </>
                          ) : (
                            <>
                              <ArrowUpRight className="h-3 w-3" />
                              Outbound
                            </>
                          )}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{format(new Date(int.createdAt), 'PPp')}</span>
                          {int.duration && <span>({int.duration} min)</span>}
                        </div>

                        {int.body && (
                          <div className="mt-2 p-3 bg-muted rounded-md">
                            <p className="text-sm whitespace-pre-wrap">{int.body}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>Logged</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
