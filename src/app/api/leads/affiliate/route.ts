import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema
const affiliateLeadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  experience: z.string().optional(),
  audience: z.string().optional(),
  message: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = affiliateLeadSchema.parse(body)

    // Extract metadata
    const ipAddress = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || null

    // Extract UTM parameters if provided
    const utmSource = body.utmSource || null
    const utmMedium = body.utmMedium || null
    const utmCampaign = body.utmCampaign || null

    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        type: 'AFFILIATE',
        status: 'NEW',
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        marketingExperience: validatedData.experience || null,
        audience: validatedData.audience || null,
        message: validatedData.message || null,
        source: referer,
        utmSource,
        utmMedium,
        utmCampaign,
        ipAddress,
        userAgent,
      },
    })

    // TODO: Send notification email to affiliate management team
    // TODO: Send welcome email with affiliate dashboard info
    // TODO: Generate unique affiliate tracking code

    return NextResponse.json({
      success: true,
      message: 'Welcome to the team! Check your email for affiliate dashboard login details.',
      leadId: lead.id,
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating affiliate lead:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid form data',
        errors: error.errors,
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'An error occurred while processing your application. Please try again.',
    }, { status: 500 })
  }
}
