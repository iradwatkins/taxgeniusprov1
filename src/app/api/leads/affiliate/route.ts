import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import {
  extractRequestMetadata,
  extractUtmParams,
  handleApiError,
  createLeadSuccessResponse,
  getLeadSuccessMessage,
  queueAdminNotification,
  queueConfirmationEmail,
  commonLeadFields,
} from '@/lib/api-helpers/lead-helpers'

// Validation schema
const affiliateLeadSchema = z.object({
  ...commonLeadFields,
  experience: z.string().optional(),
  audience: z.string().optional(),
  message: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = affiliateLeadSchema.parse(body)

    // Extract metadata and UTM parameters
    const { ipAddress, userAgent, referer } = extractRequestMetadata(request)
    const { utmSource, utmMedium, utmCampaign } = extractUtmParams(body)

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

    // Queue notifications (async, non-blocking)
    await Promise.allSettled([
      queueAdminNotification('AFFILIATE', lead),
      queueConfirmationEmail('AFFILIATE', lead.email, lead.firstName),
    ])

    return createLeadSuccessResponse(lead.id, getLeadSuccessMessage('AFFILIATE'))

  } catch (error) {
    return handleApiError(error, 'creating affiliate lead')
  }
}
