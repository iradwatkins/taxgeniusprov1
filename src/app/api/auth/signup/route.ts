import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/auth.service'
import { EmailService } from '@/lib/services/email.service'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['CLIENT', 'REFERRER', 'PREPARER'])
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, role } = signupSchema.parse(body)

    // Create user with password
    const result = await AuthService.createUserWithPassword(email, password, role)

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    // Update profile with name
    await prisma.profile.update({
      where: { userId: result.userId },
      data: {
        firstName,
        lastName,
      }
    })

    // Send welcome email
    await EmailService.sendWelcomeEmail(email, firstName, role)

    // Send magic link for email verification
    const magicLinkResult = await AuthService.sendMagicLink(email)

    if (magicLinkResult.success) {
      // Extract token for email (in production, this would be done internally)
      const tokenMatch = magicLinkResult.message.match(/token: (.+)/)
      const token = tokenMatch ? tokenMatch[1] : null

      if (token) {
        await EmailService.sendMagicLinkEmail(email, token, firstName)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.',
      userId: result.userId
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating account:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}