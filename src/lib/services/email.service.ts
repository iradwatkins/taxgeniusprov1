import { Resend } from 'resend'
import { cache } from '@/lib/redis'
import { MagicLinkEmail } from '../../../emails/MagicLinkEmail'
import { WelcomeEmail } from '../../../emails/WelcomeEmail'
import { CommissionEmail } from '../../../emails/CommissionEmail'
import { StatusUpdateEmail } from '../../../emails/StatusUpdateEmail'

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