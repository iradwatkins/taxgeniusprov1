'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  FileText,
  MessageSquare,
  User,
  Building,
  MapPin,
  Clock,
  Edit,
  Loader2,
  Plus,
  Users,
} from 'lucide-react';
import { format } from 'date-fns';
import { AddInteractionDialog } from '@/components/crm/AddInteractionDialog';
import { AppointmentDialog } from '@/components/calendar/AppointmentDialog';
import { ContactTimeline } from '@/components/crm/ContactTimeline';
import { useToast } from '@/hooks/use-toast';

interface ContactDetailClientProps {
  contactId: string;
}

export default function ContactDetailClient({ contactId }: ContactDetailClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [isInteractionDialogOpen, setIsInteractionDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);

  const fetchContactDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/crm/contacts/${contactId}/details`);

      if (response.status === 403) {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to view this contact.',
          variant: 'destructive',
        });
        router.push('/crm/contacts');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch contact details');

      const contactData = await response.json();
      setData(contactData);
    } catch (error) {
      console.error('Error fetching contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contact details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId]);

  const handleInteractionAdded = () => {
    setIsInteractionDialogOpen(false);
    fetchContactDetails(); // Refresh data
    toast({
      title: 'Success',
      description: 'Interaction logged successfully',
    });
  };

  const handleAppointmentAdded = () => {
    setIsAppointmentDialogOpen(false);
    fetchContactDetails(); // Refresh data
    toast({
      title: 'Success',
      description: 'Appointment scheduled successfully',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data || !data.contact) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Contact Not Found</h2>
          <p className="text-muted-foreground mb-4">This contact may have been deleted or you don&apos;t have access.</p>
          <Button onClick={() => router.push('/crm/contacts')}>Back to Contacts</Button>
        </div>
      </div>
    );
  }

  const { contact, profile, assignedPreparer, appointments, interactions, documents, taxReturns, stats } = data;

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      NEW: 'bg-blue-100 text-blue-800',
      CONTACTED: 'bg-purple-100 text-purple-800',
      DOCUMENTS: 'bg-yellow-100 text-yellow-800',
      PREPARING: 'bg-orange-100 text-orange-800',
      COMPLETE: 'bg-green-100 text-green-800',
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const getContactTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      LEAD: 'bg-yellow-100 text-yellow-800',
      CLIENT: 'bg-green-100 text-green-800',
      AFFILIATE: 'bg-blue-100 text-blue-800',
      PREPARER: 'bg-purple-100 text-purple-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/crm/contacts')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contacts
          </Button>

          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">
                  {contact.firstName} {contact.lastName}
                </h1>
                <Badge className={getContactTypeColor(contact.contactType)}>
                  {contact.contactType}
                </Badge>
                <Badge className={getStageColor(contact.stage)}>
                  {contact.stage}
                </Badge>
              </div>
              <p className="text-muted-foreground">{contact.email}</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsInteractionDialogOpen(true)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Log Activity
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsAppointmentDialogOpen(true)}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAppointments}</div>
              <p className="text-xs text-muted-foreground">
                {stats.upcomingAppointments} upcoming
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Interactions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInteractions}</div>
              <p className="text-xs text-muted-foreground">
                Last: {stats.lastContactDate ? format(new Date(stats.lastContactDate), 'MMM d') : 'Never'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDocuments}</div>
              <p className="text-xs text-muted-foreground">
                {profile ? 'Profile active' : 'Lead only'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tax Returns</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReturns}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalReturns > 0 ? 'Active client' : 'No returns yet'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email</p>
                    <a href={`mailto:${contact.email}`} className="text-sm text-primary hover:underline">
                      {contact.email}
                    </a>
                  </div>
                </div>

                {contact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Phone</p>
                      <a href={`tel:${contact.phone}`} className="text-sm text-primary hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contact.company && (
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Company</p>
                      <p className="text-sm">{contact.company}</p>
                    </div>
                  </div>
                )}

                <Separator />

                {assignedPreparer && (
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Assigned To</p>
                      <p className="text-sm">
                        {assignedPreparer.firstName} {assignedPreparer.lastName}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm">{format(new Date(contact.createdAt), 'MMM d, yyyy')}</p>
                  </div>
                </div>

                {contact.source && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Source</p>
                      <p className="text-sm">{contact.source}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {profile && (
              <Card>
                <CardHeader>
                  <CardTitle>Client Profile</CardTitle>
                  <CardDescription>Converted to active client</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Role</span>
                    <Badge variant="outline">{profile.role}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Since</span>
                    <span>{format(new Date(profile.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="timeline" className="space-y-4">
              <TabsList>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="appointments">
                  Appointments ({appointments.length})
                </TabsTrigger>
                {profile && (
                  <>
                    <TabsTrigger value="documents">
                      Documents ({documents.length})
                    </TabsTrigger>
                    <TabsTrigger value="returns">
                      Returns ({taxReturns.length})
                    </TabsTrigger>
                  </>
                )}
              </TabsList>

              <TabsContent value="timeline">
                <ContactTimeline
                  appointments={appointments}
                  interactions={interactions}
                  contactCreatedAt={contact.createdAt}
                />
              </TabsContent>

              <TabsContent value="appointments">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Appointments</CardTitle>
                      <Button size="sm" onClick={() => setIsAppointmentDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Appointment
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {appointments.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No appointments yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {appointments.map((apt: any) => (
                          <div key={apt.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">{apt.subject || apt.type}</p>
                                <p className="text-sm text-muted-foreground">
                                  {apt.scheduledFor
                                    ? format(new Date(apt.scheduledFor), 'MMM d, yyyy h:mm a')
                                    : 'Not scheduled'}
                                </p>
                              </div>
                              <Badge>{apt.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {profile && (
                <>
                  <TabsContent value="documents">
                    <Card>
                      <CardHeader>
                        <CardTitle>Documents</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {documents.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No documents uploaded</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {documents.map((doc: any) => (
                              <div key={doc.id} className="flex items-center justify-between p-3 border rounded">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-4 w-4" />
                                  <div>
                                    <p className="text-sm font-medium">{doc.fileName}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {doc.type} • {doc.taxYear}
                                    </p>
                                  </div>
                                </div>
                                <Badge variant="outline">{doc.status}</Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="returns">
                    <Card>
                      <CardHeader>
                        <CardTitle>Tax Returns</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {taxReturns.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No tax returns filed</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {taxReturns.map((taxReturn: any) => (
                              <div key={taxReturn.id} className="border rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-medium">{taxReturn.taxYear} Tax Return</p>
                                    <p className="text-sm text-muted-foreground">
                                      {taxReturn.filedDate
                                        ? `Filed ${format(new Date(taxReturn.filedDate), 'MMM d, yyyy')}`
                                        : 'Not filed yet'}
                                    </p>
                                    {taxReturn.refundAmount && (
                                      <p className="text-sm text-green-600">
                                        Refund: ${parseFloat(taxReturn.refundAmount).toFixed(2)}
                                      </p>
                                    )}
                                    {taxReturn.oweAmount && (
                                      <p className="text-sm text-red-600">
                                        Owe: ${parseFloat(taxReturn.oweAmount).toFixed(2)}
                                      </p>
                                    )}
                                  </div>
                                  <Badge>{taxReturn.status}</Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddInteractionDialog
        open={isInteractionDialogOpen}
        onOpenChange={setIsInteractionDialogOpen}
        contactId={contactId}
        contactName={`${contact.firstName} ${contact.lastName}`}
        onSuccess={handleInteractionAdded}
      />

      <AppointmentDialog
        open={isAppointmentDialogOpen}
        onOpenChange={setIsAppointmentDialogOpen}
        onSubmit={async (data) => {
          // Create appointment via API
          const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...data,
              clientId: contactId,
              clientName: `${contact.firstName} ${contact.lastName}`,
              clientEmail: contact.email,
              clientPhone: contact.phone || '',
            }),
          });

          if (!response.ok) throw new Error('Failed to create appointment');
          handleAppointmentAdded();
        }}
      />
    </div>
  );
}
