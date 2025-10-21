export const metadata = {
  title: 'Terms of Service | Tax Genius Pro',
  description: 'Tax Genius Pro Terms of Service - Legal agreement for using our platform',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <p className="text-muted-foreground mb-8">
          <strong>Last Updated:</strong> October 10, 2025
        </p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing or using Tax Genius Pro ("Service"), you agree to be bound by these Terms
              of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
            <p className="mb-4">Tax Genius Pro provides:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Tax preparation and filing services</li>
              <li>Connection to qualified tax preparers</li>
              <li>Referral program for earning commissions</li>
              <li>E-commerce store for tax-related products</li>
              <li>Tax preparer training and certification</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>

            <h3 className="text-xl font-semibold mb-2">3.1 Registration</h3>
            <p className="mb-4">You must create an account to use our Service. You agree to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Provide accurate, current information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">3.2 Account Types</h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Client:</strong> File tax returns
              </li>
              <li>
                <strong>Referrer:</strong> Earn commissions by referring clients
              </li>
              <li>
                <strong>Tax Preparer:</strong> Prepare and file tax returns (requires certification)
              </li>
              <li>
                <strong>Admin:</strong> Platform management (invitation only)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Tax Filing Services</h2>

            <h3 className="text-xl font-semibold mb-2">4.1 Accuracy Guarantee</h3>
            <p className="mb-4">
              We guarantee 100% accuracy on tax calculations. If the IRS determines errors were
              made, we will:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>File an amended return at no charge</li>
              <li>Pay any penalties resulting from our errors</li>
              <li>Provide additional support to resolve the issue</li>
            </ul>
            <p className="mb-4">
              This guarantee does not cover penalties from incorrect information you provide.
            </p>

            <h3 className="text-xl font-semibold mb-2">4.2 Maximum Refund Guarantee</h3>
            <p className="mb-4">
              We guarantee you receive the maximum refund you're entitled to under current tax law.
            </p>

            <h3 className="text-xl font-semibold mb-2">4.3 Your Responsibilities</h3>
            <p className="mb-4">You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Providing complete and accurate information</li>
              <li>Uploading all required documents</li>
              <li>Reviewing your return before filing</li>
              <li>Responding to preparer questions promptly</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Referral Program</h2>

            <h3 className="text-xl font-semibold mb-2">5.1 Eligibility</h3>
            <p className="mb-4">To participate in the referral program, you must:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Be 18 years or older</li>
              <li>Maintain an active account in good standing</li>
              <li>Comply with all program terms</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">5.2 Commission Structure</h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Basic Package: $25 per completed return</li>
              <li>Standard Package: $35 per completed return</li>
              <li>Premium Package: $50 per completed return</li>
              <li>Deluxe Package: $75 per completed return</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">5.3 Commission Payment</h3>
            <p className="mb-4">Commissions are:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Created automatically when a referred client's return is filed</li>
              <li>Paid out when you request payment (minimum $50)</li>
              <li>Processed within 5-7 business days of approval</li>
              <li>Paid via bank transfer, PayPal, Square Cash, or Venmo</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">5.4 Prohibited Activities</h3>
            <p className="mb-4">You may not:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Use misleading or deceptive marketing</li>
              <li>Spam or send unsolicited emails</li>
              <li>Create fake accounts or referrals</li>
              <li>Violate any laws or regulations</li>
              <li>Impersonate Tax Genius Pro or its employees</li>
            </ul>
            <p className="mb-4">
              Violation may result in account termination and forfeiture of unpaid commissions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Tax Preparer Terms</h2>

            <h3 className="text-xl font-semibold mb-2">6.1 Certification</h3>
            <p className="mb-4">Tax preparers must:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Complete required training</li>
              <li>Pass certification exam</li>
              <li>Maintain active credentials (CPA, EA, or equivalent)</li>
              <li>Complete annual continuing education</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">6.2 Professional Standards</h3>
            <p className="mb-4">Preparers agree to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Follow IRS circular 230 guidelines</li>
              <li>Maintain client confidentiality</li>
              <li>Provide accurate, timely service</li>
              <li>Communicate professionally with clients</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Payments and Refunds</h2>

            <h3 className="text-xl font-semibold mb-2">7.1 Payment Processing</h3>
            <p className="mb-4">
              All payments are processed securely through Square. We do not store credit card
              information.
            </p>

            <h3 className="text-xl font-semibold mb-2">7.2 Pricing</h3>
            <p className="mb-4">
              Prices for tax filing services are based on complexity and package selected. All
              prices are clearly displayed before purchase.
            </p>

            <h3 className="text-xl font-semibold mb-2">7.3 Refund Policy</h3>
            <p className="mb-4">Refunds are available:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Before your return is filed: Full refund</li>
              <li>After filing, due to our error: Full refund</li>
              <li>After filing, for other reasons: Case-by-case basis</li>
            </ul>
            <p className="mb-4">Store purchases (products) are non-refundable unless defective.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
            <p className="mb-4">
              All content on the Service, including text, graphics, logos, and software, is the
              property of Tax Genius Pro and protected by copyright, trademark, and other
              intellectual property laws.
            </p>
            <p className="mb-4">
              You may not copy, modify, distribute, or create derivative works without our written
              permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="mb-4">To the maximum extent permitted by law:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Tax Genius Pro is provided "as is" without warranties</li>
              <li>We are not liable for indirect, incidental, or consequential damages</li>
              <li>
                Our total liability is limited to the amount you paid us in the past 12 months
              </li>
              <li>We are not liable for IRS penalties resulting from information you provide</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
            <p className="mb-4">
              You agree to indemnify and hold harmless Tax Genius Pro from any claims, damages,
              losses, or expenses arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Information you provide to us</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
            <p className="mb-4">We may terminate or suspend your account at any time for:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Violation of these Terms</li>
              <li>Fraudulent activity</li>
              <li>Non-payment</li>
              <li>Any reason at our discretion</li>
            </ul>
            <p className="mb-4">You may terminate your account at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
            <p className="mb-4">
              These Terms are governed by the laws of [State], without regard to conflict of law
              principles. Any disputes will be resolved in the courts of [County, State].
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Changes to Terms</h2>
            <p className="mb-4">
              We may modify these Terms at any time. We will notify you of significant changes by
              email or through the Service. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Contact Us</h2>
            <p className="mb-4">Questions about these Terms? Contact us:</p>
            <ul className="list-none space-y-2 mb-4">
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:legal@taxgeniuspro.tax" className="text-primary hover:underline">
                  legal@taxgeniuspro.tax
                </a>
              </li>
              <li>
                <strong>Support:</strong>{' '}
                <a href="mailto:support@taxgeniuspro.tax" className="text-primary hover:underline">
                  support@taxgeniuspro.tax
                </a>
              </li>
              <li>
                <strong>Address:</strong> [Company Address - To be added]
              </li>
            </ul>
          </section>

          <section className="mt-12 p-6 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> By using Tax Genius Pro, you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
