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
const preparerLeadSchema = z.object({
  ...commonLeadFields,
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

    // Extract metadata and UTM parameters
    const { ipAddress, userAgent, referer } = extractRequestMetadata(request)
    const { utmSource, utmMedium, utmCampaign } = extractUtmParams(body)

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

    // Queue notifications (async, non-blocking)
    await Promise.allSettled([
      queueAdminNotification('TAX_PREPARER', lead),
      queueConfirmationEmail('TAX_PREPARER', lead.email, lead.firstName),
    ])

    return createLeadSuccessResponse(lead.id, getLeadSuccessMessage('TAX_PREPARER'))

  } catch (error) {
    return handleApiError(error, 'creating preparer lead')
  }
}
