import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { getUserPermissions, UserRole } from '@/lib/permissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  User,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';

const statusColors: Record<string, string> = {
  REQUESTED: 'secondary',
  SCHEDULED: 'default',
  CONFIRMED: 'success',
  COMPLETED: 'default',
  CANCELLED: 'destructive',
  NO_SHOW: 'warning',
  RESCHEDULED: 'secondary',
};

const typeIcons: Record<string, React.ReactElement> = {
  PHONE_CALL: <Phone className="w-4 h-4" />,
  VIDEO_CALL: <Video className="w-4 h-4" />,
  IN_PERSON: <MapPin className="w-4 h-4" />,
  CONSULTATION: <Users className="w-4 h-4" />,
  FOLLOW_UP: <Clock className="w-4 h-4" />,
};

export default async function CalendarPage() {
  const user = await currentUser();
  if (!user) redirect('/auth/login');

  const role = user.publicMetadata?.role as UserRole | undefined;
  const customPermissions = user.publicMetadata?.permissions as any;
  const permissions = getUserPermissions(role || 'client', customPermissions);

  if (!permissions.calendar) redirect('/forbidden');

  // Fetch appointments
  let appointments: any[] = []

  try {
    appointments = await prisma.appointment.findMany({
      orderBy: {
        scheduledFor: 'asc',
      },
      take: 50, // Limit for performance
    });
  } catch (error) {
    console.error('Error fetching appointments:', error)
    // Continue with empty array - will show "No appointments scheduled" message
  }

  // Get today's appointments
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysAppointments = appointments.filter(apt => {
    if (!apt.scheduledFor) return false;
    return apt.scheduledFor >= today && apt.scheduledFor < tomorrow;
  });

  // Get upcoming appointments
  const upcomingAppointments = appointments.filter(apt => {
    if (!apt.scheduledFor) return false;
    return apt.scheduledFor >= tomorrow;
  });

  // Get requested appointments (need scheduling)
  const requestedAppointments = appointments.filter(apt => apt.status === 'REQUESTED');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calendar className="w-8 h-8" />
              Calendar & Appointments
            </h1>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </div>
          <p className="text-muted-foreground">
            Manage appointments and schedules
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaysAppointments.length}</div>
              <p className="text-xs text-muted-foreground">Appointments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <p className="text-xs text-muted-foreground">Upcoming</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Requests</CardTitle>
              <Users className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requestedAppointments.length}</div>
              <p className="text-xs text-muted-foreground">Need scheduling</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
              <p className="text-xs text-muted-foreground">All appointments</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="requests">
              Requests
              {requestedAppointments.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {requestedAppointments.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Calendar</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline">Today</Button>
                    <Button variant="outline" size="icon">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-8">
                  <div className="text-center text-muted-foreground">
                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Calendar View</p>
                    <p className="text-sm">Interactive calendar will be implemented here</p>
                    <p className="text-sm mt-2">Integrate with FullCalendar or similar library</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>Complete list of all scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No appointments scheduled</p>
                    </div>
                  ) : (
                    appointments.map((apt) => (
                      <div key={apt.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {apt.type && typeIcons[apt.type]}
                              <p className="font-medium">{apt.subject || apt.type}</p>
                              <Badge variant={statusColors[apt.status] as any}>
                                {apt.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {apt.clientName}
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {apt.clientPhone}
                              </div>
                            </div>
                            {apt.scheduledFor && (
                              <div className="flex items-center gap-1 text-sm">
                                <Clock className="w-3 h-3" />
                                {new Date(apt.scheduledFor).toLocaleString()}
                                {apt.duration && ` (${apt.duration} mins)`}
                              </div>
                            )}
                            {apt.location && (
                              <div className="flex items-center gap-1 text-sm">
                                <MapPin className="w-3 h-3" />
                                {apt.location}
                              </div>
                            )}
                            {apt.meetingLink && (
                              <div className="flex items-center gap-1 text-sm">
                                <Video className="w-3 h-3" />
                                Meeting link available
                              </div>
                            )}
                          </div>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Requests</CardTitle>
                <CardDescription>Pending appointment requests that need scheduling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requestedAppointments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No pending requests</p>
                    </div>
                  ) : (
                    requestedAppointments.map((apt) => (
                      <div key={apt.id} className="border rounded-lg p-4 bg-yellow-50 dark:bg-yellow-950/20">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">REQUEST</Badge>
                              <p className="font-medium">{apt.clientName}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {apt.clientNotes || 'No notes provided'}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span>{apt.clientEmail}</span>
                              <span>{apt.clientPhone}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Requested: {new Date(apt.requestedAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="space-x-2">
                            <Button size="sm">Schedule</Button>
                            <Button size="sm" variant="outline">Contact</Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}