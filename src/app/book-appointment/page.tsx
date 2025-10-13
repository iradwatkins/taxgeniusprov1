import AppointmentBooking from '@/components/AppointmentBooking';

export default function BookAppointmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Book Your Appointment
          </h1>
          <p className="text-xl text-muted-foreground">
            Meet with a tax professional • Free consultation • No signup required
          </p>
        </div>

        <AppointmentBooking />

        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-3">What to expect:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ 30-minute video call or phone consultation</li>
            <li>✓ Review your tax situation with a CPA</li>
            <li>✓ Get answers to your questions</li>
            <li>✓ Understand next steps for filing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
