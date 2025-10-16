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
const customerLeadSchema = z.object({
  ...commonLeadFields,
  taxSituation: z.string().optional(),
  estimatedIncome: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = customerLeadSchema.parse(body)

    // Extract metadata and UTM parameters
    const { ipAddress, userAgent, referer } = extractRequestMetadata(request)
    const { utmSource, utmMedium, utmCampaign } = extractUtmParams(body)

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

    // Queue notifications (async, non-blocking)
    await Promise.allSettled([
      queueAdminNotification('CUSTOMER', lead),
      queueConfirmationEmail('CUSTOMER', lead.email, lead.firstName),
    ])

    return createLeadSuccessResponse(lead.id, getLeadSuccessMessage('CUSTOMER'))

  } catch (error) {
    return handleApiError(error, 'creating customer lead')
  }
}
