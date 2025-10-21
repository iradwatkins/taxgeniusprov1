import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import {
  extractRequestMetadata,
  extractUtmParams,
  handleApiError,
  createLeadSuccessResponse,
  getLeadSuccessMessage,
  queueAdminNotification,
  queueConfirmationEmail,
  commonLeadFields,
} from '@/lib/api-helpers/lead-helpers';
import { getAttribution, saveLeadAttribution } from '@/lib/services/attribution.service';
import { checkLeadFraud, addFraudMetadata } from '@/lib/middleware/fraud-check.middleware';
import { trackLeadSubmission } from '@/lib/analytics/ga4';

// Validation schema
const customerLeadSchema = z.object({
  ...commonLeadFields,
  taxSituation: z.string().optional(),
  estimatedIncome: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = customerLeadSchema.parse(body);

    // EPIC 6 STORY 8: Fraud prevention check
    const fraudCheck = await checkLeadFraud(request, {
      email: validatedData.email,
      phone: validatedData.phone,
      referrerUsername: validatedData.referrerUsername,
    });

    if (!fraudCheck.passed) {
      return fraudCheck.response;
    }

    // Use sanitized data from fraud check
    const sanitizedEmail = fraudCheck.sanitizedData.email;
    const sanitizedPhone = fraudCheck.sanitizedData.phone;

    // Extract metadata and UTM parameters
    const { ipAddress, userAgent, referer } = extractRequestMetadata(request);
    const { utmSource, utmMedium, utmCampaign } = extractUtmParams(body);

    // EPIC 6: Get attribution (cookie → email → phone → direct)
    const attributionResult = await getAttribution(sanitizedEmail, sanitizedPhone);

    // Create lead in database with fraud metadata
    const leadData = {
      type: 'CUSTOMER',
      status: 'NEW',
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      taxSituation: validatedData.taxSituation || null,
      estimatedIncome: validatedData.estimatedIncome || null,
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
    };

    // Add fraud check metadata
    const leadDataWithFraud = addFraudMetadata(leadData, fraudCheck.result);

    const lead = await prisma.lead.create({
      data: leadDataWithFraud,
    });

    // EPIC 7: Auto-create CRM contact for real-time visibility
    try {
      await prisma.cRMContact.create({
        data: {
          userId: null, // Lead doesn't have user account yet
          clerkUserId: null,
          contactType: 'LEAD',
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
      });
    } catch (error: any) {
      // Log error but don't fail lead creation - CRM is supplementary
      logger.error('[Lead API] Failed to create CRM contact', {
        leadId: lead.id,
        error: error.message,
      });
    }

    // EPIC 6 STORY 7: Track lead submission in GA4
    trackLeadSubmission({
      leadId: lead.id,
      leadType: 'CUSTOMER',
      referrerUsername: attributionResult.attribution.referrerUsername,
      attributionMethod: attributionResult.attribution.attributionMethod || 'direct',
      source: referer,
    });

    // Queue notifications (async, non-blocking)
    await Promise.allSettled([
      queueAdminNotification('CUSTOMER', lead),
      queueConfirmationEmail('CUSTOMER', lead.email, lead.firstName),
    ]);

    return createLeadSuccessResponse(lead.id, getLeadSuccessMessage('CUSTOMER'));
  } catch (error) {
    return handleApiError(error, 'creating customer lead');
  }
}
