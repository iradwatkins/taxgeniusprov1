import sgMail from '@sendgrid/mail'
import { cache } from '@/lib/redis'

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export interface EmailTemplate {
  subject: string
  html: string
  text?: string
}

export class EmailService {
  private static fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@taxgenius.com'
  private static appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'

  /**
   * Send magic link email
   */
  static async sendMagicLinkEmail(
    to: string,
    token: string,
    name?: string
  ): Promise<boolean> {
    try {
      const magicLinkUrl = `${this.appUrl}/auth/verify?token=${token}`

      const template = this.getMagicLinkTemplate(magicLinkUrl, name)

      const msg = {
        to,
        from: this.fromEmail,
        subject: template.subject,
        text: template.text,
        html: template.html,
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Magic Link Email (Dev Mode):', {
          to,
          magicLinkUrl,
          token
        })
        return true
      }

      await sgMail.send(msg)
      return true
    } catch (error) {
      console.error('Error sending magic link email:', error)
      return false
    }
  }

  /**
   * Send welcome email
   */
  static async sendWelcomeEmail(
    to: string,
    name: string,
    role: 'CLIENT' | 'REFERRER' | 'PREPARER'
  ): Promise<boolean> {
    try {
      const template = this.getWelcomeTemplate(name, role)

      const msg = {
        to,
        from: this.fromEmail,
        subject: template.subject,
        text: template.text,
        html: template.html,
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Welcome Email (Dev Mode):', { to, name, role })
        return true
      }

      await sgMail.send(msg)
      return true
    } catch (error) {
      console.error('Error sending welcome email:', error)
      return false
    }
  }

  /**
   * Send commission notification
   */
  static async sendCommissionEmail(
    to: string,
    name: string,
    amount: number,
    clientName: string
  ): Promise<boolean> {
    try {
      const template = this.getCommissionTemplate(name, amount, clientName)

      const msg = {
        to,
        from: this.fromEmail,
        subject: template.subject,
        text: template.text,
        html: template.html,
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Commission Email (Dev Mode):', { to, name, amount, clientName })
        return true
      }

      await sgMail.send(msg)
      return true
    } catch (error) {
      console.error('Error sending commission email:', error)
      return false
    }
  }

  /**
   * Send tax return status update
   */
  static async sendStatusUpdateEmail(
    to: string,
    name: string,
    status: string,
    message: string
  ): Promise<boolean> {
    try {
      const template = this.getStatusUpdateTemplate(name, status, message)

      const msg = {
        to,
        from: this.fromEmail,
        subject: template.subject,
        text: template.text,
        html: template.html,
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Status Update Email (Dev Mode):', { to, name, status })
        return true
      }

      await sgMail.send(msg)
      return true
    } catch (error) {
      console.error('Error sending status update email:', error)
      return false
    }
  }

  /**
   * Magic link email template
   */
  private static getMagicLinkTemplate(magicLinkUrl: string, name?: string): EmailTemplate {
    const greeting = name ? `Hi ${name}` : 'Hi there'

    return {
      subject: 'Your Tax Genius Login Link',
      text: `${greeting},\n\nClick this link to log in to Tax Genius:\n\n${magicLinkUrl}\n\nThis link will expire in 15 minutes.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nTax Genius Team`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login to Tax Genius</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">Tax Genius</h1>
          </div>

          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #ff6b35; margin-bottom: 20px;">${greeting}!</h2>

            <p style="margin-bottom: 25px;">Click the button below to securely log in to your Tax Genius account:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${magicLinkUrl}" style="display: inline-block; background: #ff6b35; color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Log In to Tax Genius</a>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 25px;">This link will expire in 15 minutes for your security.</p>

            <p style="color: #666; font-size: 14px;">If you didn't request this login link, you can safely ignore this email.</p>

            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">

            <p style="color: #999; font-size: 12px; text-align: center;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <span style="color: #666; word-break: break-all;">${magicLinkUrl}</span>
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2024 Tax Genius. All rights reserved.</p>
          </div>
        </body>
        </html>
      `
    }
  }

  /**
   * Welcome email template
   */
  private static getWelcomeTemplate(name: string, role: string): EmailTemplate {
    const roleMessages = {
      CLIENT: 'Get started by uploading your tax documents and connecting with a tax preparer.',
      REFERRER: 'Start earning by sharing your unique referral link and tracking your commissions.',
      PREPARER: 'Begin managing clients and preparing tax returns with our professional tools.'
    }

    const dashboardUrl = `${this.appUrl}/dashboard/${role.toLowerCase()}`

    return {
      subject: 'Welcome to Tax Genius!',
      text: `Hi ${name},\n\nWelcome to Tax Genius! We're excited to have you on board.\n\n${roleMessages[role]}\n\nGet started: ${dashboardUrl}\n\nBest regards,\nTax Genius Team`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Tax Genius</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to Tax Genius!</h1>
          </div>

          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #ff6b35;">Hi ${name}!</h2>

            <p>We're thrilled to have you join the Tax Genius community.</p>

            <p style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              ${roleMessages[role]}
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${dashboardUrl}" style="display: inline-block; background: #ff6b35; color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
            </div>

            <h3 style="color: #ff6b35; margin-top: 30px;">What's Next?</h3>
            <ul style="color: #666;">
              <li>Complete your profile</li>
              <li>Explore the dashboard</li>
              <li>Connect with our community</li>
            </ul>
          </div>
        </body>
        </html>
      `
    }
  }

  /**
   * Commission notification template
   */
  private static getCommissionTemplate(
    name: string,
    amount: number,
    clientName: string
  ): EmailTemplate {
    return {
      subject: `You've earned $${amount} in commission!`,
      text: `Hi ${name},\n\nGreat news! You've earned a commission of $${amount} from ${clientName}'s tax return.\n\nCheck your dashboard for more details.\n\nBest regards,\nTax Genius Team`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #ff6b35; color: white; padding: 20px; text-align: center;">
            <h1>Commission Earned! 💰</h1>
          </div>
          <div style="padding: 20px;">
            <p>Hi ${name},</p>
            <p style="font-size: 18px;"><strong>You've earned $${amount} in commission!</strong></p>
            <p>Your referral ${clientName} has completed their tax return.</p>
            <a href="${this.appUrl}/dashboard/referrer" style="display: inline-block; background: #ff6b35; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">View Dashboard</a>
          </div>
        </body>
        </html>
      `
    }
  }

  /**
   * Status update template
   */
  private static getStatusUpdateTemplate(
    name: string,
    status: string,
    message: string
  ): EmailTemplate {
    return {
      subject: `Tax Return Status: ${status}`,
      text: `Hi ${name},\n\n${message}\n\nCheck your dashboard for more details.\n\nBest regards,\nTax Genius Team`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #ff6b35; color: white; padding: 20px; text-align: center;">
            <h1>Tax Return Update</h1>
          </div>
          <div style="padding: 20px;">
            <p>Hi ${name},</p>
            <p><strong>Status: ${status}</strong></p>
            <p>${message}</p>
            <a href="${this.appUrl}/dashboard/client" style="display: inline-block; background: #ff6b35; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">View Dashboard</a>
          </div>
        </body>
        </html>
      `
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