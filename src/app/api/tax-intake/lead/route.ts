import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { trackJourneyStage } from '@/lib/services/journey-tracking.service';
import { getUTMCookie } from '@/lib/utils/cookie-manager';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      first_name,
      middle_name,
      last_name,
      email,
      phone,
      country_code,
      address_line_1,
      address_line_2,
      city,
      state,
      zip_code,
    } = body;

    // Validate required fields
    if (!first_name || !last_name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if lead already exists by email
    let lead = await prisma.taxIntakeLead.findUnique({
      where: { email },
    });

    if (lead) {
      // Update existing lead
      lead = await prisma.taxIntakeLead.update({
        where: { email },
        data: {
          first_name,
          middle_name,
          last_name,
          phone,
          country_code,
          address_line_1,
          address_line_2,
          city,
          state,
          zip_code,
          updated_at: new Date(),
        },
      });
    } else {
      // Create new lead
      lead = await prisma.taxIntakeLead.create({
        data: {
          first_name,
          middle_name,
          last_name,
          email,
          phone,
          country_code,
          address_line_1,
          address_line_2,
          city,
          state,
          zip_code,
        },
      });
    }

    // Track journey stage: INTAKE_COMPLETED (Epic 6)
    const attribution = await getUTMCookie();
    if (attribution) {
      await trackJourneyStage({
        trackingCode: attribution.trackingCode,
        stage: 'INTAKE_COMPLETED',
        metadata: {
          leadId: lead.id,
          email: lead.email,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        leadId: lead.id,
        message: 'Lead information saved successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving lead:', error);
    return NextResponse.json(
      { error: 'Failed to save lead information' },
      { status: 500 }
    );
  }
}
