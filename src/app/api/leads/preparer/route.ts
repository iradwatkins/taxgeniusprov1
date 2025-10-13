import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema
const preparerLeadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  ptin: z.string().min(1, 'PTIN is required'),
  certification: z.string().optional(),
  experience: z.string().optional(),
  message: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = preparerLeadSchema.parse(body)

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
        type: 'TAX_PREPARER',
        status: 'NEW',
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        ptin: validatedData.ptin,
        certification: validatedData.certification || null,
        experience: validatedData.experience || null,
        message: validatedData.message || null,
        source: referer,
        utmSource,
        utmMedium,
        utmCampaign,
        ipAddress,
        userAgent,
      },
    })

    // TODO: Send notification email to admin/recruitment team
    // TODO: Send confirmation email to preparer
    // TODO: Trigger background check process if needed

    return NextResponse.json({
      success: true,
      message: 'Application received! Our team will review your credentials within 24-48 hours.',
      leadId: lead.id,
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating preparer lead:', error)

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
