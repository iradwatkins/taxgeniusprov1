import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * PATCH /api/appointments/[id] - Update appointment
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id } = params;

    // Check if appointment exists
    const existing = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Update appointment
    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...body,
        scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : undefined,
      },
    });

    logger.info('Updated appointment', {
      appointmentId: id,
      updatedBy: user.id,
    });

    return NextResponse.json({ appointment: updated });
  } catch (error) {
    logger.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/appointments/[id] - Delete appointment
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Check if appointment exists
    const existing = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Delete appointment
    await prisma.appointment.delete({
      where: { id },
    });

    logger.info('Deleted appointment', {
      appointmentId: id,
      deletedBy: user.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}
