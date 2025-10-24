/**
 * SEO Brain API - Start Campaign
 *
 * POST /api/seo-brain/start-campaign
 *
 * Starts a new 200-city landing page campaign for tax services
 */

import { auth } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';
import { generate200CityPages } from '@/lib/seo-llm/campaign-generator/city-page-generator';
import { OllamaClient } from '@/lib/seo-llm/integrations/ollama/ollama-client';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // Admin only
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userIsAdmin = await isAdmin();
    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { serviceType, serviceName, description, price, features, keywords, generateImages } = body;

    // Validation
    if (!serviceType || !serviceName || !description) {
      return NextResponse.json({ error: 'Missing required fields: serviceType, serviceName, description' }, { status: 400 });
    }

    // Validate service type
    const validServiceTypes = [
      // Tax services
      'personal-tax',
      'business-tax',
      'irs-resolution',
      'tax-planning',
      // Lead generation campaigns
      'get-tax-filing',
      'become-tax-preparer',
      'become-affiliate',
    ];
    if (!validServiceTypes.includes(serviceType)) {
      return NextResponse.json(
        {
          error: `Invalid serviceType. Must be one of: ${validServiceTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Create campaign
    const campaign = await prisma.productCampaignQueue.create({
      data: {
        campaignName: `${serviceName} - 200 Cities`,
        serviceType,
        productSpec: {
          serviceName,
          description,
          price: price || null,
          features: features || [],
          keywords: keywords || [],
          generateImages: generateImages || false,
        },
        status: 'PENDING',
        priority: 5,
        citiesGenerated: 0,
        citiesIndexed: 0,
        createdBy: userId,
      },
    });

    // Start generation in background (don't await - it takes 6-7 hours)
    startCampaignGeneration(campaign.id, {
      serviceType,
      serviceName,
      description,
      price,
      features: features || [],
      keywords: keywords || [],
    }, generateImages || false).catch((error) => {
      logger.error('[SEO Brain] Campaign generation background error:', error);
    });

    return NextResponse.json({
      success: true,
      campaignId: campaign.id,
      status: 'PENDING',
      message:
        'Campaign started. Generation will take 6-7 hours for 200 cities. Check /api/seo-brain/campaign-status for progress.',
    });
  } catch (error) {
    logger.error('[SEO Brain API] Start campaign error:', error);
    return NextResponse.json(
      {
        error: 'Failed to start campaign',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Start campaign generation in background
 */
async function startCampaignGeneration(
  campaignId: string,
  taxCampaignSpec: any,
  generateImages: boolean
) {
  try {
    // Update status
    await prisma.productCampaignQueue.update({
      where: { id: campaignId },
      data: {
        status: 'GENERATING',
        generationStartedAt: new Date(),
      },
    });

    // Initialize Ollama client
    const ollamaClient = new OllamaClient();

    // Test connection first
    const connectionTest = await ollamaClient.testConnection();
    if (!connectionTest.success) {
      throw new Error(`Ollama connection failed: ${connectionTest.error}`);
    }

    logger.info(`[SEO Brain] Ollama connected successfully. Model: ${connectionTest.model}`);

    // Generate 200 city pages
    const result = await generate200CityPages(campaignId, taxCampaignSpec, ollamaClient, {
      generateImages,
      batchSize: 10,
    });

    logger.info(`[SEO Brain] Campaign ${campaignId} finished: ${result.generated} generated, ${result.failed} failed`);

    // Send completion notification (optional - can be implemented with email/Telegram)
    // await sendCampaignCompleteNotification(...)
  } catch (error) {
    logger.error('[SEO Brain] Campaign generation failed:', error);

    // Update campaign status to FAILED
    await prisma.productCampaignQueue.update({
      where: { id: campaignId },
      data: {
        status: 'FAILED',
      },
    });
  }
}

/**
 * GET /api/seo-brain/start-campaign
 * Get list of campaigns
 */
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

    // Get all campaigns
    const campaigns = await prisma.productCampaignQueue.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      campaigns: campaigns.map((c) => ({
        id: c.id,
        campaignName: c.campaignName,
        serviceType: c.serviceType,
        status: c.status,
        citiesGenerated: c.citiesGenerated,
        citiesIndexed: c.citiesIndexed,
        createdAt: c.createdAt,
        generationStartedAt: c.generationStartedAt,
        generationCompletedAt: c.generationCompletedAt,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}
