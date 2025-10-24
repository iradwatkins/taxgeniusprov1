/**
 * SEO Brain API - Campaign Status
 *
 * GET /api/seo-brain/campaign-status?campaignId=xxx
 *
 * Check the status and progress of a running campaign
 */

import { auth } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userIsAdmin = await isAdmin();
    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    if (!campaignId) {
      return NextResponse.json({ error: 'campaignId query parameter required' }, { status: 400 });
    }

    // Get campaign
    const campaign = await prisma.productCampaignQueue.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Get generated pages count
    const generatedPagesCount = await prisma.seoLandingPage.count({
      where: {
        generatedAt: {
          gte: campaign.generationStartedAt || campaign.createdAt,
        },
      },
    });

    // Calculate progress
    const totalCities = 200;
    const progress = (generatedPagesCount / totalCities) * 100;

    // Estimate time remaining
    let estimatedTimeRemaining: string | null = null;
    if (campaign.status === 'GENERATING' && campaign.generationStartedAt) {
      const elapsedMs = Date.now() - campaign.generationStartedAt.getTime();
      const avgTimePerCity = elapsedMs / Math.max(generatedPagesCount, 1);
      const remainingCities = totalCities - generatedPagesCount;
      const remainingMs = avgTimePerCity * remainingCities;

      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      estimatedTimeRemaining = `${hours}h ${minutes}m`;
    }

    return NextResponse.json({
      success: true,
      campaign: {
        id: campaign.id,
        campaignName: campaign.campaignName,
        serviceType: campaign.serviceType,
        status: campaign.status,
        progress: Math.round(progress),
        citiesGenerated: generatedPagesCount,
        totalCities,
        estimatedTimeRemaining,
        createdAt: campaign.createdAt,
        generationStartedAt: campaign.generationStartedAt,
        generationCompletedAt: campaign.generationCompletedAt,
      },
    });
  } catch (error) {
    logger.error('[SEO Brain API] Campaign status error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch campaign status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
