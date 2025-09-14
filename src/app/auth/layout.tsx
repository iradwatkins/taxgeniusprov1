import { DollarSign, Shield, Clock, Users } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Marketing/Trust Signals */}
      <div className="lg:flex-1 bg-primary p-8 lg:p-12 text-primary-foreground flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold">Tax Genius Pro</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-black mb-4">
            Get Your $7,000 Advance in Minutes!
          </h1>
          <p className="text-lg lg:text-xl opacity-90 mb-8">
            Join thousands of gig workers who got their cash advance today. No waiting for tax season!
          </p>

          {/* Trust Signals */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Instant Approval</p>
                <p className="text-sm opacity-80">Get approved in 30 seconds</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">Bank-Level Security</p>
                <p className="text-sm opacity-80">256-bit encryption</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">5,000+ Happy Customers</p>
                <p className="text-sm opacity-80">This week alone!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-8 p-6 bg-white/10 backdrop-blur rounded-xl">
          <div className="flex items-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 fill-yellow-400 text-yellow-400"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="italic mb-2">
            "I got $4,500 in literally 10 minutes! This saved me from missing rent."
          </p>
          <p className="text-sm font-semibold">- Maria G., Uber Driver</p>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}