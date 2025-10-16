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
import { getAttribution } from '@/lib/services/attribution.service'
import { logger } from '@/lib/logger'

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

    // EPIC 6: Get attribution (cookie → email → phone → direct)
    const attributionResult = await getAttribution(
      validatedData.email,
      validatedData.phone
    )

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
        // EPIC 6: Attribution fields
        referrerUsername: attributionResult.attribution.referrerUsername,
        referrerType: attributionResult.attribution.referrerType,
        commissionRate: attributionResult.attribution.commissionRate,
        commissionRateLockedAt: attributionResult.attribution.commissionRate ? new Date() : null,
        attributionMethod: attributionResult.attribution.attributionMethod,
        attributionConfidence: attributionResult.attribution.attributionConfidence,
      },
    })

    // EPIC 7: Auto-create CRM contact for real-time visibility
    try {
      await prisma.cRMContact.create({
        data: {
          userId: null,
          clerkUserId: null,
          contactType: 'PREPARER',
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          stage: 'NEW',
          source: lead.source,
          // Epic 6 Attribution Integration
          referrerUsername: lead.referrerUsername,
          referrerType: lead.referrerType,
          commissionRate: lead.commissionRate,
          commissionRateLockedAt: lead.commissionRateLockedAt,
          attributionMethod: lead.attributionMethod,
          attributionConfidence: lead.attributionConfidence,
        },
      })
    } catch (error: any) {
      // Log error but don't fail lead creation
      logger.error('[Lead API] Failed to create CRM contact', {
        leadId: lead.id,
        error: error.message
      })
    }

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
