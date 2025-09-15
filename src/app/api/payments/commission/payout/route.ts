import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Payment commission payout endpoint - temporarily disabled during migration'
  }, { status: 503 })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Payment commission payout endpoint - temporarily disabled during migration'
  }, { status: 503 })
}