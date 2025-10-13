import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema
const customerLeadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  taxSituation: z.string().optional(),
  estimatedIncome: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = customerLeadSchema.parse(body)

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
        type: 'CUSTOMER',
        status: 'NEW',
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        taxSituation: validatedData.taxSituation || null,
        estimatedIncome: validatedData.estimatedIncome || null,
        source: referer,
        utmSource,
        utmMedium,
        utmCampaign,
        ipAddress,
        userAgent,
      },
    })

    // TODO: Send notification email to admin
    // TODO: Send confirmation email to customer
    // TODO: Trigger any necessary webhooks/integrations

    return NextResponse.json({
      success: true,
      message: 'Thank you! We\'ve received your information and will contact you within 24 hours.',
      leadId: lead.id,
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating customer lead:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid form data',
        errors: error.errors,
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'An error occurred while processing your request. Please try again.',
    }, { status: 500 })
  }
}
