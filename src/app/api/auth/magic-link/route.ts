import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/auth.service'
import { EmailService } from '@/lib/services/email.service'
import { z } from 'zod'

const magicLinkSchema = z.object({
  email: z.string().email('Invalid email address')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = magicLinkSchema.parse(body)

    // Send magic link
    const result = await AuthService.sendMagicLink(email)

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    // Extract token for email (in production, this would be done internally)
    const tokenMatch = result.message.match(/token: (.+)/)
    const token = tokenMatch ? tokenMatch[1] : null

    if (token) {
      // Send email
      await EmailService.sendMagicLinkEmail(email, token)
    }

    return NextResponse.json({
      success: true,
      message: 'Magic link sent to your email'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error sending magic link:', error)
    return NextResponse.json(
      { error: 'Failed to send magic link' },
      { status: 500 }
    )
  }
}