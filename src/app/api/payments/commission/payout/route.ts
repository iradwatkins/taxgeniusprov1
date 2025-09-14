import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { PaymentService } from '@/lib/services/payment.service'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { profile } = await requireRole('REFERRER')

    // Process commission payout
    const result = await PaymentService.processCommissionPayout(profile.id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message === 'Insufficient permissions') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    console.error('Commission payout error:', error)
    return NextResponse.json(
      { error: 'Failed to process payout' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { profile } = await requireRole('REFERRER')

    // Get pending commissions
    const pendingCommissions = await prisma.commission.findMany({
      where: {
        referrerId: profile.id,
        status: 'PENDING',
      },
      include: {
        referral: {
          include: {
            client: true,
          },
        },
      },
    })

    const totalPending = pendingCommissions.reduce(
      (sum, commission) => sum + Number(commission.amount),
      0
    )

    // Get processing commissions
    const processingCommissions = await prisma.commission.findMany({
      where: {
        referrerId: profile.id,
        status: 'PROCESSING',
      },
    })

    const totalProcessing = processingCommissions.reduce(
      (sum, commission) => sum + Number(commission.amount),
      0
    )

    // Get completed commissions
    const completedCommissions = await prisma.commission.findMany({
      where: {
        referrerId: profile.id,
        status: 'COMPLETED',
      },
    })

    const totalPaid = completedCommissions.reduce(
      (sum, commission) => sum + Number(commission.amount),
      0
    )

    return NextResponse.json({
      pending: {
        count: pendingCommissions.length,
        total: totalPending,
        commissions: pendingCommissions.map((c) => ({
          id: c.id,
          amount: Number(c.amount),
          clientName: `${c.referral.client.firstName || ''} ${c.referral.client.lastName || ''}`.trim(),
          createdAt: c.createdAt.toISOString(),
        })),
      },
      processing: {
        count: processingCommissions.length,
        total: totalProcessing,
      },
      paid: {
        count: completedCommissions.length,
        total: totalPaid,
      },
      canPayout: totalPending >= 50, // $50 minimum payout
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message === 'Insufficient permissions') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    console.error('Get commissions error:', error)
    return NextResponse.json(
      { error: 'Failed to get commissions' },
      { status: 500 }
    )
  }
}