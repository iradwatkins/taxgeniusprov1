/**
 * Affiliate Application API
 *
 * POST /api/applications/affiliate
 * Handles affiliate applications with optional preparer bonding
 *
 * Part of Epic 6: Lead Tracking Dashboard Enhancement
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { getAttribution } from '@/lib/services/attribution.service';
import { logger } from '@/lib/logger';

// Validation schema
const affiliateApplicationSchema = z.object({
  // Personal Info
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),

  // Affiliate-Specific Info
  experience: z.string().optional(),
  audience: z.string().optional(),
  platforms: z.array(z.string()).optional(),
  website: z.string().url().optional().or(z.literal('')),
  socialMedia: z
    .object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      tiktok: z.string().optional(),
      youtube: z.string().optional(),
    })
    .optional(),

  // Bonding (Optional)
  bondToPreparerId: z.string().optional(),
  bondToPreparerUsername: z.string().optional(),

  // Additional
  message: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = affiliateApplicationSchema.parse(body);

    // Get attribution
    const attributionResult = await getAttribution(validatedData.email, validatedData.phone);

    // Check if email already exists
    const existingLead = await prisma.lead.findUnique({
      where: { email: validatedData.email },
    });

    if (existingLead) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 400 }
      );
    }

    // Validate preparer bonding if provided
    let bondedPreparerId: string | null = null;
    if (validatedData.bondToPreparerUsername) {
      const preparer = await prisma.profile.findUnique({
        where: { shortLinkUsername: validatedData.bondToPreparerUsername },
        select: { id: true, role: true },
      });

      if (!preparer) {
        return NextResponse.json({ error: 'Invalid tax preparer username' }, { status: 400 });
      }

      if (preparer.role !== 'TAX_PREPARER') {
        return NextResponse.json(
          { error: 'The provided username is not a tax preparer' },
          { status: 400 }
        );
      }

      bondedPreparerId = preparer.id;
    }

    // Extract request metadata
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      undefined;
    const userAgent = request.headers.get('user-agent') || undefined;
    const referer = request.headers.get('referer') || undefined;

    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        type: 'AFFILIATE',
        status: 'NEW',
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        marketingExperience: validatedData.experience,
        audience: validatedData.audience,
        website: validatedData.website,
        socialMediaProfiles: validatedData.socialMedia
          ? JSON.stringify(validatedData.socialMedia)
          : null,
        platforms: validatedData.platforms?.join(', '),
        message: validatedData.message,
        source: referer,
        ipAddress,
        userAgent,

        // EPIC 6: Attribution fields
        referrerUsername: attributionResult.attribution.referrerUsername,
        referrerType: attributionResult.attribution.referrerType,
        commissionRate: attributionResult.attribution.commissionRate,
        commissionRateLockedAt: attributionResult.attribution.commissionRate ? new Date() : null,
        attributionMethod: attributionResult.attribution.attributionMethod,
        attributionConfidence: attributionResult.attribution.attributionConfidence,

        // EPIC 6: Preparer bonding (stored as metadata for now)
        metadata: bondedPreparerId
          ? JSON.stringify({
              bondToPreparerId: bondedPreparerId,
              bondingRequestedAt: new Date().toISOString(),
            })
          : null,
      },
    });

    logger.info('Affiliate application created', {
      leadId: lead.id,
      email: validatedData.email,
      bondedToPreparerId: bondedPreparerId,
      attributionMethod: attributionResult.attribution.attributionMethod,
    });

    // Queue notifications (async, non-blocking)
    await Promise.allSettled([
      queueAdminNotification(lead, bondedPreparerId),
      queueConfirmationEmail(lead),
      bondedPreparerId ? queuePreparerNotification(bondedPreparerId, lead) : Promise.resolve(),
    ]);

    return NextResponse.json(
      {
        success: true,
        leadId: lead.id,
        message: bondedPreparerId
          ? 'Your affiliate application has been submitted! The tax preparer will review your bonding request.'
          : "Your affiliate application has been submitted! We'll review it and get back to you soon.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    logger.error('Error creating affiliate application', { error });
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}

// ============ Notification Functions ============

async function queueAdminNotification(lead: any, bondedPreparerId: string | null) {
  // TODO: Implement email notification to admin
  logger.info('Admin notification queued', { leadId: lead.id });
}

async function queueConfirmationEmail(lead: any) {
  // TODO: Implement confirmation email to applicant
  logger.info('Confirmation email queued', { leadId: lead.id });
}

async function queuePreparerNotification(preparerId: string, lead: any) {
  // TODO: Implement email notification to preparer about bonding request
  logger.info('Preparer notification queued', { preparerId, leadId: lead.id });
}
