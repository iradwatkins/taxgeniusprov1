'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, CheckCircle, ArrowRight, Phone, Mail, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface TimeSlot {
  time: string;
  available: boolean;
}

const timeSlots: TimeSlot[] = [
  { time: '9:00 AM', available: true },
  { time: '10:00 AM', available: true },
  { time: '11:00 AM', available: false },
  { time: '12:00 PM', available: true },
  { time: '1:00 PM', available: true },
  { time: '2:00 PM', available: true },
  { time: '3:00 PM', available: false },
  { time: '4:00 PM', available: true },
  { time: '5:00 PM', available: true },
];

export default function AppointmentBooking() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Combine date and time into a scheduledFor timestamp
      const scheduledFor = new Date(`${selectedDate}T${convertTo24Hour(selectedTime)}`).toISOString();

      const response = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName: formData.name,
          clientEmail: formData.email,
          clientPhone: formData.phone,
          appointmentType: 'CONSULTATION',
          scheduledFor,
          notes: formData.notes || undefined,
          source: 'appointment_booking_page',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book appointment');
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Error booking appointment:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to convert 12-hour time to 24-hour format
  const convertTo24Hour = (time12h: string): string => {
    const [time, period] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (period === 'PM' && hours !== '12') {
      hours = String(parseInt(hours) + 12);
    } else if (period === 'AM' && hours === '12') {
      hours = '00';
    }

    return `${hours.padStart(2, '0')}:${minutes || '00'}:00`;
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Appointment Confirmed!</h2>
          <p className="text-lg text-muted-foreground mb-2">Your appointment is scheduled for:</p>
          <div className="text-2xl font-semibold text-primary mb-1">
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <div className="text-xl text-primary mb-6">{selectedTime}</div>
          <p className="text-muted-foreground mb-8">
            We've sent a confirmation email to <strong>{formData.email}</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => (window.location.href = '/')}>
              Back to Home
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => (window.location.href = '/dashboard/client')}
            >
              View Your Dashboard <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {/* Left Side - Image & Info */}
      <div className="space-y-6">
        {/* Image Placeholder #1 - Main Consultation Image */}
        <div className="relative h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-dashed border-primary/20">
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 p-8 text-center">
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
              #1
            </div>
            <Calendar className="w-16 h-16 text-primary/40" />
            <p className="text-sm font-medium text-muted-foreground">
              Image Placeholder #1
              <br />
              <span className="text-xs">
                Professional tax consultation scene
                <br />
                Recommended: 800x600px
              </span>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">What to Expect:</h3>
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Free 30-Minute Consultation</p>
                <p className="text-sm text-muted-foreground">
                  Video call or phone - your choice
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Licensed CPA Review</p>
                <p className="text-sm text-muted-foreground">
                  Expert analysis of your tax situation
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Personalized Tax Strategy</p>
                <p className="text-sm text-muted-foreground">
                  Custom recommendations for your needs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Image Placeholder #2 - Trust Badges */}
        <div className="relative h-[200px] rounded-lg overflow-hidden bg-gradient-to-br from-secondary/10 to-primary/10 border-2 border-dashed border-secondary/20">
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 p-6 text-center">
            <div className="absolute top-3 left-3 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-bold">
              #2
            </div>
            <Phone className="w-12 h-12 text-secondary/40" />
            <p className="text-xs font-medium text-muted-foreground">
              Image Placeholder #2
              <br />
              Trust badges or certification logos
              <br />
              Recommended: 600x300px
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Booking Form */}
      <Card className="h-fit">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              No signup required
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Book instantly
            </div>
          </div>
          <CardTitle className="text-2xl">Schedule Your Consultation</CardTitle>
          <CardDescription>
            Fill out the form below and we'll confirm your appointment within 24 hours
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <User className="w-4 h-4" />
                Your Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  className="h-12"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                      className="h-12 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                      required
                      className="h-12 pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Date & Time Section */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Preferred Date & Time
              </h3>

              <div className="space-y-2">
                <Label htmlFor="date">Select Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="h-12"
                />
              </div>

              {selectedDate && (
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Select Time *
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        type="button"
                        variant={selectedTime === slot.time ? 'default' : 'outline'}
                        className="h-11 text-sm"
                        disabled={!slot.available}
                        onClick={() => handleTimeSelect(slot.time)}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div className="space-y-2 pt-4 border-t">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Tell us about your tax situation, specific questions, or preferred contact method..."
                className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {submitError && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
                <p className="text-sm font-medium">{submitError}</p>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full h-12"
              disabled={isSubmitting || !selectedDate || !selectedTime}
            >
              {isSubmitting ? 'Booking...' : 'Confirm Appointment'}
              {!isSubmitting && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By booking, you agree to our{' '}
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
