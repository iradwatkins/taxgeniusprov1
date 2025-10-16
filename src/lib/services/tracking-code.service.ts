/**
 * Universal Tracking Code Service
 *
 * Generates and manages unique tracking codes for all users.
 * Each user gets a unique code on signup that can be customized once.
 */

import { prisma } from '@/lib/prisma'
import { generateQRCode, type QRCodeResult } from './qr-code.service'
import { logger } from '@/lib/logger'

export interface TrackingCodeData {
  code: string
  isCustom: boolean
  qrCodeUrl: string | null
  canCustomize: boolean
}

/**
 * Generate a unique tracking code
 * Format: TGP-XXXXXX (6 digits)
 */
export async function generateUniqueTrackingCode(): Promise<string> {
  let code: string
  let exists = true
  let attempts = 0
  const maxAttempts = 10

  while (exists && attempts < maxAttempts) {
    // Generate 6-digit random number
    const random = Math.floor(100000 + Math.random() * 900000)
    code = `TGP-${random}`

    // Check if code already exists
    const existing = await prisma.profile.findFirst({
      where: {
        OR: [
          { trackingCode: code },
          { customTrackingCode: code }
        ]
      }
    })

    exists = !!existing
    attempts++
  }

  if (exists) {
    throw new Error('Failed to generate unique tracking code after multiple attempts')
  }

  return code!
}

/**
 * Generate QR code for tracking code
 */
export async function generateTrackingQRCode(
  trackingCode: string,
  baseUrl: string = 'https://taxgeniuspro.tax'
): Promise<QRCodeResult> {
  const trackingUrl = `${baseUrl}/ref/${trackingCode}`

  return await generateQRCode({
    url: trackingUrl,
    materialId: trackingCode,
    format: 'PNG',
    size: 512,
    brandColor: '#f9d938', // Tax Genius brand color (yellow)
    errorCorrectionLevel: 'H', // High error correction for print materials
  })
}

/**
 * Validate custom tracking code format
 */
export function validateCustomTrackingCode(code: string): { valid: boolean; error?: string } {
  // Must be 3-20 characters
  if (code.length < 3 || code.length > 20) {
    return { valid: false, error: 'Code must be between 3 and 20 characters' }
  }

  // Only alphanumeric, hyphens, and underscores
  if (!/^[a-zA-Z0-9-_]+$/.test(code)) {
    return { valid: false, error: 'Code can only contain letters, numbers, hyphens, and underscores' }
  }

  // Cannot start with hyphen or underscore
  if (/^[-_]/.test(code)) {
    return { valid: false, error: 'Code cannot start with a hyphen or underscore' }
  }

  // Cannot end with hyphen or underscore
  if (/[-_]$/.test(code)) {
    return { valid: false, error: 'Code cannot end with a hyphen or underscore' }
  }

  // Cannot be all numbers (would conflict with auto-generated codes)
  if (/^\d+$/.test(code)) {
    return { valid: false, error: 'Code cannot be all numbers' }
  }

  // Reserved words (case-insensitive)
  const reserved = ['admin', 'api', 'dashboard', 'auth', 'test', 'demo', 'support', 'help']
  if (reserved.includes(code.toLowerCase())) {
    return { valid: false, error: 'This code is reserved and cannot be used' }
  }

  return { valid: true }
}

/**
 * Check if custom tracking code is available
 */
export async function isTrackingCodeAvailable(code: string): Promise<boolean> {
  const existing = await prisma.profile.findFirst({
    where: {
      OR: [
        { trackingCode: code },
        { customTrackingCode: code }
      ]
    }
  })

  return !existing
}

/**
 * Assign tracking code to user (for new signups)
 */
export async function assignTrackingCodeToUser(
  profileId: string,
  baseUrl?: string
): Promise<TrackingCodeData> {
  // Generate unique code
  const trackingCode = await generateUniqueTrackingCode()

  // Generate QR code
  const qrCode = await generateTrackingQRCode(trackingCode, baseUrl)

  // Update profile
  await prisma.profile.update({
    where: { id: profileId },
    data: {
      trackingCode,
      trackingCodeQRUrl: qrCode.dataUrl,
    }
  })

  return {
    code: trackingCode,
    isCustom: false,
    qrCodeUrl: qrCode.dataUrl,
    canCustomize: true,
  }
}

/**
 * Customize tracking code (one-time only)
 */
export async function customizeTrackingCode(
  profileId: string,
  customCode: string,
  baseUrl?: string
): Promise<{ success: boolean; error?: string; data?: TrackingCodeData }> {
  // Get profile
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    select: {
      trackingCodeChanged: true,
    }
  })

  if (!profile) {
    return { success: false, error: 'Profile not found' }
  }

  // Check if already customized
  if (profile.trackingCodeChanged) {
    return { success: false, error: 'Tracking code has already been customized (one-time change only)' }
  }

  // Validate format
  const validation = validateCustomTrackingCode(customCode)
  if (!validation.valid) {
    return { success: false, error: validation.error }
  }

  // Check availability
  const available = await isTrackingCodeAvailable(customCode)
  if (!available) {
    return { success: false, error: 'This tracking code is already taken' }
  }

  // Generate new QR code with custom code
  const qrCode = await generateTrackingQRCode(customCode, baseUrl)

  // Update profile
  await prisma.profile.update({
    where: { id: profileId },
    data: {
      customTrackingCode: customCode,
      trackingCodeChanged: true,
      trackingCodeQRUrl: qrCode.dataUrl,
    }
  })

  return {
    success: true,
    data: {
      code: customCode,
      isCustom: true,
      qrCodeUrl: qrCode.dataUrl,
      canCustomize: false,
    }
  }
}

/**
 * Get user's active tracking code data
 */
export async function getUserTrackingCode(profileId: string): Promise<TrackingCodeData | null> {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    select: {
      trackingCode: true,
      customTrackingCode: true,
      trackingCodeChanged: true,
      trackingCodeQRUrl: true,
    }
  })

  if (!profile) {
    return null
  }

  // Custom code takes precedence
  const activeCode = profile.customTrackingCode || profile.trackingCode
  if (!activeCode) {
    return null
  }

  return {
    code: activeCode,
    isCustom: !!profile.customTrackingCode,
    qrCodeUrl: profile.trackingCodeQRUrl,
    canCustomize: !profile.trackingCodeChanged,
  }
}

/**
 * Get user by tracking code (for attribution)
 */
export async function getUserByTrackingCode(code: string): Promise<{ id: string; clerkUserId: string | null; role: string } | null> {
  const profile = await prisma.profile.findFirst({
    where: {
      OR: [
        { trackingCode: code },
        { customTrackingCode: code }
      ]
    },
    select: {
      id: true,
      clerkUserId: true,
      role: true,
    }
  })

  return profile
}

/**
 * Backfill tracking codes for existing users
 * (Run this once after adding the tracking code feature)
 */
export async function backfillTrackingCodes(baseUrl?: string): Promise<{ updated: number; errors: number }> {
  const profiles = await prisma.profile.findMany({
    where: {
      trackingCode: null,
    },
    select: {
      id: true,
    }
  })

  let updated = 0
  let errors = 0

  for (const profile of profiles) {
    try {
      await assignTrackingCodeToUser(profile.id, baseUrl)
      updated++
    } catch (error) {
      logger.error(`Failed to assign tracking code to profile ${profile.id}:`, error)
      errors++
    }
  }

  return { updated, errors }
}
