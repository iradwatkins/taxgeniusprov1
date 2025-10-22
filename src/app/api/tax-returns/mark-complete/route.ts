import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * POST /api/tax-returns/mark-complete
 *
 * Marks a tax return as complete and calculates revenue splits (30/70)
 * Automatically calculates commissions for referrers
 */
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get preparer profile with revenue split configuration
    const preparerProfile = await prisma.profile.findUnique({
      where: { clerkUserId: user.id },
      select: {
        id: true,
        role: true,
        revenueSplitPercentage: true,
      },
    });

    if (!preparerProfile || (preparerProfile.role !== 'TAX_PREPARER' && preparerProfile.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Only tax preparers can mark returns as complete' },
        { status: 403 }
      );
    }

    // Get the tax preparer's configured revenue split (defaults to 30% if not set)
    const taxGeniusPercentage = preparerProfile.revenueSplitPercentage || 30;

    // Parse request body
    const body = await request.json();
    const { taxReturnId, processingFeeCharged } = body;

    if (!taxReturnId || !processingFeeCharged || processingFeeCharged <= 0) {
      return NextResponse.json(
        { error: 'Missing required fields: taxReturnId and processingFeeCharged' },
        { status: 400 }
      );
    }

    // Get the tax return with client and referrer info
    const taxReturn = await prisma.taxReturn.findUnique({
      where: { id: taxReturnId },
      include: {
        profile: {
          include: {
            referrerReferrals: {
              include: {
                referrer: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                  },
                },
              },
              where: {
                status: 'ACTIVE',
              },
              take: 1,
            },
          },
        },
      },
    });

    if (!taxReturn) {
      return NextResponse.json({ error: 'Tax return not found' }, { status: 404 });
    }

    // Calculate revenue split using preparer's configured percentage
    const fee = parseFloat(processingFeeCharged.toString());
    const taxGeniusRevenue = fee * (taxGeniusPercentage / 100);
    const preparerRevenue = fee * ((100 - taxGeniusPercentage) / 100);

    // Get referrer information and commission
    let referrerCommissionAmount = 0;
    let commissionPaidTo: string | null = null;
    let referralChain: Array<{
      id: string;
      name: string;
      role: string;
      rate: number;
      amount: number;
    }> = [];

    const referral = taxReturn.profile.referrerReferrals[0];
    if (referral) {
      // Get commission rate from Commission model or use default $50
      const existingCommission = await prisma.commission.findFirst({
        where: { referralId: referral.id },
        select: { rateAtCreation: true, calculatedAmount: true },
      });

      referrerCommissionAmount = existingCommission?.calculatedAmount
        ? parseFloat(existingCommission.calculatedAmount.toString())
        : 50; // Default $50

      commissionPaidTo = referral.referrerId;

      referralChain = [
        {
          id: referral.referrer.id,
          name: `${referral.referrer.firstName || ''} ${referral.referrer.lastName || ''}`.trim(),
          role: referral.referrer.role,
          rate: referrerCommissionAmount,
          amount: referrerCommissionAmount,
        },
      ];
    }

    // Update the tax return with revenue data
    const updatedReturn = await prisma.taxReturn.update({
      where: { id: taxReturnId },
      data: {
        // Revenue tracking
        processingFeeCharged: fee,
        taxGeniusRevenue,
        preparerRevenue,

        // Commission tracking
        referrerCommissionAmount,
        commissionPaidTo,
        referralChain,
        totalCommissionsPaid: referrerCommissionAmount,

        // Reporting workflow
        markedCompleteAt: new Date(),
        markedCompleteBy: preparerProfile.id,
        autoRevenueCalculated: true,

        // Update status if not already filed
        status: taxReturn.status === 'DRAFT' || taxReturn.status === 'IN_REVIEW' ? 'FILED' : taxReturn.status,
      },
    });

    // Create or update commission record
    if (referral && referrerCommissionAmount > 0) {
      await prisma.commission.upsert({
        where: {
          referralId: referral.id,
        },
        update: {
          amount: referrerCommissionAmount,
          rateAtCreation: referrerCommissionAmount,
          calculatedAmount: referrerCommissionAmount,
          status: 'PENDING',
        },
        create: {
          referralId: referral.id,
          referrerId: referral.referrerId,
          amount: referrerCommissionAmount,
          rateAtCreation: referrerCommissionAmount,
          calculatedAmount: referrerCommissionAmount,
          status: 'PENDING',
        },
      });

      // Update referral status to COMPLETED
      await prisma.referral.update({
        where: { id: referral.id },
        data: {
          status: 'COMPLETED',
          returnFiledDate: new Date(),
          commissionEarned: referrerCommissionAmount,
        },
      });
    }

    logger.info('Tax return marked as complete', {
      taxReturnId,
      processingFee: fee,
      taxGeniusRevenue,
      preparerRevenue,
      referrerCommission: referrerCommissionAmount,
      markedBy: preparerProfile.id,
    });

    return NextResponse.json({
      success: true,
      data: {
        taxReturnId: updatedReturn.id,
        processingFee: fee,
        taxGeniusRevenue,
        preparerRevenue,
        taxGeniusPercentage,
        preparerPercentage: 100 - taxGeniusPercentage,
        referrerCommission: referrerCommissionAmount,
        netRevenue: taxGeniusRevenue - referrerCommissionAmount,
      },
    });
  } catch (error) {
    logger.error('Error marking tax return as complete:', error);
    return NextResponse.json(
      { error: 'Failed to mark return as complete. Please try again.' },
      { status: 500 }
    );
  }
}
