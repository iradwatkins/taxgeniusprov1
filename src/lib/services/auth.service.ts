import { prisma } from '@/lib/db'
import { lucia } from '@/lib/auth'
import crypto from 'crypto'
import { cookies } from 'next/headers'
import { cache } from '@/lib/redis'

export class AuthService {
  /**
   * Generate a magic link token
   */
  static generateMagicToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  /**
   * Create or update user and send magic link
   */
  static async sendMagicLink(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Normalize email
      const normalizedEmail = email.toLowerCase().trim()

      // Check rate limiting
      const rateLimitKey = `magic-link:${normalizedEmail}`
      const attempts = await cache.get<number>(rateLimitKey) || 0

      if (attempts >= 3) {
        return {
          success: false,
          message: 'Too many attempts. Please try again in 15 minutes.'
        }
      }

      // Find or create user
      let user = await prisma.user.findUnique({
        where: { email: normalizedEmail }
      })

      if (!user) {
        // Create new user
        user = await prisma.user.create({
          data: {
            email: normalizedEmail,
            emailVerified: null
          }
        })

        // Create default profile
        await prisma.profile.create({
          data: {
            userId: user.id,
            role: 'CLIENT' // Default role, can be changed later
          }
        })
      }

      // Generate magic link token
      const token = this.generateMagicToken()
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

      // Save magic link
      await prisma.magicLink.create({
        data: {
          token,
          userId: user.id,
          expiresAt,
          used: false
        }
      })

      // Update rate limiting
      await cache.set(rateLimitKey, attempts + 1, 900) // 15 minutes

      // The actual email sending will be handled by the email service
      // For now, we'll return the token (in production, never expose this)
      return {
        success: true,
        message: process.env.NODE_ENV === 'development'
          ? `Magic link token: ${token}`
          : 'Magic link sent to your email'
      }
    } catch (error) {
      console.error('Error sending magic link:', error)
      return {
        success: false,
        message: 'Failed to send magic link'
      }
    }
  }

  /**
   * Verify magic link and create session
   */
  static async verifyMagicLink(token: string): Promise<{ success: boolean; message: string; userId?: string }> {
    try {
      // Find magic link
      const magicLink = await prisma.magicLink.findUnique({
        where: { token },
        include: { user: true }
      })

      if (!magicLink) {
        return {
          success: false,
          message: 'Invalid magic link'
        }
      }

      // Check if expired
      if (new Date() > magicLink.expiresAt) {
        return {
          success: false,
          message: 'Magic link has expired'
        }
      }

      // Check if already used
      if (magicLink.used) {
        return {
          success: false,
          message: 'Magic link has already been used'
        }
      }

      // Mark as used
      await prisma.magicLink.update({
        where: { id: magicLink.id },
        data: { used: true }
      })

      // Update email verification if needed
      if (!magicLink.user.emailVerified) {
        await prisma.user.update({
          where: { id: magicLink.userId },
          data: { emailVerified: new Date() }
        })
      }

      // Create session
      const session = await lucia.createSession(magicLink.userId, {})
      const sessionCookie = lucia.createSessionCookie(session.id)

      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

      // Clean up old magic links for this user
      await prisma.magicLink.deleteMany({
        where: {
          userId: magicLink.userId,
          used: true
        }
      })

      return {
        success: true,
        message: 'Successfully logged in',
        userId: magicLink.userId
      }
    } catch (error) {
      console.error('Error verifying magic link:', error)
      return {
        success: false,
        message: 'Failed to verify magic link'
      }
    }
  }

  /**
   * Create user with password
   */
  static async createUserWithPassword(
    email: string,
    password: string,
    role: 'CLIENT' | 'REFERRER' | 'PREPARER' = 'CLIENT'
  ): Promise<{ success: boolean; message: string; userId?: string }> {
    try {
      const normalizedEmail = email.toLowerCase().trim()

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail }
      })

      if (existingUser) {
        return {
          success: false,
          message: 'User already exists'
        }
      }

      // Hash password using scrypt (built into Node.js)
      const salt = crypto.randomBytes(16).toString('hex')
      const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex')
      const finalHash = `${salt}:${hashedPassword}`

      // Create user
      const user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          hashedPassword: finalHash,
          emailVerified: null
        }
      })

      // Create profile
      await prisma.profile.create({
        data: {
          userId: user.id,
          role
        }
      })

      return {
        success: true,
        message: 'User created successfully',
        userId: user.id
      }
    } catch (error) {
      console.error('Error creating user:', error)
      return {
        success: false,
        message: 'Failed to create user'
      }
    }
  }

  /**
   * Verify password and create session
   */
  static async verifyPassword(
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; userId?: string }> {
    try {
      const normalizedEmail = email.toLowerCase().trim()

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail }
      })

      if (!user || !user.hashedPassword) {
        return {
          success: false,
          message: 'Invalid email or password'
        }
      }

      // Verify password
      const [salt, hash] = user.hashedPassword.split(':')
      const verifyHash = crypto.scryptSync(password, salt, 64).toString('hex')

      if (hash !== verifyHash) {
        return {
          success: false,
          message: 'Invalid email or password'
        }
      }

      // Create session
      const session = await lucia.createSession(user.id, {})
      const sessionCookie = lucia.createSessionCookie(session.id)

      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

      return {
        success: true,
        message: 'Successfully logged in',
        userId: user.id
      }
    } catch (error) {
      console.error('Error verifying password:', error)
      return {
        success: false,
        message: 'Failed to login'
      }
    }
  }

  /**
   * Logout user
   */
  static async logout(sessionId: string): Promise<void> {
    await lucia.invalidateSession(sessionId)
    const sessionCookie = lucia.createBlankSessionCookie()
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  }
}