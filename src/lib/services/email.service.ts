import { Resend } from 'resend'
import { cache } from '@/lib/redis'
import { MagicLinkEmail } from '../../../emails/MagicLinkEmail'
import { WelcomeEmail } from '../../../emails/WelcomeEmail'
import { CommissionEmail } from '../../../emails/CommissionEmail'
import { StatusUpdateEmail } from '../../../emails/StatusUpdateEmail'
import { DocumentsReceivedEmail } from '../../../emails/documents-received'
import { ReturnFiledEmail } from '../../../emails/return-filed'
import { ReferralInvitationEmail } from '../../../emails/referral-invitation'
import { CertificationCompleteEmail } from '../../../emails/certification-complete'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailTemplate {
  subject: string
  html?: string
  text?: string
  react?: React.ReactElement
}

export class EmailService {
  private static fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@taxgeniuspro.tax'
  private static appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'

  /**
   * Send magic link email using Resend + React Email
   */
  static async sendMagicLinkEmail(
    to: string,
    token: string,
    name?: string
  ): Promise<boolean> {
    try {
      const magicLinkUrl = `${this.appUrl}/auth/verify?token=${token}`

      if (process.env.NODE_ENV === 'development') {
        console.log('Magic Link Email (Dev Mode):', {
          to,
          magicLinkUrl,
          token,
        })
        return true
      }

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to,
        subject: 'Your Tax Genius Login Link',
        react: MagicLinkEmail({
          name,
          magicLinkUrl,
        }),
      })

      if (error) {
        console.error('Error sending magic link email:', error)
        return false
      }

      console.log('Magic link email sent:', data?.id)
      return true
    } catch (error) {
      console.error('Error sending magic link email:', error)
      return false
    }
  }

  /**
   * Send welcome email using Resend + React Email
   */
  static async sendWelcomeEmail(
    to: string,
    name: string,
    role: 'CLIENT' | 'REFERRER' | 'PREPARER'
  ): Promise<boolean> {
    try {
      const dashboardUrl = `${this.appUrl}/dashboard/${role.toLowerCase()}`

      if (process.env.NODE_ENV === 'development') {
        console.log('Welcome Email (Dev Mode):', { to, name, role })
        return true
      }

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to,
        subject: 'Welcome to Tax Genius!',
        react: WelcomeEmail({
          name,
          role,
          dashboardUrl,
        }),
      })

      if (error) {
        console.error('Error sending welcome email:', error)
        return false
      }

      console.log('Welcome email sent:', data?.id)
      return true
    } catch (error) {
      console.error('Error sending welcome email:', error)
      return false
    }
  }

  /**
   * Send commission notification using Resend + React Email
   */
  static async sendCommissionEmail(
    to: string,
    name: string,
    amount: number,
    clientName: string
  ): Promise<boolean> {
    try {
      const dashboardUrl = `${this.appUrl}/dashboard/referrer`

      if (process.env.NODE_ENV === 'development') {
        console.log('Commission Email (Dev Mode):', { to, name, amount, clientName })
        return true
      }

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to,
        subject: `You've earned $${amount.toFixed(2)} in commission!`,
        react: CommissionEmail({
          name,
          amount,
          clientName,
          dashboardUrl,
        }),
      })

      if (error) {
        console.error('Error sending commission email:', error)
        return false
      }

      console.log('Commission email sent:', data?.id)
      return true
    } catch (error) {
      console.error('Error sending commission email:', error)
      return false
    }
  }

  /**
   * Send tax return status update using Resend + React Email
   */
  static async sendStatusUpdateEmail(
    to: string,
    name: string,
    status: string,
    message: string
  ): Promise<boolean> {
    try {
      const dashboardUrl = `${this.appUrl}/dashboard/client`

      if (process.env.NODE_ENV === 'development') {
        console.log('Status Update Email (Dev Mode):', { to, name, status })
        return true
      }

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to,
        subject: `Tax Return Status: ${status}`,
        react: StatusUpdateEmail({
          name,
          status,
          message,
          dashboardUrl,
        }),
      })

      if (error) {
        console.error('Error sending status update email:', error)
        return false
      }

      console.log('Status update email sent:', data?.id)
      return true
    } catch (error) {
      console.error('Error sending status update email:', error)
      return false
    }
  }

  /**
   * Send generic email (for custom use cases)
   */
  static async sendEmail(
    to: string,
    subject: string,
    content: { react?: React.ReactElement; html?: string; text?: string }
  ): Promise<boolean> {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Generic Email (Dev Mode):', { to, subject })
        return true
      }

      const emailOptions: any = {
        from: this.fromEmail,
        to,
        subject,
      }

      if (content.react) {
        emailOptions.react = content.react
      } else if (content.html) {
        emailOptions.html = content.html
      }

      if (content.text) {
        emailOptions.text = content.text
      }

      const { data, error } = await resend.emails.send(emailOptions)

      if (error) {
        console.error('Error sending email:', error)
        return false
      }

      console.log('Email sent:', data?.id)
      return true
    } catch (error) {
      console.error('Error sending email:', error)
      return false
    }
  }

  /**
   * Send "Documents Received" confirmation email
   * Triggered when client submits tax documents (DRAFT → IN_REVIEW)
   */
  static async sendDocumentsReceivedEmail(
    to: string,
    clientName: string,
    preparerName: string,
    preparerEmail: string,
    taxYear: number,
    documentCount: number
  ): Promise<boolean> {
    try {
      const dashboardUrl = `${this.appUrl}/dashboard/client`

      if (process.env.NODE_ENV === 'development') {
        console.log('Documents Received Email (Dev Mode):', {
          to,
          clientName,
          preparerName,
          taxYear,
          documentCount,
        })
        return true
      }

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to,
        subject: `Documents Received - ${taxYear} Tax Return`,
        react: DocumentsReceivedEmail({
          clientName,
          preparerName,
          preparerEmail,
          taxYear,
          documentCount,
          dashboardUrl,
        }),
        replyTo: preparerEmail,
      })

      if (error) {
        console.error('Error sending documents received email:', error)
        return false
      }

      console.log('Documents received email sent:', data?.id)
      return true
    } catch (error) {
      console.error('Error sending documents received email:', error)
      return false
    }
  }

  /**
   * Send "Return Filed" notification email
   * Triggered when tax return is filed (IN_REVIEW → FILED)
   */
  static async sendReturnFiledEmail(
    to: string,
    clientName: string,
    preparerName: string,
    taxYear: number,
    refundAmount?: number,
    oweAmount?: number,
    filedDate?: string
  ): Promise<boolean> {
    try {
      const dashboardUrl = `${this.appUrl}/dashboard/client`

      if (process.env.NODE_ENV === 'development') {
        console.log('Return Filed Email (Dev Mode):', {
          to,
          clientName,
          preparerName,
          taxYear,
          refundAmount,
          oweAmount,
        })
        return true
      }

      const subject =
        refundAmount && refundAmount > 0
          ? `Great News! Your ${taxYear} Tax Return Has Been Filed`
          : `Your ${taxYear} Tax Return Has Been Filed`

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        react: ReturnFiledEmail({
          clientName,
          preparerName,
          taxYear,
          refundAmount,
          oweAmount,
          filedDate: filedDate || new Date().toLocaleDateString(),
          dashboardUrl,
        }),
      })

      if (error) {
        console.error('Error sending return filed email:', error)
        return false
      }

      console.log('Return filed email sent:', data?.id)
      return true
    } catch (error) {
      console.error('Error sending return filed email:', error)
      return false
    }
  }

  /**
   * Send "Referral Invitation" email
   * Triggered after tax return is filed to invite client to join referral program
   */
  static async sendReferralInvitationEmail(
    to: string,
    clientName: string,
    preparerName: string,
    taxYear: number,
    refundAmount?: number
  ): Promise<boolean> {
    try {
      const signupUrl = `${this.appUrl}/auth/signup?role=referrer`

      if (process.env.NODE_ENV === 'development') {
        console.log('Referral Invitation Email (Dev Mode):', {
          to,
          clientName,
          preparerName,
          taxYear,
          refundAmount,
        })
        return true
      }

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to,
        subject: `Earn up to $50 per referral + qualify for FREE trips! - Tax Genius Pro`,
        react: ReferralInvitationEmail({
          clientName,
          preparerName,
          taxYear,
          refundAmount,
          signupUrl,
        }),
      })

      if (error) {
        console.error('Error sending referral invitation email:', error)
        return false
      }

      console.log('Referral invitation email sent:', data?.id)
      return true
    } catch (error) {
      console.error('Error sending referral invitation email:', error)
      return false
    }
  }

  /**
   * Send "Certification Complete" email
   * Triggered when preparer completes all required training materials
   * Story 4.4 - AC: 24
   */
  static async sendCertificationCompleteEmail(
    to: string,
    preparerName: string
  ): Promise<boolean> {
    try {
      const dashboardUrl = `${this.appUrl}/app/academy`

      if (process.env.NODE_ENV === 'development') {
        console.log('Certification Complete Email (Dev Mode):', {
          to,
          preparerName,
          dashboardUrl,
        })
        return true
      }

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to,
        subject: `🎓 Congratulations! Training Certification Complete - Tax Genius Academy`,
        react: CertificationCompleteEmail({
          preparerName,
          dashboardUrl,
        }),
      })

      if (error) {
        console.error('Error sending certification complete email:', error)
        return false
      }

      console.log('Certification complete email sent:', data?.id)
      return true
    } catch (error) {
      console.error('Error sending certification complete email:', error)
      return false
    }
  }

  /**
   * Send commission earned email (Epic 5 - Story 5.2)
   */
  static async sendCommissionEarnedEmail(
    to: string,
    referrerName: string,
    clientName: string,
    commissionAmount: number,
    pendingBalance: number
  ): Promise<boolean> {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Commission Earned Email (Dev Mode):', {
          to,
          referrerName,
          clientName,
          commissionAmount,
          pendingBalance
        })
        return true
      }

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to,
        subject: `You Earned $${commissionAmount}! 🎉`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1e40af;">Congratulations, ${referrerName}!</h1>

            <p style="font-size: 18px; line-height: 1.6;">
              Great news! <strong>${clientName}'s</strong> tax return has been filed, and you've earned a commission.
            </p>

            <div style="background: #f0f9ff; border-left: 4px solid #1e40af; padding: 20px; margin: 20px 0;">
              <h2 style="margin: 0 0 10px 0; color: #1e40af;">Commission Earned</h2>
              <p style="font-size: 32px; font-weight: bold; margin: 0; color: #059669;">
                $${commissionAmount.toFixed(2)}
              </p>
            </div>

            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 16px;">
                <strong>Pending Balance:</strong> $${pendingBalance.toFixed(2)}
              </p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #92400e;">
                ${pendingBalance >= 50 ? '✓ You can request a payout now!' : `You need $${(50 - pendingBalance).toFixed(2)} more to request a payout (minimum $50)`}
              </p>
            </div>

            <p style="margin-top: 30px;">
              <a href="${this.appUrl}/dashboard/referrer"
                 style="background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                View Dashboard
              </a>
            </p>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Keep referring friends and family to earn more! Share your referral link from your dashboard.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              Tax Genius Pro | <a href="${this.appUrl}" style="color: #1e40af;">TaxGeniusPro.tax</a>
            </p>
          </div>
        `
      })

      if (error) {
        console.error('Error sending commission earned email:', error)
        return false
      }

      console.log('Commission earned email sent:', data?.id)
      return true
    } catch (error) {
      console.error('Error sending commission earned email:', error)
      return false
    }
  }

  /**
   * Send payout confirmation email (Epic 5 - Story 5.2)
   */
  static async sendPayoutConfirmationEmail(
    to: string,
    referrerName: string,
    payoutAmount: number,
    paymentMethod: string,
    estimatedArrival: Date
  ): Promise<boolean> {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Payout Confirmation Email (Dev Mode):', {
          to,
          referrerName,
          payoutAmount,
          paymentMethod,
          estimatedArrival
        })
        return true
      }

      const arrivalDate = estimatedArrival.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to,
        subject: `Your $${payoutAmount} Payout is On the Way! 💰`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1e40af;">Payout Request Received!</h1>

            <p style="font-size: 18px; line-height: 1.6;">
              Hi ${referrerName},
            </p>

            <p style="font-size: 16px; line-height: 1.6;">
              Your payout request has been submitted and is being processed. Here are the details:
            </p>

            <div style="background: #f0f9ff; border: 2px solid #1e40af; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h2 style="margin: 0 0 15px 0; color: #1e40af;">Payout Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Amount:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold; font-size: 24px; color: #059669;">
                    $${payoutAmount.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Payment Method:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold;">
                    ${paymentMethod.replace(/_/g, ' ')}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Expected Arrival:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold;">
                    ${arrivalDate}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Processing Time:</td>
                  <td style="padding: 8px 0; text-align: right;">
                    5-7 business days
                  </td>
                </tr>
              </table>
            </div>

            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">
                <strong>⏰ What's Next?</strong><br>
                Our team will review and process your payout request within 1-2 business days.
                You'll receive an email confirmation once the payment has been sent.
              </p>
            </div>

            <p style="margin-top: 30px;">
              <a href="${this.appUrl}/dashboard/referrer"
                 style="background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                View Payout History
              </a>
            </p>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Keep growing your network! Continue referring to earn more commissions.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              Tax Genius Pro | <a href="${this.appUrl}" style="color: #1e40af;">TaxGeniusPro.tax</a>
            </p>
          </div>
        `
      })

      if (error) {
        console.error('Error sending payout confirmation email:', error)
        return false
      }

      console.log('Payout confirmation email sent:', data?.id)
      return true
    } catch (error) {
      console.error('Error sending payout confirmation email:', error)
      return false
    }
  }

  /**
   * Send payout request email to admin (Epic 5 - Story 5.2)
   */
  static async sendPayoutRequestEmail(
    to: string,
    referrerName: string,
    referrerEmail: string,
    amount: number,
    commissionsCount: number,
    payoutRequestId: string
  ): Promise<boolean> {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Payout Request Email to Admin (Dev Mode):', {
          to,
          referrerName,
          referrerEmail,
          amount,
          commissionsCount,
          payoutRequestId
        })
        return true
      }

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to,
        subject: `[ACTION REQUIRED] Payout Request: $${amount} - ${referrerName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #dc2626;">New Payout Request</h1>

            <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold; color: #dc2626;">Action Required</p>
              <p style="margin: 5px 0 0 0;">A referrer has requested a commission payout.</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px; background: #f9fafb; font-weight: bold;">Referrer:</td>
                <td style="padding: 10px; background: #ffffff;">${referrerName} (${referrerEmail})</td>
              </tr>
              <tr>
                <td style="padding: 10px; background: #f9fafb; font-weight: bold;">Amount:</td>
                <td style="padding: 10px; background: #ffffff; font-size: 20px; font-weight: bold; color: #059669;">$${amount.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 10px; background: #f9fafb; font-weight: bold;">Commissions:</td>
                <td style="padding: 10px; background: #ffffff;">${commissionsCount} commission(s)</td>
              </tr>
              <tr>
                <td style="padding: 10px; background: #f9fafb; font-weight: bold;">Request ID:</td>
                <td style="padding: 10px; background: #ffffff; font-family: monospace; font-size: 12px;">${payoutRequestId}</td>
              </tr>
            </table>

            <p style="margin-top: 30px;">
              <a href="${this.appUrl}/admin/payouts/${payoutRequestId}"
                 style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Review Payout Request
              </a>
            </p>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Please process this payout within 1-2 business days.
            </p>
          </div>
        `
      })

      if (error) {
        console.error('Error sending payout request email:', error)
        return false
      }

      console.log('Payout request email sent to admin:', data?.id)
      return true
    } catch (error) {
      console.error('Error sending payout request email:', error)
      return false
    }
  }

  /**
   * Send payout completed email (Epic 5 - Story 5.2)
   */
  static async sendPayoutCompletedEmail(
    to: string,
    referrerName: string,
    amount: number,
    paymentRef: string,
    paymentMethod: string
  ): Promise<boolean> {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Payout Completed Email (Dev Mode):', {
          to,
          referrerName,
          amount,
          paymentRef,
          paymentMethod
        })
        return true
      }

      const { data, error } = await resend.emails.send({
        from: this.fromEmail,
        to,
        subject: `Your $${amount} Payout Has Been Sent! 🎉`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #059669;">Payment Sent Successfully!</h1>

            <p style="font-size: 18px; line-height: 1.6;">
              Great news, ${referrerName}!
            </p>

            <p style="font-size: 16px; line-height: 1.6;">
              Your payout request has been approved and the payment has been sent.
            </p>

            <div style="background: #f0fdf4; border: 2px solid #059669; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h2 style="margin: 0 0 15px 0; color: #059669;">Payment Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Amount Paid:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold; font-size: 24px; color: #059669;">
                    $${amount.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Payment Method:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold;">
                    ${paymentMethod.replace(/_/g, ' ')}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Reference Number:</td>
                  <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 12px;">
                    ${paymentRef}
                  </td>
                </tr>
              </table>
            </div>

            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">
                <strong>⏰ When will I receive the funds?</strong><br>
                Funds should arrive in your account within 3-5 business days, depending on your financial institution.
              </p>
            </div>

            <p style="margin-top: 30px;">
              <a href="${this.appUrl}/dashboard/referrer"
                 style="background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                View Dashboard
              </a>
            </p>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Thank you for being a valued referrer! Keep sharing your referral link to earn more.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              Tax Genius Pro | <a href="${this.appUrl}" style="color: #1e40af;">TaxGeniusPro.tax</a>
            </p>
          </div>
        `
      })

      if (error) {
        console.error('Error sending payout completed email:', error)
        return false
      }

      console.log('Payout completed email sent:', data?.id)
      return true
    } catch (error) {
      console.error('Error sending payout completed email:', error)
      return false
    }
  }

  /**
   * Send payout rejected email (Epic 5 - Story 5.2)
   */
  static async sendPayoutRejectedEmail(
    to: string,
    referrerName: string,
    amount: number,
    reason: string
  ): Promise<boolean> {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Payout Rejected Email (Dev Mode):', {
          to,
          referrerName,
          amount,
          reason
        })
        return true
      }

      const { data, error} = await resend.emails.send({
        from: this.fromEmail,
        to,
        subject: `Payout Request Update - Action Required`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #dc2626;">Payout Request Update</h1>

            <p style="font-size: 18px; line-height: 1.6;">
              Hi ${referrerName},
            </p>

            <p style="font-size: 16px; line-height: 1.6;">
              We're writing to inform you about your recent payout request.
            </p>

            <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold; color: #dc2626;">Payout Request Not Approved</p>
              <p style="margin: 5px 0 0 0;">Your request for <strong>$${amount.toFixed(2)}</strong> could not be processed at this time.</p>
            </div>

            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; font-weight: bold;">Reason:</p>
              <p style="margin: 0; color: #6b7280;">${reason}</p>
            </div>

            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">
                <strong>💡 What's Next?</strong><br>
                Your commissions have been returned to PENDING status. You can submit a new payout request once any issues have been resolved.
              </p>
            </div>

            <p style="margin-top: 30px;">
              <a href="${this.appUrl}/dashboard/referrer"
                 style="background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                View Dashboard
              </a>
            </p>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              If you have questions about this decision, please contact our support team at support@taxgeniuspro.tax
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              Tax Genius Pro | <a href="${this.appUrl}" style="color: #1e40af;">TaxGeniusPro.tax</a>
            </p>
          </div>
        `
      })

      if (error) {
        console.error('Error sending payout rejected email:', error)
        return false
      }

      console.log('Payout rejected email sent:', data?.id)
      return true
    } catch (error) {
      console.error('Error sending payout rejected email:', error)
      return false
    }
  }

  /**
   * Queue email for sending (using Redis)
   */
  static async queueEmail(
    type: string,
    to: string,
    data: Record<string, unknown>
  ): Promise<void> {
    const emailKey = `email:queue:${Date.now()}`
    await cache.set(emailKey, {
      type,
      to,
      data,
      createdAt: new Date().toISOString()
    }, 86400) // Keep for 24 hours
  }
}