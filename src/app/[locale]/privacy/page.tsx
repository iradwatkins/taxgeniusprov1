export const metadata = {
  title: 'Privacy Policy | Tax Genius Pro',
  description: 'Tax Genius Pro Privacy Policy - How we collect, use, and protect your information',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <p className="text-muted-foreground mb-8">
          <strong>Last Updated:</strong> October 10, 2025
        </p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>

            <h3 className="text-xl font-semibold mb-2">1.1 Personal Information</h3>
            <p className="mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Name, email address, phone number</li>
              <li>Tax identification information (SSN, EIN)</li>
              <li>Financial information (income, deductions, expenses)</li>
              <li>Payment information (processed securely through Square)</li>
              <li>Tax documents (W2, 1099, receipts, etc.)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">1.2 Automatically Collected Information</h3>
            <p className="mb-4">When you use our service, we automatically collect:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent</li>
              <li>Referral source</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Prepare and file your tax returns</li>
              <li>Process payments and commissions</li>
              <li>Communicate with you about your tax filing status</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Prevent fraud and ensure platform security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
            <p className="mb-4">
              We do not sell or rent your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Assigned Tax Preparers:</strong> To complete your tax return
              </li>
              <li>
                <strong>Payment Processors:</strong> Square for payment processing
              </li>
              <li>
                <strong>Email Service:</strong> Resend for transactional emails
              </li>
              <li>
                <strong>Authentication Provider:</strong> Clerk for secure login
              </li>
              <li>
                <strong>Legal Authorities:</strong> When required by law or to protect our rights
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>SSL/TLS encryption for data in transit</li>
              <li>Secure authentication via Clerk</li>
              <li>Role-based access control</li>
              <li>Time-limited document access (signed URLs expire in 15 minutes)</li>
              <li>Rate limiting to prevent abuse</li>
              <li>Regular security audits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
            <p className="mb-4">We retain your information for as long as necessary to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Provide our services</li>
              <li>Comply with IRS record-keeping requirements (minimum 7 years)</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>
                Request deletion of your information (subject to legal retention requirements)
              </li>
              <li>Opt out of marketing communications</li>
              <li>Export your data</li>
            </ul>
            <p className="mb-4">
              To exercise these rights, contact us at{' '}
              <a href="mailto:privacy@taxgeniuspro.tax" className="text-primary hover:underline">
                privacy@taxgeniuspro.tax
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking</h2>
            <p className="mb-4">We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Maintain your session</li>
              <li>Remember your preferences</li>
              <li>Track referral sources</li>
              <li>Analyze platform usage</li>
            </ul>
            <p className="mb-4">You can control cookies through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Third-Party Services</h2>
            <p className="mb-4">Our service integrates with:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Clerk:</strong> Authentication (
                <a
                  href="https://clerk.com/privacy"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener"
                >
                  Privacy Policy
                </a>
                )
              </li>
              <li>
                <strong>Square:</strong> Payment processing (
                <a
                  href="https://squareup.com/us/en/legal/general/privacy"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener"
                >
                  Privacy Policy
                </a>
                )
              </li>
              <li>
                <strong>Resend:</strong> Email delivery (
                <a
                  href="https://resend.com/legal/privacy-policy"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener"
                >
                  Privacy Policy
                </a>
                )
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p className="mb-4">
              Our service is not intended for individuals under 18 years of age. We do not knowingly
              collect information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of significant
              changes by email or through our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-none space-y-2 mb-4">
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:privacy@taxgeniuspro.tax" className="text-primary hover:underline">
                  privacy@taxgeniuspro.tax
                </a>
              </li>
              <li>
                <strong>Support:</strong>{' '}
                <a href="mailto:taxgenius.tax@gmail.com" className="text-primary hover:underline">
                  taxgenius.tax@gmail.com
                </a>
              </li>
              <li>
                <strong>Address:</strong> [Company Address - To be added]
              </li>
            </ul>
          </section>

          <section className="mt-12 p-6 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> This privacy policy is effective as of October 10, 2025. By
              using Tax Genius Pro, you agree to this Privacy Policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
